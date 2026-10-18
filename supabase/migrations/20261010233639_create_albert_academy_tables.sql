
-- ============================================================
-- Albert Academy App
-- Migration: Create school content tables
-- ============================================================

BEGIN;

-- ============================================================
-- 1. SCHOOL INFO
-- Stores the school's general information and contact details.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.school_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL DEFAULT 'Albert Academy',
    about TEXT,
    vision TEXT,
    mission TEXT,
    history TEXT,
    founder TEXT,

    contact JSONB NOT NULL DEFAULT '{}'::JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT school_info_contact_is_object
        CHECK (jsonb_typeof(contact) = 'object')
);

COMMENT ON COLUMN public.school_info.contact IS
'JSON object containing address, mobile_line_1, mobile_line_2, email, po_box, facebook_url, youtube_url, twitter_url and tiktok_url.';


-- ============================================================
-- 2. STAFF
-- Stores current staff and leadership information.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    photo TEXT,
    role TEXT NOT NULL,
    level TEXT,
    start_year INTEGER,
    end_year INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT staff_level_check
        CHECK (level IS NULL OR level IN ('jss', 'sss')),

    CONSTRAINT staff_years_check
        CHECK (
            start_year IS NULL
            OR end_year IS NULL
            OR end_year >= start_year
        )
);


-- ============================================================
-- 3. STUDENT TABLE
-- Stores student leadership information.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.student_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    photo TEXT,
    role TEXT NOT NULL,
    level TEXT,
    start_year INTEGER,
    end_year INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT student_table_level_check
        CHECK (level IS NULL OR level IN ('jss', 'sss')),

    CONSTRAINT student_table_years_check
        CHECK (
            start_year IS NULL
            OR end_year IS NULL
            OR end_year >= start_year
        )
);


-- ============================================================
-- 4. PAST LEADERSHIP
-- Stores former staff and student leaders.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.past_leadership (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    photo TEXT,
    role TEXT NOT NULL,
    level TEXT,
    about TEXT,
    start_year INTEGER,
    end_year INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT past_leadership_level_check
        CHECK (
            level IS NULL
            OR level IN ('jss', 'sss')
        ),

    CONSTRAINT past_leadership_years_check
        CHECK (
            start_year IS NULL
            OR end_year IS NULL
            OR end_year >= start_year
        )
);


-- ============================================================
-- 5. NOTABLE
-- Stores notable alumni and other notable people.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    photo TEXT,
    title TEXT,
    description TEXT,
    detail TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 6. ACADEMIC
-- Stores academic resources, publications and links.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.academic (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    photo TEXT,
    link TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 7. MEDIA
-- Stores images and other media records.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    photo TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- UPDATED_AT TRIGGER
-- Automatically refreshes updated_at on row updates.
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_school_info_updated_at
BEFORE UPDATE ON public.school_info
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_student_table_updated_at
BEFORE UPDATE ON public.student_table
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_past_leadership_updated_at
BEFORE UPDATE ON public.past_leadership
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_notable_updated_at
BEFORE UPDATE ON public.notable
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_academic_updated_at
BEFORE UPDATE ON public.academic
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_media_updated_at
BEFORE UPDATE ON public.media
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMIT;
