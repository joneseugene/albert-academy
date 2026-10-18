
-- ============================================================
-- DID YOU KNOW
-- Albert Academy public website facts
-- ============================================================

CREATE TABLE IF NOT EXISTS public.did_you_know (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,

    -- Optional public URL or Supabase Storage object path.
    image TEXT,
    image_alt TEXT,

    -- Draft facts are hidden from public visitors.
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published')),

    display_order INTEGER NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT did_you_know_title_not_empty
        CHECK (length(trim(title)) > 0),

    CONSTRAINT did_you_know_description_not_empty
        CHECK (length(trim(description)) > 0),

    CONSTRAINT did_you_know_category_not_empty
        CHECK (length(trim(category)) > 0),

    CONSTRAINT did_you_know_image_alt_requires_image
        CHECK (image IS NOT NULL OR image_alt IS NULL)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_did_you_know_public
    ON public.did_you_know (display_order, created_at DESC)
    WHERE status = 'published' AND deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_did_you_know_status
    ON public.did_you_know (status, deleted);

-- ============================================================
-- AUTOMATIC UPDATED_AT
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_did_you_know_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_did_you_know_updated_at
    ON public.did_you_know;

CREATE TRIGGER trg_did_you_know_updated_at
    BEFORE UPDATE ON public.did_you_know
    FOR EACH ROW
    EXECUTE FUNCTION public.set_did_you_know_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.did_you_know ENABLE ROW LEVEL SECURITY;

-- Public visitors and authenticated users can read published,
-- non-deleted facts.
DROP POLICY IF EXISTS "Public can read published facts"
    ON public.did_you_know;

CREATE POLICY "Public can read published facts"
    ON public.did_you_know
    FOR SELECT
    TO anon, authenticated
    USING (
        status = 'published'
        AND deleted = FALSE
    );

-- Super administrators can read all records, including drafts
-- and soft-deleted records.
DROP POLICY IF EXISTS "Super admins can read all facts"
    ON public.did_you_know;

CREATE POLICY "Super admins can read all facts"
    ON public.did_you_know
    FOR SELECT
    TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can insert facts"
    ON public.did_you_know;

CREATE POLICY "Super admins can insert facts"
    ON public.did_you_know
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can update facts"
    ON public.did_you_know;

CREATE POLICY "Super admins can update facts"
    ON public.did_you_know
    FOR UPDATE
    TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can delete facts"
    ON public.did_you_know;

CREATE POLICY "Super admins can delete facts"
    ON public.did_you_know
    FOR DELETE
    TO authenticated
    USING (public.is_super_admin());

-- ============================================================
-- GRANTS
-- RLS still determines which rows each role can access.
-- ============================================================

GRANT SELECT ON public.did_you_know TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE
    ON public.did_you_know
    TO authenticated;

-- ============================================================
-- INITIAL FACTS
-- ============================================================

INSERT INTO public.did_you_know (
    title,
    description,
    category,
    status,
    display_order
)
VALUES
(
    'A legacy that began in 1904.',
    'Founded on 4 October 1904 by the United Brethren Church, Albert Academy has shaped generations through a lasting tradition of education and service.',
    'Our beginnings',
    'published',
    1
),
(
    'Named in honour of Rev. Ira E. Albert.',
    'Albert Academy carries the name of Rev. Ira E. Albert, connecting the school''s identity to the history of the church that established it.',
    'School heritage',
    'published',
    2
),
(
    'Rooted in the heart of Freetown.',
    'In 1907, Albert Academy moved to its present location on Berry Street, Freetown, where its story continued to unfold.',
    'Our home',
    'published',
    3
),
(
    'A heritage of faith and education.',
    'Albert Academy''s history is rooted in the United Brethren Church and a Christian educational tradition that has influenced generations of students.',
    'Our tradition',
    'published',
    4
);
