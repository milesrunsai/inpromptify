import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserOrg } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** GET /api/export — export completed assessments as CSV */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const format = req.nextUrl.searchParams.get("format") ?? "csv";
  if (format !== "csv") {
    return NextResponse.json(
      { error: "Only csv format is supported" },
      { status: 400 }
    );
  }

  const org = await getUserOrg(user.id);
  if (!org) {
    return NextResponse.json({ error: "No organization" }, { status: 403 });
  }

  const assessments = await prisma.assessment.findMany({
    where: {
      orgId: org.id,
      status: "COMPLETED",
    },
    orderBy: { completedAt: "desc" },
  });

  // Build CSV
  const header = "id,candidateEmail,score,status,completedAt,createdAt";
  const rows = assessments.map((a) => {
    const escapeCsv = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };
    return [
      a.id,
      escapeCsv(a.candidateEmail),
      a.score?.toString() ?? "",
      a.status,
      a.completedAt?.toISOString() ?? "",
      a.createdAt.toISOString(),
    ].join(",");
  });

  const csv = [header, ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="assessments-export-${Date.now()}.csv"`,
    },
  });
}
