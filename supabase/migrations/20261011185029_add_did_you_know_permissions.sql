-- Add Did You Know permissions and assign them to the appropriate roles.
-- Safe to run repeatedly.

BEGIN;

-- 1. Create the four permissions.
INSERT INTO public.permissions (name, description)
VALUES
    ('did_you_know.read',   'View Did You Know resources.'),
    ('did_you_know.create', 'Create Did You Know resources.'),
    ('did_you_know.update', 'Update Did You Know resources.'),
    ('did_you_know.delete', 'Delete Did You Know resources.')
ON CONFLICT (name)
DO UPDATE SET
    description = EXCLUDED.description,
    updated_at = NOW();

-- 2. Give all four permissions to super_admin and school_admin.
-- super_admin needs full access; school_admin manages school content.
INSERT INTO public.role_permission (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM public.roles AS r
CROSS JOIN public.permissions AS p
WHERE r.name IN ('super_admin', 'school_admin')
  AND p.name IN (
      'did_you_know.read',
      'did_you_know.create',
      'did_you_know.update',
      'did_you_know.delete'
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

COMMIT;