"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  useCountUp hook                                                    */
/* ------------------------------------------------------------------ */

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const start = useCallback(() => {
    setStarted(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [start]);

  useEffect(() => {
    if (!started) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [started, end, duration]);

  return { count, ref };
}

/* ------------------------------------------------------------------ */
/*  Stat cards data                                                    */
/* ------------------------------------------------------------------ */

const statCards = [
  {
    title: "Enterprise Ready",
    description: "SOC 2 compliant with SSO, SCIM provisioning, and custom SLAs for organizations of any size.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Instant Results",
    description: "AI-powered grading delivers scores in under 2 seconds. No waiting, no manual review bottlenecks.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Developer First",
    description: "RESTful API, webhooks, and SDKs for Python, TypeScript, and Go. Integrate in minutes.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "99.9% Uptime",
    description: "Global edge infrastructure with automatic failover ensures your assessments are always available.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Main Stats Component                                               */
/* ------------------------------------------------------------------ */

export default function Stats() {
  const { count, ref: counterRef } = useCountUp(150000, 2500);

  return (
    <section className="relative py-24 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_3CVjpU5MqL28kt1M6PyOAXhNcyX/hf_20260418_085528_e32a0b1e-ca22-4247-9b28-22c4f7d5fed6.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-[#111118]/85" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="reveal text-center mb-16">
          <span className="section-label">[ By the Numbers ]</span>
          <div ref={counterRef} className="mt-6">
            <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tabular-nums">
              {count.toLocaleString()}+
            </span>
          </div>
          <p className="mt-4 text-lg text-gray-400">
            assessments completed and counting
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="reveal glass-strong rounded-2xl p-6 hover:border-white/[0.12] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-sm font-semibold text-white/90 mb-2">{card.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
