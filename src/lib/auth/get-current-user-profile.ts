import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type Role = Database["public"]["Tables"]["roles"]["Row"];

export interface CurrentUserProfile extends Profile {
  role: Pick<Role, "id" | "name" | "description"> | null;
}

export async function getCurrentUserProfile(): Promise<CurrentUserProfile | null> {
  const supabase = await createSupabaseServerClient();

  // ---------------------------------------------------------
  // Get authenticated user
  // ---------------------------------------------------------

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  if (!user) {
    return null;
  }

  // ---------------------------------------------------------
  // Get profile
  // ---------------------------------------------------------

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Failed to load profile: ${profileError.message}`);
  }

  const profile = profileData as Profile | null;

  if (!profile) {
    return null;
  }

  // ---------------------------------------------------------
  // Get role
  // ---------------------------------------------------------

  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select("id, name, description")
    .eq("id", profile.role_id)
    .maybeSingle();

  if (roleError) {
    throw new Error(`Failed to load user role: ${roleError.message}`);
  }

  const role = roleData as Pick<Role, "id" | "name" | "description"> | null;

  // ---------------------------------------------------------
  // Return normalized profile
  // ---------------------------------------------------------

  return {
    ...profile,
    role,
  };
}
