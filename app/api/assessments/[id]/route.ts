import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

/** GET /api/assessments/:id — get a single assessment */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { orgId } = await auth();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
  });
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
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
