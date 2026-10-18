import "server-only";
import { z } from "zod";

const serverSchema = z.object({ SUPABASE_SERVICE_ROLE_KEY: z.string().min(1) });

export function getServerEnv() {
  const result = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  if (!result.success) throw new Error("Server environment is not configured correctly.");
  return result.data;
}
