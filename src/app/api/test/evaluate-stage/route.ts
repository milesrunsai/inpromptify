import { NextRequest, NextResponse } from "next/server";

/**
 * Evaluate the quality of user prompts for a single assessment stage.
 * Returns a 0-100 score for prompt quality based on AI analysis.
 */

export async function POST(req: NextRequest) {
  try {
    const { taskDescription, userPrompts, aiResponses } = await req.json();

    if (!taskDescription || !userPrompts?.length) {
      return NextResponse.json({ score: 0, reasoning: "No prompts submitted" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ score: 50, reasoning: "Evaluation unavailable" });
    }

    const conversation = userPrompts.map((p: string, i: number) =>
      `USER PROMPT ${i + 1}: ${p}${aiResponses[i] ? `\nAI RESPONSE ${i + 1}: ${aiResponses[i].substring(0, 500)}...` : ""}`
    ).join("\n\n");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 400,
        messages: [{
          role: "user",
          content: `You are an AI proficiency evaluator. Score the quality of the user's prompts for this task.

TASK: ${taskDescription}

CONVERSATION:
${conversation}

Score the user's prompting ability from 0-100 based on:
1. RELEVANCE (0-25): Did the prompts actually address the task? Copying the task description back, pasting random text, or writing completely unrelated prompts = 0.
2. SPECIFICITY (0-25): Were the prompts specific enough to get a useful result? Vague one-liners = low. Detailed constraints, format, audience, tone = high.
3. STRUCTURE (0-25): Were the prompts well-organized? Did they include clear instructions, context, and desired output format?
4. EFFECTIVENESS (0-25): Based on the AI's response, did the prompts actually achieve the task goal?

CRITICAL RULES:
- If the user just copied/pasted the task description back as their prompt, score RELEVANCE as 0-5.
- If the user typed gibberish, random text, or completely off-topic content, total score should be 0-15.
- If the user wrote a basic but lazy prompt like "do this task" or "write the email", score should be 20-40.
- Only well-crafted, specific prompts with clear structure should score above 70.

Respond with ONLY valid JSON:
{"score": <number 0-100>, "relevance": <0-25>, "specificity": <0-25>, "structure": <0-25>, "effectiveness": <0-25>, "reasoning": "<one sentence>"}`,
        }],
      }),
    });

    if (!res.ok) {
      console.error("[evaluate-stage] API error:", await res.text());
      return NextResponse.json({ score: 50, reasoning: "Evaluation error" });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || "";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        score: Math.max(0, Math.min(100, parsed.score || 0)),
        relevance: parsed.relevance || 0,
        specificity: parsed.specificity || 0,
        structure: parsed.structure || 0,
        effectiveness: parsed.effectiveness || 0,
        reasoning: parsed.reasoning || "",
      });
    }

    return NextResponse.json({ score: 50, reasoning: "Could not parse evaluation" });
  } catch (err) {
    console.error("[evaluate-stage] Error:", err);
    return NextResponse.json({ score: 50, reasoning: "Evaluation failed" });
  }
}
