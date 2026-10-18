
import type { Database } from "@/types/database.types";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCrud } from "../supabase/crud-base";

type SchoolInfoTable =
  Database["public"]["Tables"]["school_info"];

export type SchoolInfo = SchoolInfoTable["Row"];

export type SchoolInfoCreateInput = Omit<
  SchoolInfoTable["Insert"],
  "id" | "created_at" | "updated_at"
>;

export type SchoolInfoUpdateInput = Omit<
  SchoolInfoTable["Update"],
  "id" | "created_at" | "updated_at"
>;

export async function createSchoolInfoRepository() {
  const supabase = await createSupabaseServerClient();

  const crud = createCrud(supabase, "school_info");

  /**
   * Get the school's information.
   *
   * The application expects only one school_info record.
   */
  async function get(): Promise<SchoolInfo | null> {
    const records = await crud.findMany();

    if (records.length > 1) {
      throw new Error(
        "Multiple school information records exist. Expected one.",
      );
    }

    return records[0] ?? null;
  }

  /**
   * Initialize the school's information.
   *
   * Fails if a record already exists.
   */
  async function create(
    input: SchoolInfoCreateInput,
  ): Promise<SchoolInfo> {
    const existing = await get();

    if (existing) {
      throw new Error(
        "School information has already been initialized.",
      );
    }

    return crud.insert(input);
  }

  /**
   * Update the existing school information.
   *
   * Does not create a record when none exists.
   */
  async function update(
    input: SchoolInfoUpdateInput,
  ): Promise<SchoolInfo> {
    const existing = await get();

    if (!existing) {
      throw new Error(
        "School information has not been initialized.",
      );
    }

    return crud.update(existing.id, input);
  }

  /**
   * Save the school's information.
   *
   * Creates the record on first use; otherwise updates it.
   */
  async function save(
    input: SchoolInfoCreateInput,
  ): Promise<SchoolInfo> {
    const existing = await get();

    if (existing) {
      return crud.update(existing.id, input);
    }

    return crud.insert(input);
  }

  return {
    get,
    create,
    update,
    save,
  };
}
