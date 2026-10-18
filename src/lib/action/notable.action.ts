"use server";

import { revalidatePath } from "next/cache";
import {
  permissions,
  type PermissionKey,
} from "@/lib/auth/permissions";

import { getCurrentUserProfile } from "@/lib/auth/get-current-user-profile";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";

import {
  notableSchema,
  type NotableFormValues,
} from "../schemas/notable.schema";

import {
  createNotableRepository,
  type Notable,
  type NotableCreateInput,
  type NotableUpdateInput,
} from "../repositories/notable.repository";

// ============================================================
// TYPES
// ============================================================

export type NotableActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

type NotableOperation = "create" | "update" | "delete";

const NOTABLE_PERMISSIONS: Record<NotableOperation, PermissionKey> = {
  create: permissions.alumniCreate,
  update: permissions.alumniUpdate,
  delete: permissions.alumniDelete,
};

// ============================================================
// RESULT HELPERS
// ============================================================

function failure<T = undefined>(
  message: string,
): NotableActionResult<T> {
  return { success: false, message };
}

function success<T>(
  message: string,
  data: T,
): NotableActionResult<T> {
  return { success: true, message, data };
}

// ============================================================
// AUTHORIZATION
// ============================================================

async function canManageNotable(
  operation: NotableOperation,
): Promise<boolean> {
  const profile = await getCurrentUserProfile();

  if (!profile || !profile.is_active) {
    return false;
  }

  const userPermissions = await getCurrentUserPermissions();

  return userPermissions.includes(NOTABLE_PERMISSIONS[operation]);
}

// ============================================================
// VALIDATION & NORMALIZATION
// ============================================================

function parseNotableInput(
  input: NotableFormValues,
):
  | { success: true; data: NotableCreateInput }
  | { success: false; message: string } {
  const parsed = notableSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ??
        "Please check the submitted information.",
    };
  }

  const values = parsed.data;

  return {
    success: true,
    data: {
      name: values.name.trim(),
      photo: values.photo?.trim() || null,
      title: values.title.trim() || null,
      description: values.description.trim() || null,
      detail: values.detail.trim() || null,
    },
  };
}

// ============================================================
// CACHE INVALIDATION
// ============================================================

function revalidateNotablePages(id?: string): void {
  revalidatePath("/notable");
  revalidatePath("/");

  if (id) {
    revalidatePath(`/notable/${id}`);
  }
}

// ============================================================
// CREATE
// ============================================================

export async function createNotable(
  input: NotableFormValues,
): Promise<NotableActionResult<Notable>> {
  try {
    if (!(await canManageNotable("create"))) {
      return failure(
        "You are not authorized to create notable records.",
      );
    }

    const parsed = parseNotableInput(input);

    if (!parsed.success) {
      return failure(parsed.message);
    }

    const repository = await createNotableRepository();
    const record = await repository.create(parsed.data);

    revalidateNotablePages();

    return success("Notable person created successfully.", record);
  } catch (error) {
    console.error("Failed to create notable person:", error);

    return failure(
      "Unable to create the notable person. Please try again.",
    );
  }
}

// ============================================================
// UPDATE
// ============================================================

export async function updateNotable(
  id: string,
  input: NotableFormValues,
): Promise<NotableActionResult<Notable>> {
  try {
    if (!(await canManageNotable("update"))) {
      return failure(
        "You are not authorized to update notable records.",
      );
    }

    if (!id.trim()) {
      return failure("A valid notable record ID is required.");
    }

    const parsed = parseNotableInput(input);

    if (!parsed.success) {
      return failure(parsed.message);
    }

    const repository = await createNotableRepository();

    const values: NotableUpdateInput = parsed.data;
    const record = await repository.update(id, values);

    revalidateNotablePages(id);

    return success("Notable person updated successfully.", record);
  } catch (error) {
    console.error("Failed to update notable person:", error);

    return failure(
      "Unable to update the notable person. Please try again.",
    );
  }
}

// ============================================================
// DELETE
// ============================================================

export async function deleteNotable(
  id: string,
): Promise<NotableActionResult<{ id: string; deleted: true }>> {
  try {
    if (!(await canManageNotable("delete"))) {
      return failure(
        "You are not authorized to delete notable records.",
      );
    }

    if (!id.trim()) {
      return failure("A valid notable record ID is required.");
    }

    const repository = await createNotableRepository();
    const result = await repository.delete(id);

    revalidateNotablePages(id);

    return success("Notable person deleted successfully.", result);
  } catch (error) {
    console.error("Failed to delete notable person:", error);

    return failure(
      "Unable to delete the notable person. Please try again.",
    );
  }
}

// ============================================================
// GET ALL / REFRESH
// ============================================================

export async function getNotableRecords(): Promise<
  NotableActionResult<Notable[]>
> {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile || !profile.is_active) {
      return failure("Please sign in to continue.");
    }

    const repository = await createNotableRepository();
    const records = await repository.findMany();

    return success(
      "Notable records retrieved successfully.",
      records,
    );
  } catch (error) {
    console.error("Failed to retrieve notable records:", error);

    return failure(
      "Unable to retrieve notable records. Please try again.",
    );
  }
}