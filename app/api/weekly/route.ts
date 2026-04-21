import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { seededShuffle } from "@/lib/shuffle";

/** Get ISO week ID like '2026-W17' — week starts Monday */
function getWeekId(): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  // Set to nearest Thursday: current date + 4 - current day number (Monday=1, Sunday=7)
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/** Select 15 questions deterministically for a given week */
async function getWeeklyQuestions(weekId: string) {
  const allQuestions = await prisma.questionBank.findMany({
    where: { isActive: true },
    select: {
      id: true,
      text: true,
      options: true,
      correctOptionId: true,
      difficulty: true,
      dimensions: true,
      maxTimeSeconds: true,
    },
  });

  // Bucket by difficulty
  const medium = allQuestions.filter((q) => q.difficulty > 30 && q.difficulty <= 60);
  const hard = allQuestions.filter((q) => q.difficulty > 60 && q.difficulty <= 80);
  const expert = allQuestions.filter((q) => q.difficulty > 80);

  // Seeded shuffle each bucket
  const shuffledMedium = seededShuffle(medium, weekId + "-medium");
  const shuffledHard = seededShuffle(hard, weekId + "-hard");
  const shuffledExpert = seededShuffle(expert, weekId + "-expert");

  // Pick: 3 medium, 5 hard, 7 expert — harder mix
  const selected = [
    ...shuffledMedium.slice(0, 3),
    ...shuffledHard.slice(0, 5),
    ...shuffledExpert.slice(0, 7),
  ];

  // If any bucket is short, fill from shuffled all
  if (selected.length < 15) {
    const usedIds = new Set(selected.map((q) => q.id));
    const remaining = seededShuffle(
      allQuestions.filter((q) => !usedIds.has(q.id)),
      weekId + "-fill"
    );
    while (selected.length < 15 && remaining.length > 0) {
      selected.push(remaining.shift()!);
    }
  }

  // Deterministic order
  return seededShuffle(selected, weekId + "-order");
}

/** GET /api/weekly — returns this week's 15 questions (no answers) */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const weekId = getWeekId();
    const questions = await getWeeklyQuestions(weekId);

    // Strip correct answers
    const sanitized = questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: (q.options as { id: string; text: string }[]).map((o) => ({
        id: o.id,
        text: o.text,
      })),
      difficulty: q.difficulty,
      maxTimeSeconds: 45,
    }));

    return NextResponse.json({ weekId, questions: sanitized });
  } catch (error) {
    console.error("Weekly quiz GET error:", error);
    return NextResponse.json({ error: "Failed to load weekly quiz" }, { status: 500 });
  }
}

/** POST /api/weekly — submit answers and return score */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { answers } = body as {
      answers: { questionId: string; selectedOptionId: string; timeTakenMs: number }[];
    };

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "answers required" }, { status: 400 });
    }

    const weekId = getWeekId();

    // Check if already taken this week
    const existing = await prisma.weeklyChallengeAttempt.findUnique({
      where: { userId_weekId: { userId: user.id, weekId } },
    });

    if (existing) {
      return NextResponse.json({
        error: "Already completed this week's challenge",
        attempt: existing,
      }, { status: 409 });
    }

    // Get this week's questions with answers to score
    const questions = await getWeeklyQuestions(weekId);
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    let score = 0;
    let totalTimeMs = 0;
    const responses = answers.map((a) => {
      const question = questionMap.get(a.questionId);
      const correct = question ? question.correctOptionId === a.selectedOptionId : false;
      if (correct) score++;
      totalTimeMs += a.timeTakenMs;
      return {
        questionId: a.questionId,
        selectedOptionId: a.selectedOptionId,
        correct,
        timeTakenMs: a.timeTakenMs,
      };
    });

    // Save individual responses to CalibrationResponse for IRT
    try {
      await Promise.all(
        responses.map((r) =>
          prisma.calibrationResponse.create({
            data: {
              questionId: r.questionId,
              selectedOptionId: r.selectedOptionId,
              wasCorrect: r.correct,
              timeTakenMs: r.timeTakenMs,
            },
          })
        )
      );
    } catch (e) {
      console.error("CalibrationResponse write failed:", e);
    }

    // Save attempt
    const attempt = await prisma.weeklyChallengeAttempt.create({
      data: {
        userId: user.id,
        weekId,
        score,
        totalQuestions: 15,
        responses,
        totalTimeMs,
      },
    });

    // Get rank for this week
    const betterScores = await prisma.weeklyChallengeAttempt.count({
      where: {
        weekId,
        OR: [
          { score: { gt: score } },
          { score, totalTimeMs: { lt: totalTimeMs } },
        ],
      },
    });
    const totalThisWeek = await prisma.weeklyChallengeAttempt.count({
      where: { weekId },
    });

    const rank = betterScores + 1;
    const percentile = totalThisWeek > 1
      ? Math.round(((totalThisWeek - rank) / (totalThisWeek - 1)) * 100)
      : 100;

    return NextResponse.json({
      attempt,
      rank,
      totalParticipants: totalThisWeek,
      percentile,
    });
  } catch (error) {
    console.error("Weekly quiz POST error:", error);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
