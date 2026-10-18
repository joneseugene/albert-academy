import type {
  Pupils,
  PupilCreateInput,
  PupilUpdateInput,
  PupilDeleteResult,
} from "@/lib/repositories/pupil.repository";

import { createPupilRepository } from "@/lib/repositories/pupil.repository";

// ============================================================
// TYPES
// ============================================================

export type {
  Pupils,
  PupilCreateInput,
  PupilUpdateInput,
  PupilDeleteResult,
};

// ============================================================
// GET ALL
// ============================================================

export async function getPupils(): Promise<Pupils[]> {
  const repository = await createPupilRepository();

  return repository.findMany();
}

// ============================================================
// GET BY ID
// ============================================================

export async function getPupilById(
  id: Pupils["id"],
): Promise<Pupils | null> {
  const repository = await createPupilRepository();

  return repository.findById(id);
}

// ============================================================
// CREATE
// ============================================================

export async function createPupil(
  input: PupilCreateInput,
): Promise<Pupils> {
  const repository = await createPupilRepository();

  return repository.create(input);
}

// ============================================================
// UPDATE
// ============================================================

export async function updatePupil(
  id: Pupils["id"],
  input: PupilUpdateInput,
): Promise<Pupils> {
  const repository = await createPupilRepository();

  return repository.update(id, input);
}

// ============================================================
// DELETE
// ============================================================

export async function deletePupil(
  id: Pupils["id"],
): Promise<PupilDeleteResult> {
  const repository = await createPupilRepository();

  return repository.delete(id);
}