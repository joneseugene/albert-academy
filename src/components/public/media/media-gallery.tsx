
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Images, X } from "lucide-react";

export type MediaGalleryItem = {
  id: string;
  name: string;
  photoUrl: string | null;
};

type MediaGalleryProps = {
  media: MediaGalleryItem[];
};

export function MediaGallery({ media }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedMedia =
    selectedIndex === null ? null : media[selectedIndex] ?? null;

  useEffect(() => {
    if (selectedMedia === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? null : (current + 1) % media.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null
            ? null
            : (current - 1 + media.length) % media.length,
        );
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMedia, media.length]);

  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {media.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`View ${item.name}`}
            className="group min-w-0 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              {item.photoUrl ? (
                <Image
                  src={item.photoUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Images
                    className="size-10 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>

            <span className="mt-4 block text-base font-medium leading-6 text-foreground transition-colors group-hover:text-primary">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <button
            type="button"
            aria-label="Close image preview"
            onClick={() => setSelectedIndex(null)}
            className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-sm"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-label={selectedMedia.name}
            className="relative z-10 flex max-h-[90dvh] w-full max-w-5xl flex-col overflow-hidden bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <h2 className="min-w-0 text-base font-semibold leading-6 text-foreground sm:text-lg">
                {selectedMedia.name}
              </h2>

              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Close preview"
                autoFocus
                className="flex size-10 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex min-h-48 flex-1 items-center justify-center overflow-hidden bg-black">
              {selectedMedia.photoUrl ? (
                <div className="relative h-[65vh] max-h-[700px] w-full">
                  <Image
                    src={selectedMedia.photoUrl}
                    alt={selectedMedia.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-contain"
                    priority
                  />
                </div>
              ) : (
                <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-6 py-12 text-white/70">
                  <Images className="size-12" aria-hidden="true" />
                  <p>No photo available</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3 sm:px-6">
              <p className="text-sm text-muted-foreground">
                {selectedIndex! + 1} of {media.length}
              </p>

              {media.length > 1 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIndex(
                        (selectedIndex! - 1 + media.length) % media.length,
                      )
                    }
                    className="border border-border px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIndex((selectedIndex! + 1) % media.length)
                    }
                    className="border border-border px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
