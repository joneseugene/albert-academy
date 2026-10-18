
CREATE OR REPLACE FUNCTION public.search_school_knowledge(
  p_query text,
  p_limit integer DEFAULT 1
)
RETURNS TABLE (
  source_type text,
  title text,
  content text,
  score real
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $function$
  WITH input AS (
    SELECT
      trim(coalesce(p_query, '')) AS original_query,
      trim(
        regexp_replace(
          lower(trim(coalesce(p_query, ''))),
          '^(who is|who was|who are|who were|who had|tell me about|what is|what was|where is|when was)\s+',
          '',
          'i'
        )
      ) AS normalized_query,
      substring(
        coalesce(p_query, '')
        FROM '\m(19[0-9]{2}|20[0-9]{2})\M'
      )::integer AS question_year,
      websearch_to_tsquery(
        'english',
        coalesce(p_query, '')
      ) AS search_query
  ),
  records AS (
    SELECT
      'school_info'::text AS source_type,
      si.name::text AS title,
      concat_ws(
        ' ', si.name, si.founder, si.about, si.history,
        si.mission, si.vision, si.contact::text
      ) AS content
    FROM public.school_info si

    UNION ALL

    SELECT
      'notable',
      n.name::text,
      concat_ws(' ', n.name, n.title, n.description, n.detail)
    FROM public.notable n

    UNION ALL

    SELECT
      'past_leadership',
      pl.name::text,
      concat_ws(
        ' ', pl.name, pl.role, pl.level, pl.about,
        pl.start_year::text, pl.end_year::text
      )
    FROM public.past_leadership pl

    UNION ALL

    SELECT
      'staff',
      s.name::text,
      concat_ws(
        ' ', s.name, s.role, s.level,
        s.start_year::text, s.end_year::text
      )
    FROM public.staff s

    UNION ALL

    SELECT
      'academic',
      a.name::text,
      concat_ws(' ', a.name, a.link)
    FROM public.academic a

    UNION ALL

    SELECT
      'did_you_know',
      d.title::text,
      concat_ws(' ', d.title, d.category, d.description)
    FROM public.did_you_know d
    WHERE d.status::text = 'published'
      AND coalesce(d.deleted, false) = false
  ),
  searchable AS (
    SELECT
      r.source_type,
      r.title,
      r.content,
      concat_ws(' ', r.title, r.content) AS searchable_text,
      to_tsvector(
        'english',
        concat_ws(' ', r.title, r.content)
      ) AS search_vector
    FROM records r
    WHERE nullif(trim(r.title), '') IS NOT NULL
       OR nullif(trim(r.content), '') IS NOT NULL
  ),
  ranked AS (
    SELECT
      s.source_type,
      s.title,
      s.content,
      (
        ts_rank_cd(s.search_vector, i.search_query) * 1.5

        + word_similarity(
            i.normalized_query,
            s.searchable_text
          ) * 0.8

        + CASE
            WHEN i.question_year IS NULL THEN 0.0
            WHEN s.searchable_text ~ (
              '(^|[^0-9])'
              || i.question_year::text
              || '([^0-9]|$)'
            ) THEN 0.40
            ELSE -0.25
          END

        + CASE
            WHEN i.original_query ~* '\mwassce\M'
             AND s.searchable_text ~* '\mwassce\M'
            THEN 0.12
            ELSE 0.0
          END

        + CASE
            WHEN i.original_query ~* 'west[[:space:]]+africa'
             AND s.searchable_text ~* 'west[[:space:]]+africa'
            THEN 0.12
            ELSE 0.0
          END

        + CASE
            WHEN i.original_query ~* '\mbest\M|\mhighest\M'
             AND s.searchable_text ~*
               '(best[[:space:]]+wassce|highest[[:space:]]+grade[[:space:]]+points|eight[[:space:]]+a1s|8[[:space:]]+a1s)'
            THEN 0.15
            ELSE 0.0
          END
      )::real AS relevance_score,

      ts_rank_cd(
        s.search_vector,
        i.search_query
      ) AS text_rank,

      word_similarity(
        i.normalized_query,
        s.searchable_text
      ) AS fuzzy_rank

    FROM searchable s
    CROSS JOIN input i
    WHERE i.original_query <> ''
  )
  SELECT
    r.source_type,
    r.title,
    r.content,
    r.relevance_score AS score
  FROM ranked r
  WHERE r.text_rank > 0
     OR r.fuzzy_rank > 0.12
  ORDER BY
    r.relevance_score DESC,
    r.text_rank DESC
  LIMIT 1;
$function$;

REVOKE ALL ON FUNCTION public.search_school_knowledge(text, integer)
  FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.search_school_knowledge(text, integer)
  TO anon, authenticated;
