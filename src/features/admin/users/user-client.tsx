"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { PermissionKey } from "@/lib/auth/permissions";
import { permissions } from "@/lib/auth/permissions";

import type { UserResourceItem } from "./user-resource";
import { UsersResourceView } from "./user-view";
import type { UserRoleOption } from "./user-form";

interface UsersPageClientProps {
  initialUsers: UserResourceItem[];
  roles: UserRoleOption[];
  userPermissions: PermissionKey[];
  refreshUsersAction: () => Promise<UserResourceItem[]>;
}

export function UsersPageClient({
  initialUsers,
  roles,
  userPermissions,
  refreshUsersAction,
}: UsersPageClientProps) {
  const [users, setUsers] =
    useState<UserResourceItem[]>(initialUsers);

  const [selectedRows, setSelectedRows] =
    useState<UserResourceItem[]>([]);

  // Synchronize when navigation or a server refresh
  // supplies a new initial dataset.
  useEffect(() => {
    setUsers(initialUsers);
    setSelectedRows([]);
  }, [initialUsers]);

  const handleRefresh = useCallback(async () => {
    // Let errors propagate to the existing refresh controls.
    const freshUsers = await refreshUsersAction();

    setUsers(freshUsers);

    // Selection currently uses object references.
    // Clear it when those objects are replaced.
    setSelectedRows([]);
  }, [refreshUsersAction]);

  // Uses the existing user-management permission.
  // Replace this if creation has a separate permission.
  const canCreateUser = userPermissions.includes(
    permissions.profilesManage,
  );

  return (
    <UsersResourceView
      data={users}
      roles={roles}
      userPermissions={userPermissions}
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
      canCreateUser={canCreateUser}
      onRefresh={handleRefresh}
    />
  );
}