"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import ScoreCard from "@/components/ScoreCard";
import type { ScoringResult } from "@/lib/scoring";

interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface StoredResult extends ScoringResult {
  testName?: string;
  testDescription?: string;
  taskDescription?: string;
  messages?: StoredMessage[];
  timeSpentSeconds?: number;
  tokenBudget?: number;
  maxAttempts?: number;
  timeLimitMinutes?: number;
}

function AttemptTimeline({ messages }: { messages: StoredMessage[] }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const pairs: { prompt: StoredMessage; response?: StoredMessage; index: number }[] = [];
  let pairIdx = 0;
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === "user") {
      pairs.push({ prompt: messages[i], response: messages[i + 1]?.role === "assistant" ? messages[i + 1] : undefined, index: pairIdx++ });
    }
  }
  if (pairs.length === 0) return null;

  return (
    <div className="space-y-3">
      {pairs.map((pair) => {
        const isExpanded = expandedIdx === pair.index;
        return (
          <div key={pair.index} className="border border-white/[0.06] rounded-lg overflow-hidden bg-[#0C1120]">
            <button onClick={() => setExpandedIdx(isExpanded ? null : pair.index)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors text-left">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#f97316] text-white flex items-center justify-center text-xs font-bold shrink-0">{pair.index + 1}</div>
                <p className="text-sm text-white font-medium truncate max-w-[300px] sm:max-w-[500px]">{pair.prompt.content.slice(0, 80)}{pair.prompt.content.length > 80 ? "…" : ""}</p>
              </div>
              <svg className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isExpanded && (
              <div className="border-t border-white/[0.06] px-4 py-3 space-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wide">Your Prompt</span>
                  <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap leading-relaxed">{pair.prompt.content}</p>
                </div>
                {pair.response && (
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">AI Response</span>
                    <div className="text-sm text-gray-400 mt-1 whitespace-pre-wrap leading-relaxed bg-white/[0.02] rounded-md p-3 max-h-[300px] overflow-y-auto border border-white/[0.04]">{pair.response.content}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ScoreDistributionChart({ userScore }: { userScore: number }) {
  const buckets = [
    { range: "0-19", count: 2, },
    { range: "20-39", count: 5, },
    { range: "40-59", count: 14, },
    { range: "60-79", count: 18, },
    { range: "80-89", count: 8, },
    { range: "90-100", count: 3, },
  ];
  const maxCount = Math.max(...buckets.map((b) => b.count));

  return (
    <div className="space-y-2">
      {buckets.map((b) => {
        const pct = (b.count / maxCount) * 100;
        const [lo, hi] = b.range.split("-").map(Number);
        const isUser = userScore >= lo && userScore <= hi;
        return (
          <div key={b.range} className="flex items-center gap-3">
            <span className="text-[10px] text-gray-400 w-10 text-right font-mono">{b.range}</span>
            <div className="flex-1 h-5 bg-white/[0.04] rounded-sm overflow-hidden relative">
              <div className={`h-full rounded-sm transition-all duration-1000 ease-out ${isUser ? "bg-[#f97316]" : "bg-white/[0.12]"}`} style={{ width: `${pct}%` }} />
              {isUser && <span className="absolute right-2 top-0.5 text-[9px] font-bold text-white">YOU</span>}
            </div>
            <span className="text-[10px] text-gray-400 w-6 font-mono">{b.count}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function TestResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [result, setResult] = useState<StoredResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "journey" | "comparison">("overview");
  const [shareTooltip, setShareTooltip] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`test-result-${id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.dimensions) {
          setResult(parsed as StoredResult);
        } else {
          setResult(buildLegacyResult(parsed));
        }
      } catch {
        setResult(null);
      }
    }
    // Check if guest user
    const guest = sessionStorage.getItem(`guest-${id}`);
    if (guest) setShowSignupPrompt(true);
    setLoading(false);
  }, [id]);

  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    // Try to get attemptId from sessionStorage (saved by save-result)
    const aid = sessionStorage.getItem(`attempt-id-${id}`);
    if (aid) setAttemptId(aid);
  }, [id]);

  const shareUrl = attemptId ? `https://inpromptify.com/score/${attemptId}` : null;

  const handleShare = async () => {
    const url = shareUrl || "https://inpromptify.com";
    const text = result
      ? `I scored ${result.promptScore}/100 (Grade: ${result.letterGrade}) on "${result.testName || "InpromptiFy"}"\n\nBetter than ${result.percentile}% of candidates.\n\nTest your AI prompting skills:`
      : "";
    if (navigator.share) {
      try { await navigator.share({ title: "My PromptScore", text, url }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareUrl ? `${text}\n${url}` : text);
      setShareTooltip(true);
      setTimeout(() => setShareTooltip(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111118] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-gray-500">Calculating your score...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-[#111118] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">No results found for this test session.</p>
          <Link href="/" className="text-sm text-orange-400 hover:text-orange-300 font-medium">Back to Home</Link>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const timeTaken = result.stats.timeSpentSeconds || result.timeSpentSeconds || 0;
  const messages = result.messages || [];
  const testName = result.testName || "Test";

  return (
    <div className="min-h-screen bg-[#111118]">
      <div className="bg-[#0C1120] border-b border-white/[0.06] sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm text-white">
            <span className="inline-flex items-center gap-1.5"><img src="/logo.png" alt="InpromptiFy" width={18} height={18} /><span className="font-semibold text-white">InpromptiFy</span></span>
          </Link>
          <span className="text-xs text-gray-600">Assessment Results</span>
        </div>
      </div>

      {/* Guest signup prompt */}
      {showSignupPrompt && (
        <div className="bg-orange-400/[0.06] border-b border-orange-500/[0.1]">
          <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-400">Create an account to save your PromptScore</p>
              <p className="text-xs text-gray-600 mt-0.5">Appear on the leaderboard and track your progress</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/signup?link=${id}`} className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Sign Up</Link>
              <button onClick={() => setShowSignupPrompt(false)} className="text-gray-600 hover:text-gray-400 text-sm px-2">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* Test Info Banner */}
      <div className="bg-[#111118] text-white">
        <div className="max-w-3xl mx-auto px-5 py-6">
          <h1 className="text-lg font-bold mb-1">{testName}</h1>
          {result.testDescription && <p className="text-sm text-gray-300 leading-relaxed mb-3">{result.testDescription}</p>}
          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            <span>{formatTime(timeTaken)} / {result.stats.timeLimitMinutes}:00</span>
            <span>{result.stats.attemptsUsed} of {result.stats.maxAttempts} attempts</span>
            <span>{result.stats.tokensUsed.toLocaleString()} / {result.stats.tokenBudget.toLocaleString()} tokens</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#0C1120] border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-5 flex gap-0">
          {([{ key: "overview", label: "Overview" }, { key: "journey", label: "Your Journey" }, { key: "comparison", label: "Comparison" }] as const).map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? "border-orange-500 text-orange-400" : "border-transparent text-gray-600 hover:text-gray-400"}`}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Hire/No-Hire Recommendation Band */}
            {(() => {
              const s = result.promptScore;
              const band = s >= 80
                ? { label: "Strong Hire", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", desc: "Candidate demonstrates advanced AI proficiency. Efficient, structured, and adaptive prompting." }
                : s >= 65
                ? { label: "Hire", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", desc: "Candidate meets proficiency requirements. Solid fundamentals with room for growth." }
                : s >= 50
                ? { label: "Consider with Training", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", desc: "Candidate shows potential but needs development in AI tool usage." }
                : { label: "Not Recommended", color: "text-red-400 bg-red-500/10 border-red-500/20", desc: "Candidate needs significant AI training before being effective." };
              return (
                <div className={`rounded-lg border p-4 ${band.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider">Recommendation</span>
                      <h3 className="text-lg font-bold mt-0.5">{band.label}</h3>
                    </div>
                    <span className="text-3xl font-bold">{result.promptScore}</span>
                  </div>
                  <p className="text-[13px] mt-1 opacity-80">{band.desc}</p>
                </div>
              );
            })()}

            <ScoreCard result={result} testName={testName} />

            {/* Scoring Audit Trail */}
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">Scoring Breakdown</h2>
              <p className="text-[12px] text-gray-500 mb-4">Detailed analysis of each scoring dimension. This is exactly how your score was calculated.</p>
              <div className="space-y-3">
                {([
                  { key: "promptQuality" as const, label: "Prompt Quality", weight: "30%" },
                  { key: "responseQuality" as const, label: "Response Quality", weight: "25%" },
                  { key: "efficiency" as const, label: "Efficiency", weight: "15%" },
                  { key: "speed" as const, label: "Speed", weight: "15%" },
                  { key: "iterationIQ" as const, label: "Iteration IQ", weight: "15%" },
                ]).map((dim) => {
                  const d = result.dimensions[dim.key];
                  if (!d) return null;
                  const scoreColor = d.score >= 80 ? "text-emerald-400" : d.score >= 60 ? "text-amber-400" : d.score >= 40 ? "text-orange-400" : "text-red-400";
                  return (
                    <details key={dim.key} className="bg-[#0C1120] border border-white/[0.06] rounded-lg group">
                      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors list-none">
                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-bold ${scoreColor} w-10`}>{d.score}</span>
                          <div>
                            <span className="text-[13px] font-medium text-white">{dim.label}</span>
                            <span className="text-[11px] text-gray-600 ml-2">{dim.weight}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ${d.score >= 80 ? "bg-emerald-500" : d.score >= 60 ? "bg-amber-500" : d.score >= 40 ? "bg-orange-500" : "bg-red-500"}`} style={{ width: `${d.score}%` }} />
                          </div>
                          <svg className="w-4 h-4 text-gray-600 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </summary>
                      <div className="px-4 pb-4 pt-1 border-t border-white/[0.04] space-y-3">
                        {d.strengths.length > 0 && (
                          <div>
                            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Strengths</span>
                            <ul className="mt-1 space-y-0.5">
                              {d.strengths.map((s, i) => (
                                <li key={i} className="text-[12px] text-gray-400 flex items-start gap-2">
                                  <svg className="w-3 h-3 mt-0.5 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {d.weaknesses.length > 0 && (
                          <div>
                            <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">Areas for Improvement</span>
                            <ul className="mt-1 space-y-0.5">
                              {d.weaknesses.map((w, i) => (
                                <li key={i} className="text-[12px] text-gray-400 flex items-start gap-2">
                                  <svg className="w-3 h-3 mt-0.5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                  {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {d.suggestions.length > 0 && (
                          <div>
                            <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider">Suggestions</span>
                            <ul className="mt-1 space-y-0.5">
                              {d.suggestions.map((s, i) => (
                                <li key={i} className="text-[12px] text-gray-400 flex items-start gap-2">
                                  <span className="text-orange-400 shrink-0">-</span>
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {d.strengths.length === 0 && d.weaknesses.length === 0 && d.suggestions.length === 0 && (
                          <p className="text-[12px] text-gray-600">No detailed breakdown available for this dimension.</p>
                        )}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>

            {/* Custom Criteria Results */}
            {result.customCriteriaResults && result.customCriteriaResults.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-white mb-3">Custom Criteria</h2>
                <div className="space-y-2">
                  {result.customCriteriaResults.map((c, i) => (
                    <div key={i} className="bg-[#0C1120] border border-white/[0.06] rounded-lg px-4 py-3 flex items-center justify-between">
                      <div>
                        <span className="text-[13px] font-medium text-white">{c.name}</span>
                        <span className="text-[11px] text-gray-600 ml-2 capitalize">{c.type}</span>
                        <p className="text-[11px] text-gray-500 mt-0.5">{c.details}</p>
                      </div>
                      <span className={`text-lg font-bold ${c.score >= 80 ? "text-emerald-400" : c.score >= 60 ? "text-amber-400" : c.score >= 40 ? "text-orange-400" : "text-red-400"}`}>{c.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "journey" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-white mb-1">Your Prompt Journey</h2>
              <p className="text-xs text-gray-400 mb-4">
                {messages.length > 0 ? `You made ${Math.ceil(messages.length / 2)} prompt attempt${Math.ceil(messages.length / 2) !== 1 ? "s" : ""}.` : "No prompt history available."}
              </p>
              {messages.length > 0 ? <AttemptTimeline messages={messages} /> : (
                <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-8 text-center">
                  <p className="text-gray-500 text-sm">Prompt history is only available for sessions completed in this browser tab.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "comparison" && (
          <div className="space-y-6">
            <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5 text-center">
              <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Your Percentile</p>
              <div className="text-5xl font-bold text-orange-400 mb-1">{result.percentile}<span className="text-lg text-gray-600 font-normal">th</span></div>
              <p className="text-sm text-gray-500">You scored higher than {result.percentile}% of all candidates</p>
            </div>
            <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Score Distribution</h3>
              <ScoreDistributionChart userScore={result.promptScore} />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={async () => {
              const guestInfo = sessionStorage.getItem(`guest-${id}`);
              const guest = guestInfo ? JSON.parse(guestInfo) : {};
              const res = await fetch("/api/test/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...result,
                  testName,
                  candidateName: guest.name || "Candidate",
                  candidateEmail: guest.email || "",
                }),
              });
              if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `InpromptiFy-Report.pdf`;
                a.click();
                URL.revokeObjectURL(url);
              }
            }}
            className="bg-orange-500 hover:bg-orange-400 text-white px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            Download PDF
          </button>
          <div className="relative">
            <button onClick={handleShare} className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] text-gray-400 px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
              {copied ? "Link Copied" : "Share Score"}
            </button>
            {shareTooltip && <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">Copied!</div>}
          </div>
          {attemptId && (
            <a
              href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent("AI Proficiency — PromptScore " + result.promptScore)}&organizationName=${encodeURIComponent("InpromptiFy")}&certUrl=${encodeURIComponent("https://inpromptify.com/score/" + attemptId)}&certId=${attemptId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0A66C2] hover:bg-[#004182] text-white px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          )}
          <Link href="/explore" className="bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] text-gray-400 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-center">Try Another</Link>
        </div>
      </div>
    </div>
  );
}

function makeDimension(score: number, weight: number) {
  return { score, weight, weightedScore: Math.round(score * weight), strengths: [] as string[], weaknesses: [] as string[], suggestions: [] as string[] };
}

function buildLegacyResult(data: Record<string, unknown>): StoredResult {
  const ps = (data.promptScore as number) || 60;
  return {
    promptScore: ps,
    letterGrade: ps >= 95 ? "S" : ps >= 80 ? "A" : ps >= 65 ? "B" : ps >= 50 ? "C" : ps >= 35 ? "D" : "F",
    percentile: (data.percentile as number) || 50,
    dimensions: {
      promptQuality: makeDimension((data.accuracy as number) || ps, 0.3),
      efficiency: makeDimension((data.efficiency as number) || ps, 0.15),
      speed: makeDimension((data.speed as number) || ps, 0.15),
      responseQuality: makeDimension(ps, 0.25),
      iterationIQ: makeDimension(ps, 0.15),
    },
    feedback: { summary: "Score imported from a previous version.", topStrengths: [], topWeaknesses: [], improvementPlan: [] },
    stats: {
      attemptsUsed: (data.attemptsUsed as number) || 0,
      tokensUsed: (data.tokensUsed as number) || 0,
      timeSpentSeconds: (data.timeSpentSeconds as number) || 0,
      maxAttempts: (data.maxAttempts as number) || 5,
      tokenBudget: (data.tokenBudget as number) || 2000,
      timeLimitMinutes: (data.timeLimitMinutes as number) || 15,
      totalPrompts: (data.attemptsUsed as number) || 0,
      avgPromptLength: 0,
      totalResponseLength: 0,
    },
    criteriaUsed: "Legacy",
    evaluatedAt: new Date().toISOString(),
    testName: data.testName as string,
    testDescription: data.testDescription as string,
    messages: (data.messages as StoredMessage[]) || [],
  };
}
