/*
  Bootstrap the first super administrator.

  IMPORTANT:
  - This migration is intended to run once.
  - It temporarily removes the profile protection trigger.
  - It assigns the designated account to super_admin.
  - It immediately restores the protection trigger.
*/

begin;

-- ============================================================
-- 1. Temporarily remove the privileged-field protection trigger
-- ============================================================

drop trigger if exists protect_profile_privileged_fields
on public.profiles;


-- ============================================================
-- 2. Promote the designated account
-- ============================================================

update public.profiles
set
  role_id = 'cb8c0da0-ab79-4f90-a0db-5ee8fe73228a',
  is_active = true,
  updated_at = now()
where id = 'e3f46f0a-bc6f-4ea9-a21d-b27752ff30ea';


-- ============================================================
-- 3. Verify that the role was actually assigned
-- ============================================================

do $$
declare
  assigned_role text;
begin
  select r.name
  into assigned_role
  from public.profiles p
  inner join public.roles r
    on r.id = p.role_id
  where p.id = 'e3f46f0a-bc6f-4ea9-a21d-b27752ff30ea';

  if assigned_role is distinct from 'super_admin' then
    raise exception
      'Bootstrap failed: expected super_admin but found %',
      coalesce(assigned_role, 'NULL');
  end if;
end;
$$;


-- ============================================================
-- 4. Restore the protection trigger
-- ============================================================

create trigger protect_profile_privileged_fields
before update on public.profiles
for each row
execute function public.protect_profile_privileged_fields();


commit;

