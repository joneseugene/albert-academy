
import type { Database } from "@/types/database.types";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCrud } from "../supabase/crud-base";

type ProfileUpdate =
  Database["public"]["Tables"]["profiles"]["Update"];

export async function createProfileRepository() {
  const supabase =
    await createSupabaseServerClient();

  const crud = createCrud(
    supabase,
    "profiles",
  );

  return {
    findById(id: string) {
      return crud.findById(id);
    },

    findMany() {
      return crud.findMany();
    },

    async findManyWithRole() {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          role:roles (
            id,
            name,
            description
          )
        `);

      if (error) {
        throw new Error(
          `Failed to load users with roles: ${error.message}`,
        );
      }

      return data;
    },

    update(
      userId: string,
      input: ProfileUpdate,
    ) {
      return crud.update(
        userId,
        input,
      );
    },

    delete(userId: string) {
      return crud.delete(userId);
    },
  };
}

