import type {
  DidYouKnow,
  DidYouKnowCreateInput,
  DidYouKnowUpdateInput,
  DidYouKnowDeleteResult,
} from "@/lib/repositories/did_you_know.repository";

import { createDidYouKnowRepository } from "@/lib/repositories/did_you_know.repository";

// ============================================================
// TYPES
// ============================================================

export type {
  DidYouKnow,
  DidYouKnowCreateInput,
  DidYouKnowUpdateInput,
  DidYouKnowDeleteResult,
};

// ============================================================
// GET RANDOM PUBLISHED
// ============================================================
export async function getRandomPublishedDidYouKnowRecord(): Promise<
  DidYouKnow | null
> {
  const repository = await createDidYouKnowRepository();

  return repository.findRandomPublished();
}


// ============================================================
// GET ALL PUBLISHED
// ============================================================
export async function getPublishedDidYouKnowPage({
  query = "",
  page = 1,
  pageSize = 12,
}: {
  query?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  data: DidYouKnow[];
  total: number;
}> {
  const repository = await createDidYouKnowRepository();

  return repository.findPublishedPage({
    query,
    page,
    pageSize,
  });
}


// ============================================================
// GET ALL
// ============================================================

export async function getDidYouKnowRecords(): Promise<DidYouKnow[]> {
  const repository = await createDidYouKnowRepository();

  return repository.findMany();
}

// ============================================================
// GET BY ID
// ============================================================

export async function getDidYouKnowRecordById(
  id: DidYouKnow["id"],
): Promise<DidYouKnow | null> {
  const repository = await createDidYouKnowRepository();

  return repository.findById(id);
}

// ============================================================
// CREATE
// ============================================================

export async function createDidYouKnowRecord(
  input: DidYouKnowCreateInput,
): Promise<DidYouKnow> {
  const repository = await createDidYouKnowRepository();

  return repository.create(input);
}

// ============================================================
// UPDATE
// ============================================================

export async function updateDidYouKnowRecord(
  id: DidYouKnow["id"],
  input: DidYouKnowUpdateInput,
): Promise<DidYouKnow> {
  const repository = await createDidYouKnowRepository();

  return repository.update(id, input);
}

// ============================================================
// DELETE
// ============================================================

export async function deleteDidYouKnowRecord(
  id: DidYouKnow["id"],
): Promise<DidYouKnowDeleteResult> {
  const repository = await createDidYouKnowRepository();

  return repository.delete(id);
}
