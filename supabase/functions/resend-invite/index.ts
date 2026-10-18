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

    const role = Array.isArray(callerProfile.roles)
      ? callerProfile.roles[0]
      : callerProfile.roles;

    if (role?.name !== "super_admin") {
      return json(
        {
          success: false,
          message:
            "Only Super Admins can resend invitations.",
        },
        403,
      );
    }

    /*
     * Read request body.
     */
    let body: {
      user_id?: unknown;
    };

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
     * An already-confirmed user no longer needs
     * an invitation.
     */
    if (targetUser.email_confirmed_at) {
      return json(
        {
          success: false,
          message:
            "This user has already accepted their invitation. Use password reset instead.",
        },
        409,
      );
    }

    if (!targetUser.email) {
      return json(
        {
          success: false,
          message:
            "The user does not have an email address.",
        },
        400,
      );
    }

    /*
     * Get target profile.
     */
    const {
      data: targetProfile,
      error: targetProfileError,
    } = await admin
      .from("profiles")
      .select(
        "id, first_name, last_name, email, is_active, is_deleted",
      )
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
     * Do not resend invitations to deleted users.
     */
    if (targetProfile.is_deleted) {
      return json(
        {
          success: false,
          message:
            "Cannot resend an invitation to a deleted user.",
        },
        409,
      );
    }

    /*
     * Generate a fresh authentication link.
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
      email: targetUser.email,
      options: {
        redirectTo,
      },
    });

    if (
      linkError ||
      !linkData?.properties?.action_link
    ) {
      console.error(
        "Generate link error:",
        linkError,
      );

      return json(
        {
          success: false,
          message:
            "Failed to generate a new invitation link.",
        },
        500,
      );
    }

    const actionLink =
      linkData.properties.action_link;

    /*
     * Recipient name.
     */
    const fullName = [
      targetProfile.first_name,
      targetProfile.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    /*
     * Send invitation email using the
     * shared email service.
     */
    try {
      await sendEmail({
        to: targetUser.email,
        subject:
          "Your Albert Academy invitation",

        template: {
          recipientName: fullName,

          title:
            "Your invitation has been reissued",

          message:
            "Your Albert Academy account invitation has been reissued. Please click the button below to continue setting up your account.",

          buttonText:
            "Accept Invitation",

          actionUrl:
            actionLink,

          footerMessage:
            "If you did not expect this invitation, you can safely ignore this email.",
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
            "Failed to send the invitation email.",
        },
        502,
      );
    }

    return json({
      success: true,
      message:
        "Invitation resent successfully.",
    });
  } catch (error) {
    console.error(
      "Resend invite error:",
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