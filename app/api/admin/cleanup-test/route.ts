import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

/** DELETE /api/admin/cleanup-test — removes test/dev data from leaderboards */
export async function DELETE(req: NextRequest) {
  // Auth: admin-only or secret token
  const secret = req.nextUrl.searchParams.get("secret");
  const adminSecret = process.env.ADMIN_SECRET;

  if (secret && adminSecret && secret === adminSecret) {
    // OK via secret
  } else {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const results: Record<string, number> = {};

  // Delete test daily quiz attempts
  const deletedDaily = await prisma.dailyQuizAttempt.deleteMany({
    where: {
      OR: [
        { email: { contains: "test" } },
        { email: { contains: "inpromptyou" } },
      ],
    },
  });
  results.dailyQuizAttempts = deletedDaily.count;

  // Delete test assessments
  const deletedAssessments = await prisma.assessment.deleteMany({
    where: {
      OR: [
        { candidateEmail: { contains: "test" } },
        { candidateEmail: { contains: "inpromptyou" } },
      ],
    },
  });
  results.assessments = deletedAssessments.count;

  // Delete test weekly attempts
  try {
    const deletedWeekly = await prisma.weeklyChallengeAttempt.deleteMany({
      where: {
        user: {
          email: { contains: "test" },
        },
      },
    });
    results.weeklyAttempts = deletedWeekly.count;
  } catch {
    results.weeklyAttempts = 0;
  }

  return NextResponse.json({ success: true, deleted: results });
}
