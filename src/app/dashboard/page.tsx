"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ds, sparklinePath, progressRing } from "@/lib/designSystem";

interface Stats {
  testsCreated: number;
  candidatesTested: number;
  avgPromptScore: number;
  totalTokensUsed: number;
}

interface CandidateRow {
  id: string;
  name: string;
  email: string;
  promptScore: number;
  tokensUsed: number;
  timeSpentMinutes: number;
  testName: string;
  completedAt: string;
}

function Sparkline({ data, color = "#f97316", width = 60, height = 20 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const d = sparklinePath(data, width, height);
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <circle cx={width} cy={parseFloat(d.split(" ").slice(-1)[0]) || 0} r="2" fill={color} />
    </svg>
  );
}

function ProgressRingSvg({ percent, size = 44, stroke = 3.5 }: { percent: number; size?: number; stroke?: number }) {
  const { radius, circumference, offset, cx, cy } = progressRing(percent, size, stroke);
  const color = ds.scoreRingColor(percent);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700 ease-out" />
    </svg>
  );
}

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats>({ testsCreated: 0, candidatesTested: 0, avgPromptScore: 0, totalTokensUsed: 0 });
  const [recentResults, setRecentResults] = useState<CandidateRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then((r) => r.json()).catch(() => ({})),
      fetch("/api/dashboard/candidates").then((r) => r.json()).catch(() => []),
    ]).then(([s, c]) => {
      if (s.testsCreated !== undefined) setStats(s);
      if (Array.isArray(c) && c.length > 0) setRecentResults(c.slice(0, 8));
      setLoading(false);
    });
  }, []);

  const hasData = stats.testsCreated > 0;

  const statCards = [
    { label: "Tests Created", value: stats.testsCreated, trend: hasData ? ds.fakeTrend(stats.testsCreated) : undefined },
    { label: "Candidates", value: stats.candidatesTested, trend: hasData ? ds.fakeTrend(stats.candidatesTested) : undefined },
    { label: "Avg Score", value: stats.avgPromptScore, isScore: true },
    { label: "Tokens Used", value: stats.totalTokensUsed, format: (v: number) => v > 1000 ? `${(v / 1000).toFixed(1)}K` : String(v), trend: hasData ? ds.fakeTrend(stats.totalTokensUsed / 1000) : undefined },
  ];

  return (
    <div className={ds.page}>
      {/* Quick Actions Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Link href="/dashboard/create" className={ds.btnPrimary}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Create Test
        </Link>
        <Link href="/explore" className={ds.btnSecondary}>Browse Tests</Link>
        <Link href="/dashboard/tests" className={ds.btnGhost}>View All Tests</Link>
      </div>

      {/* Getting Started — only for new users */}
      {!hasData && !loading && (
        <div className="mb-10 animate-fade-in-up">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-400/5 rounded-xl border border-orange-500/20 p-8">
            <h2 className="text-xl font-bold text-white mb-2">Get started with InpromptiFy</h2>
            <p className="text-sm text-gray-400 mb-8 max-w-lg">
              Set up your first assessment in under a minute. Measure how efficiently your team uses AI.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { step: "01", title: "Create an Assessment", desc: "Describe the skill you want to test. AI generates the task, scoring criteria, and token budgets automatically.", cta: "Create Test", href: "/dashboard/create", primary: true },
                { step: "02", title: "Invite Your Team", desc: "Send assessment links to employees or candidates. They complete it in a sandboxed LLM environment.", cta: "Learn More", href: "/how-it-works", primary: false },
                { step: "03", title: "Analyze Results", desc: "Get PromptScores with cost analytics. See who prompts efficiently and where money is being wasted.", cta: "Try Demo", href: "/test/demo", primary: false },
              ].map((item) => (
                <div key={item.step} className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5 flex flex-col">
                  <span className="text-[11px] font-mono text-orange-400/60 mb-3">{item.step}</span>
                  <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed mb-4 flex-1">{item.desc}</p>
                  <Link href={item.href} className={`text-[13px] font-medium px-4 py-2 rounded-md text-center transition-all ${item.primary ? "bg-orange-500 hover:bg-orange-400 text-white" : "bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 border border-white/[0.06]"}`}>
                    {item.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className={`${ds.card} p-4`}>
            <div className="flex items-start justify-between mb-3">
              <span className={ds.sectionLabel}>{stat.label}</span>
              {stat.trend && <Sparkline data={stat.trend} color="#f97316" />}
            </div>
            <div className="flex items-end gap-3">
              {stat.isScore ? (
                <div className="relative">
                  <ProgressRingSvg percent={stat.value} />
                  <span className={`absolute inset-0 flex items-center justify-center text-[13px] font-semibold ${ds.scoreBadge(stat.value)}`}>
                    {stat.value || "--"}
                  </span>
                </div>
              ) : (
                <span className="text-[26px] font-semibold text-white leading-none tracking-[-0.02em]">
                  {stat.format ? stat.format(stat.value) : stat.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Results */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={ds.sectionTitle}>Recent Results</h2>
          {recentResults.length > 0 && (
            <Link href="/dashboard/candidates" className="text-[12px] text-orange-400 hover:text-orange-300 font-medium transition-colors">View all</Link>
          )}
        </div>

        {loading ? (
          <div className={`${ds.card} p-8 text-center`}>
            <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        ) : recentResults.length === 0 ? (
          <div className={`${ds.card} p-10 text-center`}>
            <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-sm text-gray-400 mb-1">No results yet</p>
            <p className="text-[12px] text-gray-600 mb-4">Create your first assessment and invite candidates to get started.</p>
            <Link href="/dashboard/create" className={ds.btnPrimary}>Create Your First Test</Link>
          </div>
        ) : (
          <div className={`${ds.card} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className={`${ds.tableCell} ${ds.tableHeader} text-left`}>Candidate</th>
                    <th className={`${ds.tableCell} ${ds.tableHeader} text-left`}>Test</th>
                    <th className={`${ds.tableCell} ${ds.tableHeader} text-left`}>Score</th>
                    <th className={`${ds.tableCell} ${ds.tableHeader} text-left`}>Tokens</th>
                    <th className={`${ds.tableCell} ${ds.tableHeader} text-left`}>Time</th>
                    <th className={`${ds.tableCell} ${ds.tableHeader} text-left`}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentResults.map((c, i) => (
                    <tr key={c.id} className={`${ds.tableRow} ${i < recentResults.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
                      <td className={ds.tableCell}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] font-medium text-gray-400">
                            {c.name.split(" ").map((n: string) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-white">{c.name}</div>
                            <div className="text-[11px] text-gray-600">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`${ds.tableCell} text-gray-400`}>{c.testName}</td>
                      <td className={ds.tableCell}>
                        <span className={`text-[13px] font-semibold ${ds.scoreBadge(c.promptScore)}`}>{c.promptScore}</span>
                      </td>
                      <td className={ds.tableCellMuted}>{c.tokensUsed.toLocaleString()}</td>
                      <td className={ds.tableCellMuted}>{c.timeSpentMinutes}m</td>
                      <td className={ds.tableCellMuted}>{c.completedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Card (shown when user has some activity) */}
      {hasData && (
        <div className="bg-gradient-to-r from-orange-500/[0.08] to-orange-400/[0.04] rounded-xl border border-orange-500/[0.12] p-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Unlock more assessments</h3>
            <p className="text-[13px] text-gray-500">Free plan: 5 tests, 25 candidates/month. Pro gives you unlimited everything.</p>
          </div>
          <Link href="/dashboard/billing" className="shrink-0 ml-6 bg-orange-500 hover:bg-orange-400 text-white text-[13px] font-medium px-5 py-2.5 rounded-md transition-colors">
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
}
