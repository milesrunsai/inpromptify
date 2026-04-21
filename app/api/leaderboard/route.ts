import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DIMENSION_LABELS: Record<string, string> = {
  promptQuality: "Prompt Quality",
  efficiency: "Efficiency",
  responseQuality: "Response Quality",
  iterationIntelligence: "Iteration Intelligence",
  speed: "Speed",
};

interface PerformanceScores {
  promptQuality?: number;
  efficiency?: number;
  responseQuality?: number;
  iterationIntelligence?: number;
  overall?: number;
}

interface DailyResponses {
  displayName?: string;
  mcq?: unknown[];
  performance?: {
    score?: PerformanceScores;
  };
}

function extractPerformanceData(responses: unknown): {
  performanceScore: number | null;
  topDimension: string | null;
  weakDimension: string | null;
} {
  const result = { performanceScore: null as number | null, topDimension: null as string | null, weakDimension: null as string | null };

  if (!responses || typeof responses !== "object") return result;

  const data = responses as DailyResponses;
  const scores = data?.performance?.score;
  if (!scores) return result;

  if (typeof scores.overall === "number") {
    result.performanceScore = Math.round(scores.overall);
  }

  // Find top and weak dimensions (excluding 'overall')
  const dims: [string, number][] = [];
  for (const [key, val] of Object.entries(scores)) {
    if (key !== "overall" && typeof val === "number") {
      dims.push([key, val]);
    }
  }

  if (dims.length > 0) {
    dims.sort((a, b) => b[1] - a[1]);
    result.topDimension = DIMENSION_LABELS[dims[0][0]] || dims[0][0];
    result.weakDimension = DIMENSION_LABELS[dims[dims.length - 1][0]] || dims[dims.length - 1][0];
  }

  return result;
}

/** GET /api/leaderboard — supports tab=daily|weekly|alltime */
export async function GET(req: NextRequest) {
  const tab = req.nextUrl.searchParams.get("tab");

  try {
    // ── Daily tab ──
    if (tab === "daily") {
      const today = new Date().toISOString().slice(0, 10);
      const attempts = await prisma.dailyQuizAttempt.findMany({
        where: { date: today },
        orderBy: [{ score: "desc" }, { createdAt: "asc" }],
        take: 100,
      });

      const entries = attempts.map((a, i) => {
        const perf = extractPerformanceData(a.responses);
        const percentage = a.totalQuestions > 0 ? Math.round((a.score / a.totalQuestions) * 100) : 0;
        return {
          rank: i + 1,
          name: ((a.responses as DailyResponses)?.displayName) || anonymizeEmail(a.email),
          percentage,
          score: a.score,
          totalQuestions: a.totalQuestions,
          streak: a.streak,
          performanceScore: perf.performanceScore,
          topDimension: perf.topDimension,
          weakDimension: perf.weakDimension,
        };
      });

      const totalPlayers = entries.length;
      const avgPercentage = totalPlayers > 0
        ? Math.round(entries.reduce((sum, e) => sum + e.percentage, 0) / totalPlayers)
        : 0;
      const perfectScores = entries.filter((e) => e.percentage === 100).length;

      return NextResponse.json({
        entries,
        stats: { totalPlayers, avgPercentage, perfectScores },
        tab: "daily",
      });
    }

    // ── Weekly tab ──
    if (tab === "weekly") {
      const weekAgo = new Date();
      weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);
      const weekAgoStr = weekAgo.toISOString().slice(0, 10);

      const attempts = await prisma.dailyQuizAttempt.findMany({
        where: { date: { gte: weekAgoStr } },
        orderBy: { score: "desc" },
      });

      // Aggregate per email
      const byEmail = new Map<
        string,
        {
          displayName: string | null;
          totalScore: number;
          totalQuestions: number;
          streak: number;
          days: number;
          bestPerf: ReturnType<typeof extractPerformanceData>;
        }
      >();

      for (const a of attempts) {
        const perf = extractPerformanceData(a.responses);
        const dn = (a.responses as DailyResponses)?.displayName || null;
        const existing = byEmail.get(a.email);
        if (!existing) {
          byEmail.set(a.email, {
            displayName: dn,
            totalScore: a.score,
            totalQuestions: a.totalQuestions,
            streak: a.streak,
            days: 1,
            bestPerf: perf,
          });
        } else {
          if (dn) existing.displayName = dn;
          existing.totalScore += a.score;
          existing.totalQuestions += a.totalQuestions;
          existing.days += 1;
          if (a.streak > existing.streak) existing.streak = a.streak;
          if (perf.performanceScore !== null && existing.bestPerf.performanceScore === null) {
            existing.bestPerf = perf;
          }
        }
      }

      const sorted = [...byEmail.entries()]
        .map(([email, data]) => {
          const percentage = data.totalQuestions > 0
            ? Math.round((data.totalScore / data.totalQuestions) * 100)
            : 0;
          return { email, percentage, ...data };
        })
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 100);

      const entries = sorted.map((item, i) => ({
        rank: i + 1,
        name: item.displayName || anonymizeEmail(item.email),
        percentage: item.percentage,
        score: item.totalScore,
        totalQuestions: item.totalQuestions,
        streak: item.streak,
        days: item.days,
        performanceScore: item.bestPerf.performanceScore,
        topDimension: item.bestPerf.topDimension,
        weakDimension: item.bestPerf.weakDimension,
      }));

      const totalPlayers = entries.length;
      const avgPercentage = totalPlayers > 0
        ? Math.round(entries.reduce((sum, e) => sum + e.percentage, 0) / totalPlayers)
        : 0;
      const perfectScores = entries.filter((e) => e.percentage === 100).length;

      return NextResponse.json({
        entries,
        stats: { totalPlayers, avgPercentage, perfectScores },
        tab: "weekly",
      });
    }

    // ── All Time tab ──
    const assessments = await prisma.assessment.findMany({
      where: {
        status: "COMPLETED",
        score: { not: null },
        isPublic: true,
        visibility: "public",
      },
      orderBy: { score: "desc" },
      take: 100,
      select: {
        id: true,
        candidateEmail: true,
        score: true,
        dimensionScores: true,
        completedAt: true,
      },
    });

    const entries = assessments.map((a, i) => {
      const dims = (a.dimensionScores as Record<string, number>) || {};
      let topDimension: string | null = null;
      let weakDimension: string | null = null;

      const dimEntries = Object.entries(dims).filter(([, v]) => typeof v === "number");
      if (dimEntries.length > 0) {
        dimEntries.sort((x, y) => y[1] - x[1]);
        topDimension = DIMENSION_LABELS[dimEntries[0][0]] || dimEntries[0][0];
        weakDimension = DIMENSION_LABELS[dimEntries[dimEntries.length - 1][0]] || dimEntries[dimEntries.length - 1][0];
      }

      return {
        rank: i + 1,
        name: anonymizeEmail(a.candidateEmail),
        percentage: a.score || 0, // Assessment score is already 0-100
        score: a.score || 0,
        totalQuestions: 100,
        streak: 0,
        performanceScore: null,
        topDimension,
        weakDimension,
      };
    });

    const totalPlayers = entries.length;
    const avgPercentage = totalPlayers > 0
      ? Math.round(entries.reduce((sum, e) => sum + e.percentage, 0) / totalPlayers)
      : 0;
    const perfectScores = entries.filter((e) => e.percentage === 100).length;

    return NextResponse.json({
      entries,
      stats: { totalPlayers, avgPercentage, perfectScores },
      tab: "alltime",
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({
      entries: [],
      stats: { totalPlayers: 0, avgPercentage: 0, perfectScores: 0 },
      tab: tab || "alltime",
    });
  }
}

/** Anonymize email: john.doe@company.com → john.d***@c***.com */
function anonymizeEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "Anonymous";

  const anonLocal =
    local.length <= 2
      ? local + "***"
      : local.slice(0, Math.min(local.length, 4)) + "***";

  const domainParts = domain.split(".");
  const anonDomain =
    domainParts[0].slice(0, 1) +
    "***." +
    domainParts.slice(1).join(".");

  return `${anonLocal}@${anonDomain}`;
}
