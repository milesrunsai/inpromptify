import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

/** PATCH /api/team/[id] — update a member's role */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses?.[0]?.emailAddress)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
  });
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
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
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses?.[0]?.emailAddress)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
  });
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

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
