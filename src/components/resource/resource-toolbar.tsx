"use client";

import { useId, useState, type ReactNode } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ResourceFilters } from "./resource-filters";
import type { ResourceDefinition } from "./types";

interface ResourceToolbarProps<TData> {
  resource: ResourceDefinition<TData>;

search: string;
  onSearchChange: (value: string) => void;

filterValues: Record<string, string>;
  onFilterChange: (filterId: string, value: string) => void;

actions?: ReactNode;
  onCreate?: () => void;

onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
  refreshError?: string | null;
}

export function ResourceToolbar<TData>({
  resource,
  search,
  onSearchChange,
  filterValues,
  onFilterChange,
  actions,
  onCreate,
  onRefresh,
  refreshing = false,
  refreshError = null,
}: ResourceToolbarProps<TData>) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const mobileFiltersId = useId();

const filters = resource.filters ?? [];

const hasSearch = Boolean(resource.search);
  const hasFilters = filters.length > 0;

const hasActiveFilters =
    (hasSearch && search.trim().length > 0) ||
    filters.some((filter) => {
      const value = filterValues[filter.id];

return (
        value !== undefined &&
        value !== "" &&
        value !== "all"
      );
    });

const clearFilters = () => {
    onSearchChange("");

for (const filter of filters) {
      onFilterChange(filter.id, "all");
    }
  };

return (
    <div className="border-b border-border/60 px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {hasSearch ? (
            <div className="relative w-full sm:max-w-sm">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />

<Input
                type="search"
                value={search}
                onChange={(event) =>
                  onSearchChange(event.target.value)
                }
                aria-label={`Search ${resource.title}`}
                placeholder={
                  resource.search?.placeholder ??
                  `Search ${resource.title.toLowerCase()}...`
                }
                className="h-9 pl-9"
              />
            </div>
          ) : null}

{hasFilters ? (
            <>
              <div className="hidden lg:block">
                <ResourceFilters
                  filters={filters}
                  values={filterValues}
                  onChange={onFilterChange}
                />
              </div>

<div className="lg:hidden">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9"
                  aria-expanded={mobileFiltersOpen}
                  aria-controls={mobileFiltersId}
                  onClick={() =>
                    setMobileFiltersOpen((open) => !open)
                  }
                >
                  <SlidersHorizontal
                    aria-hidden="true"
                    className="mr-2 size-4"
                  />
                  Filters
                </Button>

<div
                  id={mobileFiltersId}
                  hidden={!mobileFiltersOpen}
                  className="mt-2"
                >
                  <ResourceFilters
                    filters={filters}
                    values={filterValues}
                    onChange={onFilterChange}
                  />
                </div>
              </div>
            </>
          ) : null}

{hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9"
              onClick={clearFilters}
            >
              <X aria-hidden="true" className="mr-2 size-4" />
              Clear
            </Button>
          ) : null}
        </div>

<div className="flex shrink-0 flex-wrap items-center gap-2">
          {onRefresh ? (
            <Button
              type="button"
              variant="outline"
              disabled={refreshing}
              aria-busy={refreshing}
              onClick={() => {
                void onRefresh();
              }}
            >
              <RefreshCw
                aria-hidden="true"
                className={
                  refreshing
                    ? "size-4 animate-spin"
                    : "size-4"
                }
              />

<span>
                {refreshing ? "Refreshing..." : "Refresh"}
              </span>
            </Button>
          ) : null}

{onCreate ? (
            <Button type="button" onClick={onCreate}>
              <Plus aria-hidden="true" className="size-4" />
              <span>Create</span>
            </Button>
          ) : null}

{actions}
        </div>
      </div>

{refreshError ? (
        <p
          role="alert"
          className="mt-2 text-sm text-destructive"
        >
          {refreshError}
        </p>
      ) : null}
    </div>
  );
}
