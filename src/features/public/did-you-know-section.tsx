"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Lightbulb,
  LoaderCircle,
  Shuffle,
} from "lucide-react";
import type { DidYouKnow } from "@/lib/repositories/did_you_know.repository";
import { getRandomPublishedDidYouKnow } from "@/lib/action/did.you.know.action";

interface DidYouKnowSectionProps {
  facts: DidYouKnow[];
}

export function DidYouKnowSection({
  facts,
}: DidYouKnowSectionProps) {
  const [fact, setFact] = useState<DidYouKnow | null>(
    facts[0] ?? null,
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const imageAvailable = Boolean(fact?.image?.trim());

  function handleAnotherFact() {
    if (isPending) return;

    setError(null);

    startTransition(async () => {
      try {
        const nextFact = await getRandomPublishedDidYouKnow();

        if (!nextFact) {
          setError("No published facts are available right now.");
          return;
        }

        setFact(nextFact);
      } catch {
        setError(
          "We couldn't load another fact. Please try again.",
        );
      }
    });
  }

  return (
    <section
      aria-labelledby="did-you-know-heading"
      className="relative isolate overflow-hidden border-y border-primary/10 bg-[#F8F0F1]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 -z-10 size-80 rounded-full bg-primary/[0.06] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 -z-10 size-72 rounded-full bg-primary/[0.05] blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm shadow-primary/15">
              <Lightbulb
                className="size-[19px]"
                strokeWidth={1.8}
              />
            </span>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                A little school knowledge
              </p>

              <h2
                id="did-you-know-heading"
                className="mt-1 font-display text-2xl tracking-tight text-foreground sm:text-3xl"
              >
                Did you know?
              </h2>
            </div>
          </div>

          <Link
            href="/did-you-know"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
          >
            Explore all facts
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {fact ? (
          <div
            aria-busy={isPending}
            className={`grid items-center gap-9 transition-opacity duration-200 ${
              imageAvailable
                ? "lg:grid-cols-[1fr_0.82fr] lg:gap-16"
                : "max-w-4xl"
            } ${isPending ? "opacity-60" : "opacity-100"}`}
          >
            <div className="relative py-1 sm:pl-5">
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 top-0 hidden w-[3px] rounded-full bg-primary/70 sm:block"
              />

              {fact.category && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {fact.category}
                </p>
              )}

              <h3
                aria-live="polite"
                aria-atomic="true"
                className="mt-4 font-display text-3xl leading-[1.14] tracking-tight text-foreground sm:text-4xl lg:text-5xl"
              >
                {fact.title}
              </h3>

              <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                {fact.description}
              </p>

              {error && (
                <p
                  role="status"
                  className="mt-4 text-sm text-primary"
                >
                  {error}
                </p>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleAnotherFact}
                  disabled={isPending}
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F0F1] disabled:cursor-wait disabled:opacity-70"
                >
                  {isPending ? (
                    <LoaderCircle
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Shuffle
                      className="size-4"
                      aria-hidden="true"
                    />
                  )}

                  {isPending ? "Discovering..." : "Another fact"}
                </button>

                <Link
                  href="/did-you-know"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-primary/20 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Browse library
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            {imageAvailable && fact.image && (
              <div className="relative aspect-[5/4] w-full overflow-hidden rounded-sm bg-primary/5">
                <Image
                  src={fact.image}
                  alt={fact.image_alt?.trim() || fact.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-primary/10"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl py-6">
            <p className="text-sm leading-7 text-muted-foreground">
              Discover the history, traditions, people, and heritage
              of Albert Academy.
            </p>

            {error && (
              <p role="status" className="mt-3 text-sm text-primary">
                {error}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAnotherFact}
                disabled={isPending}
                className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-70"
              >
                {isPending ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Shuffle className="size-4" />
                )}
                {isPending ? "Loading..." : "Discover a fact"}
              </button>

              <Link
                href="/did-you-know"
                className="inline-flex min-h-11 items-center gap-2 px-3 py-3 text-sm font-semibold text-primary hover:underline"
              >
                Explore all facts
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
