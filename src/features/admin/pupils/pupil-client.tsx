"use client";

import { useCallback, useEffect, useState } from "react";

import type { PermissionKey } from "@/lib/auth/permissions";

import type { PupilFormActions } from "./pupil-form";
import type { PupilResourceItem } from "./pupil-resource";
import { PupilResourceView } from "./pupil-view";

type DeletePupilAction = (
  id: string,
) => Promise<{ success: boolean; message: string }>;

interface PupilPageClientProps {
  initialPupils: PupilResourceItem[];
  canCreate: boolean;
  userPermissions: PermissionKey[];
  refreshPupilsAction: () => Promise<PupilResourceItem[]>;
  createAction: PupilFormActions["createAction"];
  updateAction: PupilFormActions["updateAction"];
  deleteAction: DeletePupilAction;
}

export function PupilPageClient({
  initialPupils,
  canCreate,
  userPermissions,
  refreshPupilsAction,
  createAction,
  updateAction,
  deleteAction,
}: PupilPageClientProps) {
  const [data, setData] = useState<PupilResourceItem[]>(initialPupils);
  const [selectedRows, setSelectedRows] = useState<PupilResourceItem[]>([]);

  useEffect(() => {
    setData(initialPupils);
    setSelectedRows([]);
  }, [initialPupils]);

  const handleRefresh = useCallback(async () => {
    const freshData = await refreshPupilsAction();
    setData(freshData);
    setSelectedRows([]);
  }, [refreshPupilsAction]);

  return (
    <PupilResourceView
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