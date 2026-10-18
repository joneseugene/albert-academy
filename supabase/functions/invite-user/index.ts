// @ts-ignore
import { createClient } from "npm:@supabase/supabase-js@2.117.3";
import { sendEmail } from "../_shared/email/mailer.ts";

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

interface InviteUserRequest {
  first_name?: unknown;
  last_name?: unknown;
  email?: unknown;
  mobile?: unknown;
  role_id?: unknown;
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
     * Client using caller JWT.
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
     * Verify caller is Super Admin.
     */
    const {
      data: callerProfile,
      error: callerProfileError,
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

    if (
      callerProfileError ||
      !callerProfile
    ) {
      console.error(
        "Caller profile error:",
        callerProfileError,
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

    const callerRole = Array.isArray(
      callerProfile.roles,
    )
      ? callerProfile.roles[0]
      : callerProfile.roles;

    if (callerRole?.name !== "super_admin") {
      return json(
        {
          success: false,
          message:
            "Only Super Admins can invite users.",
        },
        403,
      );
    }

    /*
     * Parse request.
     */
    let body: InviteUserRequest;

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
     * Validate required fields.
     */
    const firstName =
      typeof body.first_name === "string"
        ? body.first_name.trim()
        : "";

    const lastName =
      typeof body.last_name === "string"
        ? body.last_name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const mobile =
      typeof body.mobile === "string"
        ? body.mobile.trim()
        : null;

    const roleId =
      typeof body.role_id === "string"
        ? body.role_id.trim()
        : "";

    if (!firstName) {
      return json(
        {
          success: false,
          message: "First name is required.",
        },
        400,
      );
    }

    if (!lastName) {
      return json(
        {
          success: false,
          message: "Last name is required.",
        },
        400,
      );
    }

    if (!email) {
      return json(
        {
          success: false,
          message: "Email is required.",
        },
        400,
      );
    }

    if (!roleId) {
      return json(
        {
          success: false,
          message: "Role is required.",
        },
        400,
      );
    }

    /*
     * Verify requested role exists.
     */
    const {
      data: requestedRole,
      error: roleError,
    } = await admin
      .from("roles")
      .select("id, name")
      .eq("id", roleId)
      .single();

    if (roleError || !requestedRole) {
      return json(
        {
          success: false,
          message: "Selected role was not found.",
        },
        400,
      );
    }

    /*
     * Prevent duplicate profile accounts.
     */
    const {
      data: existingProfile,
      error: existingProfileError,
    } = await admin
      .from("profiles")
      .select("id, email, is_deleted")
      .eq("email", email)
      .maybeSingle();

    if (existingProfileError) {
      console.error(
        "Existing profile lookup error:",
        existingProfileError,
      );

      return json(
        {
          success: false,
          message:
            "Unable to verify whether this email already exists.",
        },
        500,
      );
    }

    if (existingProfile) {
      if (existingProfile.is_deleted) {
        return json(
          {
            success: false,
            message:
              "An account with this email already exists and has been deleted. Restore the account instead.",
          },
          409,
        );
      }

      return json(
        {
          success: false,
          message:
            "An account with this email already exists.",
        },
        409,
      );
    }

    /*
     * Create Auth user.
     *
     * Do NOT confirm the email.
     *
     * The user will become active after accepting
     * the invitation and confirming their email.
     */
    const {
      data: authResult,
      error: authError,
    } = await admin.auth.admin.createUser({
      email,
      email_confirm: false,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        mobile,
        role_id: roleId,
      },
    });

    if (authError || !authResult.user) {
      console.error(
        "Create Auth user error:",
        authError,
      );

      return json(
        {
          success: false,
          message:
            authError?.message ??
            "Failed to create user account.",
        },
        400,
      );
    }

    const targetUser = authResult.user;

    /*
     * Generate invitation link.
     *
     * The link authenticates the invited user and
     * redirects them to the onboarding page.
     */
    const siteUrl =
      Deno.env.get("SITE_URL") ??
      "http://localhost:3000";

    const redirectTo =
      `${siteUrl}/accept-invite`;

    const {
      data: linkData,
      error: linkError,
    } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo,
      },
    });

    if (
      linkError ||
      !linkData?.properties?.action_link
    ) {
      console.error(
        "Generate invitation link error:",
        linkError,
      );

      return json(
        {
          success: false,
          message:
            "User was created, but the invitation link could not be generated.",
          user_id: targetUser.id,
        },
        500,
      );
    }

    const actionLink =
      linkData.properties.action_link;

    /*
     * Send custom invitation email.
     */
    const fullName = [
      firstName,
      lastName,
    ]
      .filter(Boolean)
      .join(" ");

    try {
      await sendEmail({
        to: email,

        subject:
          "You're invited to Albert Academy",

        template: {
          recipientName: fullName,

          title:
            "You're invited to join Albert Academy",

          message:
            "An Albert Academy administrator has created an account for you. Click the button below to accept your invitation and complete your account setup.",

          buttonText:
            "Accept Invitation",

          actionUrl:
            actionLink,

          footerMessage:
            "If you were not expecting this invitation, you can safely ignore this email.",
        },
      });
    } catch (emailError) {
      console.error(
        "Invitation email failed:",
        emailError,
      );

      return json(
        {
          success: false,
          message:
            "The user account was created, but the invitation email could not be sent.",
          user_id: targetUser.id,
        },
        502,
      );
    }

    return json(
      {
        success: true,
        message:
          "User invited successfully.",
        user_id: targetUser.id,
      },
      201,
    );
  } catch (error) {
    console.error(
      "Invite user error:",
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