import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import { MediaGallery } from "@/components/public/media/media-gallery";
import type { MediaGalleryItem } from "@/components/public/media/media-gallery";


type MediaSectionProps = {
  media: MediaGalleryItem[];
};

export function MediaSection({ media }: MediaSectionProps) {
  return (
    <section id="media" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
              From the Academy
            </p>

            <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
              Moments &amp; memories.
            </h2>
          </div>

          <Link
            href="/media"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            View all media
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {media.length > 0 ? (
          <div className="mt-10">
            <MediaGallery media={media} />
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center bg-muted/50 px-6 py-16 text-center">
            <Images
              aria-hidden="true"
              className="size-10 text-muted-foreground"
            />

            <p className="mt-4 font-medium">Memories coming soon</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Academy photos will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}