import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserOrg } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** GET /api/assessments/:id — get a single assessment */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getUserOrg(user.id);
  if (!org) {
    return NextResponse.json({ error: "No organization" }, { status: 403 });
  }

  const assessment = await prisma.assessment.findFirst({
    where: { id, orgId: org.id },
  });

  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  return NextResponse.json({ assessment });
}

/** PATCH /api/assessments/:id — update assessment (submit answers, complete) */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  const body = await req.json();
  const { status, score, dimensionScores, responses, currentTheta } = body;

  // Write individual responses to CalibrationResponse for IRT calibration
  if (responses && Array.isArray(responses) && status === "COMPLETED") {
    try {
      await Promise.all(
        responses
          .filter((r: any) => r.questionId && r.selectedOptionId)
          .map((r: any) =>
            prisma.calibrationResponse.create({
              data: {
                assessmentId: id,
                questionId: r.questionId,
                selectedOptionId: r.selectedOptionId,
                wasCorrect: !!r.correct,
                timeTakenMs: r.timeTakenMs || 0,
              },
            })
          )
      );
    } catch (e) {
      console.error("CalibrationResponse write failed:", e);
    }
  }

  const updated = await prisma.assessment.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(score !== undefined && { score }),
      ...(dimensionScores && { dimensionScores }),
      ...(responses && { responses }),
      ...(currentTheta !== undefined && { currentTheta }),
      ...(status === "COMPLETED" && { completedAt: new Date() }),
    },
  });

  return NextResponse.json({ assessment: updated });
}
