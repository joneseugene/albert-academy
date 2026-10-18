
"use server";

import { revalidatePath } from "next/cache";
import { permissions } from "@/lib/auth/permissions";

import {
  pupilSchema,
  type PupilFormValues,
} from "../schemas/pupil.schema";
import { hasPermission } from "../auth/has-permission";
import type { PupilCreateInput, Pupils, PupilUpdateInput } from "../repositories/pupil.repository";
import { createPupilRepository } from "../repositories/pupil.repository";

export type PupilActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

function failure<T = undefined>(message: string): PupilActionResult<T> {
  return { success: false, message };
}

function success<T>(message: string, data: T): PupilActionResult<T> {
  return { success: true, message, data };
}

function toPupilInput(
  values: PupilFormValues,
): PupilCreateInput {
  return {
    name: values.name.trim(),
    photo: values.photo?.trim() || null,
    role: values.role.trim(),
    level: values.level?.trim() || null,
    start_year: values.start_year ?? null,
    end_year: values.end_year ?? null,
  };
}

function revalidatePupilPages(): void {
  revalidatePath("/Pupils");
  revalidatePath("/");
}

export async function createPupil(
  input: PupilFormValues,
): Promise<PupilActionResult<Pupils>> {
  try {
    if (!(await hasPermission(permissions.studentsCreate))) {
      return failure("You are not authorized to create Pupil records.");
    }

    const parsed = pupilSchema.safeParse(input);
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message ?? "Please check the submitted information.");
    }

    const repository = await createPupilRepository();
    const record = await repository.create(toPupilInput(parsed.data));

    revalidatePupilPages();
    return success("Pupil record created successfully.", record);
  } catch (error) {
    console.error("Failed to create Pupil record:", error);
    return failure("Unable to create the Pupil record. Please try again.");
  }
}

export async function updatePupil(
  id: string,
  input: PupilFormValues,
): Promise<PupilActionResult<Pupils>> {
  try {
    if (!(await hasPermission(permissions.studentsUpdate))) {
      return failure("You are not authorized to update Pupil records.");
    }

    if (!id.trim()) return failure("A valid Pupil record ID is required.");

    const parsed = pupilSchema.safeParse(input);
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message ?? "Please check the submitted information.");
    }

    const repository = await createPupilRepository();
    const record = await repository.update(
      id,
      toPupilInput(parsed.data) satisfies PupilUpdateInput,
    );

    revalidatePupilPages();
    revalidatePath(`/Pupils/${id}`);

    return success("Pupil record updated successfully.", record);
  } catch (error) {
    console.error("Failed to update Pupil record:", error);
    return failure("Unable to update the Pupil record. Please try again.");
  }
}

export async function deletePupil(
  id: string,
): Promise<PupilActionResult<{ id: string; deleted: true }>> {
  try {
    if (!(await hasPermission(permissions.studentsDelete))) {
      return failure("You are not authorized to delete Pupil records.");
    }

    if (!id.trim()) return failure("A valid Pupil record ID is required.");

    const repository = await createPupilRepository();
    const result = await repository.delete(id);

    revalidatePupilPages();
    revalidatePath(`/Pupils/${id}`);

    return success("Pupil record deleted successfully.", result);
  } catch (error) {
    console.error("Failed to delete Pupil record:", error);
    return failure("Unable to delete the Pupil record. Please try again.");
  }
}

export async function getPupilRecords(): Promise<
  PupilActionResult<Pupils[]>
> {
  try {
    if (!(await hasPermission(permissions.studentsRead))) {
      return failure("You are not authorized to view Pupil records.");
    }

    const repository = await createPupilRepository();
    const records = await repository.findMany();

    return success("Pupil records retrieved successfully.", records);
  } catch (error) {
    console.error("Failed to retrieve Pupil records:", error);
    return failure("Unable to retrieve Pupil records. Please try again.");
  }
}
