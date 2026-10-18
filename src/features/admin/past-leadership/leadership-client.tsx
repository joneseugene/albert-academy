"use client";

import { useCallback, useEffect, useState } from "react";

import type { PermissionKey } from "@/lib/auth/permissions";

import type { PastLeadershipFormActions } from "./leadership-form";
import type { PastLeadershipResourceItem } from "./leadership-resource";
import { PastLeadershipResourceView } from "./leadership-view";

type DeletePastLeadershipAction = (
  id: string,
) => Promise<{ success: boolean; message: string }>;

interface PastLeadershipPageClientProps {
  initialPastLeadership: PastLeadershipResourceItem[];
  canCreate: boolean;
  userPermissions: PermissionKey[];
  refreshPastLeadershipAction: () => Promise<PastLeadershipResourceItem[]>;
  createAction: PastLeadershipFormActions["createAction"];
  updateAction: PastLeadershipFormActions["updateAction"];
  deleteAction: DeletePastLeadershipAction;
}

export function PastLeadershipPageClient({
  initialPastLeadership,
  canCreate,
  userPermissions,
  refreshPastLeadershipAction,
  createAction,
  updateAction,
  deleteAction,
}: PastLeadershipPageClientProps) {
  const [data, setData] = useState<PastLeadershipResourceItem[]>(
    initialPastLeadership,
  );
  const [selectedRows, setSelectedRows] = useState<
    PastLeadershipResourceItem[]
  >([]);

  useEffect(() => {
    setData(initialPastLeadership);
    setSelectedRows([]);
  }, [initialPastLeadership]);

  const handleRefresh = useCallback(async () => {
    const freshData = await refreshPastLeadershipAction();
    setData(freshData);
    setSelectedRows([]);
  }, [refreshPastLeadershipAction]);

  return (
    <PastLeadershipResourceView
      data={data}
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
      onRefresh={handleRefresh}
      canCreate={canCreate}
      userPermissions={userPermissions}
      createAction={createAction}
      updateAction={updateAction}
      deleteAction={deleteAction}
    />
  );
}