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

type MediaTable = Database["public"]["Tables"]["media"];

export type Media = MediaTable["Row"];

export type MediaCreateInput = Omit<
  MediaTable["Insert"],
  "id" | "created_at" | "updated_at"
>;

export type MediaUpdateInput = Omit<
  MediaTable["Update"],
  "id" | "created_at" | "updated_at"
>;

export type MediaDeleteResult = {
  id: Media["id"];
  deleted: true;
};

export type MediaPage = {
  data: Media[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// ============================================================
// REPOSITORY
// ============================================================

export async function createMediaRepository() {
  const supabase = await createSupabaseServerClient();
  const crud = createCrud(supabase, "media");
  const photoStorage = createPhotoStorage(supabase);

  return {
    // --------------------------------------------------------
    // GET PAGINATED MEDIA
    // --------------------------------------------------------

    async findPage(
      page = 1,
      pageSize = 12,
    ): Promise<MediaPage> {
      const safePage = Math.max(1, Math.floor(page));
      const safePageSize = Math.min(
        48,
        Math.max(1, Math.floor(pageSize)),
      );

      const from = (safePage - 1) * safePageSize;
      const to = from + safePageSize - 1;

      const { data, count, error } = await supabase
        .from("media")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw new Error(`Failed to retrieve media: ${error.message}`);
      }

      const total = count ?? 0;

      return {
        data: data ?? [],
        total,
        page: safePage,
        pageSize: safePageSize,
        totalPages: Math.ceil(total / safePageSize),
      };
    },

    // --------------------------------------------------------
    // GET RANDOM
    // --------------------------------------------------------

    // GET RANDOM
    async findRandom(count = 4): Promise<Media[]> {
      const records = await crud.findMany();

      const pool = records.filter(
        (record) =>
          typeof record.photo === "string" &&
          record.photo.trim() !== "",
      );

      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = pool[i]!;
        pool[i] = pool[j]!;
        pool[j] = temp;
      }

      return pool.slice(0, Math.max(0, Math.floor(count)));
    },

    // --------------------------------------------------------
    // GET ALL
    // --------------------------------------------------------

    async findMany(): Promise<Media[]> {
      return crud.findMany();
    },

    // --------------------------------------------------------
    // GET BY ID
    // --------------------------------------------------------

    async findById(id: Media["id"]): Promise<Media | null> {
      return crud.findById(id);
    },

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    async create(input: MediaCreateInput): Promise<Media> {
      return crud.insert(input);
    },

    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    async update(
      id: Media["id"],
      input: MediaUpdateInput,
    ): Promise<Media> {
      return crud.update(id, input);
    },

    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

    async delete(id: Media["id"]): Promise<MediaDeleteResult> {
      const existing = await crud.findById(id);

      if (!existing) {
        throw new Error("Media record not found.");
      }

      const deleted = await crud.delete(id);

      if (existing.photo) {
        try {
          await photoStorage.remove(
            PHOTO_BUCKETS.media,
            existing.photo,
          );
        } catch (error) {
          console.error(
            "Media record deleted, but photo cleanup failed:",
            error,
          );
        }
      }

      return deleted;
    },
  };
}
