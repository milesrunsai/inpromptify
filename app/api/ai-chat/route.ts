import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserOrg } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT =
  "You are the official Inpromptify AI assistant. You ONLY help with topics related to Inpromptify and AI proficiency. " +
  "This includes: AI assessment preparation, prompt engineering tips, understanding your PromptScore results, " +
  "platform features and pricing, account and billing questions, AI concepts relevant to proficiency assessments, " +
  "and best practices for improving AI literacy. " +
  "You must REFUSE any requests unrelated to Inpromptify or AI proficiency assessment. " +
  "If a user asks about unrelated topics (coding homework, general knowledge, creative writing, etc.), " +
  "politely decline and redirect them back to Inpromptify topics. " +
  "Be concise, practical, and encouraging. If asked about assessment results, provide actionable study recommendations.";

/** Tier-based daily AI chat limits */
const TIER_CHAT_LIMITS: Record<string, number> = {
  FREE: 20,
  STARTER: 100,
  BUSINESS: 500,
  ENTERPRISE: -1, // unlimited
};

/** POST /api/ai-chat — streaming AI chat */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Per-IP burst rate limit
  const rl = rateLimit(`ai-chat:${getClientIp(req)}`, 20);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limited. Try again later." },
      { status: 429 }
    );
  }

  // Tier-based daily limit
  const org = await getUserOrg(user.id);
  let tier = "FREE";
  if (org) {
    const sub = await prisma.subscription.findFirst({
      where: { orgId: org.id },
    });
    if (sub) tier = sub.tier;
  }

  const dailyLimit = TIER_CHAT_LIMITS[tier] ?? 20;
  if (dailyLimit !== -1) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayCount = await prisma.aiChatMessage.count({
      where: {
        userId: user.id,
        role: "user",
        createdAt: { gte: todayStart },
      },
    });

    if (todayCount >= dailyLimit) {
      return NextResponse.json(
        {
          error: `You have reached your daily AI chat limit (${dailyLimit} messages). Upgrade your plan for more.`,
        },
        { status: 429 }
      );
    }
  }

  const body = await req.json();
  const { message, history } = body;

  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { error: "message is required" },
      { status: 400 }
    );
  }

  // Build message list
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (Array.isArray(history)) {
    for (const msg of history) {
      if (msg.role && msg.content) {
        messages.push({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        });
      }
    }
  }

  messages.push({ role: "user", content: message });

  // Save user message to DB
  await prisma.aiChatMessage.create({
    data: {
      userId: user.id,
      role: "user",
      content: message,
    },
  });

  // Create streaming response
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    stream: true,
  });

  let fullResponse = "";
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            fullResponse += text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();

        // Save assistant response to DB
        await prisma.aiChatMessage.create({
          data: {
            userId: user.id,
            role: "assistant",
            content: fullResponse,
          },
        });
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
