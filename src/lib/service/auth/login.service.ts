import type { LoginInput } from "@/lib/schemas/login.schema";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export async function loginService(input: LoginInput) {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Unable to sign in. Please try again.");
  }

  return {
    user: data.user,
    session: data.session,
  };
}