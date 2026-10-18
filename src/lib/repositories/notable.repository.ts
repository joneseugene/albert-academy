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

type NotableTable = Database["public"]["Tables"]["notable"];

export type Notable = NotableTable["Row"];

export type NotableCreateInput = Omit<
  NotableTable["Insert"],
  "id" | "created_at" | "updated_at"
>;

export type NotableUpdateInput = Omit<
  NotableTable["Update"],
  "id" | "created_at" | "updated_at"
>;

export type NotableDeleteResult = {
  id: Notable["id"];
  deleted: true;
};

// ============================================================
// REPOSITORY
// ============================================================

export async function createNotableRepository() {
  const supabase = await createSupabaseServerClient();
  const crud = createCrud(supabase, "notable");
  const photoStorage = createPhotoStorage(supabase);

  return {
    // GET ALL
    async findMany(): Promise<Notable[]> {
      return crud.findMany();
    },

    // GET RANDOM NOTABLE PEOPLE
    async findRandom(count = 4): Promise<Notable[]> {
      const records = await crud.findMany();

      // Only include people with a photo for the homepage.
      const pool = records.filter(
        (record) =>
          typeof record.photo === "string" &&
          record.photo.trim().length > 0,
      );

      // Fisher-Yates shuffle.
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j]!, pool[i]!];
      }

      return pool.slice(0, Math.max(0, Math.floor(count)));
    },

    // GET BY ID
    async findById(id: Notable["id"]): Promise<Notable | null> {
      return crud.findById(id);
    },

    // CREATE
    async create(input: NotableCreateInput): Promise<Notable> {
      return crud.insert(input);
    },

    // UPDATE
    async update(
      id: Notable["id"],
      input: NotableUpdateInput,
    ): Promise<Notable> {
      return crud.update(id, input);
    },

    // DELETE
    async delete(id: Notable["id"]): Promise<NotableDeleteResult> {
      const existing = await crud.findById(id);

      if (!existing) {
        throw new Error("Notable person not found.");
      }

      const deleted = await crud.delete(id);

      if (existing.photo) {
        try {
          await photoStorage.remove(PHOTO_BUCKETS.notable, existing.photo);
        } catch (error) {
          console.error(
            "Notable record deleted, but photo cleanup failed:",
            error,
          );
        }
      }

      return deleted;
    },
  };
}