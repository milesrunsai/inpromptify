import { NextResponse } from "next/server";
import { ensureSchema } from "@/lib/schema";

/**
 * GET /api/db/migrate
 * Run safe, idempotent migrations via ensureSchema().
 * No auth required since all operations are idempotent.
 */
export async function GET() {
  try {
    await ensureSchema();
    return NextResponse.json({ success: true, message: "Migration complete" });
  } catch (e) {
    console.error("Migration error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
