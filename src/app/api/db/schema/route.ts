import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET() {
  try {
    const sql = getSql();
    const cols = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'tests'
      ORDER BY ordinal_position
    `;
    return NextResponse.json(cols);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
