import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** GET /api/team — list team members for the authenticated org */
export async function GET(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              imageUrl: true,
              clerkUserId: true,
            },
          },
        },
      },
    },
  });
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  // Also fetch pending invites
  const invites = await prisma.teamInvite.findMany({
    where: { orgId: org.id, status: "pending" },
    orderBy: { createdAt: "desc" },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const members = (org.members as any[]).map((m) => ({
    id: m.id,
    name: m.user.name,
    email: m.user.email,
    role: m.role,
    avatarUrl: m.user.imageUrl,
    joinedAt: "",
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pendingInvites = (invites as any[]).map((inv) => ({
    id: inv.id,
    email: inv.email,
    role: inv.role,
    invitedAt: inv.createdAt.toISOString(),
    status: inv.status,
  }));

  return NextResponse.json({ members, invites: pendingInvites });
}

/** POST /api/team — invite a team member */
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!isAdmin(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rl = rateLimit(`team-invite:${getClientIp(req)}`, 10);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limited. Try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { email: inviteEmail, role } = body;

  if (!inviteEmail || typeof inviteEmail !== "string") {
    return NextResponse.json(
      { error: "email is required" },
      { status: 400 }
    );
  }

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
  });
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invite = await prisma.teamInvite.create({
    data: {
      orgId: org.id,
      email: inviteEmail.toLowerCase(),
      role: role === "ADMIN" ? "ADMIN" : "MEMBER",
      invitedBy: email!,
      status: "pending",
      expiresAt,
    },
  });

  return NextResponse.json({ invite }, { status: 201 });
}
