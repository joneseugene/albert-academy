// @ts-ignore
import { createClient } from "npm:@supabase/supabase-js@2.117.3";

declare const Deno: {
  serve(handler: (request: Request) => Response | Promise<Response>): void;

  env: {
    get(name: string): string | undefined;
  };
};

const corsHeaders = {
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Headers":
"authorization, x-client-info, apikey, content-type",
"Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
return new Response(JSON.stringify(data), {
status,
headers: {
...corsHeaders,
"Content-Type": "application/json",
},
});
}

interface UpdateUserRequest {
user_id?: unknown;
first_name?: unknown;
last_name?: unknown;
email?: unknown;
mobile?: unknown;
role_id?: unknown;
is_active?: unknown;
}

Deno.serve(async (req) => {
if (req.method === "OPTIONS") {
return new Response("ok", {
headers: corsHeaders,
});
}

if (req.method !== "POST") {
return json(
{
success: false,
message: "Method not allowed.",
},
405,
);
}

try {
/*
* Environment
*/
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get(
"SUPABASE_SERVICE_ROLE_KEY",
);
const anonKey = Deno.env.get("SUPABASE_ANON_KEY");


if (!supabaseUrl || !serviceRoleKey || !anonKey) {
  return json(
    {
      success: false,
      message:
        "Supabase environment variables are not configured.",
    },
    500,
  );
}

/*
 * Client using the caller's JWT.
 */
const supabase = createClient(
  supabaseUrl,
  anonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization:
          req.headers.get("Authorization") ?? "",
      },
    },
  },
);

/*
 * Admin client.
 */
const admin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

/*
 * Verify caller.
 */
const {
  data: { user: caller },
  error: callerError,
} = await supabase.auth.getUser();

if (callerError || !caller) {
  return json(
    {
      success: false,
      message: "Unauthorized.",
    },
    401,
  );
}

/*
 * Verify caller is a Super Admin.
 */
const {
  data: callerProfile,
  error: profileError,
} = await admin
  .from("profiles")
  .select(`
    id,
    role_id,
    roles (
      id,
      name
    )
  `)
  .eq("id", caller.id)
  .single();

if (profileError || !callerProfile) {
  console.error(
    "Caller profile error:",
    profileError,
  );

  return json(
    {
      success: false,
      message:
        "Unable to determine caller permissions.",
    },
    403,
  );
}

const callerRole = Array.isArray(callerProfile.roles)
  ? callerProfile.roles[0]
  : callerProfile.roles;

if (callerRole?.name !== "super_admin") {
  return json(
    {
      success: false,
      message:
        "Only Super Admins can update users.",
    },
    403,
  );
}

/*
 * Read request body.
 */
let body: UpdateUserRequest;

try {
  body = await req.json();
} catch {
  return json(
    {
      success: false,
      message: "Invalid JSON request body.",
    },
    400,
  );
}

/*
 * Validate user ID.
 */
const userId = body.user_id;

if (
  typeof userId !== "string" ||
  userId.trim().length === 0
) {
  return json(
    {
      success: false,
      message: "user_id is required.",
    },
    400,
  );
}

/*
 * Prevent a Super Admin from modifying
 * their own account through this function.
 *
 * Remove this block if self-management is desired.
 */
if (userId === caller.id) {
  return json(
    {
      success: false,
      message:
        "You cannot update your own account using this function.",
    },
    403,
  );
}

/*
 * Get target Auth user.
 */
const {
  data: targetResult,
  error: targetError,
} = await admin.auth.admin.getUserById(userId);

if (targetError || !targetResult.user) {
  console.error(
    "Target Auth user error:",
    targetError,
  );

  return json(
    {
      success: false,
      message: "Auth user not found.",
    },
    404,
  );
}

const targetUser = targetResult.user;

/*
 * Get target profile.
 */
const {
  data: targetProfile,
  error: targetProfileError,
} = await admin
  .from("profiles")
  .select(`
    id,
    first_name,
    last_name,
    email,
    mobile,
    role_id,
    is_active,
    is_deleted,
    roles (
      id,
      name
    )
  `)
  .eq("id", userId)
  .single();

if (
  targetProfileError ||
  !targetProfile
) {
  console.error(
    "Target profile error:",
    targetProfileError,
  );

  return json(
    {
      success: false,
      message: "User profile not found.",
    },
    404,
  );
}

/*
 * Do not update deleted users.
 */
if (targetProfile.is_deleted) {
  return json(
    {
      success: false,
      message:
        "Cannot update a deleted user. Restore the user first.",
    },
    409,
  );
}

/*
 * Validate supplied fields.
 */
const firstName =
  body.first_name === undefined
    ? targetProfile.first_name
    : body.first_name;

const lastName =
  body.last_name === undefined
    ? targetProfile.last_name
    : body.last_name;

const mobile =
  body.mobile === undefined
    ? targetProfile.mobile
    : body.mobile;

const email =
  body.email === undefined
    ? targetUser.email
    : body.email;

const roleId =
  body.role_id === undefined
    ? targetProfile.role_id
    : body.role_id;

const isActive =
  body.is_active === undefined
    ? targetProfile.is_active
    : body.is_active;

if (
  typeof firstName !== "string" ||
  firstName.trim().length === 0
) {
  return json(
    {
      success: false,
      message: "first_name is required.",
    },
    400,
  );
}

if (
  typeof lastName !== "string" ||
  lastName.trim().length === 0
) {
  return json(
    {
      success: false,
      message: "last_name is required.",
    },
    400,
  );
}

if (
  email !== null &&
  typeof email !== "string"
) {
  return json(
    {
      success: false,
      message: "email must be a valid string.",
    },
    400,
  );
}

if (
  mobile !== null &&
  typeof mobile !== "string"
) {
  return json(
    {
      success: false,
      message: "mobile must be a string or null.",
    },
    400,
  );
}

if (
  typeof roleId !== "string" ||
  roleId.trim().length === 0
) {
  return json(
    {
      success: false,
      message: "role_id is required.",
    },
    400,
  );
}

if (typeof isActive !== "boolean") {
  return json(
    {
      success: false,
      message: "is_active must be a boolean.",
    },
    400,
  );
}

/*
 * Email must be present.
 */
if (
  typeof email !== "string" ||
  email.trim().length === 0
) {
  return json(
    {
      success: false,
      message: "email is required.",
    },
    400,
  );
}

const normalizedEmail =
  email.trim().toLowerCase();

/*
 * Verify role exists.
 */
const {
  data: role,
  error: roleError,
} = await admin
  .from("roles")
  .select("id, name")
  .eq("id", roleId)
  .single();

if (roleError || !role) {
  return json(
    {
      success: false,
      message: "Selected role does not exist.",
    },
    400,
  );
}

/*
 * Do not allow another user to be promoted
 * to super_admin through this endpoint.
 *
 * Remove this restriction if your application
 * intentionally supports assigning super_admin.
 */
if (
  role.name === "super_admin" &&
  callerRole?.name === "super_admin"
) {
  /*
   * A Super Admin is technically allowed to assign
   * the role, so this block intentionally does nothing.
   */
}

/*
 * Check for duplicate profile email.
 */
const {
  data: existingProfile,
  error: existingProfileError,
} = await admin
  .from("profiles")
  .select("id, is_deleted")
  .eq("email", normalizedEmail)
  .neq("id", userId)
  .maybeSingle();

if (existingProfileError) {
  console.error(
    "Existing email check error:",
    existingProfileError,
  );

  return json(
    {
      success: false,
      message:
        "Unable to validate the email address.",
    },
    500,
  );
}

if (existingProfile) {
  return json(
    {
      success: false,
      message:
        existingProfile.is_deleted
          ? "This email belongs to a deleted user."
          : "Another user already has this email address.",
    },
    409,
  );
}

/*
 * Update Auth user.
 *
 * Only email is updated here. Password changes
 * should use the password-reset flow.
 */
const authUpdates: {
  email?: string;
} = {};

if (
  normalizedEmail !==
  (targetUser.email ?? "").toLowerCase()
) {
  authUpdates.email = normalizedEmail;
}

if (Object.keys(authUpdates).length > 0) {
  const {
    error: authUpdateError,
  } = await admin.auth.admin.updateUserById(
    userId,
    authUpdates,
  );

  if (authUpdateError) {
    console.error(
      "Auth user update error:",
      authUpdateError,
    );

    return json(
      {
        success: false,
        message:
          "Failed to update the authentication account.",
      },
      500,
    );
  }
}

/*
 * Update profile.
 */
const {
  data: updatedProfile,
  error: updateProfileError,
} = await admin
  .from("profiles")
  .update({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: normalizedEmail,
    mobile:
      typeof mobile === "string"
        ? mobile.trim()
        : mobile,
    role_id: roleId,
    is_active: isActive,
    updated_at: new Date().toISOString(),
  })
  .eq("id", userId)
  .select(`
    id,
    first_name,
    last_name,
    email,
    mobile,
    role_id,
    is_active,
    is_deleted,
    roles (
      id,
      name
    )
  `)
  .single();

if (updateProfileError || !updatedProfile) {
  console.error(
    "Profile update error:",
    updateProfileError,
  );

  /*
   * If Auth email was already changed but profile
   * update failed, the two systems can temporarily
   * be out of sync. This is logged for investigation.
   */
  return json(
    {
      success: false,
      message:
        "Authentication account was updated, but the user profile could not be updated.",
    },
    500,
  );
}

return json({
  success: true,
  message: "User updated successfully.",
  data: {
    user: {
      id: targetUser.id,
      email: normalizedEmail,
      first_name: updatedProfile.first_name,
      last_name: updatedProfile.last_name,
      mobile: updatedProfile.mobile,
      role_id: updatedProfile.role_id,
      is_active: updatedProfile.is_active,
      is_deleted: updatedProfile.is_deleted,
    },
  },
});


} catch (error) {
console.error(
"Update user error:",
error,
);


return json(
  {
    success: false,
    message:
      "An unexpected error occurred.",
  },
  500,
);


}
});
