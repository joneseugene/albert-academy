begin;

-- ============================================================
-- Add navigation/read permissions
-- ============================================================

insert into public.permissions (
  name,
  description
)
values
  (
    'dashboard.read',
    'Allows access to the administration dashboard.'
  ),
  (
    'users.read',
    'Allows viewing users and their profiles.'
  ),
  (
    'roles.read',
    'Allows viewing system roles.'
  ),
  (
    'permissions.read',
    'Allows viewing system permissions.'
  ),
  (
    'settings.read',
    'Allows viewing application settings.'
  ),
  (
    'school_info.read',
    'Allows viewing school information.'
  )
on conflict (name) do nothing;


-- ============================================================
-- Grant the new read permissions to super_admin
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
where r.name = 'super_admin'
  and p.name in (
    'dashboard.read',
    'users.read',
    'roles.read',
    'permissions.read',
    'settings.read',
    'school_info.read'
  )
on conflict (
  role_id,
  permission_id
) do nothing;


commit;

