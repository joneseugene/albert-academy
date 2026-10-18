import { Eye, Pencil, Trash2 } from "lucide-react";

import { createResource } from "@/components/resource/create-resource";
import { permissions } from "@/lib/auth/permissions";
import { NotableCard } from "./notable-card";
import Image from "next/image";

export interface NotableResourceItem {
  id: string;
  name: string;
  photo: string | null;
  title: string | null;
  description: string | null;
  detail: string | null;
  created_at: string;
  updated_at: string;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(date);
}

export const notableResource = createResource<NotableResourceItem>({
  key: "notable",
  title: "Notable People",
  description: "Manage notable alumni and other distinguished members of the school community.",

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
            <div
              aria-label={`No photo available for ${row.name}`}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#7A1523]/10 font-semibold text-[#7A1523]"
            >
              {row.name.trim().charAt(0).toUpperCase() || "N"}
            </div>
          )}

          <span className="truncate text-sm font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      id: "title",
      header: "Title",
      accessor: "title",
      searchable: true,
      sortable: true,
      cell: ({ value }) => {
        const title = typeof value === "string" ? value : "";

        return <span className="text-sm text-muted-foreground">{title || "—"}</span>;
      },
    },
    {
      id: "created_at",
      header: "Created",
      accessor: "created_at",
      sortable: true,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.created_at)}</span>
      ),
    },
  ],

  search: {
    placeholder: "Search notable people...",
    fields: ["name", "title", "description", "detail"],
  },

  selectable: true,
  mobileCard: NotableCard,

  actions: [
    {
      id: "view",
      label: "View",
      icon: Eye,
      permission: permissions.alumniRead,
      onClick: (row) => {
        window.location.assign(`/notable/${encodeURIComponent(row.id)}`);
      },
    },
    {
      id: "edit",
      label: "Edit",
      icon: Pencil,
      permission: permissions.alumniUpdate,
      onClick: (row) => {
        window.dispatchEvent(
          new CustomEvent<NotableResourceItem>("notable:edit", {
            detail: row,
          }),
        );
      },
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      permission: permissions.alumniDelete,
      variant: "destructive",
      onClick: (row) => {
        window.dispatchEvent(
          new CustomEvent<NotableResourceItem>("notable:delete", {
            detail: row,
          }),
        );
      },
    },
  ],

  empty: {
    title: "No notable people found",
    description: "Add a notable person to display them on the school website.",
  },
});
