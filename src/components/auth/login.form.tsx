"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import type {
  LoginInput} from "@/lib/schemas/login.schema";
import {
  loginSchema,
} from "@/lib/schemas/login.schema";
import { loginService } from "@/lib/service/auth/login.service";

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

    try {
      await loginService(values);

      router.replace("/admin/home");
      router.refresh();
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message === "Invalid login credentials"
            ? "The email or password you entered is incorrect."
            : error.message
          : "Unable to sign in. Please try again.",
      );
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-6 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center border bg-primary text-sm font-semibold text-primary-foreground">
              AA
            </div>

            <div>
              <p className="font-display text-lg font-semibold tracking-tight">
                Albert Academy
              </p>

              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Administration
              </p>
            </div>
          </div>
        </div>

        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Welcome back
        </p>

        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Sign in to your account
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Enter your credentials to access the Albert Academy administration
          portal.
        </p>
      </div>

      {/* Authentication error */}
      {authError && (
        <div
          role="alert"
          className="mb-6 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {authError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              disabled={isSubmitting}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={
                errors.email ? "email-error" : undefined
              }
              {...register("email")}
              className={[
                "h-11 w-full rounded-md border bg-background pl-10 pr-4 text-sm outline-none transition",
                "focus:ring-2 focus:ring-primary/20",
                "disabled:cursor-not-allowed disabled:opacity-60",
                errors.email
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                  : "border-input focus:border-primary",
              ].join(" ")}
            />
          </div>

          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Password
            </label>

            <button
              type="button"
              disabled={isSubmitting}
              className="text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
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
                "h-11 w-full rounded-md border bg-background pl-10 pr-11 text-sm outline-none transition",
                "focus:ring-2 focus:ring-primary/20",
                "disabled:cursor-not-allowed disabled:opacity-60",
                errors.password
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                  : "border-input focus:border-primary",
              ].join(" ")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              disabled={isSubmitting}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
              className="text-xs text-destructive"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
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
            "Sign in"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">
        Access to this portal is restricted to authorized Albert Academy
        administrators.
      </p>
    </div>
  );
}