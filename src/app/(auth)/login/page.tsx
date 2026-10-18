import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/features/auth/login.form";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Sign in to the Albert Academy administration portal.",
};

export default function Page() {
  return (
    <main className="min-h-dvh bg-muted">
      <div className="grid min-h-dvh lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-primary lg:flex">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -bottom-48 -right-32 h-[34rem] w-[34rem] rounded-full border border-white/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link
              href="/"
              aria-label="Albert Academy home"
              className="flex items-center gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center border border-white/20 bg-white/80">
                <Image
                  src="/photo/school-logo-inverse.png"
                  alt="Albert Academy logo"
                  width={44}
                  height={44}
                  sizes="44px"
                  className="object-contain"
                />
              </div>

              <p className="font-display text-xl font-semibold tracking-tight text-white">
                Albert Academy
              </p>
            </Link>

            <div className="max-w-xl">
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-white/55">
                Motto
              </p>

              <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-white xl:text-6xl">
                Esse Quam
                <span className="mt-2 block text-white/65">Videri</span>
              </h1>
            </div>

            <div className="text-xs text-white/40">
              Albert Academy · Sierra Leone
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-12 sm:px-10">
          <div className="mb-6 w-full max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Link>
          </div>

          <LoginForm />
        </section>
      </div>
    </main>
  );
}