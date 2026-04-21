import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/** Get ISO week ID like '2026-W17' — week starts Monday */
function getWeekId(): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/** GET /api/weekly/leaderboard — top 50 for current week */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const weekId = getWeekId();

    const attempts = await prisma.weeklyChallengeAttempt.findMany({
      where: { weekId },
      orderBy: [{ score: "desc" }, { totalTimeMs: "asc" }],
      take: 50,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    const entries = attempts.map((a, i) => {
      // Anonymize: use name if set, otherwise first 2 chars of email
      const displayName = a.user.name
        ? a.user.name
        : a.user.email.length > 2
        ? a.user.email.slice(0, 2) + "***"
        : a.user.email + "***";

      return {
        rank: i + 1,
        name: displayName,
        score: a.score,
        totalQuestions: a.totalQuestions,
        totalTimeMs: a.totalTimeMs,
        isYou: a.userId === user.id,
      };
    });

    return NextResponse.json({ weekId, entries });
  } catch (error) {
    console.error("Weekly leaderboard error:", error);
    return NextResponse.json({ weekId: "", entries: [] });
  }
}
