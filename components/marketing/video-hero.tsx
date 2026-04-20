"use client";

import { useRef, useState, useEffect } from "react";

export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const { currentTime, duration } = video;
      if (!duration) return;

      const fadeWindow = 0.8;
      let o = 1;

      if (currentTime < fadeWindow) {
        o = currentTime / fadeWindow;
      } else if (currentTime > duration - fadeWindow) {
        o = (duration - currentTime) / fadeWindow;
      }

      setOpacity(Math.max(0, Math.min(1, o)));
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return (
    <div
      className="absolute inset-0 -z-10 pointer-events-none"
      style={{ opacity }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover mix-blend-screen"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_3CVjpU5MqL28kt1M6PyOAXhNcyX/hf_20260420_033355_d2d70c02-2cf9-437b-8cd0-e210a60ba6c9.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
