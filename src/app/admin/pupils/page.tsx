export const dynamic = "force-dynamic";
import { PupilPageClient } from "@/features/admin/pupils/pupil-client";
import {
  createPupil,
  deletePupil,
  getPupilRecords,
  updatePupil,
} from "@/lib/action/pupil.action";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";
import { permissions } from "@/lib/auth/permissions";

export default async function PupilPage() {
  const [pupilResult, userPermissions] = await Promise.all([
    getPupilRecords(),
    getCurrentUserPermissions(),
  ]);

  if (!pupilResult.success) {
    throw new Error(pupilResult.message);
  }

  async function refreshPupils() {
    "use server";

    const result = await getPupilRecords();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data ?? [];
  }

  const canCreate = userPermissions.includes(permissions.studentsCreate);

  return (
    <PupilPageClient
      initialPupils={pupilResult.data ?? []}
      canCreate={canCreate}
      userPermissions={userPermissions}
      refreshPupilsAction={refreshPupils}
      createAction={createPupil}
      updateAction={updatePupil}
      deleteAction={deletePupil}
    />
  );
}