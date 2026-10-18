-- ============================================================
-- Allow the basic "user" role
-- ============================================================

alter table public.roles
drop constraint if exists roles_name_check;

alter table public.roles
add constraint roles_name_check
check (
    name in (
        'super_admin',
        'school_admin',
        'alumni_admin',
        'user'
    )
);


-- ============================================================
-- Add the basic authenticated user role
-- ============================================================

insert into public.roles (
    name,
    description
)
values (
    'user',
    'Basic authenticated user with access to their own profile.'
)
on conflict (name) do nothing;