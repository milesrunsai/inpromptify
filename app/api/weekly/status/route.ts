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

/** Get end of current ISO week (Sunday 23:59:59 UTC) */
function getWeekEnd(): Date {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  // Days until Sunday
  const daysUntilSunday = 7 - dayNum;
  d.setUTCDate(d.getUTCDate() + daysUntilSunday);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

/** Check if we're within the first 3 months of weekly challenges (prize eligible) */
function isPrizeEligible(): boolean {
  // Prize runs for first 3 months from launch (April 2026)
  const launchDate = new Date("2026-04-21T00:00:00Z");
  const prizeEnd = new Date("2026-07-21T00:00:00Z");
  const now = new Date();
  return now >= launchDate && now < prizeEnd;
}

/** GET /api/weekly/status — check weekly challenge status */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const weekId = getWeekId();

    const [attempt, participants] = await Promise.all([
      prisma.weeklyChallengeAttempt.findUnique({
        where: { userId_weekId: { userId: user.id, weekId } },
      }),
      prisma.weeklyChallengeAttempt.count({
        where: { weekId },
      }),
    ]);

    return NextResponse.json({
      taken: !!attempt,
      attempt: attempt || undefined,
      weekId,
      endsAt: getWeekEnd().toISOString(),
      prize: isPrizeEligible(),
      participants,
    });
  } catch (error) {
    console.error("Weekly status error:", error);
    return NextResponse.json({
      taken: false,
      weekId: getWeekId(),
      endsAt: getWeekEnd().toISOString(),
      prize: false,
      participants: 0,
    });
  }
}
