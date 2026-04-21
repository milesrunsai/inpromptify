"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  promptScore: number;
  testsCompleted: number;
  avgTokens?: number;
  avgAttempts?: number;
}

const fallbackData: LeaderboardEntry[] = [
  { rank: 1, name: "Sarah Chen", promptScore: 87, testsCompleted: 5, avgTokens: 420, avgAttempts: 1.8 },
  { rank: 2, name: "Marcus Rivera", promptScore: 78, testsCompleted: 4, avgTokens: 510, avgAttempts: 2.1 },
  { rank: 3, name: "Aisha Patel", promptScore: 72, testsCompleted: 3, avgTokens: 580, avgAttempts: 2.4 },
  { rank: 4, name: "James O'Brien", promptScore: 68, testsCompleted: 4, avgTokens: 640, avgAttempts: 2.6 },
  { rank: 5, name: "Yuki Tanaka", promptScore: 64, testsCompleted: 2, avgTokens: 720, avgAttempts: 3.0 },
  { rank: 6, name: "Emma Larsson", promptScore: 61, testsCompleted: 3, avgTokens: 690, avgAttempts: 2.8 },
  { rank: 7, name: "David Kim", promptScore: 58, testsCompleted: 2, avgTokens: 810, avgAttempts: 3.2 },
  { rank: 8, name: "Priya Sharma", promptScore: 55, testsCompleted: 3, avgTokens: 770, avgAttempts: 3.0 },
  { rank: 9, name: "Alex Novak", promptScore: 51, testsCompleted: 1, avgTokens: 890, avgAttempts: 3.6 },
  { rank: 10, name: "Fatima Al-Hassan", promptScore: 47, testsCompleted: 2, avgTokens: 940, avgAttempts: 3.4 },
  { rank: 11, name: "Tom Fischer", promptScore: 43, testsCompleted: 1, avgTokens: 1020, avgAttempts: 4.0 },
  { rank: 12, name: "Nina Kowalski", promptScore: 38, testsCompleted: 1, avgTokens: 1100, avgAttempts: 3.8 },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-extrabold text-white shadow-lg shadow-orange-500/30">
        1
      </div>
    );
  if (rank === 2)
    return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-sm font-extrabold text-gray-800 shadow-lg shadow-gray-400/20">
        2
      </div>
    );
  if (rank === 3)
    return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-sm font-extrabold text-amber-100 shadow-lg shadow-amber-700/20">
        3
      </div>
    );
  return (
    <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-sm font-medium text-gray-500">
      {rank}
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 80) return "from-orange-400 to-amber-400";
    if (s >= 60) return "from-orange-500 to-orange-400";
    if (s >= 40) return "from-orange-600 to-orange-500";
    return "from-orange-700 to-orange-600";
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-20 h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-sm font-bold tabular-nums ${score >= 70 ? "text-orange-400" : "text-gray-400"}`}>
        {score}
      </span>
    </div>
  );
}

type TabValue = "all" | "weekly" | "daily";

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [data, setData] = useState<LeaderboardEntry[]>(fallbackData);
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d) && d.length > 0) setData(d);
      })
      .catch(() => {});
  }, []);

  const tabs: { label: string; value: TabValue }[] = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "All Time", value: "all" },
  ];

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 pt-28 pb-16">

          {/* ── Signup funnel banner (only for logged-out users) ── */}
          {!isLoggedIn && (
            <div className="relative mb-10 rounded-2xl overflow-hidden border border-orange-500/20 bg-gradient-to-r from-[#1a0f00] via-[#0a0a0f] to-[#1a0f00]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.12),transparent_60%)]" />
              <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
                <div className="flex-shrink-0">
                  <Image
                    src="/images/crown-logo.png"
                    alt="InpromptiFy Champion"
                    width={160}
                    height={160}
                    className="rounded-xl"
                    priority
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 rounded-full border border-orange-500/20">
                    Free to play
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
                    Prove your AI skills.<br />
                    <span className="text-orange-400">Climb the ranks.</span>
                  </h2>
                  <p className="text-gray-400 text-sm max-w-md mb-5">
                    Take assessments, earn your Prompt Score, and see how you stack up against AI professionals worldwide.
                  </p>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                  >
                    Sign up and play
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Leaderboard</h1>
              <p className="text-sm text-gray-500">
                Ranked by Prompt Score. Fewer tokens, fewer attempts, better results.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/[0.04] rounded-lg p-1 border border-white/[0.06]">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                    activeTab === tab.value
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Top 3 podium ── */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            {data.slice(0, 3).map((person, i) => {
              const podiumOrder = [1, 0, 2]; // silver, gold, bronze layout
              const entry = data[podiumOrder[i]];
              const isFirst = podiumOrder[i] === 0;
              return (
                <div
                  key={entry.rank}
                  className={`relative rounded-xl border text-center p-4 sm:p-6 transition-all ${
                    isFirst
                      ? "border-orange-500/30 bg-gradient-to-b from-orange-500/10 to-transparent sm:-mt-4"
                      : "border-white/[0.06] bg-white/[0.02]"
                  }`}
                >
                  {isFirst && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="text-2xl">👑</span>
                    </div>
                  )}
                  <div className="flex justify-center mb-3 mt-1">
                    <RankBadge rank={entry.rank} />
                  </div>
                  <p className="font-bold text-white text-sm truncate">{entry.name}</p>
                  <p className={`text-2xl font-extrabold mt-1 tabular-nums ${isFirst ? "text-orange-400" : "text-gray-300"}`}>
                    {entry.promptScore}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{entry.testsCompleted} tests</p>
                </div>
              );
            })}
          </div>

          {/* ── Table ── */}
          <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.01]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-3.5 px-4 font-semibold text-orange-400/70 uppercase text-xs tracking-wider w-16">Rank</th>
                    <th className="text-left py-3.5 px-4 font-semibold text-orange-400/70 uppercase text-xs tracking-wider">Player</th>
                    <th className="text-left py-3.5 px-4 font-semibold text-orange-400/70 uppercase text-xs tracking-wider">Score</th>
                    <th className="text-center py-3.5 px-4 font-semibold text-orange-400/70 uppercase text-xs tracking-wider">Tests</th>
                    <th className="text-center py-3.5 px-4 font-semibold text-orange-400/70 uppercase text-xs tracking-wider hidden sm:table-cell">Avg Tokens</th>
                    <th className="text-center py-3.5 px-4 font-semibold text-orange-400/70 uppercase text-xs tracking-wider hidden sm:table-cell">Avg Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((person, i) => (
                    <tr
                      key={person.rank}
                      className={`border-b border-white/[0.04] last:border-0 transition-colors ${
                        i < 3
                          ? "bg-orange-500/[0.03] hover:bg-orange-500/[0.06]"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <RankBadge rank={person.rank} />
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/profile/${person.rank}`}
                          className="font-semibold text-white hover:text-orange-400 transition-colors"
                        >
                          {person.name}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <ScoreBar score={person.promptScore} />
                      </td>
                      <td className="py-3.5 px-4 text-center text-gray-400 font-medium">{person.testsCompleted}</td>
                      <td className="py-3.5 px-4 text-center text-gray-500 hidden sm:table-cell">
                        {(person.avgTokens || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center text-gray-500 hidden sm:table-cell">
                        {person.avgAttempts || 0}x
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div className="mt-8 text-center">
            {isLoggedIn ? (
              <p className="text-sm text-gray-500">
                Keep climbing.{" "}
                <Link href="/explore" className="text-orange-400 hover:text-orange-300 font-semibold">
                  Take another test →
                </Link>
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Want to see your name here?{" "}
                <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-semibold">
                  Sign up free →
                </Link>
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
