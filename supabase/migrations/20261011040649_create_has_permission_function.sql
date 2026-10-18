-- Create a permission checker supporting role-based and direct permissions.

CREATE OR REPLACE FUNCTION public.has_permission(
    permission_key text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles AS profile
        JOIN public.permissions AS permission
            ON permission.name = permission_key
        WHERE profile.id = (SELECT auth.uid())
          AND profile.is_active IS TRUE
          AND profile.is_deleted IS FALSE
          AND (
              -- Permissions inherited from the user's role.
              EXISTS (
                  SELECT 1
                  FROM public.role_permission AS rp
                  WHERE rp.role_id = profile.role_id
                    AND rp.permission_id = permission.id
              )

              OR

              -- Permissions granted directly to the user.
              EXISTS (
                  SELECT 1
                  FROM public.user_permission AS up
                  WHERE up.user_id = profile.id
                    AND up.permission_id = permission.id
              )
          )
    );
$$;

-- Allow authenticated users to check their own permissions.
GRANT EXECUTE
ON FUNCTION public.has_permission(text)
TO authenticated;

-- Refresh the PostgREST schema cache.
NOTIFY pgrst, 'reload schema';