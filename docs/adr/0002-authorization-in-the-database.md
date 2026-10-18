# ADR 0002: Authorization is enforced in Postgres

Status: Accepted

Roles and permissions are data (`roles`, `permissions`, `role_permissions`). RLS policies call
`has_permission('module.action')`. Application code checks permission keys, never role names,
and UI hiding is convenience only. Permissions are read from the database rather than JWT claims
so changes apply immediately.

Consequences: a client bug cannot bypass access control; new roles need no deploy; RLS policies
must be covered by pgTAP tests. Revisit JWT claims only if performance requires it.
