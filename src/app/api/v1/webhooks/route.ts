import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { ensureSchema } from "@/lib/schema";
import crypto from "crypto";

// Middleware to verify API key and get user
async function authenticateApiKey(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  const key = authHeader.slice(7);
  const sql = getSql();
  const rows = await sql`
    SELECT ak.user_id, ak.rate_limit, ak.requests_today
    FROM api_keys ak
    WHERE ak.key_hash = encode(sha256(${key}::bytea), 'hex')
      AND ak.is_active = true
  `;
  return rows[0] || null;
}

// GET — list webhooks
export async function GET(request: NextRequest) {
  try {
    await ensureSchema();
    const auth = await authenticateApiKey(request);
    if (!auth) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }
    const sql = getSql();
    const webhooks = await sql`
      SELECT id, url, events, is_active, last_triggered_at, failure_count, created_at
      FROM webhooks WHERE user_id = ${auth.user_id}
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ webhooks });
  } catch (error) {
    console.error("Webhook list error:", error);
    return NextResponse.json({ error: "Failed to list webhooks" }, { status: 500 });
  }
}

// POST — create webhook
export async function POST(request: NextRequest) {
  try {
    await ensureSchema();
    const auth = await authenticateApiKey(request);
    if (!auth) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const body = await request.json();
    const { url, events } = body;

    if (!url || !url.startsWith("https://")) {
      return NextResponse.json({ error: "Webhook URL must use HTTPS" }, { status: 400 });
    }

    const validEvents = ["test.completed", "candidate.scored", "candidate.invited", "test.created"];
    const selectedEvents = events?.filter((e: string) => validEvents.includes(e)) || ["test.completed", "candidate.scored"];

    const secret = `whsec_${crypto.randomBytes(24).toString("hex")}`;
    const sql = getSql();

    const rows = await sql`
      INSERT INTO webhooks (user_id, url, secret, events)
      VALUES (${auth.user_id}, ${url}, ${secret}, ${selectedEvents})
      RETURNING id, url, events, is_active, created_at
    `;

    return NextResponse.json({
      webhook: rows[0],
      secret,
      message: "Save this secret — it won't be shown again. Use it to verify webhook signatures.",
    });
  } catch (error) {
    console.error("Webhook create error:", error);
    return NextResponse.json({ error: "Failed to create webhook" }, { status: 500 });
  }
}

// DELETE — remove webhook
export async function DELETE(request: NextRequest) {
  try {
    await ensureSchema();
    const auth = await authenticateApiKey(request);
    if (!auth) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Webhook ID required" }, { status: 400 });
    }

    const sql = getSql();
    await sql`DELETE FROM webhooks WHERE id = ${Number(id)} AND user_id = ${auth.user_id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook delete error:", error);
    return NextResponse.json({ error: "Failed to delete webhook" }, { status: 500 });
  }
}
