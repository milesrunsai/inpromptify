"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  rank: number;
  name: string;
  percentage: number;
  score: number;
  totalQuestions: number;
  streak: number;
  performanceScore: number | null;
  topDimension: string | null;
  weakDimension: string | null;
}

interface LeaderboardStats {
  totalPlayers: number;
  avgPercentage: number;
  perfectScores: number;
}

type Tab = "daily" | "weekly" | "alltime";

function getPercentageColor(pct: number): string {
  if (pct >= 80) return "text-green-400";
  if (pct >= 60) return "text-orange-400";
  if (pct >= 40) return "text-yellow-400";
  return "text-red-400";
}

function getBarColor(pct: number): string {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 60) return "bg-orange-500";
  if (pct >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({ totalPlayers: 0, avgPercentage: 0, perfectScores: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("daily");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?tab=${tab}`)
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries || []);
        setStats(data.stats || { totalPlayers: 0, avgPercentage: 0, perfectScores: 0 });
      })
      .catch(() => {
        setEntries([]);
        setStats({ totalPlayers: 0, avgPercentage: 0, perfectScores: 0 });
      })
      .finally(() => setLoading(false));
  }, [tab]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  // Reorder for podium: [2nd, 1st, 3rd]
  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3.length === 2
      ? [top3[1], top3[0]]
      : top3;

  return (
    <div className="relative pt-24 pb-16 min-h-screen overflow-hidden">
      {/* Video background — only on /leaderboard */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_3CVjpU5MqL28kt1M6PyOAXhNcyX/hf_20260418_085528_e32a0b1e-ca22-4247-9b28-22c4f7d5fed6.mp4"
          type="video/mp4"
        />
      </video>
      {/* Dark overlay to keep text readable */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Leaderboard
          </h1>
          <p className="text-base text-white/50 mt-3 max-w-md mx-auto">
            Ranked by AI proficiency. See where you stand.
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
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "bg-white/[0.06] text-white/50 hover:text-white/70 hover:bg-white/[0.1]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
          {[
            { label: "Total Players", value: stats.totalPlayers.toString() },
            { label: "Avg Score", value: `${stats.avgPercentage}%` },
            { label: "Perfect Scores", value: stats.perfectScores.toString() },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-orange-400">{stat.value}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <span className="text-lg font-bold text-orange-400">#1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No one has played yet. Be the first.
            </h3>
            <p className="text-sm text-white/50 mb-6">
              Take the challenge and claim the top spot.
            </p>
            <Link
              href="/daily"
              className="glow-btn px-8 py-3 text-sm font-medium inline-block"
            >
              Start Daily Challenge
            </Link>
          </div>
        ) : (
          <>
            {/* Podium — Top 3 */}
            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-3 sm:gap-4 mb-10">
                {podiumOrder.map((entry) => {
                  if (!entry) return null;
                  const isFirst = entry.rank === 1;
                  const isSecond = entry.rank === 2;
                  const isThird = entry.rank === 3;

                  return (
                    <div
                      key={entry.rank}
                      className={`flex-1 max-w-[180px] ${isFirst ? "order-2" : isSecond ? "order-1" : "order-3"}`}
                    >
                      <div
                        className={`relative rounded-2xl border p-4 sm:p-5 text-center transition-all ${
                          isFirst
                            ? "bg-orange-500/[0.08] border-orange-500/30 shadow-lg shadow-orange-500/10"
                            : "bg-white/[0.04] border-white/[0.08]"
                        } ${isFirst ? "pb-6 sm:pb-8" : "pb-4 sm:pb-6"}`}
                      >
                        {/* Rank badge */}
                        <div
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold mb-3 ${
                            isFirst
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                              : isSecond
                                ? "bg-gray-400/20 text-gray-300 border border-gray-400/30"
                                : "bg-amber-700/20 text-amber-500 border border-amber-700/30"
                          }`}
                        >
                          {`#${entry.rank}`}
                        </div>

                        {/* Name */}
                        <p className="text-xs sm:text-sm text-white/70 truncate mb-2">
                          {entry.name}
                        </p>

                        {/* Percentage */}
                        <p className={`text-2xl sm:text-3xl font-bold tabular-nums ${isFirst ? "text-orange-400" : getPercentageColor(entry.percentage)}`}>
                          {entry.percentage}
                          <span className="text-sm font-normal text-white/40">%</span>
                        </p>

                        {/* Top dimension tag */}
                        {entry.topDimension && (
                          <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] sm:text-xs bg-white/[0.06] text-white/50 border border-white/[0.08] truncate max-w-full">
                            {entry.topDimension}
                          </span>
                        )}

                        {/* Streak */}
                        {entry.streak > 1 && (
                          <p className="text-xs text-orange-400/70 mt-1.5">
                            {entry.streak} day streak
                          </p>
                        )}
                      </div>

                      {/* Podium base */}
                      <div
                        className={`mx-2 rounded-b-lg ${
                          isFirst
                            ? "h-16 bg-gradient-to-t from-orange-500/20 to-orange-500/5"
                            : isSecond
                              ? "h-10 bg-gradient-to-t from-white/[0.06] to-transparent"
                              : "h-6 bg-gradient-to-t from-white/[0.04] to-transparent"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Table for ranks 4+ */}
            {rest.length > 0 && (
              <div className="space-y-1.5">
                {/* Header */}
                <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-2 text-xs text-white/30 uppercase tracking-wider">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-3">Player</div>
                  <div className="col-span-3">Score</div>
                  <div className="col-span-3">Top Strength</div>
                  <div className="col-span-2">Streak</div>
                </div>

                {rest.map((entry) => (
                  <div
                    key={`${entry.rank}-${entry.name}`}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] transition-all"
                  >
                    {/* Desktop row */}
                    <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-3.5 items-center">
                      <div className="col-span-1">
                        <span className="text-sm font-medium text-white/40">{entry.rank}</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-sm text-white/80 truncate block">{entry.name}</span>
                      </div>
                      <div className="col-span-3 flex items-center gap-3">
                        <span className={`text-sm font-bold tabular-nums ${getPercentageColor(entry.percentage)}`}>
                          {entry.percentage}%
                        </span>
                        <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden max-w-[80px]">
                          <div
                            className={`h-full rounded-full ${getBarColor(entry.percentage)}`}
                            style={{ width: `${entry.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="col-span-3">
                        {entry.topDimension ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-white/[0.06] text-white/50 border border-white/[0.08]">
                            {entry.topDimension}
                          </span>
                        ) : (
                          <span className="text-xs text-white/20">—</span>
                        )}
                      </div>
                      <div className="col-span-2">
                        {entry.streak > 1 ? (
                          <span className="text-xs text-orange-400">{entry.streak} day streak</span>
                        ) : (
                          <span className="text-xs text-white/20" />
                        )}
                      </div>
                    </div>

                    {/* Mobile row */}
                    <div className="sm:hidden flex items-center gap-3 px-4 py-3.5">
                      <span className="text-sm font-medium text-white/40 w-6 flex-shrink-0">{entry.rank}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/80 truncate">{entry.name}</span>
                          <span className={`text-sm font-bold tabular-nums flex-shrink-0 ml-2 ${getPercentageColor(entry.percentage)}`}>
                            {entry.percentage}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {entry.topDimension && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40 border border-white/[0.06] truncate">
                              {entry.topDimension}
                            </span>
                          )}
                          {entry.streak > 1 && (
                            <span className="text-[10px] text-orange-400">{entry.streak} day streak</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-white">Where do you rank?</h2>
            <p className="text-sm text-white/50 mt-2">
              Test your AI proficiency and compete for the leaderboard.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
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
