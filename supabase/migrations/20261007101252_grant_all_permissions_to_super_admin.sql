begin;

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
on conflict (
  role_id,
  permission_id
) do nothing;

commit;

