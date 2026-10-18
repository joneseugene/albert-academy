import type {
  PastLeadership,
  PastLeadershipCreateInput,
  PastLeadershipUpdateInput,
  PastLeadershipDeleteResult,
} from "@/lib/repositories/past-leadership.repository";

import { createPastLeadershipRepository } from "@/lib/repositories/past-leadership.repository";

// ============================================================
// TYPES
// ============================================================

export type {
  PastLeadership,
  PastLeadershipCreateInput,
  PastLeadershipUpdateInput,
  PastLeadershipDeleteResult,
};

// ============================================================
// GET ALL
// ============================================================

export async function getPastLeadershipRecords(): Promise<
  PastLeadership[]
> {
  const repository = await createPastLeadershipRepository();

  return repository.findMany();
}

// ============================================================
// GET BY ID
// ============================================================

export async function getPastLeadershipById(
  id: PastLeadership["id"],
): Promise<PastLeadership | null> {
  const repository = await createPastLeadershipRepository();

  return repository.findById(id);
}

// ============================================================
// CREATE
// ============================================================

export async function createPastLeadership(
  input: PastLeadershipCreateInput,
): Promise<PastLeadership> {
  const repository = await createPastLeadershipRepository();

  return repository.create(input);
}

// ============================================================
// UPDATE
// ============================================================

export async function updatePastLeadership(
  id: PastLeadership["id"],
  input: PastLeadershipUpdateInput,
): Promise<PastLeadership> {
  const repository = await createPastLeadershipRepository();

  return repository.update(id, input);
}

// ============================================================
// DELETE
// ============================================================

export async function deletePastLeadership(
  id: PastLeadership["id"],
): Promise<PastLeadershipDeleteResult> {
  const repository = await createPastLeadershipRepository();

  return repository.delete(id);
}