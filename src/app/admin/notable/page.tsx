export const dynamic = "force-dynamic";
import { NotablePageClient } from "@/features/admin/notable/notable-client";
import {
  createNotable,
  deleteNotable,
  getNotableRecords,
  updateNotable,
} from "@/lib/action/notable.action";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";
import { permissions } from "@/lib/auth/permissions";

export default async function NotablePage() {
  const [notableResult, userPermissions] = await Promise.all([
    getNotableRecords(),
    getCurrentUserPermissions(),
  ]);

  if (!notableResult.success) {
    throw new Error(notableResult.message);
  }

  async function refreshNotable() {
    "use server";

    const result = await getNotableRecords();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data ?? [];
  }

  const canCreate = userPermissions.includes(permissions.alumniCreate);

  return (
    <NotablePageClient
      initialNotable={notableResult.data ?? []}
      canCreate={canCreate}
      userPermissions={userPermissions}
      refreshNotableAction={refreshNotable}
      createAction={createNotable}
      updateAction={updateNotable}
      deleteAction={deleteNotable}
    />
  );
}
