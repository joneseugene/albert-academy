BEGIN;

-- 1. Create the missing navigation permissions.
INSERT INTO public.permissions (name, description)
SELECT v.name, v.description
FROM (
    VALUES
        ('academic.read', 'View academic resources.'),
        ('past_leadership.read', 'View past school leadership.'),
        ('students.read', 'View student leadership.'),
        ('staff.read', 'View school staff.'),
        ('media.read', 'View school media.')
) AS v(name, description)
WHERE NOT EXISTS (
    SELECT 1
    FROM public.permissions p
    WHERE p.name = v.name
);

-- 2. Grant the new permissions to super_admin.
INSERT INTO public.role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'super_admin'
  AND p.name IN (
      'academic.read',
      'past_leadership.read',
      'students.read',
      'staff.read',
      'media.read'
  )
ON CONFLICT DO NOTHING;

-- 3. Make school_admin compatible with the sidebar's school.read key.
INSERT INTO public.role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p
    ON p.name = 'school.read'
WHERE r.name = 'school_admin'
ON CONFLICT DO NOTHING;

COMMIT;