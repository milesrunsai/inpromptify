"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  role: string;
  date: string;
  dimensions: Record<string, number>;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 65) return "text-orange-400";
  if (score >= 45) return "text-yellow-400";
  return "text-red-400";
}

function getScoreLabel(score: number): string {
  if (score >= 97) return "Grandmaster";
  if (score >= 92) return "Master";
  if (score >= 85) return "Expert";
  if (score >= 75) return "Advanced";
  if (score >= 65) return "Proficient";
  if (score >= 45) return "Intermediate";
  if (score >= 25) return "Developing";
  return "Beginner";
}

function getRankBadge(rank: number): string {
  if (rank === 1) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  if (rank === 2) return "bg-gray-400/20 text-gray-300 border-gray-400/30";
  if (rank === 3) return "bg-orange-700/20 text-orange-400 border-orange-700/30";
  return "bg-white/[0.04] text-white/40 border-white/[0.08]";
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"all" | "month" | "week">("all");

  useEffect(() => {
    fetch(`/api/leaderboard?range=${timeRange}`)
      .then((r) => r.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [timeRange]);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-orange-500 font-mono mb-4">[ Leaderboard ]</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2 text-white">
            Top <span className="gradient-text">PromptScores</span>
          </h1>
          <p className="text-lg text-white/60 mt-4 max-w-xl mx-auto">
            See how you rank against others. Public assessment scores
            are displayed anonymously by default.
          </p>
        </div>

        {/* Time range filter */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["all", "month", "week"] as const).map((range) => (
            <button
              key={range}
              onClick={() => { setTimeRange(range); setLoading(true); }}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                timeRange === range
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-white/40 hover:text-white/60 border border-transparent"
              }`}
            >
              {range === "all" ? "All Time" : range === "month" ? "This Month" : "This Week"}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Assessments", value: entries.length || "—" },
            { label: "Average Score", value: entries.length ? Math.round(entries.reduce((a, b) => a + b.score, 0) / entries.length) : "—" },
            { label: "Top Score", value: entries.length ? entries[0]?.score : "—" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs sm:text-sm text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Leaderboard table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-12 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              No public scores yet
            </h3>
            <p className="text-sm text-white/60 mb-6">
              Be the first to take the assessment and claim the top spot.
            </p>
            <Link
              href="/assess"
              className="glow-btn px-8 py-3 text-sm font-medium inline-block"
            >
              Take the Assessment
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header row — hidden on mobile */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 text-xs text-white/40 uppercase tracking-wider">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">User</div>
              <div className="col-span-2">Score</div>
              <div className="col-span-2">Level</div>
              <div className="col-span-3">Date</div>
            </div>

            {entries.map((entry) => (
              <div
                key={`${entry.rank}-${entry.name}`}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl hover:border-orange-500/10 transition-all"
              >
                {/* Desktop: grid row */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-4 items-center">
                  <div className="col-span-1">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold ${getRankBadge(entry.rank)}`}>
                      {entry.rank}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <span className="text-sm font-medium text-white">{entry.name}</span>
                    <span className="block text-xs text-white/40">{entry.role}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`text-lg font-bold tabular-nums ${getScoreColor(entry.score)}`}>
                      {entry.score}
                    </span>
                    <span className="text-xs text-white/40"> / 100</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-white/50">{getScoreLabel(entry.score)}</span>
                  </div>
                  <div className="col-span-3">
                    <span className="text-xs text-white/40">{entry.date}</span>
                  </div>
                </div>
                {/* Mobile: card layout */}
                <div className="sm:hidden flex items-center gap-3 px-4 py-4">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold flex-shrink-0 ${getRankBadge(entry.rank)}`}>
                    {entry.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white truncate">{entry.name}</span>
                      <span className={`text-lg font-bold tabular-nums flex-shrink-0 ml-2 ${getScoreColor(entry.score)}`}>
                        {entry.score}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-white/40">{entry.role}</span>
                      <span className="text-xs text-white/50">{getScoreLabel(entry.score)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Your position CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-white">Where do you rank?</h2>
            <p className="text-sm text-white/60 mt-2">
              Take the free assessment and see your position on the global leaderboard.
            </p>
            <div className="mt-4">
              <Link
                href="/assess"
                className="glow-btn px-8 py-3 text-sm font-medium inline-block"
              >
                Take the Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
