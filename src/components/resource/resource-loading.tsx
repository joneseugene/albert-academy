import { Skeleton } from "@/components/ui/skeleton";

interface ResourceLoadingProps {
  columns?: number;
  rows?: number;
}

export function ResourceLoading({
  columns = 4,
  rows = 6,
}: ResourceLoadingProps) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="border-b bg-muted/30 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-24" />
          ))}
        </div>
      </div>

      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 p-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton
                key={columnIndex}
                className="h-5 w-full max-w-40"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}