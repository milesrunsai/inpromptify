import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { seededShuffle } from "@/lib/shuffle";

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
}

/** Select 5 questions deterministically for a given date */
async function getDailyQuestions(date: string) {
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
  const easy = allQuestions.filter((q) => q.difficulty <= 30);
  const medium = allQuestions.filter((q) => q.difficulty > 30 && q.difficulty <= 60);
  const hard = allQuestions.filter((q) => q.difficulty > 60 && q.difficulty <= 80);
  const expert = allQuestions.filter((q) => q.difficulty > 80);

  // Seeded shuffle each bucket
  const shuffledEasy = seededShuffle(easy, date + "-easy");
  const shuffledMedium = seededShuffle(medium, date + "-medium");
  const shuffledHard = seededShuffle(hard, date + "-hard");
  const shuffledExpert = seededShuffle(expert, date + "-expert");

  // Pick: 0 easy, 1 medium, 2 hard, 2 expert — daily should be challenging
  const selected = [
    ...shuffledMedium.slice(0, 1),
    ...shuffledHard.slice(0, 2),
    ...shuffledExpert.slice(0, 2),
  ];

  // If any bucket is empty, fill from shuffled all
  if (selected.length < 5) {
    const usedIds = new Set(selected.map((q) => q.id));
    const remaining = seededShuffle(
      allQuestions.filter((q) => !usedIds.has(q.id)),
      date + "-fill"
    );
    while (selected.length < 5 && remaining.length > 0) {
      selected.push(remaining.shift()!);
    }
  }

  // Deterministic order
  return seededShuffle(selected, date + "-order");
}

/** GET /api/daily — returns today's 5 questions (no answers) */
export async function GET() {
  try {
    const date = getTodayDateString();
    const questions = await getDailyQuestions(date);

    // Strip correct answers
    const sanitized = questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: (q.options as { id: string; text: string }[]).map((o) => ({
        id: o.id,
        text: o.text,
      })),
      difficulty: q.difficulty,
      maxTimeSeconds: 30,
    }));

    return NextResponse.json({ date, questions: sanitized });
  } catch (error) {
    console.error("Daily quiz GET error:", error);
    return NextResponse.json({ error: "Failed to load daily quiz" }, { status: 500 });
  }
}

/** POST /api/daily — submit answers and return score */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, answers, integrity } = body as {
      email: string;
      answers: { questionId: string; selectedOptionId: string; timeTakenMs: number }[];
      integrity?: { tabSwitches: number; pasteAttempts: number; questionsAnsweredTooFast: number; suspicionScore: number };
    };

    // Anti-cheat: reject highly suspicious submissions
    if (integrity && integrity.suspicionScore >= 60) {
      return NextResponse.json({ error: "Suspicious activity detected. Please retake the quiz without switching tabs or pasting." }, { status: 403 });
    }

    if (!email || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "email and answers required" }, { status: 400 });
    }

    const date = getTodayDateString();

    // Check if already taken today
    const existing = await prisma.dailyQuizAttempt.findUnique({
      where: { email_date: { email: email.toLowerCase(), date } },
    });

    if (existing) {
      return NextResponse.json({
        error: "Already completed today's quiz",
        attempt: existing,
      }, { status: 409 });
    }

    // Get today's questions with answers to score
    const questions = await getDailyQuestions(date);
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    let score = 0;
    const responses = answers.map((a) => {
      const question = questionMap.get(a.questionId);
      const correct = question ? question.correctOptionId === a.selectedOptionId : false;
      if (correct) score++;
      return {
        questionId: a.questionId,
        selectedOptionId: a.selectedOptionId,
        correct,
        timeTakenMs: a.timeTakenMs,
      };
    });

    // Calculate streak
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const yesterdayAttempt = await prisma.dailyQuizAttempt.findUnique({
      where: { email_date: { email: email.toLowerCase(), date: yesterdayStr } },
    });

    const streak = yesterdayAttempt ? yesterdayAttempt.streak + 1 : 1;

    // Check if user is logged in
    let userId: string | null = null;
    try {
      const user = await getCurrentUser();
      if (user) userId = user.id;
    } catch {}

    // Save attempt
    const attempt = await prisma.dailyQuizAttempt.create({
      data: {
        email: email.toLowerCase(),
        userId,
        date,
        score,
        totalQuestions: 5,
        responses,
        streak,
      },
    });

    // Get rank for today
    const betterScores = await prisma.dailyQuizAttempt.count({
      where: {
        date,
        score: { gt: score },
      },
    });
    const totalToday = await prisma.dailyQuizAttempt.count({
      where: { date },
    });

    const rank = betterScores + 1;
    const percentile = totalToday > 1 ? Math.round(((totalToday - rank) / (totalToday - 1)) * 100) : 100;

    return NextResponse.json({
      attempt,
      rank,
      totalParticipants: totalToday,
      percentile,
    });
  } catch (error) {
    console.error("Daily quiz POST error:", error);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
