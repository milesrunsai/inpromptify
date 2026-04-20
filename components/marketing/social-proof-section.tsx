"use client";

import { useEffect, useRef } from "react";

const brands = [
  { name: "Vortex", letter: "V" },
  { name: "Nimbus", letter: "N" },
  { name: "Prysma", letter: "P" },
  { name: "Cirrus", letter: "C" },
  { name: "Kynder", letter: "K" },
  { name: "Halcyn", letter: "H" },
];

// Double for seamless loop
const doubledBrands = [...brands, ...brands];

export function SocialProofSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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

      video.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      rafId = requestAnimationFrame(updateOpacity);
    };

    const handleEnded = () => {
      video.style.opacity = "0";
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
    <section className="relative w-full overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_3CVjpU5MqL28kt1M6PyOAXhNcyX/hf_20260420_060720_7b600b45-de92-47e3-b11c-619fab9fc4c5.mp4"
          type="video/mp4"
        />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-16 pb-24 px-4 gap-20">
        {/* Spacer for video visibility */}
        <div className="h-40" />

        {/* Logo Marquee */}
        <div className="max-w-5xl w-full overflow-hidden">
          <div className="flex items-center gap-12">
            {/* Left text */}
            <div className="text-foreground/50 text-sm whitespace-nowrap shrink-0">
              Relied on by brands
              <br />
              across the globe
            </div>

            {/* Scrolling logos */}
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
                {doubledBrands.map((brand, i) => (
                  <div
                    key={`${brand.name}-${i}`}
                    className="flex items-center gap-3 shrink-0"
                  >
                    <div className="liquid-glass w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold text-foreground">
                      {brand.letter}
                    </div>
                    <span className="text-base font-semibold text-foreground">
                      {brand.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
