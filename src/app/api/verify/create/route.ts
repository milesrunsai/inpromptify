import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { ensureSchema } from "@/lib/schema";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, score, letterGrade, percentile, dimensions } = body;

    if (!userName || score == null || !letterGrade || percentile == null || !dimensions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await ensureSchema();
    const sql = getSql();

    const hash = crypto.randomBytes(16).toString("hex");

    const rows = await sql`
      INSERT INTO score_verifications (hash, user_name, score, letter_grade, percentile, dimensions)
      VALUES (${hash}, ${userName}, ${score}, ${letterGrade}, ${percentile}, ${JSON.stringify(dimensions)})
      RETURNING id, hash
    `;

    return NextResponse.json({
      hash: rows[0].hash,
      url: `https://inpromptify.com/verify/${rows[0].hash}`,
    });
  } catch (error) {
    console.error("Create verification error:", error);
    return NextResponse.json({ error: "Failed to create verification" }, { status: 500 });
  }
}
