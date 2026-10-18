
-- ============================================================
-- CRUD permissions for all resource modules
-- ============================================================

DO $$
DECLARE
    resource RECORD;
    action_name TEXT;
    permission_name TEXT;
BEGIN
    FOR resource IN
        SELECT *
        FROM (
            VALUES
                ('alumni', 'Notable alumni'),
                ('academic', 'Academic resources'),
                ('students', 'Student leadership'),
                ('staff', 'School staff'),
                ('past_leadership', 'Past leadership'),
                ('media', 'Media resources'),
                ('school', 'School information'),
                ('news', 'News articles')
        ) AS resources(resource_key, resource_label)
    LOOP
        FOREACH action_name IN ARRAY ARRAY[
            'read',
            'create',
            'update',
            'delete'
        ]
        LOOP
            permission_name := resource.resource_key || '.' || action_name;

            INSERT INTO public.permissions (name, description)
            SELECT
                permission_name,
                action_name || ' ' || resource.resource_label || '.'
            WHERE NOT EXISTS (
                SELECT 1
                FROM public.permissions
                WHERE name = permission_name
            );

            -- Grant each CRUD permission to super_admin.
            INSERT INTO public.role_permission (
                role_id,
                permission_id
            )
            SELECT
                r.id,
                p.id
            FROM public.roles AS r
            CROSS JOIN public.permissions AS p
            WHERE r.name = 'super_admin'
              AND p.name = permission_name
              AND NOT EXISTS (
                  SELECT 1
                  FROM public.role_permission AS rp
                  WHERE rp.role_id = r.id
                    AND rp.permission_id = p.id
              );
        END LOOP;
    END LOOP;
END;
$$;

NOTIFY pgrst, 'reload schema';
