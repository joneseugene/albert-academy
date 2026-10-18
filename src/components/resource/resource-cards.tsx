"use client";

import { ResourceActions } from "./resource-actions";
import type { ResourceDefinition } from "./types";

interface ResourceCardsProps<TData> {
  resource: ResourceDefinition<TData>;
  data: TData[];
  userPermissions: string[];
}

export function ResourceCards<TData>({
  resource,
  data,
  userPermissions,
}: ResourceCardsProps<TData>) {
  const Card = resource.mobileCard;

  const actions = (resource.actions ?? []).filter(
    (action) => {
      if (!action.permission) {
        return true;
      }

      return userPermissions.includes(action.permission);
    },
  );

  return (
    <div className="space-y-3 md:hidden">
      {data.map((row, index) => (
        <div
          key={index}
          className="relative rounded-xl border bg-background p-4"
        >
          <Card
            row={row}
            actions={actions}
          />

          {actions.length > 0 ? (
            <div className="absolute right-3 top-3">
              <ResourceActions
                row={row}
                actions={actions}
                userPermissions={userPermissions}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}