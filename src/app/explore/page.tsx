"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface PublicTest {
  id: number;
  title: string;
  description: string;
  test_type: string;
  difficulty: string;
  model: string;
  time_limit_minutes: number;
  max_attempts: number;
  token_budget: number;
  candidates_count: number;
  avg_score: number;
  company_name: string | null;
  listing_type: string;
  created_at: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "text-orange-300 bg-orange-400/[0.08] border-orange-400/20",
  intermediate: "text-orange-400 bg-orange-400/[0.06] border-orange-500/15",
  advanced: "text-violet-400 bg-violet-500/[0.06] border-violet-500/15",
  expert: "text-purple-400 bg-purple-500/[0.06] border-purple-500/15",
};

export default function ExplorePage() {
  const [tests, setTests] = useState<PublicTest[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");

  useEffect(() => {
    fetch("/api/tests/public")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = tests
    .filter((t) => filter === "all" || t.difficulty === filter)
    .sort((a, b) => {
      if (sort === "popular") return (b.candidates_count || 0) - (a.candidates_count || 0);
      if (sort === "score") return (b.avg_score || 0) - (a.avg_score || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Header */}
      <div className="bg-[#0C1120] border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <img src="/logo.png" alt="InpromptiFy" width={20} height={20} />
              <span className="font-semibold text-white text-sm">InpromptiFy</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/test/demo" className="text-[13px] text-gray-400 hover:text-white transition-colors">Try Demo</Link>
              {isLoggedIn ? (
                <Link href="/dashboard" className="text-[13px] font-medium text-white bg-orange-500 hover:bg-orange-400 px-4 py-1.5 rounded-md transition-colors">Dashboard</Link>
              ) : (
                <Link href="/login" className="text-[13px] font-medium text-orange-400 hover:text-orange-300 transition-colors">Sign In</Link>
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Explore Assessments</h1>
          <p className="text-sm text-gray-400">Browse public AI prompting tests. Take one to benchmark your skills.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 uppercase tracking-wider mr-1">Difficulty:</span>
            {["all", "beginner", "intermediate", "advanced", "expert"].map((d) => (
              <button key={d} onClick={() => setFilter(d)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium border transition-all ${filter === d ? "border-orange-500/40 bg-orange-400/10 text-orange-400" : "border-white/[0.06] text-gray-500 hover:text-gray-300"}`}>
                {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 uppercase tracking-wider mr-1">Sort:</span>
            {[{ value: "newest", label: "Newest" }, { value: "popular", label: "Most Popular" }, { value: "score", label: "Highest Avg Score" }].map((s) => (
              <button key={s.value} onClick={() => setSort(s.value)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium border transition-all ${sort === s.value ? "border-orange-500/40 bg-orange-400/10 text-orange-400" : "border-white/[0.06] text-gray-500 hover:text-gray-300"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading assessments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">No public tests yet</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">Be the first to create a public assessment. Or try the demo to see how it works.</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/test/demo" className="bg-orange-500 hover:bg-orange-400 text-white text-[13px] font-medium px-5 py-2.5 rounded-md transition-colors">Try Demo</Link>
              <Link href="/signup" className="bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] text-gray-400 text-[13px] font-medium px-5 py-2.5 rounded-md transition-colors">Create Account</Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((test) => (
              <Link key={test.id} href={`/test/${test.id}`}
                className="group bg-[#0C1120] border border-white/[0.06] rounded-lg p-5 hover:border-white/[0.12] transition-all duration-200 hover:shadow-lg hover:shadow-black/20 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-white group-hover:text-orange-400 transition-colors truncate">{test.title}</h3>
                    {test.company_name && <p className="text-[11px] text-gray-600 mt-0.5">{test.company_name}</p>}
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize shrink-0 ml-2 ${DIFFICULTY_COLORS[test.difficulty] || "text-gray-400 bg-white/[0.04] border-white/[0.08]"}`}>
                    {test.difficulty}
                  </span>
                </div>

                <p className="text-[13px] text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-2">{test.description || "No description provided."}</p>

                <div className="flex items-center justify-between text-[11px] text-gray-600">
                  <div className="flex items-center gap-3">
                    <span>{test.time_limit_minutes}m</span>
                    <span>{test.max_attempts} attempts</span>
                    <span>{test.model === "gpt-4o" ? "GPT-4o" : test.model === "claude" ? "Claude" : test.model}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {test.candidates_count > 0 && <span>{test.candidates_count} taken</span>}
                    {test.avg_score > 0 && <span className="text-orange-400">avg {Math.round(test.avg_score)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
