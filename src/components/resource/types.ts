import type { ComponentType, ReactNode } from "react";

import type { PermissionKey } from "@/lib/auth/permissions";

/* =========================================================
   RESOURCE COLUMN
========================================================= */

export interface ResourceColumn<TData> {
  id: string;
  header: string;
  accessor?: keyof TData;

cell?: ComponentType<{
    value: unknown;
    row: TData;
  }>;

sortable?: boolean;
  searchable?: boolean;
  className?: string;
}

/* =========================================================
   RESOURCE ACTION
========================================================= */

export interface ResourceAction<TData> {
  id: string;
  label: string;

icon?: ComponentType<{
    className?: string;
  }>;

permission?: PermissionKey;

variant?:
    | "default"
    | "destructive"
    | "outline"
    | "ghost";

/**
   * Requests a generic resource form modal.
   * ResourceActions must implement this behavior.
   */
  modal?: ResourceFormMode;

/**
   * Executes a custom action.
   */
  onClick?: (row: TData) => void | Promise<void>;

hidden?: (row: TData) => boolean;
}

/* =========================================================
   RESOURCE FILTER
========================================================= */

export interface ResourceFilterOption {
  label: string;
  value: string;
}

export interface ResourceFilter<TData> {
  id: string;
  label: string;
  accessor: keyof TData;
  options: ResourceFilterOption[];
}

/* =========================================================
   RESOURCE SEARCH
========================================================= */

export interface ResourceSearchConfig<TData> {
  placeholder?: string;
  fields?: Array<keyof TData>;
}

/* =========================================================
   RESOURCE PAGINATION
========================================================= */

export interface ResourcePagination {
  page: number;
  pageSize: number;
  total: number;

onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

/* =========================================================
   RESOURCE FORM
========================================================= */

export type ResourceFormMode = "create" | "edit";

export interface ResourceFormProps<TData> {
  mode: ResourceFormMode;

/**
   * Existing record when editing.
   * Undefined when creating.
   */
  row?: TData;

/**
   * Call only after the create/update operation succeeds.
   */
  onSuccess: (data?: TData) => void;

onCancel: () => void;
}

export interface ResourceFormConfig<TData> {
  component: ComponentType<ResourceFormProps<TData>>;
  title?: string;
  description?: string;
  submitLabel?: string;
}

/* =========================================================
   RESOURCE DEFINITION
========================================================= */

export interface ResourceDefinition<TData> {
  key: string;
  title: string;
  description?: string;

columns: ResourceColumn<TData>[];

search?: ResourceSearchConfig<TData>;
  filters?: ResourceFilter<TData>[];

mobileCard: ComponentType<{
    row: TData;
    actions: ResourceAction<TData>[];
  }>;

actions?: ResourceAction<TData>[];

empty?: {
    title?: string;
    description?: string;

icon?: ComponentType<{
      className?: string;
    }>;
  };

toolbar?: {
    actions?: ReactNode;
  };

selectable?: boolean;

create?: ResourceFormConfig<TData>;
  edit?: ResourceFormConfig<TData>;
}

/* =========================================================
   RESOURCE VIEW
========================================================= */

export interface ResourceViewProps<TData> {
  resource: ResourceDefinition<TData>;
  data: TData[];

loading?: boolean;
  error?: string | null;

pagination?: ResourcePagination;

selectedRows?: TData[];
  onSelectionChange?: (rows: TData[]) => void;

userPermissions?: PermissionKey[];

/**
   * Overrides the generic create-modal behavior.
   */
  onCreate?: () => void;

/**
   * Overrides the generic edit-modal behavior.
   */
  onEdit?: (row: TData) => void;

/**
   * Overrides resource.toolbar.actions when provided.
   * Pass null to explicitly hide configured actions.
   */
  toolbarActions?: ReactNode;

/**
   * Fetch fresh records and update the data source.
   * Return the fetch promise so refresh feedback remains accurate.
   */
  onRefresh?: () => void | Promise<void>;
}
