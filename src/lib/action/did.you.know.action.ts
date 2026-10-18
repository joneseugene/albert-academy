"use server";

import { revalidatePath } from "next/cache";
import { permissions } from "@/lib/auth/permissions";
import { hasPermission } from "../auth/has-permission";
import type { DidYouKnow, DidYouKnowCreateInput, DidYouKnowUpdateInput } from "../repositories/did_you_know.repository";
import { createDidYouKnowRepository } from "../repositories/did_you_know.repository";
import type { DidYouKnowFormValues} from "../schemas/did-you-know.schema";
import { didYouKnowSchema } from "../schemas/did-you-know.schema";

// ============================================================
// TYPES
// ============================================================

export type DidYouKnowActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

// ============================================================
// RESULT HELPERS
// ============================================================

function failure<T = undefined>(
  message: string,
): DidYouKnowActionResult<T> {
  return { success: false, message };
}

function success<T>(
  message: string,
  data: T,
): DidYouKnowActionResult<T> {
  return { success: true, message, data };
}

// ============================================================
// INPUT MAPPING
// ============================================================

function toDidYouKnowInput(
  values: DidYouKnowFormValues,
): DidYouKnowCreateInput {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category.trim(),
    image: values.image?.trim() || null,
    image_alt: values.image
      ? values.imageAlt?.trim() || null
      : null,
    status: values.status,
    display_order: values.displayOrder,
  };
}

// ============================================================
// GET RANDOM PUBLISHED (PUBLIC)
// ============================================================

export async function getRandomPublishedDidYouKnow(): Promise<
  DidYouKnow | null
> {
  try {
    const repository = await createDidYouKnowRepository();

    return await repository.findRandomPublished();
  } catch (error) {
    console.error(
      "Failed to retrieve a random published fact:",
      error,
    );

    throw new Error("Unable to retrieve another fact. Please try again.");
  }
}

// ============================================================
// CACHE REVALIDATION
// ============================================================

function revalidateDidYouKnowPages(): void {
  revalidatePath("/");
  revalidatePath("/did-you-know");
  revalidatePath("/admin/did-you-know");
}

// ============================================================
// CREATE
// ============================================================

export async function createDidYouKnow(
  input: DidYouKnowFormValues,
): Promise<DidYouKnowActionResult<DidYouKnow>> {
  try {
    if (!(await hasPermission(permissions.didYouKnowCreate))) {
      return failure(
        "You are not authorized to create did-you-know facts.",
      );
    }

    const parsed = didYouKnowSchema.safeParse(input);

    if (!parsed.success) {
      return failure(
        parsed.error.issues[0]?.message ??
          "Please check the submitted information.",
      );
    }

    const repository = await createDidYouKnowRepository();
    const record = await repository.create(
      toDidYouKnowInput(parsed.data),
    );

    revalidateDidYouKnowPages();

    return success("Fact created successfully.", record);
  } catch (error) {
    console.error("Failed to create did-you-know fact:", error);

    return failure(
      "Unable to create the fact. Please try again.",
    );
  }
}

// ============================================================
// UPDATE
// ============================================================

export async function updateDidYouKnow(
  id: string,
  input: DidYouKnowFormValues,
): Promise<DidYouKnowActionResult<DidYouKnow>> {
  try {
    if (!(await hasPermission(permissions.didYouKnowUpdate))) {
      return failure(
        "You are not authorized to update did-you-know facts.",
      );
    }

    if (!id.trim()) {
      return failure("A valid fact ID is required.");
    }

    const parsed = didYouKnowSchema.safeParse(input);

    if (!parsed.success) {
      return failure(
        parsed.error.issues[0]?.message ??
          "Please check the submitted information.",
      );
    }

    const repository = await createDidYouKnowRepository();

    const record = await repository.update(
      id,
      toDidYouKnowInput(parsed.data) satisfies DidYouKnowUpdateInput,
    );

    revalidateDidYouKnowPages();

    revalidatePath(`/admin/did-you-know/${id}`);

    return success("Fact updated successfully.", record);
  } catch (error) {
    console.error("Failed to update did-you-know fact:", error);

    return failure(
      "Unable to update the fact. Please try again.",
    );
  }
}

// ============================================================
// DELETE (SOFT DELETE)
// ============================================================

export async function deleteDidYouKnow(
  id: string,
): Promise<
  DidYouKnowActionResult<{ id: string; deleted: true }>
> {
  try {
    if (!(await hasPermission(permissions.didYouKnowDelete))) {
      return failure(
        "You are not authorized to delete did-you-know facts.",
      );
    }

    if (!id.trim()) {
      return failure("A valid fact ID is required.");
    }

    const repository = await createDidYouKnowRepository();
    const result = await repository.delete(id);

    revalidateDidYouKnowPages();

    revalidatePath(`/admin/did-you-know/${id}`);

    return success("Fact deleted successfully.", result);
  } catch (error) {
    console.error("Failed to delete did-you-know fact:", error);

    return failure(
      "Unable to delete the fact. Please try again.",
    );
  }
}

// ============================================================
// GET ALL (ADMIN)
// ============================================================

export async function getDidYouKnowRecords(): Promise<
  DidYouKnowActionResult<DidYouKnow[]>
> {
  try {
    if (!(await hasPermission(permissions.didYouKnowRead))) {
      return failure(
        "You are not authorized to view did-you-know records.",
      );
    }

    const repository = await createDidYouKnowRepository();
    const records = await repository.findMany();

    return success("Facts retrieved successfully.", records);
  } catch (error) {
    console.error("Failed to retrieve did-you-know facts:", error);

    return failure(
      "Unable to retrieve facts. Please try again.",
    );
  }
}

// ============================================================
// GET PUBLISHED (PUBLIC)
// ============================================================

export async function getPublishedDidYouKnow(): Promise<
  DidYouKnowActionResult<DidYouKnow[]>
> {
  try {
    const repository = await createDidYouKnowRepository();
    const records = await repository.findPublished();

    return success(
      "Published facts retrieved successfully.",
      records,
    );
  } catch (error) {
    console.error("Failed to retrieve published facts:", error);

    return failure(
      "Unable to retrieve facts. Please try again.",
    );
  }
}
