"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface PeopleSearchProps {
  placeholder: string;
}

export function PeopleSearch({
  placeholder,
}: PeopleSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("query") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      const trimmed = query.trim();

      if (trimmed) {
        params.set("query", trimmed);
      } else {
        params.delete("query");
      }

      params.delete("page");

      const nextUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      if (nextUrl === `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`) {
        return;
      }

      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
      });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [pathname, query, router, searchParams]);

  function clearSearch() {
    setQuery("");

    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  return (
    <div
      className={[
        "relative flex min-h-14 items-center border bg-white transition-colors",
        isPending
          ? "border-primary/40"
          : "border-border focus-within:border-primary",
      ].join(" ")}
    >
      <Search className="ml-5 size-5 shrink-0 text-muted-foreground" />

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        type="search"
        aria-label={placeholder}
        className="h-14 min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
      />

      {query && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="mr-3 flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}