"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AcceptInviteForm() {
  const router = useRouter();
  const [supabase] = useState(() => createSupabaseBrowserClient());

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  
  useEffect(() => {
let mounted = true;

async function initialize() {
console.log("🔐 Accept Invite: Initialization");


console.log("1️⃣ Current URL:", window.location.href);
console.log("2️⃣ Current pathname:", window.location.pathname);
console.log("3️⃣ Current hash exists:", Boolean(window.location.hash));

const hash = window.location.hash;

if (hash) {
  const params = new URLSearchParams(hash.substring(1));

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const type = params.get("type");

  console.log("4️⃣ Hash parameters:", {
    hasAccessToken: Boolean(accessToken),
    hasRefreshToken: Boolean(refreshToken),
    type,
  });

  if (accessToken && refreshToken) {
    console.log("5️⃣ Setting Supabase session from invitation tokens...");

    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    console.log("6️⃣ setSession result:", {
      hasSession: Boolean(data.session),
      error,
    });

    if (error || !data.session) {
      if (mounted) {
        setError(
          error?.message ??
            "Unable to establish your invitation session.",
        );
        setLoading(false);
      }

      return;
    }

    console.log("✅ Invitation session established.");

    /*
     * Remove the sensitive authentication tokens from
     * the browser URL after Supabase has consumed them.
     */
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );

    if (mounted) {
      setError(null);
      setLoading(false);
    }

    return;
  }
}

console.log("7️⃣ No invitation tokens found. Checking existing session...");

const {
  data: { session },
} = await supabase.auth.getSession();

console.log("8️⃣ Existing session:", {
  hasSession: Boolean(session),
});

if (!mounted) {
  return;
}

if (!session) {
  setError(
    "This invitation is invalid or has expired. Please ask the administrator to resend the invitation.",
  );
}

setLoading(false);


}

void initialize();

return () => {
mounted = false;
};
}, [supabase]);


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "Your invitation session is invalid or has expired. Please ask the administrator to resend the invitation.",
        );
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);

      await supabase.auth.signOut();

      window.setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        {" "}
        <p className="text-sm text-gray-500">Verifying invitation... </p>{" "}
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        {" "}
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
          {" "}
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            {" "}
            <LockKeyhole className="h-6 w-6 text-green-700" />{" "}
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Password Set Successfully</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your account is ready. Redirecting you to sign in...
          </p>
        </div>
      </div>
    );
  }

  if (error && !password && !confirmPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        {" "}
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
          {" "}
          <h1 className="text-2xl font-semibold text-gray-900">Invitation Unavailable </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      {" "}
      <div className="w-full max-w-md">
        {" "}
        <div className="rounded-xl bg-white p-8 shadow-sm">
          {" "}
          <div className="mb-8 text-center">
            {" "}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#7A1523]/10">
              {" "}
              <LockKeyhole className="h-6 w-6 text-[#7A1523]" />{" "}
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Accept Invitation</h1>
            <p className="mt-2 text-sm text-gray-600">
              Set your password to activate your Albert Academy account.
            </p>
          </div>
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#7A1523] focus:ring-2 focus:ring-[#7A1523]/10 disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#7A1523] focus:ring-2 focus:ring-[#7A1523]/10 disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#7A1523] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#65121d] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Setting password..." : "Set Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
