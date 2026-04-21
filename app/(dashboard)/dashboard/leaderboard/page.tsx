"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trophy, Medal, Loader2 } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  date: string;
  dimensions: Record<string, number>;
}

const TABS = [
  { label: "All Time", value: "all" },
  { label: "This Week", value: "week" },
] as const;

function rankBadge(rank: number) {
  if (rank === 1)
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
        1
      </span>
    );
  if (rank === 2)
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600">
        2
      </span>
    );
  if (rank === 3)
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
        3
      </span>
    );
  return (
    <span className="flex size-8 items-center justify-center text-sm font-medium text-gray-400">
      {rank}
    </span>
  );
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-orange-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-500";
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"all" | "week">("all");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?range=${tab}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Leaderboard
        </h1>
        <p className="text-sm text-gray-500">
          Top AI proficiency scores from completed assessments.
        </p>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Leaderboard table */}
      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Trophy className="size-5 text-orange-500" />
            {tab === "all" ? "All Time Rankings" : "This Week's Rankings"}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {entries.length} ranked assessment{entries.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 animate-spin text-gray-400" />
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Medal className="mb-4 size-12 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900">
                No scores yet
              </h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                {tab === "week"
                  ? "No assessments completed this week. Check back soon!"
                  : "Be the first to complete an assessment and claim the top spot."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    <th className="pb-3 pr-4 w-16">Rank</th>
                    <th className="pb-3 pr-4">Name / Email</th>
                    <th className="pb-3 pr-4 w-20">Score</th>
                    <th className="pb-3 w-28">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={`${entry.rank}-${entry.name}`}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-3 pr-4">
                        {rankBadge(entry.rank)}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="font-medium text-gray-900">
                          {entry.name}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={cn(
                            "text-lg font-bold tabular-nums",
                            scoreColor(entry.score)
                          )}
                        >
                          {entry.score}%
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">{entry.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
