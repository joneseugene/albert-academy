
"use server";

import { revalidatePath } from "next/cache";
import { permissions } from "@/lib/auth/permissions";

import {
  mediaSchema,
  type MediaFormValues,
} from "../schemas/media.schema";
import {
  createMediaRepository,
  type Media,
  type MediaCreateInput,
  type MediaUpdateInput,
} from "../repositories/media.repository";
import { hasPermission } from "../auth/has-permission";

export type MediaActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

function failure<T = undefined>(message: string): MediaActionResult<T> {
  return { success: false, message };
}

function success<T>(message: string, data: T): MediaActionResult<T> {
  return { success: true, message, data };
}

function toMediaInput(values: MediaFormValues): MediaCreateInput {
  return {
    name: values.name.trim(),
    photo: values.photo?.trim() || null,
  };
}

function revalidateMediaPages(): void {
  revalidatePath("/media");
  revalidatePath("/");
}

export async function createMedia(
  input: MediaFormValues,
): Promise<MediaActionResult<Media>> {
  try {
    if (!(await hasPermission(permissions.mediaCreate))) {
      return failure("You are not authorized to create media records.");
    }

    const parsed = mediaSchema.safeParse(input);
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message ?? "Please check the submitted information.");
    }

    const repository = await createMediaRepository();
    const record = await repository.create(toMediaInput(parsed.data));

    revalidateMediaPages();
    return success("Media record created successfully.", record);
  } catch (error) {
    console.error("Failed to create media record:", error);
    return failure("Unable to create the media record. Please try again.");
  }
}

export async function updateMedia(
  id: string,
  input: MediaFormValues,
): Promise<MediaActionResult<Media>> {
  try {
    if (!(await hasPermission(permissions.mediaUpdate))) {
      return failure("You are not authorized to update media records.");
    }

    if (!id.trim()) return failure("A valid media record ID is required.");

    const parsed = mediaSchema.safeParse(input);
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message ?? "Please check the submitted information.");
    }

    const repository = await createMediaRepository();
    const record = await repository.update(
      id,
      toMediaInput(parsed.data) satisfies MediaUpdateInput,
    );

    revalidateMediaPages();
    revalidatePath(`/media/${id}`);

    return success("Media record updated successfully.", record);
  } catch (error) {
    console.error("Failed to update media record:", error);
    return failure("Unable to update the media record. Please try again.");
  }
}

export async function deleteMedia(
  id: string,
): Promise<MediaActionResult<{ id: string; deleted: true }>> {
  try {
    if (!(await hasPermission(permissions.mediaDelete))) {
      return failure("You are not authorized to delete media records.");
    }

    if (!id.trim()) return failure("A valid media record ID is required.");

    const repository = await createMediaRepository();
    const result = await repository.delete(id);

    revalidateMediaPages();
    revalidatePath(`/media/${id}`);

    return success("Media record deleted successfully.", result);
  } catch (error) {
    console.error("Failed to delete media record:", error);
    return failure("Unable to delete the media record. Please try again.");
  }
}

export async function getMediaRecords(): Promise<
  MediaActionResult<Media[]>
> {
  try {
    if (!(await hasPermission(permissions.mediaRead))) {
      return failure("You are not authorized to view media records.");
    }

    const repository = await createMediaRepository();
    const records = await repository.findMany();

    return success("Media records retrieved successfully.", records);
  } catch (error) {
    console.error("Failed to retrieve media records:", error);
    return failure("Unable to retrieve media records. Please try again.");
  }
}
