import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

const ADMIN_EMAILS_RAW = process.env.ADMIN_EMAILS ?? "";
const ADMIN_EMAIL =
  ADMIN_EMAILS_RAW.split(",").filter(Boolean)[0] ?? "inpromptyou@gmail.com";
const ORG_NAME = "InpromptiFy";
const ORG_SLUG = "inpromptify";

/** GET /api/admin/seed — seed admin account, org, and enterprise subscription */
export async function GET(req: NextRequest) {
  // Allow bootstrap via secret token OR logged-in admin
  const secret = req.nextUrl.searchParams.get("secret");
  const adminSecret = process.env.ADMIN_SECRET;

  if (secret && adminSecret && secret === adminSecret) {
    // Authorized via secret token — proceed
  } else {
    const currentUser = await getCurrentUser();
    if (!currentUser || !isAdmin(currentUser.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    // Find or create admin user
    let user = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (!user) {
      const randomHash = crypto.randomBytes(32).toString("hex");
      user = await prisma.user.create({
        data: {
          email: ADMIN_EMAIL,
          name: "InpromptiFy Admin",
          passwordHash: randomHash,
          emailVerified: true,
        },
      });
    }

    // Find or create org
    let org = await prisma.organization.findUnique({
      where: { slug: ORG_SLUG },
    });

    if (!org) {
      org = await prisma.organization.create({
        data: {
          name: ORG_NAME,
          slug: ORG_SLUG,
        },
      });
    }

    // Ensure admin membership
    const existingMembership = await prisma.membership.findFirst({
      where: { userId: user.id, orgId: org.id },
    });

    if (!existingMembership) {
      await prisma.membership.create({
        data: {
          userId: user.id,
          orgId: org.id,
          role: "ADMIN",
        },
      });
    } else if (existingMembership.role !== "ADMIN") {
      await prisma.membership.update({
        where: { id: existingMembership.id },
        data: { role: "ADMIN" },
      });
    }

    // Ensure enterprise subscription
    const existingSub = await prisma.subscription.findFirst({
      where: { orgId: org.id },
    });

    if (!existingSub) {
      await prisma.subscription.create({
        data: {
          orgId: org.id,
          stripeSubId: `seed_enterprise_${org.id}`,
          tier: "ENTERPRISE",
          credits: 999999,
          status: "active",
        },
      });
    } else if (existingSub.tier !== "ENTERPRISE") {
      await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          tier: "ENTERPRISE",
          credits: 999999,
          status: "active",
        },
      });
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      orgId: org.id,
      message: "Admin account seeded with ENTERPRISE subscription",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Seed failed", details: String(err) },
      { status: 500 }
    );
  }
}
