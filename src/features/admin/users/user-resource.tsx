"use client";

import { Eye, Pencil, UserCheck, UserX } from "lucide-react";

import { createResource } from "@/components/resource/create-resource";
import { permissions } from "@/lib/auth/permissions";

import { UserCard } from "./user-card";

export interface UserResourceRole {
  id: string;
  name: string;
  description: string | null;
}

export interface UserResourceItem {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
  role: UserResourceRole | null;
}

export const userResource = createResource<UserResourceItem>({
  key: "users",

  title: "Users",

  description:
    "Manage administrators, staff and other users of the platform.",

  columns: [
    {
      id: "name",
      header: "User",
      accessor: "first_name",
      searchable: true,
      sortable: true,

      cell: ({ row }) => {
        const name = [
          row.first_name,
          row.last_name,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {name || "Unnamed user"}
            </p>
          </div>
        );
      },
    },

    {
      id: "email",
      header: "Email",
      accessor: "email",
      searchable: true,
      sortable: true,

      cell: ({ value }) => (
        <span className="text-sm text-muted-foreground">
          {value == null || value === ""
            ? "—"
            : String(value)}
        </span>
      ),
    },

    {
      id: "role",
      header: "Role",
      accessor: "role",
      sortable: true,

      cell: ({ row }) => {
        if (!row.role) {
          return (
            <span className="text-sm text-muted-foreground">
              No role
            </span>
          );
        }

        return (
          <span className="text-sm text-foreground">
            {formatRoleName(row.role.name)}
          </span>
        );
      },
    },

    {
      id: "status",
      header: "Status",
      accessor: "is_active",
      sortable: true,

      cell: ({ value }) => {
        const isActive = value === true;

        return (
          <span className="inline-flex items-center gap-2 text-sm">
            <span
              className={
                isActive
                  ? "size-1.5 rounded-full bg-emerald-500"
                  : "size-1.5 rounded-full bg-muted-foreground/40"
              }
            />

            <span
              className={
                isActive
                  ? "text-emerald-700"
                  : "text-muted-foreground"
              }
            >
              {isActive
                ? "Active"
                : "Inactive"}
            </span>
          </span>
        );
      },
    },

    {
      id: "created_at",
      header: "Created",
      accessor: "created_at",
      sortable: true,

      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
          }).format(new Date(row.created_at))}
        </span>
      ),
    },
  ],

  search: {
    placeholder:
      "Search users by name or email...",

    fields: [
      "first_name",
      "last_name",
      "email",
    ],
  },

  filters: [
    {
      id: "status",
      label: "Status",
      accessor: "is_active",

      options: [
        {
          label: "Active",
          value: "true",
        },
        {
          label: "Inactive",
          value: "false",
        },
      ],
    },
  ],

  selectable: true,

  mobileCard: UserCard,

  actions: [
    {
      id: "view",
      label: "View",
      icon: Eye,
      permission: permissions.usersRead,

      onClick: (row) => {
        window.location.href =
          `/users/${row.id}`;
      },
    },

    {
      id: "edit",
      label: "Edit",
      icon: Pencil,
      permission:
        permissions.profilesManage,

      onClick: (row) => {
        window.dispatchEvent(
          new CustomEvent(
            "user:edit",
            {
              detail: row,
            },
          ),
        );
      },
    },

    {
      id: "activate",
      label: "Activate",
      icon: UserCheck,
      permission:
        permissions.profilesManage,

      hidden: (row) =>
        row.is_active,

      onClick: async (row) => {
        await handleStatusChange(
          row.id,
          true,
        );
      },
    },

    {
      id: "deactivate",
      label: "Deactivate",
      icon: UserX,
      permission:
        permissions.profilesManage,

      variant: "destructive",

      hidden: (row) =>
        !row.is_active,

      onClick: async (row) => {
        await handleStatusChange(
          row.id,
          false,
        );
      },
    },
  ],

  empty: {
    title: "No users found",

    description:
      "Users will appear here once they have been created.",
  },

});

function formatRoleName(name: string) {
  return name
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

async function handleStatusChange(
  userId: string,
  isActive: boolean,
) {
  console.log(
    "Update user status:",
    userId,
    isActive,
  );
}

