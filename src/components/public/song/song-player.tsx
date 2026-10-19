"use client";

import { useRef, useState } from "react";
import { Pause, Play, LoaderCircle } from "lucide-react";

type SchoolSongPlayerProps = {
  audioSrc: string;
};

const START_TIME = 8;
const MAX_RETRIES = 2;
const LOAD_TIMEOUT_MS = 15000;

export function SchoolSongPlayer({ audioSrc }: SchoolSongPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const retryCountRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldPlayRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearLoadTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  async function startPlayback(audio: HTMLAudioElement) {
    clearLoadTimeout();
    setError(null);
    setIsLoading(true);
    shouldPlayRef.current = true;

    timeoutRef.current = setTimeout(() => {
      if (!shouldPlayRef.current) return;

      setIsLoading(false);
      setError("The song is taking too long to load. Please try again.");
    }, LOAD_TIMEOUT_MS);

    try {
      if (audio.readyState === HTMLMediaElement.HAVE_NOTHING) {
        audio.load();
      }

      if (audio.currentTime === 0 || audio.ended) {
        audio.currentTime = START_TIME;
      }

      await audio.play();

      clearLoadTimeout();
      retryCountRef.current = 0;
      setIsLoading(false);
      setError(null);
    } catch {
      clearLoadTimeout();
      setIsLoading(false);
      setIsPlaying(false);

      if (
        shouldPlayRef.current &&
        retryCountRef.current < MAX_RETRIES
      ) {
        retryCountRef.current += 1;

        // Retry the request without requiring a page reload.
        window.setTimeout(() => {
          const currentAudio = audioRef.current;

          if (currentAudio && shouldPlayRef.current) {
            currentAudio.load();
            void startPlayback(currentAudio);
          }
        }, 1000 * retryCountRef.current);

        setError("Connection interrupted. Retrying…");
        return;
      }

      shouldPlayRef.current = false;
      setError("Unable to play the school song. Please try again.");
    }
  }

  function togglePlayback() {
    const audio = audioRef.current;

    if (!audio) return;

    if (!audio.paused) {
      shouldPlayRef.current = false;
      clearLoadTimeout();
      audio.pause();
      setIsLoading(false);
      return;
    }

    retryCountRef.current = 0;
    void startPlayback(audio);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="none"
        loop={false}
        onPlaying={() => {
          clearLoadTimeout();
          setIsPlaying(true);
          setIsLoading(false);
          setError(null);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onEnded={() => {
          shouldPlayRef.current = false;
          clearLoadTimeout();
          setIsPlaying(false);
          setIsLoading(false);
        }}
        onCanPlay={() => {
          if (shouldPlayRef.current) {
            setIsLoading(false);
          }
        }}
        onError={() => {
          setIsPlaying(false);

          if (shouldPlayRef.current) {
            setError("Unable to load the song. Please try again.");
          }
        }}
      />

      <button
        type="button"
        onClick={togglePlayback}
        disabled={isLoading && !isPlaying}
        aria-label={
          isLoading
            ? "Loading school song"
            : isPlaying
              ? "Pause school song"
              : "Play school song"
        }
        aria-pressed={isPlaying}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 disabled:cursor-wait disabled:opacity-80"
      >
        {isLoading ? (
          <LoaderCircle className="h-7 w-7 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-7 w-7 fill-current" />
        ) : (
          <Play className="ml-1 h-7 w-7 fill-current" />
        )}
      </button>

      <p
        className="text-center text-sm text-muted-foreground"
        aria-live="polite"
      >
        {error ??
          (isLoading
            ? "Loading school song…"
            : isPlaying
              ? "Playing school song…"
              : "Play school song")}
      </p>
    </div>
  );
}