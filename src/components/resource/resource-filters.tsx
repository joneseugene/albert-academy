"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ResourceFilter } from "./types";

interface ResourceFiltersProps<TData> {
  filters: ResourceFilter<TData>[];
  values: Record<string, string>;
  onChange: (filterId: string, value: string) => void;
}

export function ResourceFilters<TData>({
  filters,
  values,
  onChange,
}: ResourceFiltersProps<TData>) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Select
          key={filter.id}
          value={values[filter.id] ?? "all"}
          onValueChange={(value) => {
            onChange(filter.id, value ?? "all");
          }}
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All {filter.label}
            </SelectItem>

            {filter.options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}