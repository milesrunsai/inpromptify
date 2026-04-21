import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

/** PATCH /api/admin/questions/:id — approve, reject, or deactivate */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { action } = await req.json();

  if (action === "approve") {
    // Move from PendingQuestion to QuestionBank
    const pending = await prisma.pendingQuestion.findUnique({ where: { id } });
    if (!pending) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Create in QuestionBank
    await prisma.questionBank.create({
      data: {
        text: pending.text,
        options: pending.options as object,
        correctOptionId: pending.correctOptionId,
        difficulty: pending.difficulty,
        dimensions: pending.dimensions as object,
        tags: pending.tags,
        maxTimeSeconds: pending.maxTimeSeconds,
        isActive: true,
      },
    });

    // Update pending status
    await prisma.pendingQuestion.update({
      where: { id },
      data: { status: "approved", reviewedBy: user.email ?? null },
    });

    return NextResponse.json({ success: true, action: "approved" });
  }

  if (action === "reject") {
    await prisma.pendingQuestion.update({
      where: { id },
      data: { status: "rejected", reviewedBy: user.email ?? null },
    });
    return NextResponse.json({ success: true, action: "rejected" });
  }

  if (action === "deactivate") {
    await prisma.questionBank.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true, action: "deactivated" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
