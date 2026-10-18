begin;

-- ============================================================
-- Harden profiles UPDATE access
--
-- Normal users:
--   - Can update only their own profile.
--
-- Super admins:
--   - Can update any profile.
--
-- The protect_profile_privileged_fields() trigger continues
-- to prevent non-super-admin users from changing:
--   - id
--   - role_id
--   - is_active
-- ============================================================

drop policy if exists "users_update_own_profile"
on public.profiles;

drop policy if exists "super_admin_update_profiles"
on public.profiles;

create policy "users_update_own_profile"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
);

create policy "super_admin_update_profiles"
on public.profiles
for update
to authenticated
using (
  is_super_admin()
)
with check (
  is_super_admin()
);

commit;

