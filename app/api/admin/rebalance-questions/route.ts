import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "flinch-admin-2026-xyz";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  // Find questions where correct answer is significantly longer than wrong answers
  const questions = await prisma.questionBank.findMany({
    select: { id: true, text: true, options: true, correctOptionId: true },
  });

  const imbalanced: typeof questions = [];

  for (const q of questions) {
    const opts = q.options as { id: string; text: string }[];
    const correct = opts.find((o) => o.id === q.correctOptionId);
    const wrongs = opts.filter((o) => o.id !== q.correctOptionId);
    if (!correct || wrongs.length === 0) continue;

    const correctLen = correct.text.length;
    const avgWrongLen = wrongs.reduce((s, o) => s + o.text.length, 0) / wrongs.length;

    // Flag if correct answer is >1.5x the average wrong answer length
    if (correctLen > avgWrongLen * 1.5 && correctLen - avgWrongLen > 30) {
      imbalanced.push(q);
    }
  }

  if (imbalanced.length === 0) {
    return NextResponse.json({ message: "No imbalanced questions found", total: questions.length });
  }

  // Process in batches of 10
  const batchSize = 10;
  const batches = [];
  for (let i = 0; i < Math.min(imbalanced.length, 50); i += batchSize) {
    batches.push(imbalanced.slice(i, i + batchSize));
  }

  let fixed = 0;

  for (const batch of batches) {
    const prompt = `You are fixing multiple-choice questions where the correct answer is too long compared to wrong answers.

For each question below, rewrite ONLY the wrong answers to be similar in length and detail to the correct answer. 
Make wrong answers sound equally plausible and sophisticated — use real technical terminology.
Do NOT change the correct answer or the question text.
Do NOT change which option is correct.

Questions to fix:
${batch.map((q, i) => {
  const opts = q.options as { id: string; text: string }[];
  return `${i + 1}. "${q.text}"
Options: ${opts.map(o => `${o.id}: "${o.text}"`).join(" | ")}
Correct: ${q.correctOptionId}`;
}).join("\n\n")}

Return a JSON array where each item has:
- index: the 1-based question number
- options: [{id: "A", text: "..."}, {id: "B", text: "..."}, {id: "C", text: "..."}, {id: "D", text: "..."}]

Keep the correct answer text EXACTLY the same. Only rewrite wrong answers.
Return ONLY JSON array, no markdown.`;

    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-4o",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content?.trim() || "";
      
      let results: { index: number; options: { id: string; text: string }[] }[];
      try {
        const cleaned = content.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
        results = JSON.parse(cleaned);
      } catch {
        continue;
      }

      for (const result of results) {
        const q = batch[result.index - 1];
        if (!q || !result.options || result.options.length !== 4) continue;

        await prisma.questionBank.update({
          where: { id: q.id },
          data: { options: result.options },
        });
        fixed++;
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json({
    total: questions.length,
    imbalanced: imbalanced.length,
    fixed,
    message: `Rebalanced ${fixed} questions out of ${imbalanced.length} flagged`,
  });
}
