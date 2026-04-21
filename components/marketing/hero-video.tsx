"use client";

import { useRef, useEffect } from "react";

export function HeroVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure muted attribute is set at DOM level (required for mobile autoplay)
    video.muted = true;
    video.playsInline = true;

    // Attempt to play — mobile browsers may block even muted autoplay in some cases
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If autoplay fails, try again on first user interaction
        const tryPlay = () => {
          video.play().catch(() => {});
          document.removeEventListener("touchstart", tryPlay);
          document.removeEventListener("click", tryPlay);
          document.removeEventListener("scroll", tryPlay);
        };
        document.addEventListener("touchstart", tryPlay, { once: true });
        document.addEventListener("click", tryPlay, { once: true });
        document.addEventListener("scroll", tryPlay, { once: true });
      });
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
