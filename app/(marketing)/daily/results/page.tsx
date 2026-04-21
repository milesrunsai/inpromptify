"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ResultsContent() {
  const params = useSearchParams();
  const date = params.get("date") || new Date().toISOString().slice(0, 10);
  const score = parseInt(params.get("score") || "0", 10);

  const formattedDate = new Date(date + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const shareText = `I scored ${score}/5 on today's InpromptiFy Daily AI Challenge! Can you beat me? inpromptify.com/daily`;

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
        <span className="inline-block text-xs tracking-[0.2em] uppercase text-orange-500 font-mono mb-4">
          [ Daily Challenge Result ]
        </span>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 mb-8">
          <p className="text-sm text-white/40 mb-4">{formattedDate}</p>
          <div className="text-7xl font-bold gradient-text mb-4">
            {score}/5
          </div>
          <p className="text-lg text-white/60">
            {score >= 5
              ? "Perfect score!"
              : score >= 4
              ? "Outstanding!"
              : score >= 3
              ? "Great job!"
              : score >= 2
              ? "Not bad!"
              : "Keep practicing!"}
          </p>
        </div>

        <div className="mb-8">
          <p className="text-sm text-white/40 mb-3">Think you can do better?</p>
          <Link href="/daily" className="glow-btn px-8 py-3.5 text-base inline-block">
            Take Today&apos;s Challenge
          </Link>
        </div>

        <div className="flex items-center justify-center gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Post on X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

export default function DailyResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
