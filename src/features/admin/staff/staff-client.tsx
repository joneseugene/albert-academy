"use client";

import { useCallback, useEffect, useState } from "react";

import type { PermissionKey } from "@/lib/auth/permissions";

import type { StaffFormActions } from "./staff-form";
import type { StaffResourceItem } from "./staff-resource";
import { StaffResourceView } from "./staff-view";

type DeleteStaffAction = (
  id: string,
) => Promise<{ success: boolean; message: string }>;

interface StaffPageClientProps {
  initialStaff: StaffResourceItem[];
  canCreate: boolean;
  userPermissions: PermissionKey[];
  refreshStaffAction: () => Promise<StaffResourceItem[]>;
  createAction: StaffFormActions["createAction"];
  updateAction: StaffFormActions["updateAction"];
  deleteAction: DeleteStaffAction;
}

export function StaffPageClient({
  initialStaff,
  canCreate,
  userPermissions,
  refreshStaffAction,
  createAction,
  updateAction,
  deleteAction,
}: StaffPageClientProps) {
  const [data, setData] = useState<StaffResourceItem[]>(initialStaff);
  const [selectedRows, setSelectedRows] = useState<StaffResourceItem[]>([]);

  useEffect(() => {
    setData(initialStaff);
    setSelectedRows([]);
  }, [initialStaff]);

  const handleRefresh = useCallback(async () => {
    const freshData = await refreshStaffAction();
    setData(freshData);
    setSelectedRows([]);
  }, [refreshStaffAction]);

  return (
    <StaffResourceView
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