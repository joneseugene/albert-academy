-- ============================================================
-- RBAC FOUNDATION
-- Profiles, Roles, Permissions, Role Permissions, User Permissions
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. ROLES
-- ============================================================

create table public.roles (
    id uuid primary key default gen_random_uuid(),

    name text not null unique,

    description text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint roles_name_check
        check (name in (
            'super_admin',
            'school_admin',
            'alumni_admin'
        ))
);

-- ============================================================
-- 2. PERMISSIONS
-- ============================================================

create table public.permissions (
    id uuid primary key default gen_random_uuid(),

    name text not null unique,

    description text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ============================================================
-- 3. PROFILES
-- ============================================================

create table public.profiles (
    id uuid primary key
        references auth.users(id)
        on delete cascade,

    role_id uuid not null
        references public.roles(id)
        on delete restrict,

    first_name text,
    last_name text,

    email text,

    is_active boolean not null default true,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ============================================================
-- 4. ROLE PERMISSIONS
-- ============================================================

create table public.role_permission (
    role_id uuid not null
        references public.roles(id)
        on delete cascade,

    permission_id uuid not null
        references public.permissions(id)
        on delete cascade,

    created_at timestamptz not null default now(),

    primary key (role_id, permission_id)
);

-- ============================================================
-- 5. USER PERMISSIONS
-- ============================================================

create table public.user_permission (
    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    permission_id uuid not null
        references public.permissions(id)
        on delete cascade,

    created_at timestamptz not null default now(),

    primary key (user_id, permission_id)
);

-- ============================================================
-- 6. INDEXES
-- ============================================================

create index profiles_role_id_idx
    on public.profiles(role_id);

create index role_permission_permission_id_idx
    on public.role_permission(permission_id);

create index user_permission_permission_id_idx
    on public.user_permission(permission_id);

create index user_permission_user_id_idx
    on public.user_permission(user_id);

-- ============================================================
-- 7. UPDATED_AT FUNCTION
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- ============================================================
-- 8. UPDATED_AT TRIGGERS
-- ============================================================

create trigger set_roles_updated_at
before update on public.roles
for each row
execute function public.set_updated_at();

create trigger set_permissions_updated_at
before update on public.permissions
for each row
execute function public.set_updated_at();

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- ============================================================
-- 9. SEED ROLES
-- ============================================================

insert into public.roles (name, description)
values
    (
        'super_admin',
        'Full system administration and RBAC management.'
    ),
    (
        'school_admin',
        'Manages school administration and school content.'
    ),
    (
        'alumni_admin',
        'Manages alumni and old pupil records and related content.'
    )
on conflict (name) do nothing;

-- ============================================================
-- 10. HELPER FUNCTION
--
-- Determines whether the currently authenticated user
-- is a super administrator.
--
-- SECURITY DEFINER prevents RLS recursion when this function
-- reads profiles/roles while RLS is enabled.
-- ============================================================

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles p
        inner join public.roles r
            on r.id = p.role_id
        where p.id = auth.uid()
          and p.is_active = true
          and r.name = 'super_admin'
    );
$$;

-- ============================================================
-- 11. OPTIONAL HELPER: CURRENT USER ROLE
-- ============================================================

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
    select r.name
    from public.profiles p
    inner join public.roles r
        on r.id = p.role_id
    where p.id = auth.uid()
      and p.is_active = true
    limit 1;
$$;

-- ============================================================
-- 12. ENABLE RLS
-- ============================================================

alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.profiles enable row level security;
alter table public.role_permission enable row level security;
alter table public.user_permission enable row level security;

-- ============================================================
-- 13. ROLES POLICIES
-- ONLY SUPER ADMIN CAN MANAGE ROLES
-- ============================================================

create policy "super_admin_manage_roles"
on public.roles
for all
to authenticated
using (
    public.is_super_admin()
)
with check (
    public.is_super_admin()
);

-- ============================================================
-- 14. PERMISSIONS POLICIES
-- ONLY SUPER ADMIN CAN MANAGE PERMISSIONS
-- ============================================================

create policy "super_admin_manage_permissions"
on public.permissions
for all
to authenticated
using (
    public.is_super_admin()
)
with check (
    public.is_super_admin()
);

-- ============================================================
-- 15. PROFILES POLICIES
-- ONLY SUPER ADMIN CAN MANAGE PROFILES
-- ============================================================

create policy "super_admin_manage_profiles"
on public.profiles
for all
to authenticated
using (
    public.is_super_admin()
)
with check (
    public.is_super_admin()
);

-- ============================================================
-- 16. ROLE PERMISSIONS POLICIES
-- ONLY SUPER ADMIN CAN MANAGE ROLE PERMISSIONS
-- ============================================================

create policy "super_admin_manage_role_permissions"
on public.role_permission
for all
to authenticated
using (
    public.is_super_admin()
)
with check (
    public.is_super_admin()
);

-- ============================================================
-- 17. USER PERMISSIONS POLICIES
-- ONLY SUPER ADMIN CAN MANAGE USER PERMISSIONS
-- ============================================================

create policy "super_admin_manage_user_permissions"
on public.user_permission
for all
to authenticated
using (
    public.is_super_admin()
)
with check (
    public.is_super_admin()
);

-- ============================================================
-- 18. GRANTS
-- ============================================================

grant usage on schema public to authenticated;

grant select, insert, update, delete
on public.roles
to authenticated;

grant select, insert, update, delete
on public.permissions
to authenticated;

grant select, insert, update, delete
on public.profiles
to authenticated;

grant select, insert, update, delete
on public.role_permission
to authenticated;

grant select, insert, update, delete
on public.user_permission
to authenticated;

-- ============================================================
-- 19. FUNCTION EXECUTION
-- ============================================================

grant execute on function public.is_super_admin()
to authenticated;

grant execute on function public.current_user_role()
to authenticated;