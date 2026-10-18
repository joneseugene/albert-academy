-- ============================================================
-- Bootstrap the first super administrator
-- ============================================================
--
-- This is a one-time administrative bootstrap.
-- It intentionally runs as part of a database migration,
-- allowing the initial administrator's role to be assigned
-- before is_super_admin() can recognize that administrator.
-- ============================================================

update public.profiles
set
  role_id = 'cb8c0da0-ab79-4f90-a0db-5ee8fe73228a',
  updated_at = now()
where id = 'e3f46f0a-bc6f-4ea9-a21d-b27752ff30ea'
  and role_id = 'a8309f4c-10db-478b-9d85-a23047164fa5';

