import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET() {
  try {
    const sql = getSql();

    const [totalResponsesRow] = await sql`SELECT COUNT(*)::int AS count FROM quiz_responses`;
    const [totalSessionsRow] = await sql`SELECT COUNT(*)::int AS count FROM quiz_sessions`;

    const questionStats = await sql`
      SELECT
        question_id AS "questionId",
        COUNT(*)::int AS "responseCount",
        ROUND(AVG(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END), 3)::float AS "correctRate"
      FROM quiz_responses
      GROUP BY question_id
      ORDER BY question_id
    `;

    return NextResponse.json({
      totalResponses: totalResponsesRow.count,
      totalSessions: totalSessionsRow.count,
      questionStats,
    });
  } catch (error) {
    console.error("Error fetching quiz stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
