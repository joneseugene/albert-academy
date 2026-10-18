"use client";

import {
  Eye,
  KeyRound,
  Pencil,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  permissions,
} from "@/lib/auth/permissions";
import { createResource } from "@/components/resource/create-resource";
import { RoleCard } from "./role-card";


export interface RoleResourceItem {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  permission_count: number;
}

export const roleResource =
  createResource<RoleResourceItem>({
    key: "roles",

    title: "Roles",

    description:
      "Manage system roles and their assigned permissions.",

    columns: [
      {
        id: "name",
        header: "Role",
        accessor: "name",
        searchable: true,
        sortable: true,

        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#7A1523]/10 text-[#7A1523]">
              <KeyRound className="size-4" />
            </div>

            <div>
              <p className="font-medium">
                {formatRoleName(row.name)}
              </p>

              <p className="text-xs text-muted-foreground">
                {row.name}
              </p>
            </div>
          </div>
        ),
      },

      {
        id: "description",
        header: "Description",
        accessor: "description",
        searchable: true,

        cell: ({ row }) => (
          <span className="line-clamp-2 max-w-md text-sm text-muted-foreground">
            {row.description ??
              "No description provided."}
          </span>
        ),
      },

      {
        id: "permissions",
        header: "Permissions",
        accessor: "permission_count",
        sortable: true,

        cell: ({ row }) => (
          <Badge variant="secondary">
            {row.permission_count}{" "}
            {row.permission_count === 1
              ? "permission"
              : "permissions"}
          </Badge>
        ),
      },

      {
        id: "created_at",
        header: "Created",
        accessor: "created_at",
        sortable: true,

        cell: ({ row }) =>
          new Intl.DateTimeFormat(
            "en-US",
            {
              dateStyle: "medium",
            },
          ).format(
            new Date(row.created_at),
          ),
      },
    ],

    search: {
      placeholder:
        "Search roles...",

      fields: [
        "name",
        "description",
      ],
    },

    mobileCard: RoleCard,

    actions: [
      {
        id: "view",
        label: "View",
        icon: Eye,
        permission:
          permissions.rolesRead,

        onClick: (row) => {
          window.location.href =
            `/roles/${row.id}`;
        },
      },

      {
        id: "permissions",
        label: "Manage permissions",
        icon: KeyRound,
        permission:
          permissions.rolePermissionsManage,

        onClick: (row) => {
          window.location.href =
            `/roles/${row.id}/permissions`;
        },
      },

      {
        id: "edit",
        label: "Edit",
        icon: Pencil,
        permission:
          permissions.rolesManage,

        onClick: (row) => {
          window.location.href =
            `/roles/${row.id}/edit`;
        },
      },
    ],

    empty: {
      title: "No roles found",

      description:
        "System roles will appear here once they have been created.",
    },

    toolbar: {
      actions: (
        <Button
          onClick={() => {
            window.location.href =
              "/roles/new";
          }}
        >
          Add role
        </Button>
      ),
    },
  });

function formatRoleName(
  name: string,
) {
  return name
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

