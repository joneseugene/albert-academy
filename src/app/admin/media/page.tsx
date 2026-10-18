export const dynamic = "force-dynamic";
import { MediaPageClient } from "@/features/admin/media/media-client";
import {
  createMedia,
  deleteMedia,
  getMediaRecords,
  updateMedia,
} from "@/lib/action/media.action";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";
import { permissions } from "@/lib/auth/permissions";

export default async function MediaPage() {
  const [mediaResult, userPermissions] = await Promise.all([
    getMediaRecords(),
    getCurrentUserPermissions(),
  ]);

  if (!mediaResult.success) {
    throw new Error(mediaResult.message);
  }

  async function refreshMedia() {
    "use server";

    const result = await getMediaRecords();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data ?? [];
  }

  const canCreate = userPermissions.includes(permissions.mediaCreate);

  return (
    <MediaPageClient
      initialMedia={mediaResult.data ?? []}
      canCreate={canCreate}
      userPermissions={userPermissions}
      refreshMediaAction={refreshMedia}
      createAction={createMedia}
      updateAction={updateMedia}
      deleteAction={deleteMedia}
    />
  );
}