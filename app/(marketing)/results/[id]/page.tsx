"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ScoreRing } from "@/components/ui/score-ring";

interface ResultData {
  score: number;
  dimensions: Record<string, number>;
  date: string;
  name?: string;
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "Exceptional";
  if (score >= 70) return "Proficient";
  if (score >= 55) return "Developing";
  return "Needs Improvement";
}

export default function ResultsPage() {
  const params = useParams();
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const id = params.id as string;
      if (id) {
        // Decode the base64 result data
        const decoded = atob(id);
        const data = JSON.parse(decoded);
        setResultData(data);
      }
    } catch (error) {
      console.error("Failed to decode result data:", error);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Result</h1>
          <p className="text-gray-600 mb-8">This result link is not valid or has expired.</p>
          <Link 
            href="/assess"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            Take Assessment
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}${typeof window !== "undefined" ? window.location.pathname : ""}`;
  const shareText = `I scored ${resultData.score}/100 (${getScoreLabel(resultData.score)}) on the Inpromptify AI Proficiency Assessment. Think you can beat it?`;

  return (
    <>
      <style>{`header, nav, footer, [role="banner"], [role="contentinfo"] { display: none !important; }`}</style>
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-6 py-16">
          
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-orange-500 uppercase tracking-widest mb-6">Assessment Complete</p>
            <ScoreRing score={resultData.score} />
            <p className="mt-2 text-sm text-gray-400">
              AI Proficiency Assessment Result
            </p>
          </div>

          {/* Score breakdown */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Your AI Skills Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(resultData.dimensions || {}).map(([dimension, score]) => (
                <div key={dimension} className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {dimension.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{score}/100</span>
                </div>
              ))}
            </div>
          </div>

          {/* Share section */}
          <div className="text-center mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Score</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                  alert('Link copied to clipboard!');
                }}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
              >
                Copy Link
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
              >
                Share on X
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/assess"
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 text-center"
            >
              Retake Assessment
            </Link>
            <Link 
              href="/leaderboard"
              className="border border-gray-300 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-50 text-center"
            >
              View Leaderboard
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center mt-16">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}