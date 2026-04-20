import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** GET /api/admin/questions — list questions (active bank or pending) */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses?.[0]?.emailAddress)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tab = req.nextUrl.searchParams.get("tab") ?? "active";
  const search = req.nextUrl.searchParams.get("search") ?? "";

  if (tab === "active") {
    const where: Record<string, unknown> = {};
    if (search) where.text = { contains: search, mode: "insensitive" };
    const questions = await prisma.questionBank.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ questions });
  }

  // Pending or rejected
  const status = tab === "rejected" ? "rejected" : "pending";
  const where: Record<string, unknown> = { status };
  if (search) where.text = { contains: search, mode: "insensitive" };

  const questions = await prisma.pendingQuestion.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ questions });
}

/** POST /api/admin/questions — create a new pending question */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!isAdmin(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limit: 20 creates per minute
  const rl = rateLimit(`admin-create:${getClientIp(req)}`, 20);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limited. Try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { text, options, correctOptionId, difficulty, dimensions, tags, maxTimeSeconds } = body;

  if (!text || !options || !correctOptionId || !difficulty || !dimensions || !maxTimeSeconds) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const question = await prisma.pendingQuestion.create({
    data: {
      text,
      options,
      correctOptionId,
      difficulty: Math.min(100, Math.max(1, Number(difficulty))),
      dimensions,
      tags: tags ?? [],
      maxTimeSeconds: Number(maxTimeSeconds),
      source: "manual",
      status: "pending",
    },
  });

  return NextResponse.json({ question }, { status: 201 });
}
