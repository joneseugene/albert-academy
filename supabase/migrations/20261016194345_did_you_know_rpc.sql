CREATE OR REPLACE FUNCTION public.get_random_did_you_know(
  p_limit integer DEFAULT 5
)
RETURNS SETOF public.did_you_know
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT d.*
  FROM public.did_you_know AS d
  WHERE d.status = 'published'
    AND d.deleted = false
  ORDER BY random()
  LIMIT GREATEST(COALESCE(p_limit, 5), 0);
$$;

GRANT EXECUTE ON FUNCTION public.get_random_did_you_know(integer)
TO anon, authenticated;