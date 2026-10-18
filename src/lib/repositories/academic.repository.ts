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

type AcademicTable = Database["public"]["Tables"]["academic"];

export type Academic = AcademicTable["Row"];

export type AcademicCreateInput = Omit<
  AcademicTable["Insert"],
  "id" | "created_at" | "updated_at"
>;

export type AcademicUpdateInput = Omit<
  AcademicTable["Update"],
  "id" | "created_at" | "updated_at"
>;

export type AcademicDeleteResult = {
  id: Academic["id"];
  deleted: true;
};

// ============================================================
// REPOSITORY
// ============================================================

export async function createAcademicRepository() {
  const supabase = await createSupabaseServerClient();
  const crud = createCrud(supabase, "academic");
  const photoStorage = createPhotoStorage(supabase);

  return {
    // --------------------------------------------------------
    // GET RANDOM
    // --------------------------------------------------------

    async findRandom(count = 4): Promise<Academic[]> {
      const records = await crud.findMany();

      // Keep resources that have a photo or a link.
      const pool = records.filter(
        (record) =>
          (typeof record.photo === "string" &&
            record.photo.trim() !== "") ||
          (typeof record.link === "string" &&
            record.link.trim() !== ""),
      );

      // Fisher–Yates shuffle.
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = pool[i]!;
        pool[i] = pool[j]!;
        pool[j] = temp;
      }

      return pool.slice(0, Math.max(0, Math.floor(count)));
    },

    async findMany(): Promise<Academic[]> {
      return crud.findMany();
    },

    async findById(id: Academic["id"]): Promise<Academic | null> {
      return crud.findById(id);
    },

    async create(input: AcademicCreateInput): Promise<Academic> {
      return crud.insert(input);
    },

    async update(
      id: Academic["id"],
      input: AcademicUpdateInput,
    ): Promise<Academic> {
      return crud.update(id, input);
    },

    async delete(
      id: Academic["id"],
    ): Promise<AcademicDeleteResult> {
      const existing = await crud.findById(id);

      if (!existing) {
        throw new Error("Academic record not found.");
      }

      const deleted = await crud.delete(id);

      if (existing.photo) {
        try {
          await photoStorage.remove(
            PHOTO_BUCKETS.academic,
            existing.photo,
          );
        } catch (error) {
          console.error(
            "Academic record deleted, but photo cleanup failed:",
            error,
          );
        }
      }

      return deleted;
    },
  };
}
