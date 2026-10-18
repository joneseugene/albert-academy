import type {
  Notable,
  NotableCreateInput,
  NotableUpdateInput,
  NotableDeleteResult,
} from "@/lib/repositories/notable.repository";

import { createNotableRepository } from "@/lib/repositories/notable.repository";

// ============================================================
// TYPES
// ============================================================

export type {
  Notable,
  NotableCreateInput,
  NotableUpdateInput,
  NotableDeleteResult,
};

export type NotablePageResult = {
  data: Notable[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

// ============================================================
// GET ALL
// ============================================================

export async function getNotablePeople(): Promise<Notable[]> {
  const repository = await createNotableRepository();
  return repository.findMany();
}

// ============================================================
// GET RANDOM NOTABLE PEOPLE
// ============================================================

export async function getRandomNotablePeople(
  count = 4,
): Promise<Notable[]> {
  const repository = await createNotableRepository();
  return repository.findRandom(count);
}

// ============================================================
// GET PAGINATED AND SEARCHABLE NOTABLE PEOPLE
// ============================================================

export async function getNotablePage(
  page = 1,
  pageSize = 20,
  search = "",
): Promise<NotablePageResult> {
  const repository = await createNotableRepository();

  const safePage = Number.isSafeInteger(page) ? Math.max(1, page) : 1;
  const safePageSize = Number.isSafeInteger(pageSize)
    ? Math.min(100, Math.max(1, pageSize))
    : 20;

  const searchTerm = search.trim().slice(0, 100).toLocaleLowerCase();

  const records = await repository.findMany();

  // Apply search before randomization.
  const filteredRecords = searchTerm
    ? records.filter((record) =>
        [
          record.name,
          record.title ?? "",
          record.description ?? "",
          record.detail ?? "",
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(searchTerm),
      )
    : [...records];

  // Shuffle the matching records using Fisher-Yates.
  for (let i = filteredRecords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredRecords[i], filteredRecords[j]] = [
      filteredRecords[j]!,
      filteredRecords[i]!,
    ];
  }

  const total = filteredRecords.length;
  const totalPages = Math.ceil(total / safePageSize);
  const currentPage =
    totalPages > 0 ? Math.min(safePage, totalPages) : 1;
  const startIndex = (currentPage - 1) * safePageSize;

  return {
    data: filteredRecords.slice(startIndex, startIndex + safePageSize),
    page: currentPage,
    pageSize: safePageSize,
    total,
    totalPages,
  };
}

// ============================================================
// GET BY ID
// ============================================================

export async function getNotablePersonById(
  id: Notable["id"],
): Promise<Notable | null> {
  const repository = await createNotableRepository();
  return repository.findById(id);
}

// ============================================================
// CREATE
// ============================================================

export async function createNotablePerson(
  input: NotableCreateInput,
): Promise<Notable> {
  const repository = await createNotableRepository();
  return repository.create(input);
}

// ============================================================
// UPDATE
// ============================================================

export async function updateNotablePerson(
  id: Notable["id"],
  input: NotableUpdateInput,
): Promise<Notable> {
  const repository = await createNotableRepository();
  return repository.update(id, input);
}

// ============================================================
// DELETE
// ============================================================

export async function deleteNotablePerson(
  id: Notable["id"],
): Promise<NotableDeleteResult> {
  const repository = await createNotableRepository();
  return repository.delete(id);
}