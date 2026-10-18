
import type { Database } from "@/types/database.types";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCrud } from "@/lib/supabase/crud-base";
import {
  createPhotoStorage,
  PHOTO_BUCKETS,
} from "@/lib/supabase/photo-storage";

// ============================================================
// TYPES
// ============================================================

type PastLeadershipTable =
  Database["public"]["Tables"]["past_leadership"];

export type PastLeadership = PastLeadershipTable["Row"];

export type PastLeadershipCreateInput = Omit<
  PastLeadershipTable["Insert"],
  "id" | "created_at" | "updated_at"
>;

export type PastLeadershipUpdateInput = Omit<
  PastLeadershipTable["Update"],
  "id" | "created_at" | "updated_at"
>;

export type PastLeadershipDeleteResult = {
  id: PastLeadership["id"];
  deleted: true;
};

// ============================================================
// REPOSITORY
// ============================================================

export async function createPastLeadershipRepository() {
  const supabase = await createSupabaseServerClient();
  const crud = createCrud(supabase, "past_leadership");
  const photoStorage = createPhotoStorage(supabase);

  return {
    async findMany(): Promise<PastLeadership[]> {
      return crud.findMany();
    },

    async findById(
      id: PastLeadership["id"],
    ): Promise<PastLeadership | null> {
      return crud.findById(id);
    },

    async create(
      input: PastLeadershipCreateInput,
    ): Promise<PastLeadership> {
      return crud.insert(input);
    },

    async update(
      id: PastLeadership["id"],
      input: PastLeadershipUpdateInput,
    ): Promise<PastLeadership> {
      return crud.update(id, input);
    },

    async delete(
      id: PastLeadership["id"],
    ): Promise<PastLeadershipDeleteResult> {
      const existing = await crud.findById(id);

      if (!existing) {
        throw new Error("Leadership record not found.");
      }

      const deleted = await crud.delete(id);

      if (existing.photo) {
        try {
          await photoStorage.remove(
            PHOTO_BUCKETS.pastLeadership,
            existing.photo,
          );
        } catch (error) {
          console.error(
            "Leadership record deleted, but photo cleanup failed:",
            error,
          );
        }
      }

      return deleted;
    },
  };
}
