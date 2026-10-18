-- ============================================================
-- Add soft-delete support to profiles
-- ============================================================

alter table public.profiles
add column if not exists is_deleted boolean not null default false;