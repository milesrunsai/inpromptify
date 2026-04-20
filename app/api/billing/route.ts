import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getStripeClient, PLANS, type PlanKey } from "@/lib/stripe";

/** POST /api/billing — create a Stripe checkout session */
export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
  });
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const body = await req.json();
  const plan = body.plan as PlanKey;

  if (!plan || !PLANS[plan] || !PLANS[plan].priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const session = await getStripeClient().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?billing=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?billing=cancelled`,
    metadata: {
      orgId: org.id,
      plan,
    },
  });

  return NextResponse.json({ url: session.url });
}

/** GET /api/billing — get current billing info */
export async function GET() {
  const { orgId } = await auth();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { subscriptions: true },
  });
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const subscription = org.subscriptions[0];

  return NextResponse.json({
    plan: subscription?.tier ?? "FREE",
    credits: subscription?.credits ?? 5,
    status: subscription?.status ?? "active",
  });
}
