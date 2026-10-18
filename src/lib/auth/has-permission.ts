import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PermissionKey } from "./permissions";

export async function hasPermission(
  permission: PermissionKey,
): Promise<boolean> {
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
    return false;
  }

  const { data, error } = await supabase.rpc(
    "has_permission",
    {
      permission_key: permission,
    } as never,
  );

  if (error) {
    throw new Error(
      `Permission check failed: ${error.message}`,
    );
  }

  return data === true;
}