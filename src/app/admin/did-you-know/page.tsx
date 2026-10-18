export const dynamic = "force-dynamic";
import { DidYouKnowPageClient } from "@/features/admin/did-you-know/dyk-client";
import {
  createDidYouKnow,
  deleteDidYouKnow,
  getDidYouKnowRecords,
  updateDidYouKnow,
} from "@/lib/action/did.you.know.action";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";
import { permissions } from "@/lib/auth/permissions";

export default async function DidYouKnowPage() {
  const [didYouKnowResult, userPermissions] = await Promise.all([
    getDidYouKnowRecords(),
    getCurrentUserPermissions(),
  ]);

  if (!didYouKnowResult.success) {
    throw new Error(didYouKnowResult.message);
  }

  async function refreshDidYouKnow() {
    "use server";

    const result = await getDidYouKnowRecords();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data ?? [];
  }

  const canCreate = userPermissions.includes(
    permissions.didYouKnowCreate,
  );

  return (
    <DidYouKnowPageClient
      initialDidYouKnow={didYouKnowResult.data ?? []}
      canCreate={canCreate}
      userPermissions={userPermissions}
      refreshDidYouKnowAction={refreshDidYouKnow}
      createAction={createDidYouKnow}
      updateAction={updateDidYouKnow}
      deleteAction={deleteDidYouKnow}
    />
  );
}
