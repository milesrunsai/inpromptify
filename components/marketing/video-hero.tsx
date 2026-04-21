"use client";

import { useRef, useEffect } from "react";

export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let rafId: number;

    const updateOpacity = () => {
      if (!video.duration || video.paused) {
        rafId = requestAnimationFrame(updateOpacity);
        return;
      }

      const { currentTime, duration } = video;
      const fadeTime = 0.5;

      let opacity = 1;
      if (currentTime < fadeTime) {
        opacity = currentTime / fadeTime;
      } else if (currentTime > duration - fadeTime) {
        opacity = (duration - currentTime) / fadeTime;
      }

      container.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      rafId = requestAnimationFrame(updateOpacity);
    };

    const handleEnded = () => {
      container.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 100);
    };

    video.addEventListener("ended", handleEnded);
    rafId = requestAnimationFrame(updateOpacity);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0 }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_3CVjpU5MqL28kt1M6PyOAXhNcyX/hf_20260420_060720_7b600b45-de92-47e3-b11c-619fab9fc4c5.mp4"
          type="video/mp4"
        />
      </video>
      {/* Overlay to keep text readable */}
      <div className="absolute inset-0 bg-background/60" />
    </div>
  );
}
