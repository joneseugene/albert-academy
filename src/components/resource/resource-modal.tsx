"use client";

import { useId, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export interface ResourceModalProps {
open: boolean;
onOpenChange: (open: boolean) => void;

title: string;
description?: string;

/**

* Must match the id of the form inside the modal.
  */
  formId: string;

children: ReactNode;

submitLabel?: string;
submittingLabel?: string;
cancelLabel?: string;

/**

* Pass the form's actual submission state.
  */
  submitting?: boolean;

/**

* Disables submission without blocking cancellation.
  */
  submitDisabled?: boolean;

/**

* Optional form-level or server error.
  */
  error?: string | null;
  }

export function ResourceModal({
open,
onOpenChange,
title,
description,
formId,
children,
submitLabel = "Save",
submittingLabel = "Saving...",
cancelLabel = "Cancel",
submitting = false,
submitDisabled = false,
error = null,
}: ResourceModalProps) {
const titleId = useId();
const descriptionId = useId();

const handleOpenChange = (nextOpen: boolean) => {
if (!nextOpen && submitting) {
return;
}


onOpenChange(nextOpen);


};

return ( <Dialog
   open={open}
   onOpenChange={handleOpenChange}
 >
<DialogContent
showCloseButton={!submitting}
aria-labelledby={titleId}
aria-describedby={
description ? descriptionId : undefined
}
aria-busy={submitting}
className="flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg flex-col gap-0 overflow-hidden border border-border bg-background p-0 shadow-xl sm:max-w-lg"
>
{/* Header */} <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-5 pr-12 text-left"> <DialogTitle
         id={titleId}
         className="text-base font-semibold"
       >
{title} </DialogTitle>


      {description ? (
        <DialogDescription
          id={descriptionId}
          className="mt-1 text-sm"
        >
          {description}
        </DialogDescription>
      ) : null}
    </DialogHeader>

    {/* Body */}
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-7">
      {error ? (
        <div
          role="alert"
          className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      {children}
    </div>

    {/* Footer */}
    <DialogFooter className="shrink-0 gap-2 border-t border-border/60 bg-background px-6 py-4 mb-1">
      <Button
        type="button"
        variant="outline"
        disabled={submitting}
        onClick={() => handleOpenChange(false)}
      >
        {cancelLabel}
      </Button>

      <Button
        type="submit"
        form={formId}
        disabled={
          submitting || submitDisabled
        }
      >
        {submitting ? (
          <Loader2
            aria-hidden="true"
            className="size-4 animate-spin"
          />
        ) : null}

        <span>
          {submitting
            ? submittingLabel
            : submitLabel}
        </span>
      </Button>
    </DialogFooter>

    <span
      role="status"
      aria-live="polite"
      className="sr-only"
    >
      {submitting
        ? submittingLabel
        : ""}
    </span>
  </DialogContent>
</Dialog>


);
}
