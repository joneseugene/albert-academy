
import { Eye, Pencil, Trash2 } from "lucide-react";
import { createResource } from "@/components/resource/create-resource";
import { permissions } from "@/lib/auth/permissions";
import { PastLeadershipCard } from "./leadership-card";
import Image from "next/image";

export interface PastLeadershipResourceItem {
  id: string;
  name: string;
  photo: string | null;
  role: string;
  level: string | null;
  start_year: number | null;
  end_year: number | null;
  about: string | null;
  created_at: string;
  updated_at: string;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(date);
}

export const pastLeadershipResource =
  createResource<PastLeadershipResourceItem>({
    key: "past-leadership",
    title: "Leadership",
    description: "Manage records of former school leaders and their service.",

    columns: [
      {
        id: "name",
        header: "Name",
        accessor: "name",
        searchable: true,
        sortable: true,
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-3">
            {row.photo ? (
              <Image
                src={row.photo}
                alt={`${row.name}'s portrait`}
                loading="lazy"
                className="size-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#7A1523]/10 font-semibold text-[#7A1523]">
                {row.name.trim().charAt(0).toUpperCase() || "P"}
              </div>
            )}
            <span className="truncate text-sm font-medium">{row.name}</span>
          </div>
        ),
      },
      {
        id: "role",
        header: "Role",
        accessor: "role",
        searchable: true,
        sortable: true,
        cell: ({ value }) => (
          <span className="text-sm text-muted-foreground">
            {typeof value === "string" && value ? value : "—"}
          </span>
        ),
      },
      {
        id: "start_year",
        header: "Start year",
        accessor: "start_year",
        sortable: true,
        cell: ({ value }) => (
          <span className="text-sm text-muted-foreground">
            {typeof value === "number" ? value : "—"}
          </span>
        ),
      },
      {
        id: "end_year",
        header: "End year",
        accessor: "end_year",
        sortable: true,
        cell: ({ value }) => (
          <span className="text-sm text-muted-foreground">
            {typeof value === "number" ? value : "—"}
          </span>
        ),
      },
      {
        id: "created_at",
        header: "Created",
        accessor: "created_at",
        sortable: true,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.created_at)}
          </span>
        ),
      },
    ],

    search: {
      placeholder: "Search past leaders...",
      fields: ["name", "role", "level", "about"],
    },

    selectable: true,
    mobileCard: PastLeadershipCard,

    actions: [
      {
        id: "view",
        label: "View",
        icon: Eye,
        permission: permissions.pastLeadershipRead,
        onClick: (row) => {
          window.location.assign(
            `/past-leadership/${encodeURIComponent(row.id)}`,
          );
        },
      },
      {
        id: "edit",
        label: "Edit",
        icon: Pencil,
        permission: permissions.pastLeadershipUpdate,
        onClick: (row) => {
          window.dispatchEvent(
            new CustomEvent<PastLeadershipResourceItem>(
              "past-leadership:edit",
              { detail: row },
            ),
          );
        },
      },
      {
        id: "delete",
        label: "Delete",
        icon: Trash2,
        permission: permissions.pastLeadershipDelete,
        variant: "destructive",
        onClick: (row) => {
          window.dispatchEvent(
            new CustomEvent<PastLeadershipResourceItem>(
              "past-leadership:delete",
              { detail: row },
            ),
          );
        },
      },
    ],

    empty: {
      title: "No past leaders found",
      description: "Add a former school leader to preserve their history.",
    },
  });
