import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** GET /api/leaderboard — supports tab=daily|weekly|alltime (default) and legacy range param */
export async function GET(req: NextRequest) {
  const tab = req.nextUrl.searchParams.get("tab");
  const range = req.nextUrl.searchParams.get("range") || req.nextUrl.searchParams.get("period");

  try {
    // Daily tab — today's DailyQuizAttempt scores
    if (tab === "daily") {
      const today = new Date().toISOString().slice(0, 10);
      const attempts = await prisma.dailyQuizAttempt.findMany({
        where: { date: today },
        orderBy: [{ score: "desc" }, { createdAt: "asc" }],
        take: 100,
      });

      const entries = attempts.map((a, i) => ({
        rank: i + 1,
        name: anonymizeEmail(a.email),
        score: a.score,
        date: new Date(a.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        streak: a.streak,
        totalQuestions: a.totalQuestions,
      }));

      return NextResponse.json({ entries, tab: "daily" });
    }

    // Weekly tab — best score per email over last 7 days
    if (tab === "weekly") {
      const weekAgo = new Date();
      weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);
      const weekAgoStr = weekAgo.toISOString().slice(0, 10);

      const attempts = await prisma.dailyQuizAttempt.findMany({
        where: { date: { gte: weekAgoStr } },
        orderBy: { score: "desc" },
      });

      // Best score per email + total correct across days
      const byEmail = new Map<string, { bestScore: number; totalCorrect: number; streak: number; days: number }>();
      for (const a of attempts) {
        const existing = byEmail.get(a.email);
        if (!existing) {
          byEmail.set(a.email, {
            bestScore: a.score,
            totalCorrect: a.score,
            streak: a.streak,
            days: 1,
          });
        } else {
          existing.totalCorrect += a.score;
          existing.days += 1;
          if (a.score > existing.bestScore) existing.bestScore = a.score;
          if (a.streak > existing.streak) existing.streak = a.streak;
        }
      }

      const sorted = [...byEmail.entries()]
        .sort((a, b) => b[1].totalCorrect - a[1].totalCorrect)
        .slice(0, 100);

      const entries = sorted.map(([email, data], i) => ({
        rank: i + 1,
        name: anonymizeEmail(email),
        score: data.totalCorrect,
        bestScore: data.bestScore,
        streak: data.streak,
        days: data.days,
        date: `${data.days} day${data.days !== 1 ? "s" : ""}`,
      }));

      return NextResponse.json({ entries, tab: "weekly" });
    }

    // All Time tab — full assessments (default, also handles legacy range param)
    let dateFilter = {};
    const now = new Date();

    if (range === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { completedAt: { gte: weekAgo } };
    } else if (range === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { completedAt: { gte: monthAgo } };
    }

    const assessments = await prisma.assessment.findMany({
      where: {
        status: "COMPLETED",
        score: { not: null },
        isPublic: true,
        visibility: "public",
        ...dateFilter,
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

    const entries = assessments.map((a, index) => ({
      rank: index + 1,
      name: anonymizeEmail(a.candidateEmail),
      score: a.score || 0,
      role: "General Assessment",
      date: a.completedAt
        ? new Date(a.completedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Unknown",
      dimensions: (a.dimensionScores as Record<string, number>) || {},
    }));

    return NextResponse.json({ entries, tab: "alltime" });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ entries: [], tab: tab || "alltime" });
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
