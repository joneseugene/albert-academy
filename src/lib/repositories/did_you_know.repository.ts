import type { Database } from "@/types/database.types";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCrud } from "@/lib/supabase/crud-base";

// ============================================================
// TYPES
// ============================================================

type DidYouKnowTable = Database["public"]["Tables"]["did_you_know"];

export type DidYouKnow = DidYouKnowTable["Row"];

export type DidYouKnowCreateInput = Omit<
  DidYouKnowTable["Insert"],
  "id" | "created_at" | "updated_at"
>;

export type DidYouKnowUpdateInput = Omit<
  DidYouKnowTable["Update"],
  "id" | "created_at" | "updated_at"
>;

export type DidYouKnowDeleteResult = {
  id: DidYouKnow["id"];
  deleted: true;
};

// ============================================================
// REPOSITORY
// ============================================================

export async function createDidYouKnowRepository() {
  const supabase = await createSupabaseServerClient();
  const crud = createCrud(supabase, "did_you_know");

  return {
    /**
     * Retrieve one randomly selected published fact for the public website.
     */
    async findRandomPublished(): Promise<DidYouKnow | null> {
      const { data, error } = await supabase
        .from("did_you_know")
        .select("*")
        .eq("status", "published")
        .eq("deleted", false);

      if (error) {
        throw new Error(
          `Failed to fetch a random fact: ${error.message}`,
        );
      }

      if (data.length === 0) {
        return null;
      }

      const randomIndex = Math.floor(Math.random() * data.length);

      return data[randomIndex] ?? null;
    },

    async findMany(): Promise<DidYouKnow[]> {
      return crud.findMany();
    },

    async findById(
      id: DidYouKnow["id"],
    ): Promise<DidYouKnow | null> {
      return crud.findById(id);
    },

    /**
     * Retrieve published facts for public display.
     * Filtering here complements the database's RLS policies.
     */
    async findPublished(): Promise<DidYouKnow[]> {
      const { data, error } = await supabase
        .from("did_you_know")
        .select("*")
        .eq("status", "published")
        .eq("deleted", false)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(
          `Failed to fetch published facts: ${error.message}`,
        );
      }

      return data;
    },

    async findPublishedPage({
      query = "",
      page = 1,
      pageSize = 12,
    }: {
      query?: string;
      page?: number;
      pageSize?: number;
    }): Promise<{
      data: DidYouKnow[];
      total: number;
    }> {
      const safePage = Math.max(1, Math.floor(page));
      const safePageSize = Math.min(
        48,
        Math.max(1, Math.floor(pageSize)),
      );

      const searchTerm = query
        .trim()
        .replace(/[,%()\\*]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      let request = supabase
        .from("did_you_know")
        .select("*", { count: "exact" })
        .eq("status", "published")
        .eq("deleted", false);

      if (searchTerm) {
        const pattern = `%${searchTerm}%`;

        request = request.or(
          `title.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern}`,
        );
      }

      const from = (safePage - 1) * safePageSize;
      const to = from + safePageSize - 1;

      const { data, count, error } = await request
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw new Error(
          `Failed to search published facts: ${error.message}`,
        );
      }

      return {
        data: data ?? [],
        total: count ?? 0,
      };
    },

    async create(
      input: DidYouKnowCreateInput,
    ): Promise<DidYouKnow> {
      return crud.insert(input);
    },

    async update(
      id: DidYouKnow["id"],
      input: DidYouKnowUpdateInput,
    ): Promise<DidYouKnow> {
      return crud.update(id, input);
    },

    /**
     * Soft-delete a fact through the shared CRUD abstraction.
     */
    async delete(
      id: DidYouKnow["id"],
    ): Promise<DidYouKnowDeleteResult> {
      const existing = await crud.findById(id);

      if (!existing) {
        throw new Error("Did-you-know record not found.");
      }

      return crud.delete(id);
    },
  };
}
