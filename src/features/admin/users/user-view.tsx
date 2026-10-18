"use client";

import { ResourceView } from "@/components/resource/resource-view";
import type { ResourceViewProps } from "@/components/resource/types";

import {
  userResource,
  type UserResourceItem,
} from "./user-resource";

import {
  AddUserButton,
} from "./user-add-button";

import type {
  UserRoleOption,
} from "./user-form";

export type UsersResourceViewProps = Omit<
  ResourceViewProps<UserResourceItem>,
  "resource" | "toolbarActions" | "onCreate" | "onRefresh"
> & {
  /**
   * Fetch fresh users and update the data source.
   */
  onRefresh: () => void | Promise<void>;

  /**
   * Available roles that can be assigned to users.
   */
  roles: UserRoleOption[];

  /**
   * The parent should determine creation authorization
   * using the application's actual permission policy.
   */
  canCreateUser: boolean;
};

export function UsersResourceView({
  onRefresh,
  roles,
  canCreateUser,
  ...props
}: UsersResourceViewProps) {
  return (
    <ResourceView<UserResourceItem>
      {...props}
      resource={userResource}
      onRefresh={onRefresh}
      toolbarActions={
        <>
          {userResource.toolbar?.actions}

          {canCreateUser ? (
            <AddUserButton
              roles={roles}
              onCreated={onRefresh}
            />
          ) : null}
        </>
      }
    />
  );
}