import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSql } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as Record<string, unknown>).id;
    const sql = getSql();

    // Team average
    const [avgRow] = await sql`
      SELECT
        COALESCE(AVG(ta.score), 0)::int as avg_score,
        COALESCE(AVG(ta.efficiency), 0)::int as avg_efficiency,
        COALESCE(AVG(ta.tokens_used), 0)::int as avg_tokens,
        COUNT(DISTINCT ta.candidate_email)::int as unique_candidates,
        COUNT(*)::int as total_attempts
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE t.user_id = ${Number(userId)} AND ta.status = 'completed'
    `;

    // Score distribution
    const distribution = await sql`
      SELECT
        CASE
          WHEN ta.score < 20 THEN '0-19'
          WHEN ta.score < 40 THEN '20-39'
          WHEN ta.score < 60 THEN '40-59'
          WHEN ta.score < 80 THEN '60-79'
          WHEN ta.score < 90 THEN '80-89'
          ELSE '90-100'
        END as range,
        COUNT(*)::int as count
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE t.user_id = ${Number(userId)} AND ta.status = 'completed'
      GROUP BY 1
      ORDER BY 1
    `;

    // Per-person breakdown
    const people = await sql`
      SELECT
        ta.candidate_email as email,
        ta.candidate_name as name,
        ROUND(AVG(ta.score))::int as avg_score,
        COUNT(*)::int as tests_taken,
        ROUND(AVG(ta.tokens_used))::int as avg_tokens,
        ROUND(AVG(ta.efficiency))::int as avg_efficiency,
        MAX(ta.completed_at) as last_active
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE t.user_id = ${Number(userId)} AND ta.status = 'completed'
      GROUP BY ta.candidate_email, ta.candidate_name
      ORDER BY avg_score DESC
    `;

    // Dimension averages for weakness analysis
    const dimensionAvgs = await sql`
      SELECT
        ROUND(AVG(ta.accuracy))::int as avg_prompt_quality,
        ROUND(AVG(ta.efficiency))::int as avg_efficiency,
        ROUND(AVG(ta.speed))::int as avg_speed,
        ROUND(AVG(ta.score))::int as avg_response_quality,
        ROUND(AVG(LEAST(ta.score, 100)))::int as avg_iteration_iq
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE t.user_id = ${Number(userId)} AND ta.status = 'completed'
    `;

    // Per-person score history for skill decay tracking (last 6 months)
    const scoreHistory = await sql`
      SELECT
        ta.candidate_email as email,
        ta.candidate_name as name,
        ta.score::int as score,
        ta.completed_at as completed_at
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE t.user_id = ${Number(userId)}
        AND ta.status = 'completed'
        AND ta.completed_at >= NOW() - INTERVAL '6 months'
      ORDER BY ta.completed_at ASC
    `;

    // Per-person dimension breakdown for heatmap
    const personDimensions = await sql`
      SELECT
        ta.candidate_name as name,
        ta.candidate_email as email,
        ROUND(AVG(ta.accuracy))::int as prompt_quality,
        ROUND(AVG(ta.efficiency))::int as efficiency,
        ROUND(AVG(ta.speed))::int as speed,
        ROUND(AVG(ta.score))::int as response_quality,
        MAX(ta.completed_at) as last_assessed
      FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE t.user_id = ${Number(userId)} AND ta.status = 'completed'
      GROUP BY ta.candidate_email, ta.candidate_name
      ORDER BY ta.candidate_name
    `;

    // Estimated savings
    const avgTokensPerPerson = Number(avgRow.avg_tokens) || 0;
    const optimalTokens = Math.round(avgTokensPerPerson * 0.4); // assume 60% waste
    const tokenSavings = avgTokensPerPerson - optimalTokens;
    const costPer1kTokens = 0.003; // rough average
    const monthlySavingsPerPerson = (tokenSavings / 1000) * costPer1kTokens * 22; // 22 work days
    const totalPeople = Number(avgRow.unique_candidates) || 1;
    const annualSavings = Math.round(monthlySavingsPerPerson * 12 * totalPeople);

    return NextResponse.json({
      summary: {
        avgScore: avgRow.avg_score || 0,
        avgEfficiency: avgRow.avg_efficiency || 0,
        avgTokens: avgRow.avg_tokens || 0,
        uniqueCandidates: avgRow.unique_candidates || 0,
        totalAttempts: avgRow.total_attempts || 0,
        estimatedAnnualSavings: annualSavings,
      },
      distribution,
      people,
      dimensions: dimensionAvgs[0] || { avg_prompt_quality: 0, avg_efficiency: 0, avg_speed: 0, avg_response_quality: 0, avg_iteration_iq: 0 },
      scoreHistory,
      personDimensions,
    });
  } catch (e) {
    console.error("Analytics error:", e);
    return NextResponse.json({
      summary: { avgScore: 0, avgEfficiency: 0, avgTokens: 0, uniqueCandidates: 0, totalAttempts: 0, estimatedAnnualSavings: 0 },
      distribution: [],
      people: [],
    });
  }
}
