import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** GET /api/daily/status — check if user/email already took today's quiz */
export async function GET(req: NextRequest) {
  try {
    const date = getTodayDateString();
    const email = req.nextUrl.searchParams.get("email");

    // Try logged-in user first
    let attempt = null;
    try {
      const user = await getCurrentUser();
      if (user) {
        attempt = await prisma.dailyQuizAttempt.findUnique({
          where: { email_date: { email: user.email, date } },
        });
        if (attempt) {
          return NextResponse.json({ taken: true, attempt });
        }
      }
    } catch {}

    // Try by email param
    if (email) {
      attempt = await prisma.dailyQuizAttempt.findUnique({
        where: { email_date: { email: email.toLowerCase(), date } },
      });
      if (attempt) {
        return NextResponse.json({ taken: true, attempt });
      }
    }

    // Get today's stats
    const [totalToday, topScore, avgResult, yesterdayTop] = await Promise.all([
      prisma.dailyQuizAttempt.count({ where: { date } }),
      prisma.dailyQuizAttempt.findFirst({
        where: { date },
        orderBy: { score: "desc" },
        select: { score: true },
      }),
      prisma.dailyQuizAttempt.aggregate({
        where: { date },
        _avg: { score: true },
      }),
      prisma.dailyQuizAttempt.findMany({
        where: { date: getYesterdayDateString() },
        orderBy: [{ score: "desc" }, { createdAt: "asc" }],
        take: 5,
        select: { email: true, score: true, totalQuestions: true },
      }),
    ]);

    // Anonymize yesterday's emails
    const yesterdayLeaders = yesterdayTop.map((e, i) => {
      const parts = e.email.split("@");
      const name = parts[0].length > 2
        ? parts[0].slice(0, 2) + "***"
        : parts[0] + "***";
      return {
        rank: i + 1,
        name,
        score: e.score,
        totalQuestions: e.totalQuestions,
      };
    });

    return NextResponse.json({
      taken: false,
      todayStats: {
        participants: totalToday,
        topScore: topScore?.score ?? 0,
        avgScore: avgResult._avg.score
          ? Math.round(avgResult._avg.score * 10) / 10
          : 0,
      },
      yesterdayLeaders,
    });
  } catch (error) {
    console.error("Daily status error:", error);
    return NextResponse.json({
      taken: false,
      todayStats: { participants: 0, topScore: 0, avgScore: 0 },
      yesterdayLeaders: [],
    });
  }
}
