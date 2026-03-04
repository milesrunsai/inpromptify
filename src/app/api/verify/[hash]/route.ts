import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { ensureSchema } from "@/lib/schema";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;
    if (!hash) {
      return NextResponse.json({ error: "Hash is required" }, { status: 400 });
    }

    await ensureSchema();
    const sql = getSql();

    const rows = await sql`
      SELECT hash, user_name, score, letter_grade, percentile, dimensions, created_at
      FROM score_verifications
      WHERE hash = ${hash}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Verification not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Get verification error:", error);
    return NextResponse.json({ error: "Failed to fetch verification" }, { status: 500 });
  }
}
