import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PeoplePaginationProps {
  currentPage: number;
  totalPages: number;
  query?: string;
}

function createPageUrl(page: number, query?: string) {
  const params = new URLSearchParams();

  if (query) {
    params.set("query", query);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();

  return search ? `?${search}` : "";
}

function getVisiblePages(
  currentPage: number,
  totalPages: number,
): Array<number | "..."> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export function PeoplePagination({
  currentPage,
  totalPages,
  query,
}: PeoplePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-border pt-7 sm:flex-row"
    >
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1, query)}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground/40">
          <ArrowLeft className="size-4" />
          Previous
        </span>
      )}

      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex size-9 items-center justify-center text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={createPageUrl(page, query)}
              aria-current={page === currentPage ? "page" : undefined}
              className={[
                "flex size-9 items-center justify-center text-sm transition-colors",
                page === currentPage
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              {page}
            </Link>
          ),
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1, query)}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          Next
          <ArrowRight className="size-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground/40">
          Next
          <ArrowRight className="size-4" />
        </span>
      )}
    </nav>
  );
}