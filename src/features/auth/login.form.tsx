"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { LoginInput} from "@/lib/schemas/login.schema";
import { loginSchema } from "@/lib/schemas/login.schema";


export function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setAuthError(null);

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      if (error.message === "Invalid login credentials") {
        setAuthError("The email or password you entered is incorrect.");
      } else {
        setAuthError(error.message);
      }

      return;
    }

    router.replace("/admin/home");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      {/* Mobile brand */}
      <div className="mb-12 lg:hidden">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center bg-primary text-sm font-semibold text-primary-foreground">
            AA
          </div>

          <div>
            <p className="font-display text-xl font-semibold tracking-tight">
              Albert Academy
            </p>

            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Administration
            </p>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div>
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Welcome back
        </p>

        <h2 className="font-display text-4xl font-semibold tracking-tight">
          Sign in
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Sign in to manage Albert Academy&apos;s digital platform.
        </p>
      </div>

      {/* Authentication error */}
      {authError && (
        <div
          role="alert"
          className="mt-6 border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {authError}
        </div>
      )}

      {/* Form */}
      <form
        className="mt-9 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@albertacademy.sl"
              disabled={isSubmitting}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={
                errors.email ? "email-error" : undefined
              }
              {...register("email")}
              className={[
                "h-12 w-full border bg-background pl-11 pr-4 text-sm outline-none transition-colors",
                "placeholder:text-muted-foreground/60",
                "focus:ring-2 focus:ring-ring/20",
                "disabled:cursor-not-allowed disabled:opacity-60",
                errors.email
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary",
              ].join(" ")}
            />
          </div>

          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="mt-2 text-xs text-destructive"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium"
            >
              Password
            </label>

            <button
              type="button"
              disabled={isSubmitting}
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isSubmitting}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              {...register("password")}
              className={[
                "h-12 w-full border bg-background pl-11 pr-11 text-sm outline-none transition-colors",
                "placeholder:text-muted-foreground/60",
                "focus:ring-2 focus:ring-ring/20",
                "disabled:cursor-not-allowed disabled:opacity-60",
                errors.password
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary",
              ].join(" ")}
            />

            <button
              type="button"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              disabled={isSubmitting}
              onClick={() =>
                setShowPassword((current) => !current)
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="mt-2 text-xs text-destructive"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember */}
        <div className="flex items-center gap-3">
          <input
            id="remember"
            type="checkbox"
            disabled={isSubmitting}
            className="h-4 w-4 accent-[hsl(var(--primary))]"
          />

          <label
            htmlFor="remember"
            className="text-sm text-muted-foreground"
          >
            Keep me signed in
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex h-12 w-full items-center justify-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <span>Signing in</span>

              <span
                aria-hidden="true"
                className="inline-flex w-5"
              >
                <span className="animate-pulse">.</span>
                <span
                  className="animate-pulse"
                  style={{ animationDelay: "150ms" }}
                >
                  .
                </span>
                <span
                  className="animate-pulse"
                  style={{ animationDelay: "300ms" }}
                >
                  .
                </span>
              </span>
            </>
          ) : (
            <>
              <span>Sign in</span>

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Security notice */}
      <div className="mt-8 flex gap-3 border border-border bg-muted/50 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

        <p className="text-xs leading-5 text-muted-foreground">
          This area is restricted to authorized Albert Academy
          administrators. Access and administrative actions may be
          monitored for security purposes.
        </p>
      </div>

      {/* Footer */}
      <p className="mt-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Albert Academy. All rights reserved.
      </p>
    </div>
  );
}