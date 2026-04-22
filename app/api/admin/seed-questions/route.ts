import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { QUESTION_POOL } from "@/lib/question-bank";

/**
 * POST /api/admin/seed-questions
 * 
 * Phase 1: Seed all hardcoded questions from question-bank.ts into QuestionBank
 * Phase 2: Generate additional questions via Anthropic API in batches
 * 
 * Query params:
 *   ?secret=ADMIN_SECRET (required)
 *   &generate=true (optional — also generate LLM questions)
 *   &target=1000 (optional — total target count, default 1000)
 *   &batch=20 (optional — questions per LLM call, default 20)
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const generate = req.nextUrl.searchParams.get("generate") === "true";
  const target = parseInt(req.nextUrl.searchParams.get("target") || "1000", 10);
  const batchSize = parseInt(req.nextUrl.searchParams.get("batch") || "20", 10);

  const results: { phase: string; count: number; errors: string[] }[] = [];

  // ── Phase 1: Seed hardcoded questions ──
  let seededCount = 0;
  const seedErrors: string[] = [];

  for (const q of QUESTION_POOL) {
    try {
      const existing = await prisma.questionBank.findFirst({
        where: { text: q.text },
      });
      if (existing) continue;

      await prisma.questionBank.create({
        data: {
          text: q.text,
          options: q.options || [],
          correctOptionId: q.correctOptionId || "",
          difficulty: q.difficulty,
          dimensions: q.dimensions,
          tags: q.tags,
          maxTimeSeconds: q.maxTimeSeconds,
          isActive: true,
        },
      });
      seededCount++;
    } catch (e) {
      seedErrors.push(`q${q.id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  results.push({ phase: "seed_hardcoded", count: seededCount, errors: seedErrors });

  // ── Phase 2: Generate via LLM ──
  if (generate) {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const apiKey = anthropicKey || openaiKey;
    const useOpenAI = !anthropicKey && !!openaiKey;
    if (!apiKey) {
      results.push({ phase: "generate", count: 0, errors: ["Neither ANTHROPIC_API_KEY nor OPENAI_API_KEY set"] });
    } else {
      const currentCount = await prisma.questionBank.count({ where: { isActive: true } });
      const remaining = Math.max(0, target - currentCount);
      const maxBatchesPerCall = parseInt(req.nextUrl.searchParams.get("maxBatches") || "3", 10);
      const batches = Math.min(maxBatchesPerCall, Math.ceil(remaining / batchSize));
      let totalGenerated = 0;
      const genErrors: string[] = [];

      const dimensions = [
        "promptQuality", "efficiency", "speed", "responseQuality", "iterationIntelligence"
      ];

      const categories = [
        "Prompt Engineering", "Chain-of-Thought Reasoning", "Few-Shot Prompting",
        "RAG Architecture", "Model Selection", "AI Safety & Ethics",
        "Hallucination Detection", "Code Generation & Debugging", "Data Analysis with AI",
        "Agent Design", "Output Formatting", "Temperature & Parameters",
        "Context Window Management", "Fine-Tuning vs Prompting", "Multimodal AI",
        "AI Tool Selection", "Workflow Automation", "Evaluation & Benchmarking",
        "Retrieval & Embedding", "Production Deployment"
      ];

      for (let i = 0; i < batches && totalGenerated < remaining; i++) {
        const thisBatch = Math.min(batchSize, remaining - totalGenerated);
        const category = categories[i % categories.length];
        const diffRange = i % 4 === 0 ? "easy (10-30)" : i % 4 === 1 ? "medium (31-55)" : i % 4 === 2 ? "hard (56-80)" : "expert (81-100)";

        const prompt = `Generate exactly ${thisBatch} multiple-choice questions testing real-world AI proficiency.

Category focus: ${category}
Difficulty range: ${diffRange}

Each question MUST have:
- text: Clear question stem about a practical AI scenario
- options: Exactly 4 options as [{id: "A", text: "..."}, {id: "B", text: "..."}, {id: "C", text: "..."}, {id: "D", text: "..."}]
- correctOptionId: "A", "B", "C", or "D"
- difficulty: Number ${diffRange.match(/\d+-\d+/)?.[0] || "30-70"}
- dimensions: 1-2 from [${dimensions.join(", ")}]
- tags: 2-3 relevant lowercase tags
- maxTimeSeconds: 30-60

Rules:
- Questions must test PRACTICAL skill, not trivia
- Every wrong answer must be plausible
- No "all of the above" or "none of the above"
- Vary question formats: scenario-based, what-would-you-do, identify-the-problem, best-practice
- CRITICAL: All 4 options MUST be similar in length and detail. If one answer is 2 sentences, ALL must be ~2 sentences. The correct answer must NOT be the longest.
- Wrong answers must use real technical terms and sound equally sophisticated as the correct answer.
- Distribute correct answers evenly across A/B/C/D.

Return ONLY a JSON array. No markdown, no explanation.`;

        try {
          let content = "";
          if (useOpenAI) {
            const resp = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
              body: JSON.stringify({ model: "gpt-4o", max_tokens: 8192, messages: [{ role: "user", content: prompt }] }),
            });
            if (!resp.ok) { genErrors.push(`Batch ${i + 1}: OpenAI ${resp.status}`); continue; }
            const d = await resp.json();
            content = d.choices?.[0]?.message?.content ?? "";
          } else {
            const resp = await fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
              body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8192, messages: [{ role: "user", content: prompt }] }),
            });
            if (!resp.ok) { genErrors.push(`Batch ${i + 1}: Anthropic ${resp.status}`); continue; }
            const d = await resp.json();
            content = d.content?.[0]?.text ?? "";
          }
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (!jsonMatch) {
            genErrors.push(`Batch ${i + 1}: No JSON array in response`);
            continue;
          }

          const questions = JSON.parse(jsonMatch[0]);
          let batchCreated = 0;

          for (const q of questions) {
            if (!q.text || !q.options || !q.correctOptionId) continue;
            // Deduplicate by text
            const exists = await prisma.questionBank.findFirst({ where: { text: q.text } });
            if (exists) continue;

            try {
              await prisma.questionBank.create({
                data: {
                  text: q.text,
                  options: q.options,
                  correctOptionId: q.correctOptionId,
                  difficulty: Math.min(100, Math.max(1, Number(q.difficulty) || 50)),
                  dimensions: Array.isArray(q.dimensions) ? q.dimensions : ["promptQuality"],
                  tags: Array.isArray(q.tags) ? q.tags : [],
                  maxTimeSeconds: Number(q.maxTimeSeconds) || 45,
                  isActive: true,
                },
              });
              batchCreated++;
            } catch (e) {
              genErrors.push(`Batch ${i + 1} item: ${e instanceof Error ? e.message : String(e)}`);
            }
          }

          totalGenerated += batchCreated;

          // Small delay between batches to respect rate limits
          if (i < batches - 1) {
            await new Promise((r) => setTimeout(r, 1000));
          }
        } catch (e) {
          genErrors.push(`Batch ${i + 1}: ${e instanceof Error ? e.message : String(e)}`);
        }
      }

      results.push({ phase: "generate_llm", count: totalGenerated, errors: genErrors });
    }
  }

  const finalCount = await prisma.questionBank.count({ where: { isActive: true } });

  return NextResponse.json({
    success: true,
    totalQuestionsInBank: finalCount,
    results,
  });
}
