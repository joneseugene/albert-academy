import type {
  Staff,
  StaffCreateInput,
  StaffUpdateInput,
  StaffDeleteResult,
} from "@/lib/repositories/staff.repository";

import { createStaffRepository } from "@/lib/repositories/staff.repository";

// ============================================================
// TYPES
// ============================================================

export type {
  Staff,
  StaffCreateInput,
  StaffUpdateInput,
  StaffDeleteResult,
};

// ============================================================
// GET ALL STAFF
// ============================================================

export async function getStaff(): Promise<Staff[]> {
  const repository = await createStaffRepository();

  return repository.findMany();
}

// ============================================================
// GET STAFF BY ID
// ============================================================

export async function getStaffById(
  id: Staff["id"],
): Promise<Staff | null> {
  const repository = await createStaffRepository();

  return repository.findById(id);
}

// ============================================================
// CREATE STAFF
// ============================================================

export async function createStaff(
  input: StaffCreateInput,
): Promise<Staff> {
  const repository = await createStaffRepository();

  return repository.create(input);
}

// ============================================================
// UPDATE STAFF
// ============================================================

export async function updateStaff(
  id: Staff["id"],
  input: StaffUpdateInput,
): Promise<Staff> {
  const repository = await createStaffRepository();

  return repository.update(id, input);
}

// ============================================================
// DELETE STAFF
// ============================================================

export async function deleteStaff(
  id: Staff["id"],
): Promise<StaffDeleteResult> {
  const repository = await createStaffRepository();

  return repository.delete(id);
}