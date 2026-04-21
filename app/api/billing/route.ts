import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserOrg } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripeClient, PLANS, type PlanKey } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** POST /api/billing — create a Stripe checkout session */
export async function POST(req: NextRequest) {
  const rl = rateLimit(`billing-post:${getClientIp(req)}`, 5);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getUserOrg(user.id);
  if (!org) {
    return NextResponse.json({ error: "No organization" }, { status: 403 });
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
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getUserOrg(user.id);
  if (!org) {
    return NextResponse.json({ error: "No organization" }, { status: 403 });
  }

  const orgWithSubs = await prisma.organization.findUnique({
    where: { id: org.id },
    include: { subscriptions: true },
  });

  const subscription = orgWithSubs?.subscriptions[0];

  return NextResponse.json({
    plan: subscription?.tier ?? "FREE",
    credits: subscription?.credits ?? 5,
    status: subscription?.status ?? "active",
  });
}
