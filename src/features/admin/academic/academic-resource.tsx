
import { Eye, Pencil, Trash2 } from "lucide-react";
import { createResource } from "@/components/resource/create-resource";
import { permissions } from "@/lib/auth/permissions";
import { AcademicCard } from "./academic-card";
import Image from "next/image";

export interface AcademicResourceItem {
  id: string;
  name: string;
  photo: string | null;
  link: string | null;
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

export const academicResource = createResource<AcademicResourceItem>({
  key: "academic",
  title: "Academic Resources",
  description: "Manage academic information and resources displayed on the school website.",

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
              {row.name.trim().charAt(0).toUpperCase() || "A"}
            </div>
          )}
          <span className="truncate text-sm font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      id: "link",
      header: "Link",
      accessor: "link",
      cell: ({ value }) => {
        const link = typeof value === "string" ? value : "";

        return link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="max-w-56 truncate text-sm text-[#7A1523] hover:underline"
          >
            {link}
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
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
          {formatDate(row.created_at)}
        </span>
      ),
    },
  ],

  search: {
    placeholder: "Search academic resources...",
    fields: ["name", "link"],
  },

  selectable: true,
  mobileCard: AcademicCard,

  actions: [
    {
      id: "view",
      label: "View",
      icon: Eye,
      permission: permissions.academicRead,
      onClick: (row) => {
        window.location.assign(
          `/academic/${encodeURIComponent(row.id)}`,
        );
      },
    },
    {
      id: "edit",
      label: "Edit",
      icon: Pencil,
      permission: permissions.academicUpdate,
      onClick: (row) => {
        window.dispatchEvent(
          new CustomEvent<AcademicResourceItem>("academic:edit", {
            detail: row,
          }),
        );
      },
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      permission: permissions.academicDelete,
      variant: "destructive",
      onClick: (row) => {
        window.dispatchEvent(
          new CustomEvent<AcademicResourceItem>("academic:delete", {
            detail: row,
          }),
        );
      },
    },
  ],

  empty: {
    title: "No academic resources found",
    description: "Add an academic resource to display it on the school website.",
  },
});
