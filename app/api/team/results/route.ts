import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserOrg } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** GET /api/team/results — get team assessment results */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const org = await getUserOrg(user.id);
    if (!org) {
      return NextResponse.json({ error: "No organization found" }, { status: 403 });
    }

    // Get team assessments
    const assessments = await prisma.assessment.findMany({
      where: {
        orgId: org.id,
        status: "COMPLETED",
        score: { not: null }
      },
      orderBy: { completedAt: "desc" },
      select: {
        id: true,
        candidateEmail: true,
        score: true,
        dimensionScores: true,
        completedAt: true,
      }
    });

    // Get team stats
    const totalAssessments = assessments.length;
    const avgScore = totalAssessments > 0 
      ? Math.round(assessments.reduce((sum, a) => sum + (a.score || 0), 0) / totalAssessments)
      : 0;
    
    const topScore = Math.max(...assessments.map(a => a.score || 0));
    const scores = assessments.map(a => a.score || 0);
    
    // Calculate score distribution
    const scoreRanges = {
      excellent: scores.filter(s => s >= 85).length, // 85-100
      good: scores.filter(s => s >= 70 && s < 85).length, // 70-84
      average: scores.filter(s => s >= 55 && s < 70).length, // 55-69
      needsImprovement: scores.filter(s => s < 55).length, // 0-54
    };

    return NextResponse.json({
      teamStats: {
        totalAssessments,
        avgScore,
        topScore,
        scoreDistribution: scoreRanges
      },
      assessments: assessments.map(a => ({
        id: a.id,
        email: a.candidateEmail,
        name: a.candidateEmail.split('@')[0], // Use email prefix as name
        score: a.score,
        completedAt: a.completedAt,
        performance: a.score >= 85 ? 'Excellent' : 
                    a.score >= 70 ? 'Good' : 
                    a.score >= 55 ? 'Average' : 'Needs Improvement'
      }))
    });

  } catch (error) {
    console.error("Team results error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team results" },
      { status: 500 }
    );
  }
}