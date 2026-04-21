import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, email, score, totalQuestions, timeSpentSeconds } = body;

    // Validate required fields
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }
    if (typeof score !== "number" || score < 0) {
      return NextResponse.json({ error: "score must be a non-negative number" }, { status: 400 });
    }
    if (typeof totalQuestions !== "number" || totalQuestions < 1) {
      return NextResponse.json({ error: "totalQuestions must be a positive number" }, { status: 400 });
    }

    const sql = getSql();

    // If email provided, try to find matching user
    let userId: number | null = null;
    if (email && typeof email === "string") {
      const users = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
      if (users.length > 0) {
        userId = users[0].id as number;
      }
    }

    await sql`
      INSERT INTO quiz_sessions (session_id, user_id, email, score, total_questions, time_spent_seconds)
      VALUES (${sessionId}, ${userId}, ${email ?? null}, ${score}, ${totalQuestions}, ${timeSpentSeconds ?? null})
      ON CONFLICT (session_id) DO NOTHING
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving quiz session:", error);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}
