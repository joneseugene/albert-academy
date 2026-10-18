
"use client";

import { Pause, Play, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Stanza {
  number: string;
  lines: string[];
}

interface SchoolSongLyricsProps {
  openingVerse: string[];
  chorus: string[];
  stanzas: Stanza[];
  audioSrc: string;
}

export function SchoolSongLyrics({
  openingVerse,
  chorus,
  stanzas,
  audioSrc,
}: SchoolSongLyricsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lyricsRef = useRef<HTMLElement | null>(null);

  const [showLyrics, setShowLyrics] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize the interface with the audio element.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleWaiting = () => {
      if (!audio.paused) setIsLoading(true);
    };

    const handleCanPlay = () => setIsLoading(false);

    const handleError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      console.error("The school song audio failed to load:", audio.error);
    };

    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  // Bring the lyrics into view when they are first displayed.
  useEffect(() => {
    if (!showLyrics) return;

    const frame = requestAnimationFrame(() => {
      lyricsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [showLyrics]);

  // Automatically scroll while the audio is playing.
  // Pausing playback cancels the animation until playback resumes.
  useEffect(() => {
    const audio = audioRef.current;
    const lyrics = lyricsRef.current;

    if (!audio || !lyrics || !showLyrics || !isPlaying) return;

    let animationFrame = 0;

    const scrollWithAudio = () => {
      if (
        !audio.paused &&
        !audio.ended &&
        Number.isFinite(audio.duration) &&
        audio.duration > 0
      ) {
        const progress = Math.min(
          Math.max(audio.currentTime / audio.duration, 0),
          1,
        );

        const sectionTop =
          lyrics.getBoundingClientRect().top + window.scrollY;

        const sectionBottom = sectionTop + lyrics.offsetHeight;
        const maxScroll = Math.max(
          0,
          sectionBottom - window.innerHeight,
        );

        const scrollDistance = Math.max(0, maxScroll - sectionTop);
        const scrollProgress = Math.min(progress * 1.2, 1);

        const targetScroll =
          sectionTop + scrollProgress * scrollDistance;

        window.scrollTo({
          top: Math.max(0, Math.min(targetScroll, maxScroll)),
          behavior: "instant",
        });
      }

      if (!audio.paused && !audio.ended) {
        animationFrame = requestAnimationFrame(scrollWithAudio);
      }
    };

    animationFrame = requestAnimationFrame(scrollWithAudio);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, showLyrics]);

  // Start playback and reveal the lyrics and floating controls.
  async function playSong() {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);

    try {
      if (audio.ended || audio.currentTime === 0) {
        audio.currentTime = 8;
      }

      await audio.play();
      setShowLyrics(true);
    } catch (error) {
      console.error("Unable to play the school song:", error);
      setIsPlaying(false);
      setIsLoading(false);
    } finally {
      if (audio.paused) {
        setIsLoading(false);
      }
    }
  }

  function pauseSong() {
    audioRef.current?.pause();
  }

  function stopSong() {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    setIsPlaying(false);
    setIsLoading(false);

    if (showLyrics) {
      requestAnimationFrame(() => {
        lyricsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }

  async function handleMainButton() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused && !audio.ended) {
      pauseSong();
      return;
    }

    await playSong();
  }

  function hideLyrics() {
    setShowLyrics(false);
  }

  return (
    <>
      <audio ref={audioRef} preload="metadata" src={audioSrc} />

      {/* Floating controls: visible after Play reveals the lyrics. */}
      {showLyrics && (
        <div
          role="region"
          aria-label="School song playback controls"
          className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-sm border border-white/20 bg-primary/45 px-4 py-3 text-white shadow-lg backdrop-blur-md sm:inset-x-6 sm:top-5 sm:px-6"
        >
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.16em]">
              Albert Academy
            </p>
            <p className="mt-1 text-xs text-white/75" aria-live="polite">
              {isLoading
                ? "Loading song..."
                : isPlaying
                  ? "Now playing"
                  : "Playback paused"}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleMainButton}
              disabled={isLoading}
              aria-label={isPlaying ? "Pause song" : "Play song"}
              aria-pressed={isPlaying}
              className="flex size-10 items-center justify-center border border-white/30 bg-white/15 text-white transition-colors hover:bg-white/25 disabled:cursor-wait disabled:opacity-60"
            >
              {isLoading ? (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              ) : isPlaying ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="ml-0.5 size-4 fill-current" />
              )}
            </button>

            <button
              type="button"
              onClick={stopSong}
              aria-label="Stop song"
              className="flex size-10 items-center justify-center border border-white/25 text-white/90 transition-colors hover:bg-white/15"
            >
              <Square className="size-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={hideLyrics}
              aria-label="Hide lyrics"
              className="flex size-10 items-center justify-center border border-white/25 text-white/90 transition-colors hover:bg-white/15"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main playback controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleMainButton}
          aria-label={
            isPlaying
              ? "Pause the Albert Academy school song"
              : "Play the Albert Academy school song"
          }
          aria-pressed={isPlaying}
          className="group inline-flex h-14 items-center gap-4 bg-white px-7 text-sm font-semibold text-primary transition-all hover:bg-white/90"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:scale-105">
            {isLoading ? (
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              />
            ) : isPlaying ? (
              <Pause className="size-4 fill-current" strokeWidth={2} />
            ) : (
              <Play className="ml-0.5 size-4 fill-current" strokeWidth={2} />
            )}
          </span>

          <span>
            {isLoading
              ? "Loading song..."
              : isPlaying
                ? "Pause song"
                : "Play song"}
          </span>
        </button>

        {(isPlaying || showLyrics) && (
          <button
            type="button"
            onClick={stopSong}
            aria-label="Stop the Albert Academy school song"
            className="inline-flex h-14 items-center gap-3 border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            <Square className="size-4 fill-current" strokeWidth={2} />
            <span>Stop</span>
          </button>
        )}

        {showLyrics && (
          <button
            type="button"
            onClick={hideLyrics}
            aria-expanded={showLyrics}
            aria-controls="school-song-lyrics"
            className="inline-flex h-14 items-center gap-3 border border-white/20 bg-transparent px-5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
          >
            <X className="size-4" />
            <span>Hide lyrics</span>
          </button>
        )}
      </div>

      {/* Lyrics */}
      <section
        ref={lyricsRef}
        id="school-song-lyrics"
        aria-hidden={!showLyrics}
        className={`relative overflow-hidden bg-primary text-white transition-all duration-700 ease-in-out ${
          showLyrics
            ? "max-h-[5000px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-white/10" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 sm:px-8 lg:py-32">
          {/* Song heading */}
          <div className="mb-20 text-center">
            <button
              type="button"
              onClick={handleMainButton}
              disabled={isLoading}
              aria-label={
                isPlaying
                  ? "Pause the Albert Academy school song"
                  : "Play the Albert Academy school song"
              }
              aria-pressed={isPlaying}
              className="group mx-auto mb-6 flex size-12 items-center justify-center border border-white/20 text-white transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-primary disabled:cursor-wait"
            >
              {isLoading ? (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                />
              ) : isPlaying ? (
                <Pause className="size-5 fill-current" aria-hidden="true" />
              ) : (
                <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
              )}
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
              Albert Academy
            </p>

            <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl lg:text-6xl">
              The School Song
            </h2>

            <p className="mt-5 text-sm text-white/50" aria-live="polite">
              {isLoading
                ? "Loading recording..."
                : isPlaying
                  ? "Now playing"
                  : "The recording is paused"}
            </p>
          </div>

          {/* Opening verse */}
          <div className="relative mx-auto max-w-3xl">
            <div className="border-b border-white/15 py-12">
              <div className="mb-8 flex items-center gap-5">
                <span className="font-display text-4xl text-white/25">♪</span>
                <div className="h-px w-12 bg-white/20" />
              </div>

              <div className="space-y-2 pl-1">
                {openingVerse.map((line, index) => (
                  <p
                    key={`${index}-${line}`}
                    className="font-display text-2xl leading-[1.55] text-white sm:text-3xl"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Opening chorus */}
            <div className="relative my-12 overflow-hidden border border-white/10 bg-white/[0.06] px-7 py-12 text-white sm:px-12 sm:py-14">
              <div className="absolute -right-16 -top-16 size-40 rounded-full border border-white/10" />

              <div className="relative">
                <div className="mb-8 flex items-center gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                    Chorus
                  </span>
                  <div className="h-px w-10 bg-white/20" />
                </div>

                <div className="space-y-2">
                  {chorus.map((line, index) => (
                    <p
                      key={`${index}-${line}`}
                      className="font-display text-2xl leading-[1.55] text-white sm:text-3xl"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Numbered stanzas */}
            {stanzas.map((stanza, index) => (
              <div
                key={stanza.number}
                className={[
                  "relative py-12",
                  index !== stanzas.length - 1
                    ? "border-b border-white/15"
                    : "",
                ].join(" ")}
              >
                <div className="mb-8 flex items-center gap-5">
                  <span className="font-display text-4xl text-white/25">
                    {stanza.number}
                  </span>
                  <div className="h-px w-12 bg-white/20" />
                </div>

                <div className="space-y-2 pl-1">
                  {stanza.lines.map((line, lineIndex) => (
                    <p
                      key={`${lineIndex}-${line}`}
                      className="font-display text-2xl leading-[1.55] text-white sm:text-3xl"
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Chorus after each stanza */}
                <div className="mt-12 border-l-2 border-white/20 pl-6 sm:pl-8">
                  <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
                    Chorus
                  </p>

                  <div className="space-y-1.5">
                    {chorus.map((line, lineIndex) => (
                      <p
                        key={`${lineIndex}-${line}`}
                        className="font-display text-xl leading-[1.55] text-white/80 sm:text-2xl"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
