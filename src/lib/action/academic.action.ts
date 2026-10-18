
"use server";

import { revalidatePath } from "next/cache";
import { permissions } from "@/lib/auth/permissions";

import {
  academicSchema,
  type AcademicFormValues,
} from "../schemas/academic.schema";
import {
  createAcademicRepository,
  type Academic,
  type AcademicCreateInput,
  type AcademicUpdateInput,
} from "../repositories/academic.repository";
import { hasPermission } from "../auth/has-permission";

export type AcademicActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

function failure<T = undefined>(message: string): AcademicActionResult<T> {
  return { success: false, message };
}

function success<T>(message: string, data: T): AcademicActionResult<T> {
  return { success: true, message, data };
}


function toAcademicInput(
  values: AcademicFormValues,
): AcademicCreateInput {
  return {
    name: values.name.trim(),
    photo: values.photo?.trim() || null,
    link: values.link?.trim() || null,
  };
}

function revalidateAcademicPages(): void {
  revalidatePath("/academic");
  revalidatePath("/");
}

export async function createAcademic(
  input: AcademicFormValues,
): Promise<AcademicActionResult<Academic>> {
  try {
    if (!(await hasPermission(permissions.academicCreate))) {
      return failure("You are not authorized to create academic records.");
    }

    const parsed = academicSchema.safeParse(input);

    if (!parsed.success) {
      return failure(
        parsed.error.issues[0]?.message ?? "Please check the submitted information.",
      );
    }

    const repository = await createAcademicRepository();
    const record = await repository.create(toAcademicInput(parsed.data));

    revalidateAcademicPages();

    return success("Academic record created successfully.", record);
  } catch (error) {
    console.error("Failed to create academic record:", error);
    return failure("Unable to create the academic record. Please try again.");
  }
}

export async function updateAcademic(
  id: string,
  input: AcademicFormValues,
): Promise<AcademicActionResult<Academic>> {
  try {
    if (!(await hasPermission(permissions.academicUpdate))) {
      return failure("You are not authorized to update academic records.");
    }

    if (!id.trim()) return failure("A valid academic record ID is required.");

    const parsed = academicSchema.safeParse(input);

    if (!parsed.success) {
      return failure(
        parsed.error.issues[0]?.message ?? "Please check the submitted information.",
      );
    }

    const repository = await createAcademicRepository();
    const record = await repository.update(
      id,
      toAcademicInput(parsed.data) satisfies AcademicUpdateInput,
    );

    revalidateAcademicPages();
    revalidatePath(`/academic/${id}`);

    return success("Academic record updated successfully.", record);
  } catch (error) {
    console.error("Failed to update academic record:", error);
    return failure("Unable to update the academic record. Please try again.");
  }
}

export async function deleteAcademic(
  id: string,
): Promise<AcademicActionResult<{ id: string; deleted: true }>> {
  try {
    if (!(await hasPermission(permissions.academicDelete))) {
      return failure("You are not authorized to delete academic records.");
    }

    if (!id.trim()) return failure("A valid academic record ID is required.");

    const repository = await createAcademicRepository();
    const result = await repository.delete(id);

    revalidateAcademicPages();
    revalidatePath(`/academic/${id}`);

    return success("Academic record deleted successfully.", result);
  } catch (error) {
    console.error("Failed to delete academic record:", error);
    return failure("Unable to delete the academic record. Please try again.");
  }
}

export async function getAcademicRecords(): Promise<
  AcademicActionResult<Academic[]>
> {
  try {
    if (!(await hasPermission(permissions.academicRead))) {
      return failure("You are not authorized to view academic records.");
    }

    const repository = await createAcademicRepository();
    const records = await repository.findMany();

    return success("Academic records retrieved successfully.", records);
  } catch (error) {
    console.error("Failed to retrieve academic records:", error);
    return failure("Unable to retrieve academic records. Please try again.");
  }
}
