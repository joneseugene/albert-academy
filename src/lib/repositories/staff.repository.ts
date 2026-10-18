
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

type StaffTable = Database["public"]["Tables"]["staff"];

export type Staff = StaffTable["Row"];

export type StaffCreateInput = Omit<
  StaffTable["Insert"],
  "id" | "created_at" | "updated_at"
>;

export type StaffUpdateInput = Omit<
  StaffTable["Update"],
  "id" | "created_at" | "updated_at"
>;

export type StaffDeleteResult = {
  id: Staff["id"];
  deleted: true;
};

// ============================================================
// REPOSITORY
// ============================================================

export async function createStaffRepository() {
  const supabase = await createSupabaseServerClient();
  const crud = createCrud(supabase, "staff");
  const photoStorage = createPhotoStorage(supabase);

  return {
    async findMany(): Promise<Staff[]> {
      return crud.findMany();
    },

    async findById(id: Staff["id"]): Promise<Staff | null> {
      return crud.findById(id);
    },

    async create(input: StaffCreateInput): Promise<Staff> {
      return crud.insert(input);
    },

    async update(
      id: Staff["id"],
      input: StaffUpdateInput,
    ): Promise<Staff> {
      return crud.update(id, input);
    },

    async delete(id: Staff["id"]): Promise<StaffDeleteResult> {
      const existing = await crud.findById(id);

      if (!existing) {
        throw new Error("Staff record not found.");
      }

      const deleted = await crud.delete(id);

      if (existing.photo) {
        try {
          await photoStorage.remove(
            PHOTO_BUCKETS.staff,
            existing.photo,
          );
        } catch (error) {
          console.error(
            "Staff record deleted, but photo cleanup failed:",
            error,
          );
        }
      }

      return deleted;
    },
  };
}
