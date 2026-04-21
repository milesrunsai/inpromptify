import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "flinch-admin-2026-xyz";

export async function GET(req: NextRequest) {
  // Check admin secret
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch daily quiz attempts (leaderboard entries)
    const entries = await prisma.dailyQuizAttempt.findMany({
      orderBy: [
        { date: "desc" },
        { score: "desc" },
        { createdAt: "asc" },
      ],
      take: 100, // Limit to recent entries
    });

    return NextResponse.json({
      entries: entries.map(entry => ({
        id: entry.id,
        email: entry.email,
        score: entry.score,
        totalQuestions: entry.totalQuestions,
        streak: entry.streak,
        date: entry.date,
        createdAt: entry.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Admin leaderboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard entries" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  // Check admin secret
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Entry ID required" }, { status: 400 });
  }

  try {
    await prisma.dailyQuizAttempt.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin leaderboard delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Check admin secret
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { email, score, streak, date } = body;

    if (!email || score === undefined || !streak || !date) {
      return NextResponse.json(
        { error: "Missing required fields: email, score, streak, date" },
        { status: 400 }
      );
    }

    // Check if entry already exists for this email and date
    const existing = await prisma.dailyQuizAttempt.findUnique({
      where: {
        email_date: {
          email,
          date,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Entry already exists for this email and date" },
        { status: 400 }
      );
    }

    // Create new entry
    const entry = await prisma.dailyQuizAttempt.create({
      data: {
        email,
        score: Math.max(0, Math.min(5, parseInt(score))), // Clamp between 0-5
        totalQuestions: 5, // Default for daily quiz
        streak: Math.max(1, parseInt(streak)),
        date,
        responses: [], // Empty responses for admin-created entries
      },
    });

    return NextResponse.json({
      entry: {
        id: entry.id,
        email: entry.email,
        score: entry.score,
        totalQuestions: entry.totalQuestions,
        streak: entry.streak,
        date: entry.date,
        createdAt: entry.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Admin leaderboard create error:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}