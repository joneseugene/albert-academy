import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";
import type { PermissionKey } from "./permissions";

type ProfileRow =
  Database["public"]["Tables"]["profiles"]["Row"];

type RolePermissionRow =
  Database["public"]["Tables"]["role_permission"]["Row"];

type PermissionRow =
  Database["public"]["Tables"]["permissions"]["Row"];

export async function getCurrentUserPermissions(): Promise<
  PermissionKey[]
> {
  const supabase = await createSupabaseServerClient();

  // ---------------------------------------------------------
  // Authenticated user
  // ---------------------------------------------------------

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
    return [];
  }

  // ---------------------------------------------------------
  // Profile
  // ---------------------------------------------------------

  const {
    data: profileData,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("role_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(
      `Failed to load user profile: ${profileError.message}`,
    );
  }

  const profile = profileData as Pick<
    ProfileRow,
    "role_id"
  > | null;

  if (!profile) {
    return [];
  }

  // ---------------------------------------------------------
  // Role permissions
  // ---------------------------------------------------------

  const {
    data: rolePermissionsData,
    error: rolePermissionsError,
  } = await supabase
    .from("role_permission")
    .select("permission_id")
    .eq("role_id", profile.role_id);

  if (rolePermissionsError) {
    throw new Error(
      `Failed to load role permissions: ${rolePermissionsError.message}`,
    );
  }

  const rolePermissions =
    (rolePermissionsData ?? []) as Pick<
      RolePermissionRow,
      "permission_id"
    >[];

  if (rolePermissions.length === 0) {
    return [];
  }

  // ---------------------------------------------------------
  // Permission IDs
  // ---------------------------------------------------------

  const permissionIds = rolePermissions.map(
    ({ permission_id }) => permission_id,
  );

  // ---------------------------------------------------------
  // Load permissions
  // ---------------------------------------------------------

  const {
    data: permissionData,
    error: permissionError,
  } = await supabase
    .from("permissions")
    .select("id, name")
    .in("id", permissionIds);

  if (permissionError) {
    throw new Error(
      `Failed to load permissions: ${permissionError.message}`,
    );
  }

  const permissionRows =
    (permissionData ?? []) as Pick<
      PermissionRow,
      "id" | "name"
    >[];

  // ---------------------------------------------------------
  // Return effective permission keys
  // ---------------------------------------------------------

  const permissionKeys = new Set<PermissionKey>();

  for (const permission of permissionRows) {
    permissionKeys.add(permission.name as PermissionKey);
  }

  return [...permissionKeys];
}

