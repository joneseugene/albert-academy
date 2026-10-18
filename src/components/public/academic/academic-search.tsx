
"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useState,
  useTransition,
} from "react";
import type { FormEvent } from "react";

type AcademicSearchProps = {
  initialSearch: string;
};

export function AcademicSearch({
  initialSearch,
}: AcademicSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialSearch);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = query.trim().slice(0, 100);
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    const queryString = params.toString();

    startTransition(() => {
      router.push(queryString ? `/academic-resources?${queryString}` : "/academic-resources");
    });
  }

  function handleClear() {
    setQuery("");

    startTransition(() => {
      router.push("/academic-resources");
    });
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="w-full sm:w-auto sm:min-w-[320px]"
    >
      <label
        htmlFor="academic-search"
        className="sr-only"
      >
        Search academic resources
      </label>

      <div className="flex h-11 items-center gap-2 border border-border bg-background px-3 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
        <Search
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />

        <input
          id="academic-search"
          type="search"
          name="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search resources..."
          maxLength={100}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="inline-flex size-7 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-8 shrink-0 items-center justify-center bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Searching…" : "Search"}
        </button>
      </div>
    </form>
  );
}
