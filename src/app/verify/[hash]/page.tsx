import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CertBadge from "@/components/CertBadge";
import { getSql } from "@/lib/db";
import { ensureSchema } from "@/lib/schema";
import { Metadata } from "next";
import { getCertTier } from "@/components/CertBadge";

interface VerifyPageProps {
  params: Promise<{ hash: string }>;
}

async function getVerification(hash: string) {
  try {
    await ensureSchema();
    const sql = getSql();
    const rows = await sql`
      SELECT hash, user_name, score, letter_grade, percentile, dimensions, created_at
      FROM score_verifications WHERE hash = ${hash}
    `;
    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { hash } = await params;
  const data = await getVerification(hash);
  if (!data) return { title: "Verification Not Found — InpromptiFy" };

  const tier = getCertTier(data.score);
  const tierLabel = tier ? ` | ${tier.charAt(0).toUpperCase() + tier.slice(1)} Certified` : "";
  const ord = (n: number) => { const s = ["th","st","nd","rd"]; const v = n % 100; return n + (s[(v-20)%10] || s[v] || s[0]); };

  return {
    title: `${data.user_name} — PromptScore ${data.score}/100${tierLabel} | InpromptiFy`,
    description: `${data.user_name} scored ${data.score}/100 (${data.letter_grade}, ${ord(data.percentile)} percentile) on the InpromptiFy AI Proficiency Assessment.${tierLabel ? ` ${tierLabel}.` : ""}`,
    openGraph: {
      title: `${data.user_name} — PromptScore ${data.score}/100${tierLabel}`,
      description: `Verified AI Proficiency Score: ${data.score}/100 (${data.letter_grade}). ${ord(data.percentile)} percentile.`,
      url: `https://inpromptify.com/verify/${hash}`,
      siteName: "InpromptiFy",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.user_name} — PromptScore ${data.score}/100`,
      description: `AI Proficiency Score: ${data.score}/100 (${data.letter_grade}). Verified by InpromptiFy.`,
    },
  };
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { hash } = await params;
  const data = await getVerification(hash);

  if (!data) {
    return (
      <>
        <Nav />
        <main className="bg-[#111118] min-h-screen">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Verification Not Found</h1>
            <p className="text-sm text-gray-500">This verification link is invalid or has expired.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const dims = typeof data.dimensions === "string" ? JSON.parse(data.dimensions) : data.dimensions;
  const scoreColor = data.score >= 80 ? "text-emerald-400" : data.score >= 65 ? "text-blue-400" : data.score >= 50 ? "text-amber-400" : "text-red-400";
  const dateStr = new Date(data.created_at).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" });
  const ordinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const shareUrl = `https://inpromptify.com/verify/${hash}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const twitterText = `I scored ${data.score}/100 on the InpromptiFy AI Proficiency Assessment (${data.letter_grade}, ${ordinal(data.percentile)} percentile). What's your PromptScore?`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;

  // Radar chart dimensions
  const dimLabels = ["Prompt Quality", "Efficiency", "Speed", "Response Quality", "Iteration IQ"];
  const dimValues = [
    dims.promptQuality ?? dims.accuracy ?? 0,
    dims.efficiency ?? 0,
    dims.speed ?? 0,
    dims.responseQuality ?? dims.quality ?? 0,
    dims.iterationIQ ?? dims.iteration ?? 0,
  ];

  return (
    <>
      <Nav />
      <main className="bg-[#111118] min-h-screen">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-[11px] font-mono text-orange-400/70 uppercase tracking-wider mb-3">Verified Score</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
              {data.user_name}
            </h1>
            <p className="text-sm text-gray-500">{dateStr}</p>
          </div>

          {/* Score Card */}
          <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <span className={`text-7xl font-bold ${scoreColor}`}>{data.score}</span>
                <span className="text-2xl text-gray-600">/100</span>
                <p className="text-sm text-gray-500 mt-1">PromptScore</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className={`text-2xl font-bold ${scoreColor}`}>{data.letter_grade}</span>
                    <p className="text-[11px] text-gray-600">Grade</p>
                  </div>
                  <div className="h-8 w-px bg-white/[0.06]" />
                  <div className="text-center">
                    <span className="text-2xl font-bold text-white">{ordinal(data.percentile)}</span>
                    <p className="text-[11px] text-gray-600">Percentile</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dimension Bars */}
            <div className="space-y-3 mb-6">
              {dimLabels.map((label, i) => (
                <div key={label}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-gray-500 font-mono">{Math.round(dimValues[i])}/100</span>
                  </div>
                  <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full transition-all"
                      style={{ width: `${Math.min(dimValues[i], 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Hash */}
            <div className="border-t border-white/[0.06] pt-4 flex items-center justify-between">
              <p className="text-[11px] text-gray-600 font-mono">Verification: {hash.slice(0, 12)}...</p>
              <p className="text-[11px] text-gray-600">Issued by InpromptiFy</p>
            </div>
          </div>

          {/* Certification Badge */}
          <div className="mb-6">
            <CertBadge score={data.score} showDesc />
          </div>

          {/* Share Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#0077B5] hover:bg-[#006399] text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Add to LinkedIn
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Share on X
            </a>
            <button
              onClick={undefined}
              className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]"
            >
              Copy Link
            </button>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Want to get your own PromptScore?</p>
            <a
              href="/test/demo"
              className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
            >
              Take the Assessment
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
