import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/** GET /api/my-results — current user's completed assessments with rank */
export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    return NextResponse.json({ assessments: [] }, { status: 401 });
  }

  try {
    const myAssessments = await prisma.assessment.findMany({
      where: {
        candidateEmail: user.email,
        status: "COMPLETED",
        score: { not: null },
      },
      orderBy: { completedAt: "desc" },
      select: {
        id: true,
        score: true,
        dimensionScores: true,
        completedAt: true,
      },
    });

    // Compute global rank for each assessment
    const allScores = await prisma.assessment.findMany({
      where: { status: "COMPLETED", score: { not: null } },
      orderBy: { score: "desc" },
      select: { id: true },
    });
    const rankMap = new Map(allScores.map((a, i) => [a.id, i + 1]));

    const assessments = myAssessments.map((a) => ({
      id: a.id,
      score: a.score!,
      completedAt: a.completedAt?.toISOString() ?? new Date().toISOString(),
      dimensionScores: (a.dimensionScores as Record<string, number>) ?? null,
      rank: rankMap.get(a.id) ?? null,
    }));

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error("My results error:", error);
    return NextResponse.json({ assessments: [] });
  }
}
