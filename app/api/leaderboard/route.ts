import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** GET /api/leaderboard — public leaderboard of assessment scores */
export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get("range") || req.nextUrl.searchParams.get("period") || "all";

  try {
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

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Leaderboard error:", error);
    // Return empty leaderboard if DB not connected
    return NextResponse.json({ entries: [] });
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
