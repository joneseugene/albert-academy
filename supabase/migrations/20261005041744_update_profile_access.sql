-- ============================================================
-- Profile Access & Ownership
-- ============================================================
-- Rules:
-- 1. Authenticated users can read their own profile.
-- 2. Authenticated users can update their own profile.
-- 3. Users cannot change their role or active status.
-- 4. Super admins can read all profiles.
-- 5. Super admins can create profiles.
-- 6. Super admins can update any profile.
-- 7. Super admins can delete profiles.
-- ============================================================


-- ============================================================
-- 1. Remove the previous profiles policy
-- ============================================================

drop policy if exists "super_admin_manage_profiles"
on public.profiles;


-- ============================================================
-- 2. Users can read their own profile
--    Super admins can read every profile.
-- ============================================================

create policy "users_read_own_profile"
on public.profiles
for select
to authenticated
using (
    id = auth.uid()
    or public.is_super_admin()
);


-- ============================================================
-- 3. Users can update their own profile
--    Super admins can update any profile.
-- ============================================================

create policy "users_update_own_profile"
on public.profiles
for update
to authenticated
using (
    id = auth.uid()
    or public.is_super_admin()
)
with check (
    id = auth.uid()
    or public.is_super_admin()
);


-- ============================================================
-- 4. Only super admins can create profiles
-- ============================================================

create policy "super_admin_insert_profiles"
on public.profiles
for insert
to authenticated
with check (
    public.is_super_admin()
);


-- ============================================================
-- 5. Only super admins can delete profiles
-- ============================================================

create policy "super_admin_delete_profiles"
on public.profiles
for delete
to authenticated
using (
    public.is_super_admin()
);


-- ============================================================
-- 6. Protect privileged profile fields
--
-- Regular users may update their own profile, but they cannot
-- change:
--
--   role_id
--   is_active
--
-- Super admins can change both.
-- ============================================================

create or replace function public.protect_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

    -- Super admins can modify everything.
    if public.is_super_admin() then
        return new;
    end if;

    -- Regular users cannot change their identity.
    new.id := old.id;

    -- Regular users cannot change their assigned role.
    new.role_id := old.role_id;

    -- Regular users cannot activate/deactivate themselves.
    new.is_active := old.is_active;

    return new;

end;
$$;


-- ============================================================
-- 7. Apply protection before profile updates
-- ============================================================

drop trigger if exists protect_profile_privileged_fields
on public.profiles;

create trigger protect_profile_privileged_fields
before update on public.profiles
for each row
execute function public.protect_profile_privileged_fields();


-- ============================================================
-- 8. Make sure authenticated users have the required
--    privileges at the table level.
-- ============================================================

grant select, update
on public.profiles
to authenticated;

grant insert, delete
on public.profiles
to authenticated;