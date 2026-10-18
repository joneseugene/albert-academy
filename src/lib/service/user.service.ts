import "server-only";

import type { Database } from "@/types/database.types";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import type {
  UpdateUserInput,
} from "@/lib/schemas/user.schema";

import { requirePermission } from "@/lib/auth/require-permission";
import { permissions } from "@/lib/auth/permissions";

import { createProfileRepository } from "@/lib/repositories/profile.repository";
import type { InviteUserInput } from "../schemas/invite.user.schema";

type Profile =
  Database["public"]["Tables"]["profiles"]["Row"];

type ProfileUpdate =
  Database["public"]["Tables"]["profiles"]["Update"];

type Role =
  Database["public"]["Tables"]["roles"]["Row"];

export type UserWithRole =
  Profile & {
    role:
      | Pick<
          Role,
          "id" | "name" | "description"
        >
      | null;
  };

const USER_SELECT = `
  *,
  role:roles (
    id,
    name,
    description
  )
`;

export async function getUsers(): Promise<
  UserWithRole[]
> {
  await requirePermission(
    permissions.usersRead,
  );

  const supabase =
    await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(USER_SELECT);

  if (error) {
    throw new Error(
      `Failed to load users: ${error.message}`,
    );
  }

  return (data ?? []) as UserWithRole[];
}

export async function getUser(
  userId: string,
): Promise<UserWithRole | null> {
  await requirePermission(
    permissions.usersRead,
  );

  const supabase =
    await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(USER_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load user: ${error.message}`,
    );
  }

  return data as UserWithRole | null;
}

/**
 * Invite a new user.
 *
 * This operation uses the service-role client because
 * Supabase Auth Admin APIs require privileged credentials.
 *
 * The caller's permission is checked BEFORE the admin
 * client is used.
 */
export async function inviteUser(
  input: InviteUserInput,
) {
  await requirePermission(
    permissions.profilesManage,
  );

  const admin =
    createSupabaseAdminClient();

  /*
   * Validate that the requested role exists.
   *
   * This query uses the admin client because role
   * assignment is part of the privileged invitation
   * operation.
   */
  const { data: role, error: roleError } =
    await admin
      .from("roles")
      .select("id, name, description")
      .eq("id", input.roleId)
      .maybeSingle();

  if (roleError) {
    throw new Error(
      `Failed to validate role: ${roleError.message}`,
    );
  }

  if (!role) {
    throw new Error(
      "The selected role does not exist.",
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not configured.",
    );
  }

  const redirectTo =
    `${siteUrl}/accept-invite`;

  /*
   * Send the Supabase invitation email.
   *
   * first_name, last_name and role_id are stored
   * in auth.users.raw_user_meta_data and can be
   * used when creating/synchronizing the profile.
   */
  const { data, error } =
    await admin.auth.admin.inviteUserByEmail(
      input.email,
      {
        data: {
          first_name: input.firstName,
          last_name: input.lastName,
          role_id: input.roleId,
        },
        redirectTo,
      },
    );

  if (error) {
    throw new Error(
      `Failed to invite user: ${error.message}`,
    );
  }

  if (!data.user) {
    throw new Error(
      "Invitation failed: no user was returned.",
    );
  }

  return data.user;
}

export async function updateUser(
  userId: string,
  input: UpdateUserInput,
): Promise<UserWithRole | null> {
  await requirePermission(
    permissions.profilesManage,
  );

  const profiles =
    await createProfileRepository();

  const profileUpdate: ProfileUpdate = {};

  if (input.firstName !== undefined) {
    profileUpdate.first_name =
      input.firstName;
  }

  if (input.lastName !== undefined) {
    profileUpdate.last_name =
      input.lastName;
  }

  if (input.email !== undefined) {
    profileUpdate.email =
      input.email;
  }

  if (input.roleId !== undefined) {
    profileUpdate.role_id =
      input.roleId;
  }

  if (input.isActive !== undefined) {
    profileUpdate.is_active =
      input.isActive;
  }

  if (
    Object.keys(profileUpdate).length === 0
  ) {
    return getUser(userId);
  }

  await profiles.update(
    userId,
    profileUpdate,
  );

  return getUser(userId);
}

export async function activateUser(
  userId: string,
): Promise<UserWithRole | null> {
  await requirePermission(
    permissions.profilesManage,
  );

  const profiles =
    await createProfileRepository();

  await profiles.update(userId, {
    is_active: true,
  });

  return getUser(userId);
}

export async function deactivateUser(
  userId: string,
): Promise<UserWithRole | null> {
  await requirePermission(
    permissions.profilesManage,
  );

  const profiles =
    await createProfileRepository();

  await profiles.update(userId, {
    is_active: false,
  });

  return getUser(userId);
}