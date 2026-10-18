"use client";

import {
  createCoreRowModel,
  createSortedRowModel,
  flexRender,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "cn";

import type { PermissionKey } from "@/lib/auth/permissions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ResourceActions } from "./resource-actions";
import { ResourceSelection } from "./resource-selection";
import type { ResourceDefinition } from "./types";

interface ResourceTableProps<TData extends RowData> {
  resource: ResourceDefinition<TData>;
  data: TData[];
  userPermissions: PermissionKey[];
  selectedRows: TData[];
  onSelectionChange: (rows: TData[]) => void;
  onEdit?: (row: TData) => void;
}

const features = tableFeatures({
  rowSortingFeature,
  coreRowModel: createCoreRowModel(),
  sortedRowModel: createSortedRowModel(),
});

export function ResourceTable<TData extends RowData>({
  resource,
  data,
  userPermissions,
  selectedRows,
  onSelectionChange,
  onEdit,
}: ResourceTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

const isSelected = useCallback(
    (row: TData) => selectedRows.includes(row),
    [selectedRows],
  );

const toggleSelection = useCallback(
    (row: TData, selected: boolean) => {
      const alreadySelected = selectedRows.includes(row);

if (selected === alreadySelected) {
        return;
      }

onSelectionChange(
        selected
          ? [...selectedRows, row]
          : selectedRows.filter((item) => item !== row),
      );
    },
    [selectedRows, onSelectionChange],
  );

const columnClasses = useMemo(
    () =>
      new Map(
        resource.columns.map((column) => [
          column.id,
          column.className,
        ] as const),
      ),
    [resource.columns],
  );

const columns = useMemo<ColumnDef<typeof features, TData>[]>(
    () => {
      const result: ColumnDef<typeof features, TData>[] = [
        {
          id: "rowNumber",
          header: "#",
          enableSorting: false,
        },
      ];

if (resource.selectable) {
        result.push({
          id: "selection",
          header: "",
          enableSorting: false,
          cell: ({ row }) => (
            <ResourceSelection
              row={row.original}
              selected={isSelected(row.original)}
              onChange={(selected) =>
                toggleSelection(row.original, selected)
              }
            />
          ),
        });
      }

for (const resourceColumn of resource.columns) {
        const accessor = resourceColumn.accessor;

result.push({
          id: resourceColumn.id,

accessorFn:
            accessor !== undefined
              ? (row: TData) => row[accessor]
              : undefined,

enableSorting:
            Boolean(resourceColumn.sortable) &&
            accessor !== undefined,

header: ({ column: tableColumn }) => {
            if (!tableColumn.getCanSort()) {
              return (
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
                  {resourceColumn.header}
                </span>
              );
            }

const sorted = tableColumn.getIsSorted();

return (
              <button
                type="button"
                className="group inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Sort by ${resourceColumn.header}`}
                onClick={() => tableColumn.toggleSorting()}
              >
                {resourceColumn.header}

{sorted === "asc" ? (
                  <ArrowUp
                    aria-hidden="true"
                    className="size-3 text-foreground"
                  />
                ) : sorted === "desc" ? (
                  <ArrowDown
                    aria-hidden="true"
                    className="size-3 text-foreground"
                  />
                ) : (
                  <ArrowUpDown
                    aria-hidden="true"
                    className="size-3 opacity-30 transition-opacity group-hover:opacity-70"
                  />
                )}
              </button>
            );
          },

cell: ({ row }) => {
            const value =
              accessor !== undefined
                ? row.original[accessor]
                : undefined;

if (resourceColumn.cell) {
              const Cell = resourceColumn.cell;

return <Cell value={value} row={row.original} />;
            }

return value == null ? (
              <span className="text-muted-foreground/40">—</span>
            ) : (
              String(value)
            );
          },
        });
      }

if (resource.actions?.length) {
        result.push({
          id: "actions",
          header: "",
          enableSorting: false,
          cell: ({ row }) => (
            <div className="flex justify-end">
              <ResourceActions
                row={row.original}
                actions={resource.actions ?? []}
                userPermissions={userPermissions}
                onEdit={onEdit}
              />
            </div>
          ),
        });
      }

return result;
    },
    [
      resource,
      isSelected,
      toggleSelection,
      userPermissions,
      onEdit,
    ],
  );

const table = useTable({
    key: `${resource.key}-table`,
    features,
    columns,
    data,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

return (
    <Table className="w-full border-0">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="border-0 bg-muted/[0.035] hover:bg-muted/[0.035]"
          >
            {headerGroup.headers.map((header) => {
              const sorted = header.column.getIsSorted();

return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  aria-sort={
                    header.isPlaceholder ||
                    !header.column.getCanSort()
                      ? undefined
                      : sorted === "asc"
                        ? "ascending"
                        : sorted === "desc"
                          ? "descending"
                          : "none"
                  }
                  className={cn(
                    "h-10 border-0 px-5 py-0 align-middle",
                    columnClasses.get(header.column.id),
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>

<TableBody>
        {table.getRowModel().rows.map((row, displayIndex) => (
          <TableRow
            key={row.id}
            data-state={
              resource.selectable && isSelected(row.original)
                ? "selected"
                : undefined
            }
            className="group border-0 bg-background transition-colors duration-150 hover:bg-muted/[0.035] data-[state=selected]:bg-muted/[0.06]"
          >
            {row.getAllCells().map((cell) => (
              <TableCell
                key={cell.id}
                className={cn(
                  "border-0 px-5 py-[15px] align-middle",
                  columnClasses.get(cell.column.id),
                )}
              >
                {cell.column.id === "rowNumber" ? (
                  <span className="text-xs tabular-nums text-muted-foreground/60">
                    {displayIndex + 1}
                  </span>
                ) : (
                  flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
