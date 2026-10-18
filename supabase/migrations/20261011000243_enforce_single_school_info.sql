
-- Allow at most one school information record.
CREATE UNIQUE INDEX school_info_single_row_idx
ON public.school_info ((true));
