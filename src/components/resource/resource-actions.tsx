"use client";

import { MoreHorizontal } from "lucide-react";

import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ResourceAction } from "./types";

interface ResourceActionsProps<TData> {
row: TData;
actions: ResourceAction<TData>[];
userPermissions: string[];
onEdit?: (row: TData) => void;
}

export function ResourceActions<TData>({
row,
actions,
userPermissions,
onEdit,
}: ResourceActionsProps<TData>) {
const visibleActions = actions.filter(
(action) => {
if (action.hidden?.(row)) {
return false;
}


  if (
    action.permission &&
    !userPermissions.includes(
      action.permission,
    )
  ) {
    return false;
  }

  return true;
},


);

if (visibleActions.length === 0) {
return null;
}

return ( <DropdownMenu> <DropdownMenuTrigger
     type="button"
     aria-label="Open actions"
     className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
   > <MoreHorizontal className="size-4" /> </DropdownMenuTrigger>


  <DropdownMenuContent
    align="end"
    className="w-44"
  >
    {visibleActions.map(
      (action, index) => {
        const Icon = action.icon;

        return (
          <div key={action.id}>
            {action.variant ===
              "destructive" &&
            index > 0 ? (
              <DropdownMenuSeparator />
            ) : null}

            <DropdownMenuItem
              className={
                action.variant ===
                "destructive"
                  ? "text-destructive focus:text-destructive"
                  : undefined
              }
              onClick={() => {
                if (action.modal === "edit") {
                  onEdit?.(row);
                  return;
                }

                if (action.onClick) {
                  void action.onClick(row);
                }
              }}
            >
              {Icon ? (
                <Icon className="mr-2 size-4" />
              ) : null}

              {action.label}
            </DropdownMenuItem>
          </div>
        );
      },
    )}
  </DropdownMenuContent>
</DropdownMenu>


);
}
