import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserOrg } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

/** PATCH /api/team/[id] — update a member's role */
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

  const org = await getUserOrg(user.id);
  if (!org) {
    return NextResponse.json({ error: "No organization" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { role } = body;

  if (role !== "ADMIN" && role !== "MEMBER") {
    return NextResponse.json(
      { error: "role must be ADMIN or MEMBER" },
      { status: 400 }
    );
  }

  const membership = await prisma.membership.findFirst({
    where: { id, orgId: org.id },
  });
  if (!membership) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const updated = await prisma.membership.update({
    where: { id },
    data: { role },
  });

  return NextResponse.json({ membership: updated });
}

/** DELETE /api/team/[id] — remove a member or cancel an invite */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const org = await getUserOrg(user.id);
  if (!org) {
    return NextResponse.json({ error: "No organization" }, { status: 403 });
  }

  const { id } = await params;

  // Try deleting a membership first
  const membership = await prisma.membership.findFirst({
    where: { id, orgId: org.id },
  });
  if (membership) {
    await prisma.membership.delete({ where: { id } });
    return NextResponse.json({ deleted: true, type: "membership" });
  }

  // Try deleting a team invite
  const invite = await prisma.teamInvite.findFirst({
    where: { id, orgId: org.id },
  });
  if (invite) {
    await prisma.teamInvite.delete({ where: { id } });
    return NextResponse.json({ deleted: true, type: "invite" });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
