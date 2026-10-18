import type { Database } from "@/types/database.types";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { createResource } from "@/components/resource/create-resource";
import { permissions } from "@/lib/auth/permissions";
import { DidYouKnowCard } from "./dyk-card";
import Image from "next/image";

export type DidYouKnowResourceItem =
  Database["public"]["Tables"]["did_you_know"]["Row"];

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(date);
}

export const didYouKnowResource =
  createResource<DidYouKnowResourceItem>({
    key: "did_you_know",
    title: "Did You Know?",
    description:
      "Manage interesting facts about Albert Academy displayed on the school website.",

    columns: [
      {
        id: "title",
        header: "Title",
        accessor: "title",
        searchable: true,
        sortable: true,
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-3">
            {row.image ? (
              <Image
                src={row.image}
                alt={row.image_alt || `${row.title} thumbnail`}
                loading="lazy"
                className="size-10 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#7A1523]/10 font-semibold text-[#7A1523]">
                {row.title.trim().charAt(0).toUpperCase() || "D"}
              </div>
            )}

            <span className="truncate text-sm font-medium">
              {row.title}
            </span>
          </div>
        ),
      },
      {
        id: "category",
        header: "Category",
        accessor: "category",
        searchable: true,
        sortable: true,
        cell: ({ value }) => (
          <span className="text-sm capitalize">
            {typeof value === "string" && value.trim()
              ? value
              : "—"}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessor: "status",
        sortable: true,
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              row.status === "published"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {row.status === "published" ? "Published" : "Draft"}
          </span>
        ),
      },
      {
        id: "display_order",
        header: "Display Order",
        accessor: "display_order",
        sortable: true,
        cell: ({ row }) => (
          <span className="text-sm tabular-nums text-muted-foreground">
            {row.display_order}
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
      placeholder: "Search facts...",
      fields: ["title", "description", "category"],
    },

    selectable: true,
    mobileCard: DidYouKnowCard,

    actions: [
      {
        id: "view",
        label: "View",
        icon: Eye,
        permission: permissions.didYouKnowRead,
        onClick: (row) => {
          window.location.assign(
            `/admin/did-you-know/${encodeURIComponent(row.id)}`,
          );
        },
      },
      {
        id: "edit",
        label: "Edit",
        icon: Pencil,
        permission: permissions.didYouKnowUpdate,
        onClick: (row) => {
          window.dispatchEvent(
            new CustomEvent<DidYouKnowResourceItem>(
              "did-you-know:edit",
              { detail: row },
            ),
          );
        },
      },
      {
        id: "delete",
        label: "Delete",
        icon: Trash2,
        permission: permissions.didYouKnowDelete,
        variant: "destructive",
        onClick: (row) => {
          window.dispatchEvent(
            new CustomEvent<DidYouKnowResourceItem>(
              "did-you-know:delete",
              { detail: row },
            ),
          );
        },
      },
    ],

    empty: {
      title: "No facts found",
      description:
        "Add a fact about Albert Academy to display it on the school website.",
    },
  });