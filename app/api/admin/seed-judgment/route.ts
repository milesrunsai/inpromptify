import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/admin/seed-judgment?secret=XXX&batch=25&maxBatches=1
 * 
 * Generates hirer-focused judgment questions via OpenAI.
 * These test real-world AI decision-making, not buzzword knowledge.
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const batchSize = parseInt(req.nextUrl.searchParams.get("batch") || "20", 10);
  const maxBatches = parseInt(req.nextUrl.searchParams.get("maxBatches") || "1", 10);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY not set" }, { status: 500 });
  }

  const roles = [
    "Accounting & Finance",
    "Legal & Compliance",
    "Marketing & Content",
    "Software Engineering",
    "HR & People Operations",
    "Sales & Business Development",
    "Customer Support",
    "Data Analysis & BI",
    "Product Management",
    "Executive Leadership",
    "Healthcare Administration",
    "Education & Training",
    "Operations & Supply Chain",
    "Consulting & Strategy",
    "Real Estate & Property",
  ];

  const scenarioTypes = [
    "when-not-to-use-ai",
    "verification-and-review",
    "confidentiality-risk",
    "ai-output-gone-wrong",
    "iteration-and-refinement",
    "bias-and-fairness",
    "choosing-ai-vs-human",
    "explaining-ai-decisions-to-stakeholders",
    "ai-policy-and-governance",
    "candidate-evaluation",
  ];

  let totalGenerated = 0;
  const errors: string[] = [];

  for (let i = 0; i < maxBatches; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const scenario = scenarioTypes[Math.floor(Math.random() * scenarioTypes.length)];
    const diffRange = Math.random() < 0.3 ? "medium (40-55)" : Math.random() < 0.7 ? "hard (56-75)" : "expert (76-95)";

    const prompt = `You are creating interview-quality AI proficiency assessment questions for a hiring manager evaluating candidates in ${role}.

Generate exactly ${batchSize} multiple-choice questions. These are NOT trivia about AI. They test JUDGMENT — how someone would actually use AI responsibly and effectively in their job.

Scenario focus: ${scenario}
Difficulty range: ${diffRange}

CRITICAL RULES FOR QUESTION QUALITY:
1. Every question must describe a realistic workplace scenario in ${role}
2. The correct answer tests JUDGMENT, RISK AWARENESS, or PROCESS MATURITY
3. Wrong answers must be EQUALLY PLAUSIBLE — they should sound reasonable to someone who hasn't thought deeply about the issue
4. The correct answer should NOT be the longest option. Vary answer lengths.
5. Include questions where the right answer is sometimes the SIMPLEST option
6. At least 30% of questions should test when NOT to use AI or where AI creates risk
7. At least 20% should test verification habits and professional skepticism
8. Avoid AI buzzwords like "hallucination", "temperature", "tokens" — use plain professional language
9. Frame questions the way a senior professional would think about them, not an AI researcher

Question patterns to use:
- "Your colleague does X with AI. What's the main concern?"
- "A ${role} professional receives AI output that looks correct. What should they do?"
- "When would you choose NOT to use AI for this ${role} task?"
- "Two people handle this differently. Who made the better decision and why?"
- "Your manager asks you to use AI for X. What's your first question?"
- "The AI gave you Y result. What's the most important thing to check?"

Each question must have:
- text: Realistic scenario question (50-200 chars)
- options: Exactly 4 as [{id:"A",text:"..."},{id:"B",text:"..."},{id:"C",text:"..."},{id:"D",text:"..."}]
- correctOptionId: Distribute evenly across A, B, C, D (NOT always B)
- difficulty: Number in range ${diffRange.match(/\d+-\d+/)?.[0] || "50-70"}
- dimensions: 1-2 from [promptQuality, efficiency, responseQuality, iterationIntelligence]
- tags: include "hiring", the role name lowercase, and 1-2 relevant tags
- maxTimeSeconds: 30-45

Return ONLY a JSON array. No markdown.`;

    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "gpt-4o", max_tokens: 8192, temperature: 0.9, messages: [{ role: "user", content: prompt }] }),
      });
      if (!resp.ok) { errors.push(`Batch ${i + 1}: OpenAI ${resp.status}`); continue; }
      const d = await resp.json();
      const content = d.choices?.[0]?.message?.content ?? "";

      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) { errors.push(`Batch ${i + 1}: No JSON array`); continue; }

      const questions = JSON.parse(jsonMatch[0]);
      let batchCreated = 0;

      for (const q of questions) {
        if (!q.text || !q.options || !q.correctOptionId) continue;
        const exists = await prisma.questionBank.findFirst({ where: { text: q.text } });
        if (exists) continue;

        try {
          await prisma.questionBank.create({
            data: {
              text: q.text,
              options: q.options,
              correctOptionId: q.correctOptionId,
              difficulty: Math.min(100, Math.max(1, Number(q.difficulty) || 60)),
              dimensions: Array.isArray(q.dimensions) ? q.dimensions : ["iterationIntelligence"],
              tags: Array.isArray(q.tags) ? q.tags : ["hiring"],
              maxTimeSeconds: Number(q.maxTimeSeconds) || 40,
              isActive: true,
            },
          });
          batchCreated++;
        } catch (e) { errors.push(`Item: ${e instanceof Error ? e.message : String(e)}`); }
      }

      totalGenerated += batchCreated;
      if (i < maxBatches - 1) await new Promise((r) => setTimeout(r, 1000));
    } catch (e) { errors.push(`Batch ${i + 1}: ${e instanceof Error ? e.message : String(e)}`); }
  }

  const total = await prisma.questionBank.count({ where: { isActive: true } });
  return NextResponse.json({ success: true, generated: totalGenerated, total, errors });
}
