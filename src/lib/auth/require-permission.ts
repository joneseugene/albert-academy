import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserPermissions } from "./get-current-user-permissions";
import type { PermissionKey } from "./permissions";

export async function requirePermission(
  permission: PermissionKey,
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(
      `Authentication failed: ${authError.message}`,
    );
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  // ---------------------------------------------------------
  // Super admin bypass
  // ---------------------------------------------------------

  const {
    data: isSuperAdmin,
    error: superAdminError,
  } = await supabase.rpc("is_super_admin");

  if (superAdminError) {
    throw new Error(
      `Failed to verify administrator role: ${superAdminError.message}`,
    );
  }

  if (isSuperAdmin === true) {
    return user;
  }

  // ---------------------------------------------------------
  // Permission check
  // ---------------------------------------------------------

  const userPermissions =
    await getCurrentUserPermissions();

  if (!userPermissions.includes(permission)) {
    throw new Error("Forbidden");
  }

  return user;
}

