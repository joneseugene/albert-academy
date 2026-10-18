import "server-only";
import { createClient } from "@supabase/supabase-js";
import { clientEnv } from "@/lib/env";
import { getServerEnv } from "@/lib/env.server";
import type { Database } from "@/types/database.types";

/**
 * Service-role client. BYPASSES RLS. Server-only.
 * Permitted uses: creating/inviting users and health probes. Callers must verify the
 * acting user's permission first. Never use it to read or write content on behalf of visitors.
 */
export function createSupabaseAdminClient() {
  return createClient<Database>(clientEnv.NEXT_PUBLIC_SUPABASE_URL, getServerEnv().SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
