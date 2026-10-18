export const dynamic = "force-dynamic";
import { PastLeadershipPageClient } from "@/features/admin/past-leadership/leadership-client";
import {
  createPastLeadership,
  deletePastLeadership,
  getPastLeadershipRecords,
  updatePastLeadership,
} from "@/lib/action/past.leadership.action";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";
import { permissions } from "@/lib/auth/permissions";

export default async function PastLeadershipPage() {
  const [leadershipResult, userPermissions] = await Promise.all([
    getPastLeadershipRecords(),
    getCurrentUserPermissions(),
  ]);

  if (!leadershipResult.success) {
    throw new Error(leadershipResult.message);
  }

  async function refreshPastLeadership() {
    "use server";

    const result = await getPastLeadershipRecords();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data ?? [];
  }

  const canCreate = userPermissions.includes(
    permissions.pastLeadershipCreate,
  );

  return (
    <PastLeadershipPageClient
      initialPastLeadership={leadershipResult.data ?? []}
      canCreate={canCreate}
      userPermissions={userPermissions}
      refreshPastLeadershipAction={refreshPastLeadership}
      createAction={createPastLeadership}
      updateAction={updatePastLeadership}
      deleteAction={deletePastLeadership}
    />
  );
}