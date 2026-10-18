
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export const PHOTO_BUCKETS = {
  staff: "staff-photos",
  academic: "academic-photos",
  media: "media-photos",
  notable: "notable-photos",
  pastLeadership: "past-leadership-photos",
  students: "student-photos",
  didYouKnow: "did-you-know-photos",
} as const;

export type PhotoBucket =
  (typeof PHOTO_BUCKETS)[keyof typeof PHOTO_BUCKETS];

type SupabaseStorage = Pick<
  SupabaseClient<Database>,
  "storage"
>;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

const FILE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export interface UploadedPhoto {
  bucket: PhotoBucket;
  path: string;
  publicUrl: string;
}

export interface UploadPhotoOptions {
  folder?: string;
  previousPhoto?: string | null;
}

function validatePhoto(file: File): void {
  if (
    !ALLOWED_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_MIME_TYPES)[number],
    )
  ) {
    throw new Error(
      "Unsupported image format. Use JPEG, PNG, WebP, GIF, or AVIF.",
    );
  }

  if (file.size === 0) {
    throw new Error("The selected image is empty.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("The image must not exceed 5 MB.");
  }
}

function getObjectPath(
  bucket: PhotoBucket,
  photo: string,
): string | null {
  const value = photo.trim();

  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      const prefix = `/storage/v1/object/public/${bucket}/`;

      if (!url.pathname.startsWith(prefix)) {
        return null;
      }

      const encodedPath = url.pathname.slice(prefix.length);

      if (!encodedPath) {
        return null;
      }

      return encodedPath
        .split("/")
        .map((segment) => decodeURIComponent(segment))
        .join("/");
    } catch {
      return null;
    }
  }

  const path = value.replace(/^\/+/, "");

  if (
    !path ||
    path.split("/").some(
      (segment) =>
        !segment || segment === "." || segment === "..",
    )
  ) {
    return null;
  }

  return path;
}

export function createPhotoStorage(supabase: SupabaseStorage) {
  function getPublicUrl(
    bucket: PhotoBucket,
    path: string,
  ): string {
    const objectPath = getObjectPath(bucket, path);

    if (!objectPath) {
      throw new Error("Invalid photo path for the selected bucket.");
    }

    return supabase.storage
      .from(bucket)
      .getPublicUrl(objectPath).data.publicUrl;
  }

  async function upload(
    bucket: PhotoBucket,
    file: File,
    options: UploadPhotoOptions = {},
  ): Promise<UploadedPhoto> {
    validatePhoto(file);

    const extension = FILE_EXTENSIONS[file.type];

    if (!extension) {
      throw new Error("Could not determine the image extension.");
    }

    const folder = options.folder
      ?.split("/")
      .map((segment) => segment.trim())
      .filter(Boolean)
      .join("/");

    if (
      folder &&
      folder.split("/").some(
        (segment) =>
          segment === "." || segment === "..",
      )
    ) {
      throw new Error("Invalid photo folder.");
    }

    const filename = `${crypto.randomUUID()}.${extension}`;
    const path = folder ? `${folder}/${filename}` : filename;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw new Error(`Photo upload failed: ${error.message}`);
    }

    const uploaded: UploadedPhoto = {
      bucket,
      path: data.path,
      publicUrl: getPublicUrl(bucket, data.path),
    };

    const previousPhoto = options.previousPhoto?.trim();

    if (previousPhoto) {
      const previousPath = getObjectPath(bucket, previousPhoto);

      if (previousPath && previousPath !== uploaded.path) {
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove([previousPath]);

        if (deleteError) {
          // Attempt to clean up the new upload if replacement fails.
          await supabase.storage
            .from(bucket)
            .remove([uploaded.path]);

          throw new Error(
            `The new photo uploaded, but the previous photo could not be removed: ${deleteError.message}`,
          );
        }
      }
    }

    return uploaded;
  }

  async function remove(
    bucket: PhotoBucket,
    photo: string,
  ): Promise<void> {
    const path = getObjectPath(bucket, photo);

    if (!path) {
      throw new Error(
        "Invalid photo URL or path for the selected bucket.",
      );
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Photo deletion failed: ${error.message}`);
    }
  }

  return {
    getPublicUrl,
    upload,
    remove,
  };
}
