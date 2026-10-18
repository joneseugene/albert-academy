"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type SchoolSongPlayerProps = {
  audioSrc: string;
};

export function SchoolSongPlayer({ audioSrc }: SchoolSongPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio) return;

    setError(null);

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      if (audio.currentTime === 0 || audio.ended) {
        audio.currentTime = 8;
      }

      await audio.play();
    } catch {
      setIsPlaying(false);
      setError("Unable to play the school song. Please try again.");
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="none"
        loop={false}
        onPlay={() => {
          setIsPlaying(true);
          setError(null);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setError("The school song could not be loaded.");
        }}
      />

      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause school song" : "Play school song"}
        aria-pressed={isPlaying}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
      >
        {isPlaying ? (
          <Pause className="h-7 w-7 fill-current" />
        ) : (
          <Play className="ml-1 h-7 w-7 fill-current" />
        )}
      </button>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {error ?? (isPlaying ? "Playing school song…" : "Play school song")}
      </p>
    </div>
  );
}