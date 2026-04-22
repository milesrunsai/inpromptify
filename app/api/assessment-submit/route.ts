import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** POST /api/assessment-submit — submit main assessment and add to leaderboard */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { email, displayName, score, dimensionScores, showOnLeaderboard } = await req.json();

    if (!email || typeof score !== "number") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (score < 0 || score > 100) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);

    // Check if this email already took the main assessment today
    const existingAttempt = await prisma.dailyQuizAttempt.findUnique({
      where: { 
        email_date: { 
          email: email.toLowerCase(), 
          date: today 
        } 
      },
    });

    if (existingAttempt) {
      return NextResponse.json({ 
        error: "You can only take the main assessment once per day" 
      }, { status: 409 });
    }

    // Save to leaderboard if opted in
    let attempt = null;
    if (showOnLeaderboard) {
      attempt = await prisma.dailyQuizAttempt.create({
        data: {
          email: email.toLowerCase(),
          userId: user?.id || null,
          date: today,
          score: Math.round(score), // Main assessment score (0-100, convert to 0-5 scale for leaderboard)
          totalQuestions: 100, // Indicate this is main assessment
          responses: {
            displayName: displayName || email.split("@")[0],
            type: "main_assessment",
            dimensionScores,
          },
          streak: 1, // First time taking main assessment
        },
      });

      // Get rank for today
      const betterScores = await prisma.dailyQuizAttempt.count({
        where: {
          date: today,
          score: { gt: Math.round(score) },
        },
      });

      return NextResponse.json({ 
        success: true, 
        rank: betterScores + 1,
        attempt: {
          id: attempt.id,
          score: attempt.score,
          date: attempt.date,
        }
      });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Assessment submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit assessment" },
      { status: 500 }
    );
  }
}