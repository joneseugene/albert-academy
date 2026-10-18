"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RefreshAlumniButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isPending}
      aria-label="Refresh alumni data"
      className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
    >
      <RefreshCw
        aria-hidden="true"
        className={`size-4 ${isPending ? "animate-spin" : ""}`}
      />
      {isPending ? "Refreshing..." : "Refresh results"}
    </button>
  );
}