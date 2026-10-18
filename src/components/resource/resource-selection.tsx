"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface ResourceSelectionProps<TData> {
  row: TData;
  selected: boolean;
  onChange: (selected: boolean) => void;
}

export function ResourceSelection<TData>({
  selected,
  onChange,
}: ResourceSelectionProps<TData>) {
  return (
    <Checkbox
      checked={selected}
      onCheckedChange={(value) => {
        onChange(value === true);
      }}
      aria-label="Select row"
    />
  );
}