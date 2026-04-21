"use client";

import { useState, useEffect } from "react";

interface PersonDimension {
  name: string;
  email: string;
  prompt_quality: number;
  efficiency: number;
  speed: number;
  response_quality: number;
  last_assessed: string;
}

interface ScoreHistoryEntry {
  email: string;
  name: string;
  score: number;
  completed_at: string;
}

interface Analytics {
  summary: {
    avgScore: number;
    avgEfficiency: number;
    avgTokens: number;
    uniqueCandidates: number;
    totalAttempts: number;
    estimatedAnnualSavings: number;
  };
  distribution: Array<{ range: string; count: number }>;
  people: Array<{
    email: string;
    name: string;
    avg_score: number;
    tests_taken: number;
    avg_tokens: number;
    avg_efficiency: number;
    last_active: string;
  }>;
  dimensions: {
    avg_prompt_quality: number;
    avg_efficiency: number;
    avg_speed: number;
    avg_response_quality: number;
    avg_iteration_iq: number;
  };
  scoreHistory: ScoreHistoryEntry[];
  personDimensions: PersonDimension[];
}

// Industry benchmarks (based on aggregated public data)
const INDUSTRY_BENCHMARKS: Record<string, number> = {
  "Prompt Quality": 58,
  "Efficiency": 52,
  "Speed": 65,
  "Response Quality": 55,
  "Iteration IQ": 48,
  "Overall": 54,
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-orange-500" : score >= 60 ? "bg-orange-500/60" : score >= 40 ? "bg-orange-500/40" : "bg-orange-500/20";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-white/[0.04] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[13px] font-mono text-gray-400 w-8">{score}</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!data || data.summary.totalAttempts === 0) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-white mb-2">Team Analytics</h1>
        <p className="text-sm text-gray-500 mb-6">No assessment data yet. Create a test and invite your team to get started.</p>
        <a href="/dashboard/create" className="text-sm text-orange-500 font-medium hover:text-orange-600">Create your first assessment</a>
      </div>
    );
  }

  const { summary, distribution, people } = data;
  const allBuckets = ["0-19", "20-39", "40-59", "60-79", "80-89", "90-100"];
  const distMap = Object.fromEntries(distribution.map((d) => [d.range, d.count]));
  const maxCount = Math.max(...allBuckets.map((b) => distMap[b] || 0), 1);

  const topPerformers = people.filter((p) => p.avg_score >= 80);
  const needsTraining = people.filter((p) => p.avg_score < 50);

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white mb-1">Team Analytics</h1>
        <p className="text-sm text-gray-500">AI prompting performance across your organization.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Team Avg Score", value: summary.avgScore, suffix: "/100" },
          { label: "People Assessed", value: summary.uniqueCandidates, suffix: "" },
          { label: "Total Assessments", value: summary.totalAttempts, suffix: "" },
          { label: "Est. Annual Savings", value: `$${summary.estimatedAnnualSavings.toLocaleString()}`, suffix: "", highlight: true },
        ].map((card) => (
          <div key={card.label} className={`bg-[#0C1120] rounded-lg border ${card.highlight ? "border-orange-500/20 bg-orange-500/10" : "border-white/[0.06]"} p-4`}>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">{card.label}</div>
            <div className="text-2xl font-bold text-white">
              {typeof card.value === "number" ? card.value : card.value}
              {card.suffix && <span className="text-sm text-gray-400 font-normal">{card.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Score Distribution */}
        <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Score Distribution</h2>
          <div className="space-y-2.5">
            {allBuckets.map((bucket) => {
              const count = distMap[bucket] || 0;
              const pct = (count / maxCount) * 100;
              return (
                <div key={bucket} className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-400 w-12 text-right font-mono">{bucket}</span>
                  <div className="flex-1 h-6 bg-white/[0.04] rounded-sm overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-sm transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] text-gray-400 w-6 font-mono">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-4">
          <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Top Performers</h2>
            {topPerformers.length === 0 ? (
              <p className="text-sm text-gray-400">No one scoring 80+ yet.</p>
            ) : (
              <div className="space-y-2">
                {topPerformers.slice(0, 5).map((p) => (
                  <div key={p.email} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-white font-medium">{p.name}</span>
                      <span className="text-[11px] text-gray-400 ml-2">{p.tests_taken} tests</span>
                    </div>
                    <span className="text-sm font-semibold text-orange-500">{p.avg_score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Needs Training</h2>
            {needsTraining.length === 0 ? (
              <p className="text-sm text-gray-400">Everyone is scoring above 50.</p>
            ) : (
              <div className="space-y-2">
                {needsTraining.slice(0, 5).map((p) => (
                  <div key={p.email} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-white font-medium">{p.name}</span>
                      <span className="text-[11px] text-gray-400 ml-2">{p.tests_taken} tests</span>
                    </div>
                    <span className="text-sm font-semibold text-red-500">{p.avg_score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dimension Weakness + Industry Benchmarks */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Dimension Averages vs Benchmarks */}
        <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5">
          <h2 className="text-sm font-semibold text-white mb-1">Skills vs Industry Benchmark</h2>
          <p className="text-[11px] text-gray-500 mb-4">Your team&apos;s average per dimension compared to industry average.</p>
          <div className="space-y-3">
            {[
              { label: "Prompt Quality", yours: data.dimensions?.avg_prompt_quality || 0 },
              { label: "Efficiency", yours: data.dimensions?.avg_efficiency || 0 },
              { label: "Speed", yours: data.dimensions?.avg_speed || 0 },
              { label: "Response Quality", yours: data.dimensions?.avg_response_quality || 0 },
              { label: "Iteration IQ", yours: data.dimensions?.avg_iteration_iq || 0 },
            ].map((dim) => {
              const benchmark = INDUSTRY_BENCHMARKS[dim.label] || 50;
              const diff = dim.yours - benchmark;
              const diffColor = diff > 0 ? "text-emerald-400" : diff < 0 ? "text-red-400" : "text-gray-400";
              return (
                <div key={dim.label}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-gray-400">{dim.label}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-gray-500 font-mono">{dim.yours}</span>
                      <span className={`font-mono text-[11px] ${diffColor}`}>
                        {diff > 0 ? "+" : ""}{diff} vs {benchmark}
                      </span>
                    </span>
                  </div>
                  <div className="relative h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="absolute h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(dim.yours, 100)}%` }} />
                    <div className="absolute h-full w-0.5 bg-amber-400/60" style={{ left: `${benchmark}%` }} title={`Industry: ${benchmark}`} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-[10px] text-gray-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full" /> Your team</span>
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-amber-400/60" /> Industry avg</span>
          </div>
        </div>

        {/* Weakness Identification */}
        <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5">
          <h2 className="text-sm font-semibold text-white mb-1">Areas for Improvement</h2>
          <p className="text-[11px] text-gray-500 mb-4">Dimensions where your team scores below industry average.</p>
          {(() => {
            const dims = [
              { label: "Prompt Quality", yours: data.dimensions?.avg_prompt_quality || 0, bench: INDUSTRY_BENCHMARKS["Prompt Quality"] },
              { label: "Efficiency", yours: data.dimensions?.avg_efficiency || 0, bench: INDUSTRY_BENCHMARKS["Efficiency"] },
              { label: "Speed", yours: data.dimensions?.avg_speed || 0, bench: INDUSTRY_BENCHMARKS["Speed"] },
              { label: "Response Quality", yours: data.dimensions?.avg_response_quality || 0, bench: INDUSTRY_BENCHMARKS["Response Quality"] },
              { label: "Iteration IQ", yours: data.dimensions?.avg_iteration_iq || 0, bench: INDUSTRY_BENCHMARKS["Iteration IQ"] },
            ];
            const weaknesses = dims.filter((d) => d.yours < d.bench).sort((a, b) => (a.yours - a.bench) - (b.yours - b.bench));
            const strengths = dims.filter((d) => d.yours >= d.bench).sort((a, b) => (b.yours - b.bench) - (a.yours - a.bench));

            return (
              <div className="space-y-4">
                {weaknesses.length > 0 ? (
                  <div className="space-y-2">
                    {weaknesses.map((w) => (
                      <div key={w.label} className="flex items-center justify-between bg-red-500/[0.04] border border-red-500/10 rounded-lg px-4 py-2.5">
                        <span className="text-sm text-gray-300">{w.label}</span>
                        <span className="text-sm text-red-400 font-mono">{w.yours} (need {w.bench}+)</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-emerald-400">Your team is above industry average in all dimensions.</p>
                )}
                {strengths.length > 0 && (
                  <>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-4">Strengths</p>
                    {strengths.slice(0, 3).map((s) => (
                      <div key={s.label} className="flex items-center justify-between bg-emerald-500/[0.04] border border-emerald-500/10 rounded-lg px-4 py-2.5">
                        <span className="text-sm text-gray-300">{s.label}</span>
                        <span className="text-sm text-emerald-400 font-mono">+{s.yours - s.bench} above avg</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Team Proficiency Heatmap */}
      {data.personDimensions && data.personDimensions.length > 0 && (
        <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5 mb-8">
          <h2 className="text-sm font-semibold text-white mb-1">Team Proficiency Heatmap</h2>
          <p className="text-[11px] text-gray-500 mb-4">Score by dimension for each team member. Darker = stronger.</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-3 py-2">Name</th>
                  {["Prompt Quality", "Efficiency", "Speed", "Response Quality"].map((h) => (
                    <th key={h} className="text-center text-[10px] text-gray-400 uppercase tracking-wider px-3 py-2">{h}</th>
                  ))}
                  <th className="text-center text-[10px] text-gray-400 uppercase tracking-wider px-3 py-2">Last Assessed</th>
                </tr>
              </thead>
              <tbody>
                {data.personDimensions.map((p: PersonDimension) => {
                  const sixMonthsAgo = new Date();
                  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                  const isExpired = p.last_assessed && new Date(p.last_assessed) < sixMonthsAgo;
                  const cellBg = (val: number) => {
                    if (val >= 80) return "bg-emerald-500/20 text-emerald-400";
                    if (val >= 65) return "bg-blue-500/15 text-blue-400";
                    if (val >= 50) return "bg-amber-500/15 text-amber-400";
                    return "bg-red-500/15 text-red-400";
                  };
                  return (
                    <tr key={p.email} className="border-b border-white/[0.02]">
                      <td className="px-3 py-2.5">
                        <span className="text-[13px] text-white font-medium">{p.name}</span>
                        {isExpired && <span className="text-[10px] text-amber-400 ml-2">EXPIRED</span>}
                      </td>
                      {[p.prompt_quality, p.efficiency, p.speed, p.response_quality].map((val, i) => (
                        <td key={i} className="px-3 py-2.5 text-center">
                          <span className={`inline-block text-[12px] font-mono font-semibold rounded px-2 py-0.5 ${cellBg(val)}`}>{val}</span>
                        </td>
                      ))}
                      <td className="px-3 py-2.5 text-center">
                        <span className={`text-[11px] font-mono ${isExpired ? "text-amber-400" : "text-gray-500"}`}>
                          {p.last_assessed ? new Date(p.last_assessed).toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skill Decay Tracking */}
      {data.scoreHistory && data.scoreHistory.length > 0 && (
        <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5 mb-8">
          <h2 className="text-sm font-semibold text-white mb-1">Score Progression (Last 6 Months)</h2>
          <p className="text-[11px] text-gray-500 mb-4">Track how scores change over time. Scores older than 6 months are marked as expired.</p>
          <div className="space-y-4">
            {(() => {
              // Group by person
              const byPerson: Record<string, ScoreHistoryEntry[]> = {};
              data.scoreHistory.forEach((entry: ScoreHistoryEntry) => {
                const key = entry.email;
                if (!byPerson[key]) byPerson[key] = [];
                byPerson[key].push(entry);
              });

              return Object.entries(byPerson).slice(0, 10).map(([email, entries]) => {
                const name = entries[0].name;
                const firstScore = entries[0].score;
                const lastScore = entries[entries.length - 1].score;
                const delta = lastScore - firstScore;
                const deltaColor = delta > 0 ? "text-emerald-400" : delta < 0 ? "text-red-400" : "text-gray-400";
                const lastDate = new Date(entries[entries.length - 1].completed_at);
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                const isExpired = lastDate < sixMonthsAgo;

                return (
                  <div key={email} className="flex items-center gap-4">
                    <div className="w-36 shrink-0">
                      <span className="text-[13px] text-white font-medium block truncate">{name}</span>
                      {isExpired && <span className="text-[10px] text-amber-400">Needs reassessment</span>}
                    </div>
                    {/* Mini sparkline */}
                    <div className="flex-1 flex items-end gap-0.5 h-8">
                      {entries.map((e, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-orange-500/60 rounded-t-sm min-w-[4px]"
                          style={{ height: `${Math.max((e.score / 100) * 100, 8)}%` }}
                          title={`${e.score}/100 — ${new Date(e.completed_at).toLocaleDateString()}`}
                        />
                      ))}
                    </div>
                    <div className="w-24 text-right shrink-0">
                      <span className="text-[13px] font-mono text-white">{lastScore}</span>
                      {entries.length > 1 && (
                        <span className={`text-[11px] font-mono ml-1 ${deltaColor}`}>
                          {delta > 0 ? "+" : ""}{delta}
                        </span>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Full People Table */}
      <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h2 className="text-sm font-semibold text-white">All Team Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-2.5">Name</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-2.5">Avg Score</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-2.5">Tests</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-2.5">Avg Tokens</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-2.5">Efficiency</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-2.5">Rating</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.email} className="border-b border-gray-50 hover:bg-white/[0.02]/50">
                  <td className="px-5 py-3">
                    <div className="text-[13px] font-medium text-white">{p.name}</div>
                    <div className="text-[11px] text-gray-400">{p.email}</div>
                  </td>
                  <td className="px-5 py-3"><ScoreBar score={p.avg_score} /></td>
                  <td className="px-5 py-3 text-[13px] text-gray-500">{p.tests_taken}</td>
                  <td className="px-5 py-3 text-[13px] text-gray-500 font-mono">{p.avg_tokens.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[13px] text-gray-500">{p.avg_efficiency}/100</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      p.avg_score >= 80 ? "bg-emerald-500/10 text-emerald-400" :
                      p.avg_score >= 60 ? "bg-blue-500/10 text-blue-400" :
                      p.avg_score >= 40 ? "bg-amber-500/10 text-amber-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>
                      {p.avg_score >= 80 ? "Top Performer" : p.avg_score >= 60 ? "Proficient" : p.avg_score >= 40 ? "Developing" : "Needs Training"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
