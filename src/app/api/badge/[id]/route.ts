import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = getSql();

    const [attempt] = await sql`
      SELECT score FROM test_attempts WHERE id = ${Number(id)} AND status = 'completed'
    `;

    const score = attempt ? Number(attempt.score) : 0;
    const color = score >= 80 ? "#10b981" : score >= 65 ? "#f97316" : score >= 50 ? "#f59e0b" : "#ef4444";
    const grade = score >= 95 ? "S" : score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : score >= 35 ? "D" : "F";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="32" viewBox="0 0 200 32">
      <rect width="200" height="32" rx="6" fill="#0a0a0f"/>
      <rect x="0.5" y="0.5" width="199" height="31" rx="5.5" stroke="white" stroke-opacity="0.08" fill="none"/>
      <text x="8" y="20.5" font-family="system-ui,sans-serif" font-size="11" fill="#f97316" opacity="0.6">[</text>
      <text x="14" y="20.5" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="white">IF</text>
      <text x="27" y="20.5" font-family="system-ui,sans-serif" font-size="11" fill="#f97316" opacity="0.6">]</text>
      <text x="40" y="20.5" font-family="system-ui,sans-serif" font-size="11" fill="white" opacity="0.5">PromptScore</text>
      <rect x="120" y="6" width="72" height="20" rx="4" fill="${color}" opacity="0.15"/>
      <text x="156" y="20" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="${color}" text-anchor="middle">${score}/100 ${grade}</text>
    </svg>`;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch {
    return new NextResponse("", { status: 500 });
  }
}
