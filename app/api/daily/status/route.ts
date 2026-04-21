import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
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
    const totalToday = await prisma.dailyQuizAttempt.count({ where: { date } });
    const topScore = await prisma.dailyQuizAttempt.findFirst({
      where: { date },
      orderBy: { score: "desc" },
      select: { score: true },
    });

    return NextResponse.json({
      taken: false,
      todayStats: {
        participants: totalToday,
        topScore: topScore?.score ?? 0,
      },
    });
  } catch (error) {
    console.error("Daily status error:", error);
    return NextResponse.json({ taken: false, todayStats: { participants: 0, topScore: 0 } });
  }
}
