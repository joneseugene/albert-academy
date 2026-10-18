
-- ============================================================
-- Albert Academy App
-- Enable Row Level Security on all school content tables
-- ============================================================

BEGIN;

ALTER TABLE public.school_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

COMMIT;
