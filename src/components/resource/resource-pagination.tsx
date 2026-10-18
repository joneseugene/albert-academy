"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ResourcePagination as ResourcePaginationConfig } from "./types";

interface ResourcePaginationProps {
  pagination: ResourcePaginationConfig;
}

export function ResourcePagination({
  pagination,
}: ResourcePaginationProps) {
  const totalPages = Math.max(
    1,
    Math.ceil(pagination.total / pagination.pageSize),
  );

  const canPrevious = pagination.page > 1;
  const canNext = pagination.page < totalPages;

  const start =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.pageSize + 1;

  const end = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total,
  );

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-medium text-foreground">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">
          {pagination.total}
        </span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={!canPrevious}
          onClick={() => {
            pagination.onPageChange?.(pagination.page - 1);
          }}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <span className="min-w-20 text-center text-xs text-muted-foreground">
          Page {pagination.page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={!canNext}
          onClick={() => {
            pagination.onPageChange?.(pagination.page + 1);
          }}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}