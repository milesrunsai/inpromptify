import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT =
  "You are an AI learning assistant for InpromptiFy, an AI proficiency assessment platform. " +
  "Help users understand AI concepts, improve their prompt engineering skills, and prepare for " +
  "AI proficiency assessments. Be concise, practical, and encouraging. If asked about assessment " +
  "results, provide actionable study recommendations.";

/** POST /api/ai-chat — streaming AI chat */
export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`ai-chat:${getClientIp(req)}`, 20);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limited. Try again later." },
      { status: 429 }
    );
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
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (dbUser) {
    await prisma.aiChatMessage.create({
      data: {
        userId: dbUser.id,
        role: "user",
        content: message,
      },
    });
  }

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
        if (dbUser) {
          await prisma.aiChatMessage.create({
            data: {
              userId: dbUser.id,
              role: "assistant",
              content: fullResponse,
            },
          });
        }
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
