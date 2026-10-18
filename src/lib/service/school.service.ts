

// ============================================================
// TYPES
// ============================================================

import type { SchoolInfo, SchoolInfoCreateInput, SchoolInfoUpdateInput} from "../repositories/school_info.repository";
import { createSchoolInfoRepository } from "../repositories/school_info.repository";

export type {
  SchoolInfo,
  SchoolInfoCreateInput,
  SchoolInfoUpdateInput,
};

// ============================================================
// GET SCHOOL INFORMATION
// ============================================================

export async function getSchoolInfo(): Promise<SchoolInfo | null> {
  const repository = await createSchoolInfoRepository();

  return repository.get();
}

// ============================================================
// INITIALIZE SCHOOL INFORMATION
// ============================================================

export async function createSchoolInfo(
  input: SchoolInfoCreateInput,
): Promise<SchoolInfo> {
  const repository = await createSchoolInfoRepository();

  return repository.create(input);
}

// ============================================================
// UPDATE SCHOOL INFORMATION
// ============================================================

export async function updateSchoolInfo(
  input: SchoolInfoUpdateInput,
): Promise<SchoolInfo> {
  const repository = await createSchoolInfoRepository();

  return repository.update(input);
}

// ============================================================
// SAVE SCHOOL INFORMATION
// ============================================================

export async function saveSchoolInfo(
  input: SchoolInfoCreateInput,
): Promise<SchoolInfo> {
  const repository = await createSchoolInfoRepository();

  return repository.save(input);
}