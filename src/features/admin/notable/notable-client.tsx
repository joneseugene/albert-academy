"use client";

import { useCallback, useEffect, useState } from "react";

import type { PermissionKey } from "@/lib/auth/permissions";

import type { NotableFormActions } from "./notable-form";
import { NotableResourceView } from "./notable-view";
import type { NotableResourceItem } from "./notable-resource";

type DeleteNotableAction = (
  id: string,
) => Promise<{ success: boolean; message: string }>;

interface NotablePageClientProps {
  initialNotable: NotableResourceItem[];
  canCreate: boolean;
  userPermissions: PermissionKey[];
  refreshNotableAction: () => Promise<NotableResourceItem[]>;
  createAction: NotableFormActions["createAction"];
  updateAction: NotableFormActions["updateAction"];
  deleteAction: DeleteNotableAction;
}

export function NotablePageClient({
  initialNotable,
  canCreate,
  userPermissions,
  refreshNotableAction,
  createAction,
  updateAction,
  deleteAction,
}: NotablePageClientProps) {
  const [data, setData] =
    useState<NotableResourceItem[]>(initialNotable);

  const [selectedRows, setSelectedRows] =
    useState<NotableResourceItem[]>([]);

  useEffect(() => {
    setData(initialNotable);
    setSelectedRows([]);
  }, [initialNotable]);

  const handleRefresh = useCallback(async () => {
    const freshData = await refreshNotableAction();

    setData(freshData);
    setSelectedRows([]);
  }, [refreshNotableAction]);

  return (
    <NotableResourceView
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
