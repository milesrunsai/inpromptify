"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface ScoreData {
  id: number;
  score: number;
  grade: string;
  percentile: number;
  candidateName: string;
  testName: string;
  testDescription: string;
  dimensions: { pq: number; eff: number; spd: number; rq: number; iq: number };
  tokensUsed: number;
  attemptsUsed: number;
  completedAt: string;
}

function DimensionBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] text-gray-500 w-36 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[13px] font-semibold text-white w-8 text-right">{value}</span>
    </div>
  );
}

export default function PublicScorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [creatingBadge, setCreatingBadge] = useState(false);

  useEffect(() => {
    fetch(`/api/score/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.score !== undefined) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    const url = `https://inpromptify.com/score/${id}`;
    if (navigator.share) {
      try { await navigator.share({ title: `PromptScore: ${data?.score}/100`, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scoreColor = (s: number) => s >= 80 ? "#10b981" : s >= 65 ? "#6366f1" : s >= 50 ? "#f59e0b" : "#ef4444";
  const recommendation = (s: number) => s >= 80 ? "Strong Hire" : s >= 65 ? "Hire" : s >= 50 ? "Consider with Training" : "Needs Development";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-bold text-white mb-2">Score Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">This score may not exist or hasn't been made public yet.</p>
          <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Back to InpromptiFy</Link>
        </div>
      </div>
    );
  }

  const color = scoreColor(data.score);

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Header */}
      <div className="bg-[#0C1120] border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm text-white">
            <span className="inline-flex items-center gap-1.5"><img src="/logo.png" alt="InpromptiFy" width={18} height={18} /><span className="font-semibold text-white">InpromptiFy</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-600 uppercase tracking-wider">Verified PromptScore</span>
            <Link href="/test/demo" className="text-[12px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Get Yours</Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-10">
        {/* Score Hero */}
        <div className="text-center mb-10">
          <p className="text-[13px] text-gray-500 mb-2">{data.testName}</p>
          <h1 className="text-xl font-bold text-white mb-6">{data.candidateName}</h1>

          <div className="inline-flex flex-col items-center">
            <div
              className="w-40 h-40 rounded-full flex flex-col items-center justify-center mb-3"
              style={{ border: `5px solid ${color}`, background: "rgba(255,255,255,0.02)" }}
            >
              <span className="text-6xl font-extrabold text-white leading-none">{data.score}</span>
              <span className="text-sm font-semibold mt-1" style={{ color }}>{data.grade}</span>
            </div>
            <div className="text-sm font-semibold" style={{ color }}>{recommendation(data.score)}</div>
            <p className="text-[13px] text-gray-500 mt-1">Better than {data.percentile}% of candidates</p>
          </div>
        </div>

        {/* Dimensions */}
        <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-white mb-4">Performance Breakdown</h2>
          <div className="space-y-3">
            <DimensionBar label="Prompt Quality" value={data.dimensions.pq} color={color} />
            <DimensionBar label="Efficiency" value={data.dimensions.eff} color={color} />
            <DimensionBar label="Speed" value={data.dimensions.spd} color={color} />
            <DimensionBar label="Response Quality" value={data.dimensions.rq} color={color} />
            <DimensionBar label="Iteration IQ" value={data.dimensions.iq} color={color} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Tokens Used", value: data.tokensUsed?.toLocaleString() || "—" },
            { label: "Attempts", value: data.attemptsUsed?.toString() || "—" },
            { label: "Completed", value: data.completedAt ? new Date(data.completedAt).toLocaleDateString() : "—" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0C1120] border border-white/[0.06] rounded-lg p-4 text-center">
              <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">{s.label}</div>
              <div className="text-sm font-semibold text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Verified Badge CTA */}
        <div className="bg-gradient-to-r from-emerald-600/[0.08] to-indigo-600/[0.04] rounded-xl border border-emerald-500/[0.12] p-6 mb-6">
          <h3 className="text-sm font-semibold text-white mb-1">Get Your Verified Credential</h3>
          <p className="text-[13px] text-gray-500 mb-4">Create a permanent, shareable verification page with your PromptScore, certification badge, and dimension breakdown.</p>
          <button
            onClick={async () => {
              if (!data || creatingBadge) return;
              setCreatingBadge(true);
              try {
                const res = await fetch("/api/verify/create", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userName: data.candidateName,
                    score: data.score,
                    letterGrade: data.grade,
                    percentile: data.percentile,
                    dimensions: {
                      promptQuality: data.dimensions.pq,
                      efficiency: data.dimensions.eff,
                      speed: data.dimensions.spd,
                      responseQuality: data.dimensions.rq,
                      iterationIQ: data.dimensions.iq,
                    },
                  }),
                });
                const result = await res.json();
                if (result.hash) {
                  window.location.href = `/verify/${result.hash}`;
                }
              } catch {
                alert("Failed to create verification. Please try again.");
              } finally {
                setCreatingBadge(false);
              }
            }}
            disabled={creatingBadge}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[13px] font-medium px-5 py-2.5 rounded-md transition-colors"
          >
            {creatingBadge ? "Creating..." : "Get Shareable Verified Badge"}
          </button>
        </div>

        {/* Share / Actions */}
        <div className="bg-gradient-to-r from-indigo-600/[0.08] to-violet-600/[0.04] rounded-xl border border-indigo-500/[0.12] p-6 mb-6">
          <h3 className="text-sm font-semibold text-white mb-1">Share Your PromptScore</h3>
          <p className="text-[13px] text-gray-500 mb-4">Add it to your resume, LinkedIn, or portfolio to prove your AI proficiency.</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleShare} className="bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-medium px-5 py-2.5 rounded-md transition-colors">
              {copied ? "Link Copied" : "Copy Share Link"}
            </button>
            <a
              href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent("AI Proficiency Assessment — PromptScore " + data.score)}&organizationName=${encodeURIComponent("InpromptiFy")}&certUrl=${encodeURIComponent("https://inpromptify.com/score/" + id)}&certId=${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0A66C2] hover:bg-[#004182] text-white text-[13px] font-medium px-5 py-2.5 rounded-md transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Add to LinkedIn
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I scored ${data.score}/100 on an AI proficiency assessment — better than ${data.percentile}% of candidates.\n\nTest your prompting skills:`)}&url=${encodeURIComponent("https://inpromptify.com/score/" + id)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/[0.06] hover:bg-white/[0.1] text-white text-[13px] font-medium px-5 py-2.5 rounded-md transition-colors border border-white/[0.08] flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Post on X
            </a>
          </div>
        </div>

        {/* Embed badge code */}
        <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-white mb-1">Embed Badge</h3>
          <p className="text-[13px] text-gray-500 mb-3">Add your verified PromptScore to your website or portfolio.</p>
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3 font-mono text-[11px] text-gray-400 break-all select-all">
            {`<a href="https://inpromptify.com/score/${id}" target="_blank"><img src="https://inpromptify.com/api/badge/${id}" alt="PromptScore: ${data.score}/100" height="32" /></a>`}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">What's your PromptScore?</h3>
          <p className="text-[13px] text-gray-500 mb-5">Take a free AI proficiency assessment and find out where you rank.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/test/demo" className="bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-medium px-6 py-3 rounded-md transition-colors">
              Take the Assessment
            </Link>
            <Link href="/explore" className="bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] text-gray-400 text-[13px] font-medium px-6 py-3 rounded-md transition-colors">
              Browse Tests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
