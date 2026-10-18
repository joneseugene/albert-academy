
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

type Pupil = Database["public"]["Tables"]["student_table"];

export type Pupils = Pupil["Row"];

export type PupilCreateInput = Omit<
  Pupil["Insert"],
  "id" | "created_at" | "updated_at"
>;

export type PupilUpdateInput = Omit<
  Pupil["Update"],
  "id" | "created_at" | "updated_at"
>;

export type PupilDeleteResult = {
  id: Pupils["id"];
  deleted: true;
};

// ============================================================
// REPOSITORY
// ============================================================

export async function createPupilRepository() {
  const supabase = await createSupabaseServerClient();
  const crud = createCrud(supabase, "student_table");
  const photoStorage = createPhotoStorage(supabase);

  return {
    async findMany(): Promise<Pupils[]> {
      return crud.findMany();
    },

    async findById(id: Pupils["id"]): Promise<Pupils | null> {
      return crud.findById(id);
    },

    async create(input: PupilCreateInput): Promise<Pupils> {
      return crud.insert(input);
    },

    async update(
      id: Pupils["id"],
      input: PupilUpdateInput,
    ): Promise<Pupils> {
      return crud.update(id, input);
    },

    async delete(
      id: Pupils["id"],
    ): Promise<PupilDeleteResult> {
      const existing = await crud.findById(id);

      if (!existing) {
        throw new Error("Pupil record not found.");
      }

      const deleted = await crud.delete(id);

      if (existing.photo) {
        try {
          await photoStorage.remove(
            PHOTO_BUCKETS.students,
            existing.photo,
          );
        } catch (error) {
          console.error(
            "Pupil's record deleted, but photo cleanup failed:",
            error,
          );
        }
      }

      return deleted;
    },
  };
}
