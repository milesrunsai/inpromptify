import { NextRequest, NextResponse } from "next/server";

// Tiered rate limiting
// Per-minute: prevent burst abuse
// Per-day: cap total free AI usage per IP (controls cost)
const minuteMap = new Map<string, { count: number; resetAt: number }>();
const dailyMap = new Map<string, { count: number; resetAt: number }>();

const MINUTE_LIMIT = 6; // 6 requests per minute per IP
const DAILY_FREE_LIMIT = 15; // 15 total free prompts per day per IP (enough for ~3 tests)
const DAILY_AUTH_LIMIT = 100; // authenticated users get more

function checkRateLimit(ip: string, isAuthenticated: boolean = false): { allowed: boolean; reason?: string } {
  const now = Date.now();

  // Per-minute check
  const minEntry = minuteMap.get(ip);
  if (!minEntry || now > minEntry.resetAt) {
    minuteMap.set(ip, { count: 1, resetAt: now + 60_000 });
  } else if (minEntry.count >= MINUTE_LIMIT) {
    return { allowed: false, reason: "Too many requests. Please wait a moment." };
  } else {
    minEntry.count++;
  }

  // Daily check
  const dailyLimit = isAuthenticated ? DAILY_AUTH_LIMIT : DAILY_FREE_LIMIT;
  const dayEntry = dailyMap.get(ip);
  const dayMs = 86_400_000;
  if (!dayEntry || now > dayEntry.resetAt) {
    dailyMap.set(ip, { count: 1, resetAt: now + dayMs });
  } else if (dayEntry.count >= dailyLimit) {
    return {
      allowed: false,
      reason: isAuthenticated
        ? "Daily limit reached. Upgrade your plan for more."
        : "Daily free limit reached. Sign up for more assessments.",
    };
  } else {
    dayEntry.count++;
  }

  maybeCleanup();
  return { allowed: true };
}

// Lazy cleanup — runs inside checkRateLimit instead of setInterval (avoids build issues)
let lastCleanup = Date.now();
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < 600_000) return;
  lastCleanup = now;
  for (const [key, val] of minuteMap) { if (now > val.resetAt) minuteMap.delete(key); }
  for (const [key, val] of dailyMap) { if (now > val.resetAt) dailyMap.delete(key); }
}

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  model: string;
}

// Model configuration
const MODELS = {
  "claude-haiku": {
    id: "claude-haiku-4-5",
    name: "Claude Haiku",
    provider: "anthropic" as const,
    costPer1kInput: 0.001,
    costPer1kOutput: 0.005,
  },
  "claude-sonnet": {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet",
    provider: "anthropic" as const,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai" as const,
    costPer1kInput: 0.00015,
    costPer1kOutput: 0.0006,
  },
  "gpt-4o": {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai" as const,
    costPer1kInput: 0.0025,
    costPer1kOutput: 0.01,
  },
} as const;

type ModelKey = keyof typeof MODELS;

async function callOpenAI(
  prompt: string,
  taskDescription: string,
  model: ModelKey = "gpt-4o-mini",
  conversationHistory: AnthropicMessage[] = []
): Promise<{ response: string; inputTokens: number; outputTokens: number; modelUsed: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const modelConfig = MODELS[model];

  const systemPrompt = `You are an AI assistant being used in a prompting skill assessment platform called InpromptiFy. The candidate has been given the following task:

---
${taskDescription}
---

Respond naturally and helpfully to their prompts. Your response quality will be used to evaluate how well the candidate prompted you. Be thorough but concise. Do not mention that this is a test or assessment.`;

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...conversationHistory.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: prompt },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelConfig.id,
      max_tokens: 1500,
      messages,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("OpenAI API error:", error);
    throw new Error(`OpenAI API error: ${res.status}`);
  }

  const data = await res.json();

  return {
    response: data.choices?.[0]?.message?.content || "No response generated.",
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
    modelUsed: modelConfig.name,
  };
}

async function callClaude(
  prompt: string,
  taskDescription: string,
  model: ModelKey = "claude-haiku",
  conversationHistory: AnthropicMessage[] = []
): Promise<{ response: string; inputTokens: number; outputTokens: number; modelUsed: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const modelConfig = MODELS[model] || MODELS["claude-haiku"];

  const systemPrompt = `You are an AI assistant being used in a prompting skill assessment platform called InpromptiFy. The candidate has been given the following task:

---
${taskDescription}
---

Respond naturally and helpfully to their prompts. Your response quality will be used to evaluate how well the candidate prompted you. Be thorough but concise. Do not mention that this is a test or assessment.`;

  const messages: AnthropicMessage[] = [
    ...conversationHistory,
    { role: "user", content: prompt },
  ];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: modelConfig.id,
      max_tokens: 1500,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Anthropic API error:", error);
    throw new Error(`Anthropic API error: ${res.status}`);
  }

  const data: AnthropicResponse = await res.json();

  return {
    response: data.content[0]?.text || "No response generated.",
    inputTokens: data.usage.input_tokens,
    outputTokens: data.usage.output_tokens,
    modelUsed: modelConfig.name,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check auth status (cookie-based, don't block if missing)
    const authCookie = request.cookies.get("authjs.session-token")?.value || 
                       request.cookies.get("__Secure-authjs.session-token")?.value;
    const isAuthenticated = !!authCookie;

    // Rate limiting — stricter for anonymous users
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const rateCheck = checkRateLimit(ip, isAuthenticated);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.reason }, { status: 429 });
    }

    const body = await request.json();
    const { prompt, testId, taskDescription, attemptNumber, model, conversationHistory } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!testId) {
      return NextResponse.json({ error: "Test ID is required" }, { status: 400 });
    }

    // Determine model — default to haiku (cheapest)
    const selectedModel: ModelKey = (model && model in MODELS) ? model as ModelKey : "claude-haiku";
    const modelConfig = MODELS[selectedModel] || MODELS["claude-haiku"];

    // Route to the right provider
    let result;
    if (modelConfig.provider === "openai") {
      if (!process.env.OPENAI_API_KEY) {
        // Fallback to Claude if no OpenAI key configured
        result = await callClaude(
          prompt,
          taskDescription || "Complete the given task as effectively as possible.",
          "claude-haiku",
          conversationHistory || []
        );
      } else {
        result = await callOpenAI(
          prompt,
          taskDescription || "Complete the given task as effectively as possible.",
          selectedModel,
          conversationHistory || []
        );
      }
    } else {
      result = await callClaude(
        prompt,
        taskDescription || "Complete the given task as effectively as possible.",
        selectedModel,
        conversationHistory || []
      );
    }

    return NextResponse.json({
      response: result.response,
      tokensUsed: {
        prompt: result.inputTokens,
        completion: result.outputTokens,
        total: result.inputTokens + result.outputTokens,
      },
      model: result.modelUsed,
      attemptNumber: attemptNumber || 1,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Submit error:", error);
    const errMsg = error instanceof Error ? error.message : String(error);

    return NextResponse.json({
      response: "The AI service encountered an error. Please try again.",
      tokensUsed: { prompt: 0, completion: 0, total: 0 },
      model: "fallback",
      error: errMsg,
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  }
}
