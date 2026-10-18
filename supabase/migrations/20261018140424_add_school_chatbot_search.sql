
-- Enable fuzzy text matching.
create extension if not exists pg_trgm with schema extensions;

-- Search published school information without duplicating existing data.
create or replace function public.search_school_knowledge(
  p_query text,
  p_limit integer default 8
)
returns table (
  source_type text,
  title text,
  content text,
  score real
)
language sql
stable
security definer
set search_path = public, extensions, pg_temp
as $function$
  with input as (
    select
      trim(coalesce(p_query, '')) as original_query,
      trim(
        regexp_replace(
          lower(trim(coalesce(p_query, ''))),
          '^(who is|who was|what is|what was|tell me about|'
          || 'give me information about|give me details about|'
          || 'can you tell me about|where is|when was)[[:space:]]+',
          '',
          'i'
        )
      ) as search_query
  ),
  documents as (
    select
      'school_info'::text as source_type,
      s.name as title,
      concat_ws(
        E'\n',
        'School: ' || s.name,
        'Founder: ' || s.founder,
        'About: ' || s.about,
        'History: ' || s.history,
        'Mission: ' || s.mission,
        'Vision: ' || s.vision
      ) as content
    from public.school_info s

    union all

    select
      'notable',
      n.name,
      concat_ws(
        E'\n',
        'Name: ' || n.name,
        'Title: ' || n.title,
        'Description: ' || n.description,
        'Details: ' || n.detail
      )
    from public.notable n

    union all

    select
      'past_leadership',
      p.name,
      concat_ws(
        E'\n',
        'Name: ' || p.name,
        'Role: ' || p.role,
        'Level: ' || p.level,
        'About: ' || p.about,
        'Start year: ' || p.start_year::text,
        'End year: ' || p.end_year::text
      )
    from public.past_leadership p

    union all

    select
      'staff',
      s.name,
      concat_ws(
        E'\n',
        'Name: ' || s.name,
        'Role: ' || s.role,
        'Level: ' || s.level,
        'Start year: ' || s.start_year::text,
        'End year: ' || s.end_year::text
      )
    from public.staff s

    union all

    select
      'academic',
      a.name,
      concat_ws(
        E'\n',
        'Academic information: ' || a.name,
        'Link: ' || a.link
      )
    from public.academic a

    union all

    select
      'did_you_know',
      d.title,
      concat_ws(
        E'\n',
        'Fact: ' || d.title,
        'Category: ' || d.category,
        'Description: ' || d.description
      )
    from public.did_you_know d
    where d.deleted = false
      and lower(d.status) = 'published'
  ),
  ranked as (
    select
      d.source_type,
      d.title,
      d.content,
      greatest(
        ts_rank_cd(
          to_tsvector('english', d.title || ' ' || d.content),
          websearch_to_tsquery('english', i.search_query)
        ),
        extensions.similarity(
          lower(d.title || ' ' || d.content),
          lower(i.search_query)
        )
      )::real as score
    from documents d
    cross join input i
    where i.original_query <> ''
      and i.search_query <> ''
      and (
        to_tsvector('english', d.title || ' ' || d.content)
          @@ websearch_to_tsquery('english', i.search_query)
        or extensions.similarity(
          lower(d.title || ' ' || d.content),
          lower(i.search_query)
        ) >= 0.12
      )
  )
  select
    r.source_type,
    r.title,
    r.content,
    r.score
  from ranked r
  order by r.score desc, r.title asc
  limit least(greatest(coalesce(p_limit, 8), 1), 20);
$function$;

-- The function exposes only the curated fields returned above.
revoke all on function public.search_school_knowledge(text, integer)
  from public;

grant execute on function public.search_school_knowledge(text, integer)
  to anon, authenticated;
