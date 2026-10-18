-- ============================================================
-- SEED RBAC PERMISSIONS
-- ============================================================

-- ============================================================
-- 1. SYSTEM / RBAC PERMISSIONS
-- ============================================================

insert into public.permissions (name, description)
values
    ('profiles.manage', 'Create, update, and manage user profiles.'),
    ('roles.manage', 'Create, update, and manage system roles.'),
    ('permissions.manage', 'Create, update, and manage permissions.'),
    ('role_permissions.manage', 'Assign permissions to roles.'),
    ('user_permissions.manage', 'Assign direct permissions to users.')
on conflict (name) do nothing;


-- ============================================================
-- 2. SCHOOL PERMISSIONS
-- ============================================================

insert into public.permissions (name, description)
values
    ('school.read', 'View school information and content.'),
    ('school.create', 'Create school information and content.'),
    ('school.update', 'Update school information and content.'),
    ('school.delete', 'Delete school information and content.')
on conflict (name) do nothing;


-- ============================================================
-- 3. SCHOOL CONTENT PERMISSIONS
-- ============================================================

insert into public.permissions (name, description)
values
    ('news.read', 'View school news.'),
    ('news.create', 'Create school news.'),
    ('news.update', 'Update school news.'),
    ('news.delete', 'Delete school news.'),

    ('leadership.manage', 'Manage school leadership information.'),

    ('principals.manage', 'Manage school principals information.'),

    ('school_song.manage', 'Manage the school song and lyrics.')
on conflict (name) do nothing;


-- ============================================================
-- 4. ALUMNI PERMISSIONS
-- ============================================================

insert into public.permissions (name, description)
values
    ('alumni.read', 'View alumni records.'),
    ('alumni.create', 'Create alumni records.'),
    ('alumni.update', 'Update alumni records.'),
    ('alumni.delete', 'Delete alumni records.')
on conflict (name) do nothing;


-- ============================================================
-- 5. SUPER ADMIN GETS ALL PERMISSIONS
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
on conflict (role_id, permission_id) do nothing;


-- ============================================================
-- 6. SCHOOL ADMIN PERMISSIONS
-- ============================================================

insert into public.role_permission (
    role_id,
    permission_id
)
select
    r.id,
    p.id
from public.roles r
join public.permissions p
    on p.name in (
        'school.read',
        'school.create',
        'school.update',
        'school.delete',

        'news.read',
        'news.create',
        'news.update',
        'news.delete',

        'leadership.manage',
        'principals.manage',
        'school_song.manage'
    )
where r.name = 'school_admin'
on conflict (role_id, permission_id) do nothing;


-- ============================================================
-- 7. ALUMNI ADMIN PERMISSIONS
-- ============================================================

insert into public.role_permission (
    role_id,
    permission_id
)
select
    r.id,
    p.id
from public.roles r
join public.permissions p
    on p.name in (
        'alumni.read',
        'alumni.create',
        'alumni.update',
        'alumni.delete'
    )
where r.name = 'alumni_admin'
on conflict (role_id, permission_id) do nothing;