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

interface DeleteUserRequest {
user_id?: unknown;
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
        "Only Super Admins can delete users.",
    },
    403,
  );
}

/*
 * Read request body.
 */
let body: DeleteUserRequest;

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
 * Prevent a Super Admin from deleting
 * their own account.
 */
if (userId === caller.id) {
  return json(
    {
      success: false,
      message:
        "You cannot delete your own account.",
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
 * Already deleted.
 */
if (targetProfile.is_deleted) {
  return json(
    {
      success: false,
      message: "User is already deleted.",
    },
    409,
  );
}

/*
 * Soft delete profile.
 *
 * We intentionally keep the Auth account.
 */
const {
  data: deletedProfile,
  error: deleteError,
} = await admin
  .from("profiles")
  .update({
    is_deleted: true,
    is_active: false,
    updated_at: new Date().toISOString(),
  })
  .eq("id", userId)
  .eq("is_deleted", false)
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

if (deleteError || !deletedProfile) {
  console.error(
    "Soft delete error:",
    deleteError,
  );

  return json(
    {
      success: false,
      message:
        "Failed to delete the user.",
    },
    500,
  );
}

return json({
  success: true,
  message: "User deleted successfully.",
  data: {
    user: {
      id: deletedProfile.id,
      first_name: deletedProfile.first_name,
      last_name: deletedProfile.last_name,
      email: targetUser.email,
      mobile: deletedProfile.mobile,
      role_id: deletedProfile.role_id,
      is_active: deletedProfile.is_active,
      is_deleted: deletedProfile.is_deleted,
    },
  },
});


} catch (error) {
console.error(
"Delete user error:",
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
