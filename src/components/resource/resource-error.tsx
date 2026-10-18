import { AlertCircle } from "lucide-react";

interface ResourceErrorProps {
  message?: string;
}

export function ResourceError({
  message = "Something went wrong while loading this resource.",
}: ResourceErrorProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
      <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-5 text-destructive" />
      </div>

      <h3 className="text-sm font-semibold">
        Unable to load data
      </h3>

      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}