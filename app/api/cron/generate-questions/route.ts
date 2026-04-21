import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/cron/generate-questions
 *
 * Called by Vercel Cron (or external scheduler) to generate new questions
 * using an LLM and insert them as pending for admin review.
 *
 * Protected by CRON_SECRET header check.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Determine how many questions we need
  const activeCount = await prisma.questionBank.count({
    where: { isActive: true },
  });
  const pendingCount = await prisma.pendingQuestion.count({
    where: { status: "pending" },
  });

  // If we already have 200+ active and 20+ pending, skip generation
  if (activeCount >= 200 && pendingCount >= 20) {
    return NextResponse.json({
      skipped: true,
      activeCount,
      pendingCount,
      message: "Sufficient questions in pool",
    });
  }

  const batchSize = Math.min(10, Math.max(3, 200 - activeCount));

  // Build the prompt for question generation
  const dimensions = [
    "promptQuality",
    "efficiency",
    "speed",
    "responseQuality",
    "iterationIntelligence",
  ];

  const systemPrompt = `You are an expert assessment designer for AI proficiency testing.
Generate ${batchSize} multiple-choice questions that test real-world AI fluency.

Each question must have:
- text: The question stem
- options: Exactly 4 options as [{id: "A", text: "..."}, {id: "B", text: "..."}, {id: "C", text: "..."}, {id: "D", text: "..."}]
- correctOptionId: The id of the correct option
- difficulty: A number 1-100 (distribute evenly across easy/medium/hard)
- dimensions: 1-2 from [${dimensions.join(", ")}]
- tags: 2-3 relevant tags
- maxTimeSeconds: 30-60 depending on complexity

Focus on practical scenarios: prompt engineering, iterating on AI output, evaluating responses,
debugging AI-generated code, choosing the right tool/model, structured output requests.

Respond with a JSON array of questions. No markdown wrapping.`;

  // Call the LLM (Anthropic Claude)
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: systemPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: "LLM API error", details: err },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.content?.[0]?.text ?? "";

    // Parse the JSON array from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse LLM output" },
        { status: 500 }
      );
    }

    const questions = JSON.parse(jsonMatch[0]);
    let created = 0;

    for (const q of questions) {
      if (!q.text || !q.options || !q.correctOptionId) continue;
      await prisma.pendingQuestion.create({
        data: {
          text: q.text,
          options: q.options,
          correctOptionId: q.correctOptionId,
          difficulty: Math.min(100, Math.max(1, Number(q.difficulty) || 50)),
          dimensions: q.dimensions ?? ["promptQuality"],
          tags: q.tags ?? [],
          maxTimeSeconds: Number(q.maxTimeSeconds) || 45,
          source: "llm-generated",
          status: "pending",
        },
      });
      created++;
    }

    return NextResponse.json({
      success: true,
      generated: created,
      activeCount,
      pendingCount: pendingCount + created,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "Generation failed", details: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
