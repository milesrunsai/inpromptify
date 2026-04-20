import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

/** GET /api/assessments — list assessments for the authenticated org */
export async function GET() {
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

  const assessments = await prisma.assessment.findMany({
    where: { orgId: org.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ assessments });
}

/** POST /api/assessments — create a new assessment invitation */
export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { subscriptions: true },
  });
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  // Check credits
  const subscription = org.subscriptions[0];
  const credits = subscription?.credits ?? 5; // Free tier default
  if (credits === 0) {
    return NextResponse.json(
      { error: "No credits remaining. Please upgrade your plan." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { candidateEmail } = body;

  if (!candidateEmail || typeof candidateEmail !== "string") {
    return NextResponse.json(
      { error: "candidateEmail is required" },
      { status: 400 }
    );
  }

  const assessment = await prisma.assessment.create({
    data: {
      orgId: org.id,
      candidateEmail,
      status: "PENDING",
    },
  });

  // Deduct a credit
  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { credits: { decrement: 1 } },
    });
  }

  return NextResponse.json({ assessment }, { status: 201 });
}
