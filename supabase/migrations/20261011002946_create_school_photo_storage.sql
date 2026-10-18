
-- ============================================================
-- Albert Academy: Public image storage buckets
-- ============================================================

-- 1. Create buckets for school website content.
-- Public buckets allow public image URLs.
-- Uploads are restricted to images up to 5 MB.

INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
VALUES
    (
        'staff-photos',
        'staff-photos',
        TRUE,
        5242880,
        ARRAY[
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/avif'
        ]
    ),
    (
        'academic-photos',
        'academic-photos',
        TRUE,
        5242880,
        ARRAY[
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/avif'
        ]
    ),
    (
        'media-photos',
        'media-photos',
        TRUE,
        5242880,
        ARRAY[
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/avif'
        ]
    ),
    (
        'notable-photos',
        'notable-photos',
        TRUE,
        5242880,
        ARRAY[
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/avif'
        ]
    ),
    (
        'past-leadership-photos',
        'past-leadership-photos',
        TRUE,
        5242880,
        ARRAY[
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/avif'
        ]
    ),
    (
        'student-photos',
        'student-photos',
        TRUE,
        5242880,
        ARRAY[
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/avif'
        ]
    )
ON CONFLICT (id)
DO UPDATE SET
    name = EXCLUDED.name,
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;


-- ============================================================
-- 2. Super administrator helper
-- Uses the existing profiles and roles tables.
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles AS p
        INNER JOIN public.roles AS r
            ON r.id = p.role_id
        WHERE p.id = (SELECT auth.uid())
          AND r.name = 'super_admin'
    );
$$;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_super_admin()
TO authenticated;


-- ============================================================
-- 3. Public read access for school photos
-- ============================================================

DROP POLICY IF EXISTS "Public can view school photos"
ON storage.objects;

CREATE POLICY "Public can view school photos"
ON storage.objects
FOR SELECT
TO public
USING (
    bucket_id IN (
        'staff-photos',
        'academic-photos',
        'media-photos',
        'notable-photos',
        'past-leadership-photos',
        'student-photos'
    )
);


-- ============================================================
-- 4. Only super administrators can upload photos
-- ============================================================

DROP POLICY IF EXISTS "Super admins can upload school photos"
ON storage.objects;

CREATE POLICY "Super admins can upload school photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id IN (
        'staff-photos',
        'academic-photos',
        'media-photos',
        'notable-photos',
        'past-leadership-photos',
        'student-photos'
    )
    AND (SELECT public.is_super_admin())
);


-- ============================================================
-- 5. Only super administrators can update or overwrite photos
-- ============================================================

DROP POLICY IF EXISTS "Super admins can update school photos"
ON storage.objects;

CREATE POLICY "Super admins can update school photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id IN (
        'staff-photos',
        'academic-photos',
        'media-photos',
        'notable-photos',
        'past-leadership-photos',
        'student-photos'
    )
    AND (SELECT public.is_super_admin())
)
WITH CHECK (
    bucket_id IN (
        'staff-photos',
        'academic-photos',
        'media-photos',
        'notable-photos',
        'past-leadership-photos',
        'student-photos'
    )
    AND (SELECT public.is_super_admin())
);


-- ============================================================
-- 6. Only super administrators can delete photos
-- ============================================================

DROP POLICY IF EXISTS "Super admins can delete school photos"
ON storage.objects;

CREATE POLICY "Super admins can delete school photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id IN (
        'staff-photos',
        'academic-photos',
        'media-photos',
        'notable-photos',
        'past-leadership-photos',
        'student-photos'
    )
    AND (SELECT public.is_super_admin())
);
