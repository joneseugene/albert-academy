-- ============================================================
-- RBAC RLS POLICIES
-- ============================================================
-- Goals:
--
-- 1. Authenticated users can read roles.
-- 2. Authenticated users can read role_permission mappings.
-- 3. Authenticated users can read their own user_permission mappings.
-- 4. Only super_admin can modify roles.
-- 5. Only super_admin can modify role_permission.
-- 6. Only super_admin can modify user_permission.
--
-- Existing RLS policies are removed/recreated so this migration
-- is deterministic.
-- ============================================================


-- ============================================================
-- Ensure RLS is enabled
-- ============================================================

alter table public.roles enable row level security;

alter table public.role_permission enable row level security;

alter table public.user_permission enable row level security;


-- ============================================================
-- ROLES
-- ============================================================

drop policy if exists "authenticated_users_can_view_roles"
on public.roles;

drop policy if exists "super_admin_manage_roles"
on public.roles;


-- Authenticated users can read roles.
create policy "authenticated_users_can_view_roles"
on public.roles
for select
to authenticated
using (true);


-- Only super_admin can create, update, or delete roles.
create policy "super_admin_manage_roles"
on public.roles
for all
to authenticated
using (is_super_admin())
with check (is_super_admin());


-- ============================================================
-- ROLE PERMISSION
-- ============================================================

drop policy if exists "authenticated_users_can_view_role_permissions"
on public.role_permission;

drop policy if exists "super_admin_manage_role_permissions"
on public.role_permission;


-- Authenticated users can read role/permission mappings.
create policy "authenticated_users_can_view_role_permissions"
on public.role_permission
for select
to authenticated
using (true);


-- Only super_admin can modify role/permission mappings.
create policy "super_admin_manage_role_permissions"
on public.role_permission
for all
to authenticated
using (is_super_admin())
with check (is_super_admin());


-- ============================================================
-- USER PERMISSION
-- ============================================================

drop policy if exists "users_can_view_own_permissions"
on public.user_permission;

drop policy if exists "super_admin_manage_user_permissions"
on public.user_permission;


-- Users can see only their own direct permissions.
create policy "users_can_view_own_permissions"
on public.user_permission
for select
to authenticated
using (user_id = auth.uid());


-- Only super_admin can modify direct user permissions.
create policy "super_admin_manage_user_permissions"
on public.user_permission
for all
to authenticated
using (is_super_admin())
with check (is_super_admin());

