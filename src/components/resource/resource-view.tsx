"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import type { RowData } from "@tanstack/react-table";

import { ResourceCards } from "./resource-cards";
import { ResourceEmpty } from "./resource-empty";
import { ResourceError } from "./resource-error";
import { ResourceFormModal } from "./resource-form-modal";
import { ResourceLoading } from "./resource-loading";
import { ResourcePagination } from "./resource-pagination";
import { ResourceTable } from "./resource-table";
import { ResourceToolbar } from "./resource-toolbar";

import type { ResourceViewProps } from "./types";

export function ResourceView<TData extends RowData>({
  resource,
  data,
  loading = false,
  error = null,
  pagination,
  selectedRows,
  onSelectionChange,
  userPermissions = [],
  onCreate,
  onEdit,
  toolbarActions,
  onRefresh,
}: ResourceViewProps<TData>) {
  const [search, setSearch] = useState("");

const [filterValues, setFilterValues] = useState<
    Record<string, string>
  >({});

const [internalSelectedRows, setInternalSelectedRows] =
    useState<TData[]>([]);

const [createModalOpen, setCreateModalOpen] = useState(false);

const [editRow, setEditRow] = useState<TData | null>(null);

const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(
    null,
  );

const refreshInProgress = useRef(false);

const effectiveSelectedRows =
    selectedRows ?? internalSelectedRows;

const filteredData = useMemo(() => {
    let result = [...data];

const query = search.trim().toLowerCase();

if (resource.search && query) {
      const fields =
        resource.search.fields ??
        resource.columns
          .filter((column) => column.searchable)
          .map((column) => column.accessor)
          .filter(
            (accessor): accessor is keyof TData =>
              accessor !== undefined,
          );

if (fields.length > 0) {
        result = result.filter((row) =>
          fields.some((field) => {
            const value = row[field];

return (
              value != null &&
              String(value).toLowerCase().includes(query)
            );
          }),
        );
      }
    }

for (const filter of resource.filters ?? []) {
      const value = filterValues[filter.id];

if (
        value === undefined ||
        value === "" ||
        value === "all"
      ) {
        continue;
      }

result = result.filter(
        (row) => String(row[filter.accessor]) === value,
      );
    }

return result;
  }, [data, filterValues, resource, search]);

const hasActiveFilters =
    (Boolean(resource.search) && search.trim().length > 0) ||
    (resource.filters ?? []).some((filter) => {
      const value = filterValues[filter.id];

return (
        value !== undefined &&
        value !== "" &&
        value !== "all"
      );
    });

const handleFilterChange = useCallback(
    (filterId: string, value: string) => {
      setFilterValues((current) => ({
        ...current,
        [filterId]: value,
      }));
    },
    [],
  );

const handleSelectionChange = useCallback(
    (rows: TData[]) => {
      if (selectedRows === undefined) {
        setInternalSelectedRows(rows);
      }

onSelectionChange?.(rows);
    },
    [selectedRows, onSelectionChange],
  );

const handleRefresh = useCallback(async () => {
    if (!onRefresh || refreshInProgress.current) {
      return;
    }

refreshInProgress.current = true;
    setRefreshing(true);
    setRefreshError(null);

try {
      await onRefresh();
    } catch {
      setRefreshError(
        "Unable to refresh the list. Please try again.",
      );
    } finally {
      refreshInProgress.current = false;
      setRefreshing(false);
    }
  }, [onRefresh]);

const handleCreate = useCallback(() => {
    if (onCreate) {
      onCreate();
      return;
    }

if (resource.create) {
      setCreateModalOpen(true);
    }
  }, [onCreate, resource.create]);

const handleEdit = useCallback(
    (row: TData) => {
      if (onEdit) {
        onEdit(row);
        return;
      }

if (resource.edit) {
        setEditRow(row);
      }
    },
    [onEdit, resource.edit],
  );

const handleEditModalChange = useCallback((open: boolean) => {
    if (!open) {
      setEditRow(null);
    }
  }, []);

const handleCreateSuccess = useCallback(() => {
    setCreateModalOpen(false);
    void handleRefresh();
  }, [handleRefresh]);

const handleEditSuccess = useCallback(() => {
    setEditRow(null);
    void handleRefresh();
  }, [handleRefresh]);

const loadingColumnCount =
    resource.columns.length +
    1 +
    (resource.selectable ? 1 : 0) +
    (resource.actions?.length ? 1 : 0);

const canCreate = Boolean(resource.create || onCreate);
  const canEdit = Boolean(resource.edit || onEdit);

return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {resource.title}
          </h1>

{resource.description ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {resource.description}
            </p>
          ) : null}
        </div>

<div
          aria-busy={loading || refreshing}
          className="overflow-hidden rounded-md border border-border/70 bg-background"
        >
          <ResourceToolbar
            resource={resource}
            search={search}
            onSearchChange={setSearch}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            actions={
              toolbarActions !== undefined
                ? toolbarActions
                : resource.toolbar?.actions
            }
            onCreate={canCreate ? handleCreate : undefined}
            onRefresh={onRefresh ? handleRefresh : undefined}
            refreshing={refreshing}
            refreshError={refreshError}
          />

{error ? (
            <div className="p-4">
              <ResourceError message={error} />
            </div>
          ) : loading ? (
            <div className="p-4">
              <ResourceLoading
                columns={Math.max(loadingColumnCount, 1)}
              />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-4">
              {hasActiveFilters ? (
                <div
                  role="status"
                  className="py-10 text-center"
                >
                  <h2 className="text-sm font-medium">
                    No matching results
                  </h2>

<p className="mt-1 text-sm text-muted-foreground">
                    Try another search or clear your filters.
                  </p>
                </div>
              ) : (
                <ResourceEmpty resource={resource} />
              )}
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <ResourceTable
                  key={resource.key}
                  resource={resource}
                  data={filteredData}
                  userPermissions={userPermissions}
                  selectedRows={effectiveSelectedRows}
                  onSelectionChange={handleSelectionChange}
                  onEdit={canEdit ? handleEdit : undefined}
                />
              </div>

<div className="md:hidden">
                <ResourceCards
                  resource={resource}
                  data={filteredData}
                  userPermissions={userPermissions}
                />
              </div>
            </>
          )}

{pagination && !loading && !error ? (
            <ResourcePagination pagination={pagination} />
          ) : null}
        </div>
      </div>

{resource.create ? (
        <ResourceFormModal
          resource={resource}
          mode="create"
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSuccess={handleCreateSuccess}
        />
      ) : null}

{resource.edit ? (
        <ResourceFormModal
          resource={resource}
          mode="edit"
          open={editRow !== null}
          row={editRow ?? undefined}
          onOpenChange={handleEditModalChange}
          onSuccess={handleEditSuccess}
        />
      ) : null}
    </>
  );
}
