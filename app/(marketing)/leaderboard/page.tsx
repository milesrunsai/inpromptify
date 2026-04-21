"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  date: string;
  role?: string;
  streak?: number;
  totalQuestions?: number;
  bestScore?: number;
  days?: number;
  dimensions?: Record<string, number>;
}

type Tab = "daily" | "weekly" | "alltime";

function getScoreColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "text-green-400";
  if (pct >= 60) return "text-orange-400";
  if (pct >= 40) return "text-yellow-400";
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
  const [tab, setTab] = useState<Tab>("daily");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?tab=${tab}`)
      .then((r) => r.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [tab]);

  const isDaily = tab === "daily";
  const isWeekly = tab === "weekly";
  const maxScore = isDaily ? 5 : isWeekly ? 35 : 100;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-orange-500 font-mono mb-4">
            [ Leaderboard ]
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2 text-white">
            Top <span className="gradient-text">Scores</span>
          </h1>
          <p className="text-lg text-white/60 mt-4 max-w-xl mx-auto">
            Compete daily, build your streak, and climb the ranks.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {([
            { id: "daily" as Tab, label: "Daily" },
            { id: "weekly" as Tab, label: "Weekly" },
            { id: "alltime" as Tab, label: "All Time" },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-white/40 hover:text-white/60 border border-transparent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: isDaily ? "Players Today" : isWeekly ? "Players This Week" : "Total Assessments",
              value: entries.length || "—",
            },
            {
              label: "Average Score",
              value: entries.length
                ? isDaily || isWeekly
                  ? `${(entries.reduce((a, b) => a + b.score, 0) / entries.length).toFixed(1)}/${isDaily ? 5 : ""}`
                  : Math.round(entries.reduce((a, b) => a + b.score, 0) / entries.length)
                : "—",
            },
            {
              label: "Top Score",
              value: entries.length
                ? isDaily
                  ? `${entries[0]?.score}/5`
                  : entries[0]?.score
                : "—",
            },
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
              {isDaily ? "No one has played today yet" : "No scores yet"}
            </h3>
            <p className="text-sm text-white/60 mb-6">
              {isDaily
                ? "Be the first to take today's Daily Challenge!"
                : "Be the first to take the assessment and claim the top spot."}
            </p>
            <Link
              href={isDaily || isWeekly ? "/daily" : "/assess"}
              className="glow-btn px-8 py-3 text-sm font-medium inline-block"
            >
              {isDaily || isWeekly ? "Take Daily Challenge" : "Take the Assessment"}
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header row */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 text-xs text-white/40 uppercase tracking-wider">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">User</div>
              <div className="col-span-2">Score</div>
              <div className="col-span-2">{isDaily ? "Time" : isWeekly ? "Days" : "Level"}</div>
              <div className="col-span-3">{isDaily ? "Submitted" : isWeekly ? "Streak" : "Date"}</div>
            </div>

            {entries.map((entry) => (
              <div
                key={`${entry.rank}-${entry.name}`}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl hover:border-orange-500/10 transition-all"
              >
                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-4 items-center">
                  <div className="col-span-1">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold ${getRankBadge(entry.rank)}`}>
                      {entry.rank}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <span className="text-sm font-medium text-white">{entry.name}</span>
                    {!isDaily && !isWeekly && entry.role && (
                      <span className="block text-xs text-white/40">{entry.role}</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    {isDaily ? (
                      <span className={`text-lg font-bold tabular-nums ${getScoreColor(entry.score, 5)}`}>
                        {entry.score}<span className="text-xs text-white/40">/5</span>
                      </span>
                    ) : isWeekly ? (
                      <span className={`text-lg font-bold tabular-nums ${getScoreColor(entry.score, 35)}`}>
                        {entry.score}
                      </span>
                    ) : (
                      <>
                        <span className={`text-lg font-bold tabular-nums ${getScoreColor(entry.score, 100)}`}>
                          {entry.score}
                        </span>
                        <span className="text-xs text-white/40"> / 100</span>
                      </>
                    )}
                  </div>
                  <div className="col-span-2">
                    {isDaily ? (
                      <span className="text-xs text-white/50">{entry.date}</span>
                    ) : isWeekly ? (
                      <span className="text-xs text-white/50">{entry.date}</span>
                    ) : (
                      <span className="text-xs text-white/50">{getScoreLabel(entry.score)}</span>
                    )}
                  </div>
                  <div className="col-span-3">
                    {isDaily ? (
                      <span className="text-xs text-white/40">{entry.date}</span>
                    ) : isWeekly ? (
                      entry.streak && entry.streak > 1 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-orange-400">
                          {entry.streak} day streak
                        </span>
                      ) : (
                        <span className="text-xs text-white/40">—</span>
                      )
                    ) : (
                      <span className="text-xs text-white/40">{entry.date}</span>
                    )}
                  </div>
                </div>

                {/* Mobile */}
                <div className="sm:hidden flex items-center gap-3 px-4 py-4">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold flex-shrink-0 ${getRankBadge(entry.rank)}`}>
                    {entry.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white truncate">{entry.name}</span>
                      <span className={`text-lg font-bold tabular-nums flex-shrink-0 ml-2 ${getScoreColor(entry.score, isDaily ? 5 : isWeekly ? 35 : 100)}`}>
                        {entry.score}{isDaily && <span className="text-xs text-white/40">/5</span>}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-white/40">{entry.date}</span>
                      {isWeekly && entry.streak && entry.streak > 1 && (
                        <span className="text-xs text-orange-400">{entry.streak} streak</span>
                      )}
                      {!isDaily && !isWeekly && (
                        <span className="text-xs text-white/50">{getScoreLabel(entry.score)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-white">Where do you rank?</h2>
            <p className="text-sm text-white/60 mt-2">
              {isDaily || isWeekly
                ? "Take the daily challenge and compete for the top spot."
                : "Take the free assessment and see your position on the global leaderboard."}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/daily"
                className="glow-btn px-8 py-3 text-sm font-medium inline-block"
              >
                Daily Challenge
              </Link>
              <Link
                href="/assess"
                className="ghost-btn px-8 py-3 text-sm font-medium inline-block"
              >
                Full Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
