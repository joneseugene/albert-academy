
"use server";

import { revalidatePath } from "next/cache";
import { permissions } from "@/lib/auth/permissions";

import {
  staffSchema,
  type StaffFormValues,
} from "../schemas/staff.schema";
import {
  createStaffRepository,
  type Staff,
  type StaffCreateInput,
  type StaffUpdateInput,
} from "../repositories/staff.repository";
import { hasPermission } from "../auth/has-permission";

export type StaffActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

function failure<T = undefined>(message: string): StaffActionResult<T> {
  return { success: false, message };
}

function success<T>(message: string, data: T): StaffActionResult<T> {
  return { success: true, message, data };
}

function toStaffInput(values: StaffFormValues): StaffCreateInput {
  return {
    name: values.name.trim(),
    photo: values.photo?.trim() || null,
    role: values.role.trim(),
    level: values.level?.trim() || null,
    start_year: values.start_year ?? null,
    end_year: values.end_year ?? null,
  };
}

function revalidateStaffPages(): void {
  revalidatePath("/staff");
  revalidatePath("/");
}

export async function createStaff(
  input: StaffFormValues,
): Promise<StaffActionResult<Staff>> {
  try {
    if (!(await hasPermission(permissions.staffCreate))) {
      return failure("You are not authorized to create staff records.");
    }

    const parsed = staffSchema.safeParse(input);
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message ?? "Please check the submitted information.");
    }

    const repository = await createStaffRepository();
    const record = await repository.create(toStaffInput(parsed.data));

    revalidateStaffPages();
    return success("Staff record created successfully.", record);
  } catch (error) {
    console.error("Failed to create staff record:", error);
    return failure("Unable to create the staff record. Please try again.");
  }
}

export async function updateStaff(
  id: string,
  input: StaffFormValues,
): Promise<StaffActionResult<Staff>> {
  try {
    if (!(await hasPermission(permissions.staffUpdate))) {
      return failure("You are not authorized to update staff records.");
    }

    if (!id.trim()) return failure("A valid staff record ID is required.");

    const parsed = staffSchema.safeParse(input);
    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message ?? "Please check the submitted information.");
    }

    const repository = await createStaffRepository();
    const record = await repository.update(
      id,
      toStaffInput(parsed.data) satisfies StaffUpdateInput,
    );

    revalidateStaffPages();
    revalidatePath(`/staff/${id}`);

    return success("Staff record updated successfully.", record);
  } catch (error) {
    console.error("Failed to update staff record:", error);
    return failure("Unable to update the staff record. Please try again.");
  }
}

export async function deleteStaff(
  id: string,
): Promise<StaffActionResult<{ id: string; deleted: true }>> {
  try {
    if (!(await hasPermission(permissions.staffDelete))) {
      return failure("You are not authorized to delete staff records.");
    }

    if (!id.trim()) return failure("A valid staff record ID is required.");

    const repository = await createStaffRepository();
    const result = await repository.delete(id);

    revalidateStaffPages();
    revalidatePath(`/staff/${id}`);

    return success("Staff record deleted successfully.", result);
  } catch (error) {
    console.error("Failed to delete staff record:", error);
    return failure("Unable to delete the staff record. Please try again.");
  }
}

export async function getStaffRecords(): Promise<StaffActionResult<Staff[]>> {
  try {
    if (!(await hasPermission(permissions.staffRead))) {
      return failure("You are not authorized to view staff records.");
    }

    const repository = await createStaffRepository();
    const records = await repository.findMany();

    return success("Staff records retrieved successfully.", records);
  } catch (error) {
    console.error("Failed to retrieve staff records:", error);
    return failure("Unable to retrieve staff records. Please try again.");
  }
}
