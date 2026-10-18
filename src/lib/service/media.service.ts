import type {
  Media,
  MediaCreateInput,
  MediaUpdateInput,
  MediaDeleteResult,
  MediaPage,
} from "@/lib/repositories/media.repository";

import { createMediaRepository } from "@/lib/repositories/media.repository";

export type {
  Media,
  MediaCreateInput,
  MediaUpdateInput,
  MediaDeleteResult,
  MediaPage,
};

// GET PAGINATED MEDIA
export async function getMediaPage(
  page = 1,
  pageSize = 12,
): Promise<MediaPage> {
  const repository = await createMediaRepository();

  return repository.findPage(page, pageSize);
}

// GET RANDOM
export async function getRandomMediaRecords(
  count = 4,
): Promise<Media[]> {
  const repository = await createMediaRepository();

  return repository.findRandom(count);
}

// GET ALL
export async function getMediaRecords(): Promise<Media[]> {
  const repository = await createMediaRepository();

  return repository.findMany();
}

// GET BY ID
export async function getMediaRecordById(
  id: Media["id"],
): Promise<Media | null> {
  const repository = await createMediaRepository();

  return repository.findById(id);
}

// CREATE
export async function createMediaRecord(
  input: MediaCreateInput,
): Promise<Media> {
  const repository = await createMediaRepository();

  return repository.create(input);
}

// UPDATE
export async function updateMediaRecord(
  id: Media["id"],
  input: MediaUpdateInput,
): Promise<Media> {
  const repository = await createMediaRepository();

  return repository.update(id, input);
}

// DELETE
export async function deleteMediaRecord(
  id: Media["id"],
): Promise<MediaDeleteResult> {
  const repository = await createMediaRepository();

  return repository.delete(id);
}