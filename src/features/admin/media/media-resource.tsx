
import { Eye, Pencil, Trash2 } from "lucide-react";

import { createResource } from "@/components/resource/create-resource";
import { permissions } from "@/lib/auth/permissions";
import { MediaCard } from "./media-card";
import Image from "next/image";

export interface MediaResourceItem {
  id: string;
  name: string;
  photo: string | null;
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

export const mediaResource = createResource<MediaResourceItem>({
  key: "media",
  title: "Media Gallery",
  description: "Manage photos and other media displayed on the school website.",

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
              alt={`${row.name} thumbnail`}
              loading="lazy"
              className="size-10 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#7A1523]/10 font-semibold text-[#7A1523]">
              {row.name.trim().charAt(0).toUpperCase() || "M"}
            </div>
          )}
          <span className="truncate text-sm font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      id: "photo",
      header: "Photo",
      accessor: "photo",
      cell: ({ value }) => (
        <span className="text-sm text-muted-foreground">
          {typeof value === "string" && value ? "Uploaded" : "No photo"}
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
    placeholder: "Search media...",
    fields: ["name"],
  },

  selectable: true,
  mobileCard: MediaCard,

  actions: [
    {
      id: "view",
      label: "View",
      icon: Eye,
      permission: permissions.mediaRead,
      onClick: (row) => {
        window.location.assign(
          `/media/${encodeURIComponent(row.id)}`,
        );
      },
    },
    {
      id: "edit",
      label: "Edit",
      icon: Pencil,
      permission: permissions.mediaUpdate,
      onClick: (row) => {
        window.dispatchEvent(
          new CustomEvent<MediaResourceItem>("media:edit", {
            detail: row,
          }),
        );
      },
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      permission: permissions.mediaDelete,
      variant: "destructive",
      onClick: (row) => {
        window.dispatchEvent(
          new CustomEvent<MediaResourceItem>("media:delete", {
            detail: row,
          }),
        );
      },
    },
  ],

  empty: {
    title: "No media found",
    description: "Add media to build the school's photo gallery.",
  },
});
