import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { clientEnv } from "@/lib/env";
import type { Database } from "@/types/database.types";

const LOGIN_PATH = "/login";

/** Refreshes the session cookie and redirects anonymous visitors away from Dashboard. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),

        setAll: (
          list: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[],
        ) => {
          list.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          list.forEach(({ name, value, options }) => {
            response.cookies.set(
              name,
              value,
              options as Parameters<typeof response.cookies.set>[2],
            );
          });
        },
      },
    },
  );

  // getUser() validates the token with Supabase.
  // Never trust getSession() on the server.
  const { data } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isAdmin =
    pathname === "/admin/home" || pathname.startsWith("/admin/home/");

  // Convenience redirect only.
  // Real authorization is enforced by RLS and server checks.
  if (isAdmin && pathname !== LOGIN_PATH && !data.user) {
    const url = request.nextUrl.clone();

    url.pathname = LOGIN_PATH;
    url.searchParams.set("next", pathname);

    return NextResponse.redirect(url);
  }

  return response;
}