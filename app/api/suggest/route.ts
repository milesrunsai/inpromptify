import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DIFFICULTY_MAP: Record<string, number> = {
  Easy: 25,
  Medium: 50,
  Hard: 70,
  Expert: 90,
};

const VALID_OPTIONS = ["A", "B", "C", "D"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, options, correctOptionId, difficulty, tags, email } = body;

    // Validate text
    if (!text || typeof text !== "string" || text.length < 20 || text.length > 500) {
      return NextResponse.json(
        { error: "Question text must be between 20 and 500 characters." },
        { status: 400 }
      );
    }

    // Validate options
    if (
      !Array.isArray(options) ||
      options.length !== 4 ||
      !options.every(
        (o: { id?: string; text?: string }) =>
          o && typeof o.text === "string" && o.text.trim().length > 0 && VALID_OPTIONS.includes(o.id ?? "")
      )
    ) {
      return NextResponse.json(
        { error: "Exactly 4 answer options (A-D) with text are required." },
        { status: 400 }
      );
    }

    // Validate correct answer
    if (!VALID_OPTIONS.includes(correctOptionId)) {
      return NextResponse.json(
        { error: "Correct answer must be A, B, C, or D." },
        { status: 400 }
      );
    }

    // Validate difficulty
    const difficultyNumber = DIFFICULTY_MAP[difficulty];
    if (!difficultyNumber) {
      return NextResponse.json(
        { error: "Difficulty must be Easy, Medium, Hard, or Expert." },
        { status: 400 }
      );
    }

    // Rate limit by email (10 per 24h)
    if (email && typeof email === "string") {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      // Check recent submissions by searching for email in the source field
      // Since PendingQuestion doesn't have an email field, we'll use a pragmatic approach:
      // store email in source as "community:email" and query by it
      const recentCount = await prisma.pendingQuestion.count({
        where: {
          source: `community:${email.toLowerCase().trim()}`,
          createdAt: { gte: oneDayAgo },
        },
      });

      if (recentCount >= 10) {
        return NextResponse.json(
          { error: "You've submitted too many questions recently. Please try again later." },
          { status: 429 }
        );
      }
    }

    // Parse tags
    const parsedTags = tags
      ? String(tags)
          .split(",")
          .map((t: string) => t.trim().toLowerCase())
          .filter(Boolean)
      : [];

    // Determine source string (include email for rate limiting)
    const source =
      email && typeof email === "string"
        ? `community:${email.toLowerCase().trim()}`
        : "community";

    await prisma.pendingQuestion.create({
      data: {
        text: text.trim(),
        options,
        correctOptionId,
        difficulty: difficultyNumber,
        dimensions: ["promptQuality"],
        tags: parsedTags,
        maxTimeSeconds: 45,
        source,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Question submitted for review",
    });
  } catch (error) {
    console.error("Suggest question error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
