"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface ResultData {
  score: number;
  dimensions: Record<string, number>;
  role: string;
  date: string;
  name?: string;
}

const DIMENSION_LABELS: Record<string, string> = {
  promptQuality: "Prompt Quality",
  efficiency: "Efficiency",
  speed: "Speed",
  responseQuality: "Response Quality",
  iterationIntelligence: "Iteration Intelligence",
};

function getScoreLabel(score: number): string {
  if (score >= 90) return "Exceptional";
  if (score >= 80) return "Expert";
  if (score >= 65) return "Proficient";
  if (score >= 45) return "Intermediate";
  if (score >= 25) return "Developing";
  return "Beginner";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 65) return "#f97316";
  if (score >= 45) return "#eab308";
  return "#ef4444";
}

function getRecommendation(score: number): { label: string; color: string; text: string } {
  if (score >= 75) return { label: "Strong Hire", color: "#22c55e", text: "Demonstrates advanced AI fluency across multiple dimensions. Recommended for AI-intensive roles." };
  if (score >= 55) return { label: "Hire", color: "#f97316", text: "Solid AI proficiency with room for growth. Suitable for roles with moderate AI requirements." };
  if (score >= 40) return { label: "Conditional", color: "#eab308", text: "Foundational AI knowledge present. May benefit from targeted training before placement." };
  return { label: "Not Ready", color: "#ef4444", text: "Significant gaps in AI proficiency. Recommend structured upskilling program before assessment." };
}

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    // Decode result from URL param (base64 encoded JSON)
    try {
      const decoded = atob(id);
      const data = JSON.parse(decoded);
      setResult(data);
    } catch {
      setResult(null);
    }
  }, [id]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Invalid or expired results link.</p>
      </div>
    );
  }

  const recommendation = getRecommendation(result.score);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Score Card */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ minHeight: "600px" }}
        >
          {/* Background */}
          <img
            src="/scorecard-bg.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Content overlay */}
          <div className="relative z-10 p-8 sm:p-12 flex flex-col h-full min-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Image
                src="/logo.png"
                alt="InpromptiFy"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
              <span className="text-xs text-white/40 tracking-wider uppercase">
                AI Proficiency Assessment
              </span>
            </div>

            {/* Score */}
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              {result.name && (
                <p className="text-sm text-white/50 mb-4">{result.name}</p>
              )}

              {/* Score circle */}
              <div className="relative w-40 h-40 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke={getScoreColor(result.score)}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.score / 100) * 339.292} 339.292`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white tabular-nums">
                    {result.score}
                  </span>
                  <span className="text-xs text-white/50 mt-1">/ 100</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white">
                {getScoreLabel(result.score)}
              </h2>
              <p className="text-sm text-white/50 mt-1">
                PromptScore
              </p>

              {/* Recommendation badge */}
              <div
                className="mt-4 px-4 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${recommendation.color}20`,
                  color: recommendation.color,
                }}
              >
                {recommendation.label}
              </div>
            </div>

            {/* Dimension bars */}
            <div className="space-y-3 mb-8">
              {Object.entries(DIMENSION_LABELS).map(([key, label]) => {
                const score = Math.round(result.dimensions[key] || 50);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-white/60">{label}</span>
                      <span className="text-white font-medium tabular-nums">{score}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${score}%`,
                          backgroundColor: getScoreColor(score),
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-white/30">
              <span>{result.role || "General Assessment"}</span>
              <span>inpromptify.com</span>
            </div>
          </div>
        </div>

        {/* CTA below card */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-white">
            Think you can beat this score?
          </h2>
          <p className="text-gray-400 mt-2">
            Take the free 3-minute AI proficiency assessment. No account required.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/assess"
              className="glow-btn px-8 py-3 text-sm font-medium inline-block text-center"
            >
              Take the Assessment
            </Link>
            <Link
              href="/features"
              className="ghost-btn px-8 py-3 text-sm inline-block text-center"
            >
              How It Works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
