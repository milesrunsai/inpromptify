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
  return "bg-gray-100 text-gray-400 border-gray-200";
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
    <div className="min-h-screen pt-24 pb-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-orange-500 font-mono mb-4">[ Leaderboard ]</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2 text-gray-900">
            Top <span className="gradient-text">PromptScores</span>
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-xl mx-auto">
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
                  : "text-gray-400 hover:text-gray-600 border border-transparent"
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
            <div key={stat.label} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Leaderboard table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-100 border border-gray-100 rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No public scores yet
            </h3>
            <p className="text-sm text-gray-600 mb-6">
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
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-400 uppercase tracking-wider">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">User</div>
              <div className="col-span-2">Score</div>
              <div className="col-span-2">Level</div>
              <div className="col-span-3">Date</div>
            </div>

            {entries.map((entry) => (
              <div
                key={`${entry.rank}-${entry.name}`}
                className="bg-gray-50 border border-gray-100 rounded-xl grid grid-cols-12 gap-4 px-4 py-4 items-center hover:border-orange-500/10 transition-all"
              >
                <div className="col-span-1">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold ${getRankBadge(entry.rank)}`}>
                    {entry.rank}
                  </span>
                </div>
                <div className="col-span-4">
                  <span className="text-sm font-medium text-gray-900">{entry.name}</span>
                  <span className="block text-xs text-gray-400">{entry.role}</span>
                </div>
                <div className="col-span-2">
                  <span className={`text-lg font-bold tabular-nums ${getScoreColor(entry.score)}`}>
                    {entry.score}
                  </span>
                  <span className="text-xs text-gray-400"> / 100</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500">{getScoreLabel(entry.score)}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-xs text-gray-400">{entry.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Your position CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-gray-900">Where do you rank?</h2>
            <p className="text-sm text-gray-600 mt-2">
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
