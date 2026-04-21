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
    <section className="relative py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-orange-500/10 to-orange-500/5" />
      <div className="absolute inset-0 dot-pattern opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/daily"
          className="block group bg-white/[0.03] border border-orange-500/20 hover:border-orange-500/40 rounded-2xl p-6 sm:p-8 transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Pulse icon */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-xs tracking-[0.15em] uppercase text-orange-500 font-mono">
                  Daily AI Challenge
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-medium">
                  LIVE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                5 questions. 2 minutes. How do you rank?
              </h2>
              <p className="text-sm text-white/50 mt-1.5">
                New questions every day — compete against the global community
              </p>
            </div>

            <div className="flex items-center gap-6 flex-shrink-0">
              {stats.participants > 0 && (
                <div className="text-center hidden sm:block">
                  <div className="text-lg font-bold text-white">{stats.participants}</div>
                  <div className="text-xs text-white/40">played today</div>
                </div>
              )}
              {stats.topScore > 0 && (
                <div className="text-center hidden sm:block">
                  <div className="text-lg font-bold text-orange-400">{stats.topScore}/5</div>
                  <div className="text-xs text-white/40">top score</div>
                </div>
              )}
              <div className="glow-btn px-6 py-2.5 text-sm font-medium group-hover:scale-105 transition-transform">
                Play Now
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
