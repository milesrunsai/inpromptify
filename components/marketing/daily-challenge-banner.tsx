"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function DailyChallengeBanner() {
  const [stats, setStats] = useState({ participants: 0, topScore: 0 });

  useEffect(() => {
    fetch("/api/daily/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.todayStats) setStats(data.todayStats);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link
          href="/daily"
          className="flex items-center justify-between gap-4 py-4 px-5 rounded-lg border border-white/[0.06] hover:border-white/[0.12] transition-colors group"
        >
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-orange-500 text-lg">⚡</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Daily AI Challenge
                {stats.participants > 0 && (
                  <span className="text-white/30 font-normal ml-2">
                    {stats.participants} played today
                    {stats.topScore > 0 && <> · top score {stats.topScore}/5</>}
                  </span>
                )}
              </p>
              <p className="text-xs text-white/40 mt-0.5">5 questions. New every day.</p>
            </div>
          </div>
          <span className="liquid-glass-btn px-4 py-2 rounded-lg text-sm font-medium text-white flex-shrink-0 group-hover:bg-white/[0.14] transition-all">
            Play
          </span>
        </Link>
      </div>
    </section>
  );
}
