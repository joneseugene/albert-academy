# ADR 0003: Toolchain choices

Status: Accepted

Next.js App Router, strict TypeScript (`noUncheckedIndexedAccess`), Tailwind 3 with CSS-variable
tokens (shadcn-compatible), Zod 3 with React Hook Form, Vitest for unit tests, pgTAP for RLS tests,
Tiptap for rich text (added in Phase 5). Hosting target: Vercel plus hosted Supabase.
A Content-Security-Policy is deferred to Phase 9.
