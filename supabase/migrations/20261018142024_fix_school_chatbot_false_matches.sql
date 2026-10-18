
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
SECURITY INVOKER
SET search_path = public, extensions, pg_temp
AS $function$
  WITH question AS (
    SELECT
      trim(coalesce(p_query, '')) AS original_query,
      trim(
        regexp_replace(
          trim(coalesce(p_query, '')),
          '^(who is|who was|who are|who were)\s+',
          '',
          'i'
        )
      ) AS subject,
      trim(
        regexp_replace(
          trim(coalesce(p_query, '')),
          '^(who is|who was|who are|who were)\s+',
          '',
          'i'
        )
      ) ~* '^(dr\.?\s+)?[[:alpha:]][[:alpha:] .''-]*\??$'
        AS is_person_question
  ),
  candidates AS (
    SELECT
      s.source_type,
      s.title,
      s.content,
      s.score,
      q.subject,
      q.is_person_question,
      lower(regexp_replace(q.subject, '\?+$', '')) AS clean_subject,
      lower(coalesce(s.title, '')) AS clean_title
    FROM question q
    CROSS JOIN LATERAL public.search_school_knowledge(
      q.original_query,
      greatest(coalesce(p_limit, 1), 8)
    ) s
  )
  SELECT
    c.source_type,
    c.title,
    c.content,
    c.score
  FROM candidates c
  WHERE
    NOT c.is_person_question
    OR c.clean_title = c.clean_subject
    OR c.clean_title = regexp_replace(c.clean_subject, '^dr\.?\s+', '')
    OR c.clean_title LIKE c.clean_subject || '%'
    OR c.clean_title LIKE '% ' || c.clean_subject || '%'
  ORDER BY c.score DESC
  LIMIT 1;
$function$;
