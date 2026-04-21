"use client";
import { useState, useEffect, useRef } from "react";

function CountUpStat({ value, label, light }: { value: string; label: string; light?: boolean }) {
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
      <p className={`text-3xl font-bold ${light ? 'text-orange-500' : 'text-orange-500'}`}>{display}</p>
      <p className={`text-sm mt-1 ${light ? 'text-gray-500' : 'text-white/30'}`}>{label}</p>
    </div>
  );
}

export default function CountUpStats({ light }: { light?: boolean }) {
  return (
    <div className="mt-24 grid md:grid-cols-4 gap-8 text-center">
      <CountUpStat value="150K+" label="Assessments" light={light} />
      <CountUpStat value="40+" label="Countries" light={light} />
      <CountUpStat value="500+" label="Organizations" light={light} />
      <CountUpStat value="99.9%" label="Uptime" light={light} />
    </div>
  );
}
