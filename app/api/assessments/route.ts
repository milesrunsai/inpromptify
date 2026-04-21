import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserOrg } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** GET /api/assessments — list assessments for the authenticated org */
export async function GET(req: NextRequest) {
  const rl = rateLimit(`assessments-get:${getClientIp(req)}`, 30);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getUserOrg(user.id);
  if (!org) {
    return NextResponse.json({ error: "No organization" }, { status: 403 });
  }

  // Pagination & filtering
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") ?? "20", 10)));
  const status = req.nextUrl.searchParams.get("status");
  const search = req.nextUrl.searchParams.get("search");

  const where: Record<string, unknown> = { orgId: org.id };
  if (status) {
    where.status = status;
  }
  if (search) {
    where.candidateEmail = { contains: search, mode: "insensitive" };
  }

  const [assessments, total] = await Promise.all([
    prisma.assessment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.assessment.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({ assessments, total, page, limit, totalPages });
}

/** POST /api/assessments — create a new assessment invitation */
export async function POST(req: NextRequest) {
  const rl = rateLimit(`assessments-post:${getClientIp(req)}`, 10);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getUserOrg(user.id);
  if (!org) {
    return NextResponse.json({ error: "No organization" }, { status: 403 });
  }

  // Check credits and tier-based monthly limit
  const subscription = await prisma.subscription.findFirst({
    where: { orgId: org.id },
  });
  const credits = subscription?.credits ?? 5;
  if (credits === 0) {
    return NextResponse.json(
      { error: "No credits remaining. Please upgrade your plan." },
      { status: 403 }
    );
  }

  const tierMonthlyLimits: Record<string, number> = {
    FREE: 3,
    STARTER: 50,
    BUSINESS: 500,
    ENTERPRISE: -1,
  };
  const tier = subscription?.tier ?? "FREE";
  const monthlyLimit = tierMonthlyLimits[tier] ?? 3;

  if (monthlyLimit !== -1) {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthCount = await prisma.assessment.count({
      where: { orgId: org.id, createdAt: { gte: monthStart } },
    });

    if (monthCount >= monthlyLimit) {
      return NextResponse.json(
        {
          error: `You have reached your monthly assessment limit (${monthlyLimit}). Upgrade your plan for more.`,
        },
        { status: 429 }
      );
    }
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
