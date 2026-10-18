import { Inbox } from "lucide-react";

import type { ResourceDefinition } from "./types";

interface ResourceEmptyProps<TData> {
  resource: ResourceDefinition<TData>;
}

export function ResourceEmpty<TData>({
  resource,
}: ResourceEmptyProps<TData>) {
  const Icon = resource.empty?.icon ?? Inbox;

  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>

      <h3 className="text-sm font-semibold">
        {resource.empty?.title ?? `No ${resource.title.toLowerCase()} found`}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {resource.empty?.description ??
          `There are currently no ${resource.title.toLowerCase()} to display.`}
      </p>
    </div>
  );
}