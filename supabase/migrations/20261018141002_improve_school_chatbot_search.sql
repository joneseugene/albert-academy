
-- Improve Albert Academy chatbot retrieval for paraphrased questions.
-- Replaces the existing search function without changing its RPC signature.

CREATE SCHEMA IF NOT EXISTS extensions;

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.search_school_knowledge(
  p_query text,
  p_limit integer DEFAULT 8
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
      trim(
        regexp_replace(
          coalesce(p_query, ''),
          '^\s*(who is|who was|who has|who had|what is|what was|tell me about|give me information about|can you tell me about|do you know)\s+',
          '',
          'i'
        )
      ) AS original_query
  ),
  queries AS (
    SELECT
      original_query,
      regexp_replace(
        original_query,
        '\m(best|top|greatest|highest)\M',
        'highest grade points',
        'gi'
      ) AS expanded_query
    FROM input
  ),
  documents AS (
    -- General school information
    SELECT
      'school_info'::text AS source_type,
      coalesce(s.name, 'School information')::text AS title,
      concat_ws(
        E'\n',
        'School: ' || s.name,
        'Founder: ' || s.founder,
        'About: ' || s.about,
        'History: ' || s.history,
        'Mission: ' || s.mission,
        'Vision: ' || s.vision,
        'Contact: ' || s.contact::text
      )::text AS content
    FROM public.school_info AS s

    UNION ALL

    -- Notable alumni and other notable people
    SELECT
      'notable'::text,
      concat_ws(' — ', n.name, nullif(n.title, ''))::text,
      concat_ws(
        E'\n',
        'Name: ' || n.name,
        'Title: ' || n.title,
        'Description: ' || n.description,
        'Details: ' || n.detail
      )::text
    FROM public.notable AS n

    UNION ALL

    -- Past school leadership
    SELECT
      'past_leadership'::text,
      concat_ws(' — ', p.name, nullif(p.role, ''))::text,
      concat_ws(
        E'\n',
        'Name: ' || p.name,
        'Role: ' || p.role,
        'Level: ' || p.level,
        'About: ' || p.about,
        'Start year: ' || p.start_year::text,
        'End year: ' || p.end_year::text
      )::text
    FROM public.past_leadership AS p

    UNION ALL

    -- Staff
    SELECT
      'staff'::text,
      concat_ws(' — ', st.name, nullif(st.role, ''))::text,
      concat_ws(
        E'\n',
        'Name: ' || st.name,
        'Role: ' || st.role,
        'Level: ' || st.level,
        'Start year: ' || st.start_year::text,
        'End year: ' || st.end_year::text
      )::text
    FROM public.staff AS st

    UNION ALL

    -- Academic resources
    SELECT
      'academic'::text,
      coalesce(a.name, 'Academic resource')::text,
      concat_ws(
        E'\n',
        'Name: ' || a.name,
        'Link: ' || a.link
      )::text
    FROM public.academic AS a

    UNION ALL

    -- Only published, non-deleted facts
    SELECT
      'did_you_know'::text,
      coalesce(d.title, 'School fact')::text,
      concat_ws(
        E'\n',
        'Title: ' || d.title,
        'Category: ' || d.category,
        'Description: ' || d.description
      )::text
    FROM public.did_you_know AS d
    WHERE
      d.deleted IS NOT TRUE
      AND lower(d.status::text) = 'published'
  ),
  prepared AS (
    SELECT
      d.source_type,
      d.title,
      d.content,
      lower(coalesce(d.title, '') || ' ' || coalesce(d.content, '')) AS searchable_text,
      q.original_query,
      q.expanded_query,
      websearch_to_tsquery(
        'english',
        q.original_query
      ) AS original_tsquery,
      websearch_to_tsquery(
        'english',
        q.expanded_query
      ) AS expanded_tsquery
    FROM documents AS d
    CROSS JOIN queries AS q
    WHERE
      length(trim(q.original_query)) > 0
  ),
  scored AS (
    SELECT
      p.source_type,
      p.title,
      p.content,
      GREATEST(
        ts_rank_cd(
          setweight(
            to_tsvector('english', coalesce(p.title, '')),
            'A'
          ) ||
          setweight(
            to_tsvector('english', coalesce(p.content, '')),
            'B'
          ),
          p.original_tsquery
        ),
        ts_rank_cd(
          to_tsvector(
            'english',
            coalesce(p.title, '') || ' ' || coalesce(p.content, '')
          ),
          p.expanded_tsquery
        ),
        similarity(
          lower(coalesce(p.title, '')),
          lower(p.original_query)
        ),
        word_similarity(
          lower(p.original_query),
          p.searchable_text
        ),
        word_similarity(
          lower(p.expanded_query),
          p.searchable_text
        )
      )::real AS score,
      p.original_tsquery,
      p.expanded_tsquery,
      p.searchable_text,
      p.original_query,
      p.expanded_query
    FROM prepared AS p
  )
  SELECT
    s.source_type,
    s.title,
    s.content,
    s.score
  FROM scored AS s
  WHERE
    s.original_tsquery @@ to_tsvector(
      'english',
      coalesce(s.title, '') || ' ' || coalesce(s.content, '')
    )
    OR s.expanded_tsquery @@ to_tsvector(
      'english',
      coalesce(s.title, '') || ' ' || coalesce(s.content, '')
    )
    OR similarity(
      lower(coalesce(s.title, '')),
      lower(s.original_query)
    ) >= 0.12
    OR word_similarity(
      lower(s.original_query),
      s.searchable_text
    ) >= 0.25
    OR word_similarity(
      lower(s.expanded_query),
      s.searchable_text
    ) >= 0.25
  ORDER BY s.score DESC, s.title ASC
  LIMIT LEAST(GREATEST(coalesce(p_limit, 8), 1), 20);
$function$;

REVOKE ALL
ON FUNCTION public.search_school_knowledge(text, integer)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.search_school_knowledge(text, integer)
TO anon, authenticated;
