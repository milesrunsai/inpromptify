import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, questionId, answerIndex, isCorrect, responseTimeMs } = body;

    // Validate required fields
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }
    if (typeof questionId !== "number" || questionId < 1 || questionId > 10) {
      return NextResponse.json({ error: "questionId must be between 1 and 10" }, { status: 400 });
    }
    if (typeof answerIndex !== "number" || answerIndex < 0 || answerIndex > 3) {
      return NextResponse.json({ error: "answerIndex must be between 0 and 3" }, { status: 400 });
    }
    if (typeof isCorrect !== "boolean") {
      return NextResponse.json({ error: "isCorrect must be a boolean" }, { status: 400 });
    }

    const sql = getSql();

    await sql`
      INSERT INTO quiz_responses (session_id, question_id, answer_index, is_correct, response_time_ms)
      VALUES (${sessionId}, ${questionId}, ${answerIndex}, ${isCorrect}, ${responseTimeMs ?? null})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving quiz response:", error);
    return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
  }
}
