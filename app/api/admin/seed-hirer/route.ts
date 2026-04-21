import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const HIRER_QUESTIONS = [
  {
    text: "Your team member uses AI to draft a client-facing financial report. The numbers look correct but the analysis section was entirely AI-generated. What is the primary risk?",
    options: [{ id: "A", text: "The formatting might not match company templates" }, { id: "B", text: "The AI may have fabricated plausible-sounding analysis that doesn't reflect actual business context or data relationships" }, { id: "C", text: "The client might notice it was AI-generated" }, { id: "D", text: "It could be slower than writing it manually" }],
    correctOptionId: "B", difficulty: 70, dimensions: ["responseQuality", "iterationIntelligence"], tags: ["judgment", "risk-awareness", "hiring"],
  },
  {
    text: "A job candidate says 'I use AI for everything — it handles about 90% of my work.' As a hiring manager, what should this tell you?",
    options: [{ id: "A", text: "They are highly efficient and should be hired immediately" }, { id: "B", text: "They likely lack understanding of where AI creates risk and where human judgment is essential" }, { id: "C", text: "They are more productive than candidates who don't use AI" }, { id: "D", text: "They have mastered AI and need no further training" }],
    correctOptionId: "B", difficulty: 65, dimensions: ["iterationIntelligence", "promptQuality"], tags: ["judgment", "hiring", "risk-awareness"],
  },
  {
    text: "An employee pastes an entire customer database into ChatGPT to 'find patterns.' What is the most serious issue?",
    options: [{ id: "A", text: "ChatGPT might give inaccurate patterns" }, { id: "B", text: "It might be slow to process" }, { id: "C", text: "Confidential customer data has been sent to a third-party service, potentially violating privacy regulations and data protection policies" }, { id: "D", text: "The patterns would be more accurate in Excel" }],
    correctOptionId: "C", difficulty: 55, dimensions: ["iterationIntelligence"], tags: ["confidentiality", "risk-awareness", "hiring"],
  },
  {
    text: "You ask AI to summarize a 50-page contract. It returns a clean, confident summary. What should you do FIRST?",
    options: [{ id: "A", text: "Send it to the client — it looks professional" }, { id: "B", text: "Verify key clauses, dates, and obligations against the original document because AI frequently omits or misrepresents critical details" }, { id: "C", text: "Ask AI to confirm its own summary is correct" }, { id: "D", text: "Run it through a different AI for a second opinion" }],
    correctOptionId: "B", difficulty: 60, dimensions: ["responseQuality", "iterationIntelligence"], tags: ["verification", "judgment", "hiring"],
  },
  {
    text: "AI generates a response that cites three academic studies to support its recommendation. All citations include author names, journal titles, and dates. What is the most likely issue?",
    options: [{ id: "A", text: "The studies are probably outdated" }, { id: "B", text: "The citations may be entirely fabricated — AI frequently generates realistic-looking references that don't exist" }, { id: "C", text: "The journal impact factors might be low" }, { id: "D", text: "The studies are real but may have been retracted" }],
    correctOptionId: "B", difficulty: 50, dimensions: ["responseQuality"], tags: ["hallucination", "verification", "hiring"],
  },
  {
    text: "Which of these tasks should a professional NEVER delegate entirely to AI without human review?",
    options: [{ id: "A", text: "Drafting a first version of internal meeting notes" }, { id: "B", text: "Generating a compliance determination that affects regulatory filings" }, { id: "C", text: "Creating a brainstorm list of marketing taglines" }, { id: "D", text: "Reformatting data from one spreadsheet layout to another" }],
    correctOptionId: "B", difficulty: 55, dimensions: ["iterationIntelligence"], tags: ["judgment", "compliance", "hiring"],
  },
  {
    text: "Your company is evaluating AI tools for the team. What question matters MOST for the procurement decision?",
    options: [{ id: "A", text: "Which AI scored highest on public benchmarks" }, { id: "B", text: "Where does the data go, who can access it, and does it comply with our data handling policies" }, { id: "C", text: "Which AI has the most features" }, { id: "D", text: "Which AI is cheapest per token" }],
    correctOptionId: "B", difficulty: 65, dimensions: ["iterationIntelligence", "efficiency"], tags: ["procurement", "data-privacy", "hiring"],
  },
  {
    text: "You prompt AI to write a job description and the output is generic and full of buzzwords. What is the BEST next step?",
    options: [{ id: "A", text: "Use it as-is — job descriptions are all similar anyway" }, { id: "B", text: "Try a completely different AI tool" }, { id: "C", text: "Add specific constraints: team size, actual responsibilities, required outcomes, salary band, and what makes this role different" }, { id: "D", text: "Ask AI to 'make it more unique'" }],
    correctOptionId: "C", difficulty: 45, dimensions: ["promptQuality", "iterationIntelligence"], tags: ["iteration", "specificity", "hiring"],
  },
  {
    text: "An AI-generated report has correct data but reads like it was written by a robot. The best approach is to:",
    options: [{ id: "A", text: "Add a disclaimer that it was AI-generated" }, { id: "B", text: "Rewrite it entirely without AI" }, { id: "C", text: "Iterate with specific feedback: rewrite in the tone of our previous reports, focus on the metrics our board cares about, remove generic filler" }, { id: "D", text: "Lower the temperature setting and regenerate" }],
    correctOptionId: "C", difficulty: 60, dimensions: ["promptQuality", "iterationIntelligence"], tags: ["iteration", "tone", "hiring"],
  },
  {
    text: "A candidate describes their AI workflow as: 'I paste the task, copy the output, and submit it.' What critical step is missing?",
    options: [{ id: "A", text: "Using a premium AI model instead of the free version" }, { id: "B", text: "Review, verification, and iteration — checking the output against requirements, source data, and quality standards" }, { id: "C", text: "Adding emojis to make the output more engaging" }, { id: "D", text: "Running the output through a grammar checker" }],
    correctOptionId: "B", difficulty: 40, dimensions: ["iterationIntelligence", "responseQuality"], tags: ["process", "verification", "hiring"],
  },
  {
    text: "Your AI assistant confidently tells you a specific tax treatment is correct. The explanation sounds reasonable. What should raise a red flag?",
    options: [{ id: "A", text: "AI being confident is a feature — trust it" }, { id: "B", text: "AI expresses equal confidence whether correct or hallucinating. Tax advice requires verification against current legislation and a qualified professional" }, { id: "C", text: "Only worry if it mentions specific dollar amounts" }, { id: "D", text: "It's fine as long as you used the latest model" }],
    correctOptionId: "B", difficulty: 70, dimensions: ["iterationIntelligence", "responseQuality"], tags: ["confidence-calibration", "judgment", "hiring"],
  },
  {
    text: "Two team members use AI for the same analysis. Person A takes 10 minutes and submits directly. Person B takes 30 minutes, iterating three times and cross-referencing. Who performed better?",
    options: [{ id: "A", text: "Person A — three times more efficient" }, { id: "B", text: "Person B — speed without verification creates risk, and iteration likely produced a more accurate result" }, { id: "C", text: "They performed equally — both used AI" }, { id: "D", text: "Person A — speed always wins in business" }],
    correctOptionId: "B", difficulty: 55, dimensions: ["efficiency", "iterationIntelligence"], tags: ["judgment", "process", "hiring"],
  },
  {
    text: "What is the strongest signal that someone is genuinely proficient with AI in a professional context?",
    options: [{ id: "A", text: "They can name all the major AI models and their capabilities" }, { id: "B", text: "They describe times AI saved them time AND times it gave wrong results, explaining how they handled both" }, { id: "C", text: "They use AI for every single task" }, { id: "D", text: "They have AI certifications from multiple providers" }],
    correctOptionId: "B", difficulty: 65, dimensions: ["iterationIntelligence", "promptQuality"], tags: ["maturity", "judgment", "hiring"],
  },
  {
    text: "You're building an AI policy for your company. What should it address FIRST?",
    options: [{ id: "A", text: "Which AI tools are approved and banned" }, { id: "B", text: "What data can and cannot be shared with AI tools, including customer data, financial data, source code, and personal information" }, { id: "C", text: "How much the AI tools will cost" }, { id: "D", text: "Which employees are allowed to use AI" }],
    correctOptionId: "B", difficulty: 60, dimensions: ["iterationIntelligence"], tags: ["policy", "data-privacy", "hiring"],
  },
  {
    text: "A hiring manager asks you to use AI to screen 200 resumes and rank candidates. What is the MOST important concern?",
    options: [{ id: "A", text: "Whether the AI can process that many resumes quickly" }, { id: "B", text: "Whether the AI will introduce or amplify bias, and whether decisions can be audited and explained to candidates" }, { id: "C", text: "Whether the AI can read PDF formats" }, { id: "D", text: "Whether the ranked list will be perfectly accurate" }],
    correctOptionId: "B", difficulty: 65, dimensions: ["iterationIntelligence", "responseQuality"], tags: ["bias", "ethics", "hiring"],
  },
];

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let seeded = 0;
  const errors: string[] = [];

  for (const q of HIRER_QUESTIONS) {
    try {
      const existing = await prisma.questionBank.findFirst({ where: { text: q.text } });
      if (existing) continue;
      await prisma.questionBank.create({
        data: { text: q.text, options: q.options, correctOptionId: q.correctOptionId, difficulty: q.difficulty, dimensions: q.dimensions, tags: q.tags, maxTimeSeconds: 45, isActive: true },
      });
      seeded++;
    } catch (e) { errors.push(e instanceof Error ? e.message : String(e)); }
  }

  const total = await prisma.questionBank.count({ where: { isActive: true } });
  return NextResponse.json({ success: true, seeded, total, errors });
}
