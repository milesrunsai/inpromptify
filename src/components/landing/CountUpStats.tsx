"use client";
import { useState, useEffect, useRef } from "react";

function CountUpStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const numericMatch = value.match(/^([\d.]+)(.*)$/);
    if (!numericMatch) return;

    const target = parseFloat(numericMatch[1]);
    const suffix = numericMatch[2];
    const isFloat = value.includes(".");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setDisplay("0" + suffix);
          const start = performance.now();
          const duration = 2000;
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;
            setDisplay(
              (isFloat ? current.toFixed(1) : Math.round(current).toLocaleString()) + suffix
            );
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="reveal">
      <p className="text-3xl font-bold gradient-text">{display}</p>
      <p className="text-sm text-white/30 mt-1">{label}</p>
    </div>
  );
}

export default function CountUpStats() {
  return (
    <div className="mt-24 grid md:grid-cols-4 gap-8 text-center">
      <CountUpStat value="150K+" label="Assessments" />
      <CountUpStat value="40+" label="Countries" />
      <CountUpStat value="500+" label="Organizations" />
      <CountUpStat value="99.9%" label="Uptime" />
    </div>
  );
}
