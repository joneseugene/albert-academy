-- ============================================================
-- Add mobile number to profiles
-- ============================================================

alter table public.profiles
add column if not exists mobile text;