import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { permissions } from "@/lib/auth/permissions";

import type { Database } from "@/types/database.types";
import { createCrud } from "../supabase/crud-base";

type Role =
  Database["public"]["Tables"]["roles"]["Row"];

export type RoleOption = Pick<
  Role,
  "id" | "name" | "description"
>;

/**
 * Get roles available for user management.
 *
 * The caller must have permission to manage profiles/users.
 */
export async function getRoles(): Promise<RoleOption[]> {
  await requirePermission(
    permissions.profilesManage,
  );

  const supabase =
    await createSupabaseServerClient();

  const roles = createCrud(
    supabase,
    "roles",
  );

  const data = await roles.findMany();

  return data
    .map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name),
    );
}