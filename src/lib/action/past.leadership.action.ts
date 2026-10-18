
"use server";

import { revalidatePath } from "next/cache";
import { permissions } from "@/lib/auth/permissions";

import {
  pastLeadershipSchema,
  type PastLeadershipFormValues,
} from "../schemas/past-leadership.schema";
import {
  createPastLeadershipRepository,
  type PastLeadership,
  type PastLeadershipCreateInput,
  type PastLeadershipUpdateInput,
} from "../repositories/past-leadership.repository";
import { hasPermission } from "../auth/has-permission";

export type PastLeadershipActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

function failure<T = undefined>(message: string): PastLeadershipActionResult<T> {
  return { success: false, message };
}

function success<T>(message: string, data: T): PastLeadershipActionResult<T> {
  return { success: true, message, data };
}

function toPastLeadershipInput(
  values: PastLeadershipFormValues,
): PastLeadershipCreateInput {
  return {
    name: values.name.trim(),
    photo: values.photo?.trim() || null,
    role: values.role.trim(),
    level: values.level?.trim() || null,
    start_year: values.start_year ?? null,
    end_year: values.end_year ?? null,
    about: values.about?.trim() || null,
  };
}

function revalidatePastLeadershipPages(): void {
  revalidatePath("/past-leadership");
  revalidatePath("/");
}

export async function createPastLeadership(
  input: PastLeadershipFormValues,
): Promise<PastLeadershipActionResult<PastLeadership>> {
  try {
    if (!(await hasPermission(permissions.pastLeadershipCreate))) {
      return failure("You are not authorized to create Leadership records.");
    }

    const parsed = pastLeadershipSchema.safeParse(input);
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message ?? "Please check the submitted information.");
    }

    const repository = await createPastLeadershipRepository();
    const record = await repository.create(toPastLeadershipInput(parsed.data));

    revalidatePastLeadershipPages();
    return success("Leadership record created successfully.", record);
  } catch (error) {
    console.error("Failed to create leadership record:", error);
    return failure("Unable to create the leadership record. Please try again.");
  }
}

export async function updatePastLeadership(
  id: string,
  input: PastLeadershipFormValues,
): Promise<PastLeadershipActionResult<PastLeadership>> {
  try {
    if (!(await hasPermission(permissions.pastLeadershipUpdate))) {
      return failure("You are not authorized to update Leadership records.");
    }

    if (!id.trim()) return failure("A valid Leadership record ID is required.");

    const parsed = pastLeadershipSchema.safeParse(input);
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message ?? "Please check the submitted information.");
    }

    const repository = await createPastLeadershipRepository();
    const record = await repository.update(
      id,
      toPastLeadershipInput(parsed.data) satisfies PastLeadershipUpdateInput,
    );

    revalidatePastLeadershipPages();
    revalidatePath(`/past-leadership/${id}`);

    return success("Leadership record updated successfully.", record);
  } catch (error) {
    console.error("Failed to update leadership record:", error);
    return failure("Unable to update the leadership record. Please try again.");
  }
}

export async function deletePastLeadership(
  id: string,
): Promise<PastLeadershipActionResult<{ id: string; deleted: true }>> {
  try {
    if (!(await hasPermission(permissions.pastLeadershipDelete))) {
      return failure("You are not authorized to delete leadership records.");
    }

    if (!id.trim()) return failure("A valid leadership record ID is required.");

    const repository = await createPastLeadershipRepository();
    const result = await repository.delete(id);

    revalidatePastLeadershipPages();
    revalidatePath(`/past-leadership/${id}`);

    return success("Leadership record deleted successfully.", result);
  } catch (error) {
    console.error("Failed to delete leadership record:", error);
    return failure("Unable to delete the leadership record. Please try again.");
  }
}

export async function getPastLeadershipRecords(): Promise<
  PastLeadershipActionResult<PastLeadership[]>
> {
  try {
    if (!(await hasPermission(permissions.pastLeadershipRead))) {
      return failure("You are not authorized to view leadership records.");
    }

    const repository = await createPastLeadershipRepository();
    const records = await repository.findMany();

    return success("Leadership records retrieved successfully.", records);
  } catch (error) {
    console.error("Failed to retrieve leadership records:", error);
    return failure("Unable to retrieve leadership records. Please try again.");
  }
}
