# ADR 0001: One Next.js app with a layered structure

Status: Accepted

Public site and admin portal are route groups in one app and one deployment. Code is layered
UI → Server Actions (Zod validation) → services (business logic) → repositories (Supabase queries)
→ Postgres (RLS/functions). Each module lives in `src/features/<module>`.

Consequences: one deploy and shared components; future modules are added as a new feature folder,
a migration and permission rows, without touching existing modules.
