-- ============================================================
-- Albert Academy
-- School Admin: School Information Permissions
-- ============================================================

begin;

-- ============================================================
-- 1. Ensure school information permissions exist
-- ============================================================

insert into public.permissions (name)
values
  ('school_info.read'),
  ('school_info.update')
on conflict (name) do nothing;


-- ============================================================
-- 2. Assign school information permissions to school_admin
-- ============================================================

insert into public.role_permission (
  role_id,
  permission_id
)
select
  r.id,
  p.id
from public.roles r
cross join public.permissions p
where r.name = 'school_admin'
  and p.name in (
    'school_info.read',
    'school_info.update'
  )
on conflict do nothing;


-- ============================================================
-- 3. Validate the role exists
-- ============================================================

do $$
begin
  if not exists (
    select 1
    from public.roles
    where name = 'school_admin'
  ) then
    raise exception
      'Migration failed: role "school_admin" does not exist.';
  end if;
end;
$$;


-- ============================================================
-- 4. Validate both permissions are assigned
-- ============================================================

do $$
declare
  missing_count integer;
begin
  select count(*)
  into missing_count
  from (
    select p.name
    from public.permissions p
    where p.name in (
      'school_info.read',
      'school_info.update'
    )

    except

    select p.name
    from public.role_permission rp
    join public.roles r
      on r.id = rp.role_id
    join public.permissions p
      on p.id = rp.permission_id
    where r.name = 'school_admin'
      and p.name in (
        'school_info.read',
        'school_info.update'
      )
  ) missing;

  if missing_count > 0 then
    raise exception
      'Migration failed: school_admin is missing required school information permissions.';
  end if;
end;
$$;


commit;

