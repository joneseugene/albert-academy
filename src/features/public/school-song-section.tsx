import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SchoolSongPlayer } from "@/components/public/song/song-player";

export function SchoolSongSection() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex justify-center">
            <div className="relative flex size-60 items-center justify-center rounded-full border border-primary/20 sm:size-72">
              <div className="absolute inset-5 rounded-full border border-primary/10" />
              <SchoolSongPlayer audioSrc="/audio/albert-academy-school-song.mp3" />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Our School Song</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              A voice shared across generations.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              Discover the Albert Academy school song, its lyrics and the traditions that connect generations of pupils and alumni.
            </p>
            <Link href="/school-song" className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary">
              Explore the school song
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
