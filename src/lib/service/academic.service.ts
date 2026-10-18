
import type {
  Academic,
  AcademicCreateInput,
  AcademicUpdateInput,
  AcademicDeleteResult,
} from "@/lib/repositories/academic.repository";

import { createAcademicRepository } from "@/lib/repositories/academic.repository";

// ============================================================
// TYPES
// ============================================================

export type {
  Academic,
  AcademicCreateInput,
  AcademicUpdateInput,
  AcademicDeleteResult,
};

export type AcademicPageResult = {
  data: Academic[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

// ============================================================
// GET RANDOM
// ============================================================

export async function getRandomAcademicRecords(
  count = 4,
): Promise<Academic[]> {
  const repository = await createAcademicRepository();

  return repository.findRandom(count);
}

// ============================================================
// GET PAGINATED AND SEARCHABLE RECORDS
// ============================================================

export async function getAcademicPage(
  page = 1,
  pageSize = 12,
  search = "",
): Promise<AcademicPageResult> {
  const repository = await createAcademicRepository();

  const safePage = Number.isSafeInteger(page)
    ? Math.max(1, page)
    : 1;

  const safePageSize = Number.isSafeInteger(pageSize)
    ? Math.min(100, Math.max(1, pageSize))
    : 12;

  const searchTerm = search.trim().slice(0, 100).toLocaleLowerCase();

  const records = await repository.findMany();

  const filteredRecords = searchTerm
    ? records.filter((record) =>
        record.name.toLocaleLowerCase().includes(searchTerm),
      )
    : records;

  const total = filteredRecords.length;
  const totalPages = Math.ceil(total / safePageSize);
  const currentPage =
    totalPages > 0 ? Math.min(safePage, totalPages) : 1;

  const startIndex = (currentPage - 1) * safePageSize;

  return {
    data: filteredRecords.slice(
      startIndex,
      startIndex + safePageSize,
    ),
    page: currentPage,
    pageSize: safePageSize,
    total,
    totalPages,
  };
}

// ============================================================
// GET ALL
// ============================================================

export async function getAcademicRecords(): Promise<Academic[]> {
  const repository = await createAcademicRepository();

  return repository.findMany();
}

// ============================================================
// GET BY ID
// ============================================================

export async function getAcademicRecordById(
  id: Academic["id"],
): Promise<Academic | null> {
  const repository = await createAcademicRepository();

  return repository.findById(id);
}

// ============================================================
// CREATE
// ============================================================

export async function createAcademicRecord(
  input: AcademicCreateInput,
): Promise<Academic> {
  const repository = await createAcademicRepository();

  return repository.create(input);
}

// ============================================================
// UPDATE
// ============================================================

export async function updateAcademicRecord(
  id: Academic["id"],
  input: AcademicUpdateInput,
): Promise<Academic> {
  const repository = await createAcademicRepository();

  return repository.update(id, input);
}

// ============================================================
// DELETE
// ============================================================

export async function deleteAcademicRecord(
  id: Academic["id"],
): Promise<AcademicDeleteResult> {
  const repository = await createAcademicRepository();

  return repository.delete(id);
}
