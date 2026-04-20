import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, PLANS, type PlanKey } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripeClient().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook verification failed: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.orgId;
      const plan = session.metadata?.plan as PlanKey | undefined;

      if (!orgId || !plan) break;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (!subscriptionId) break;

      await prisma.subscription.upsert({
        where: { stripeSubId: subscriptionId },
        update: {
          tier: plan,
          credits: PLANS[plan].credits === -1 ? 999999 : PLANS[plan].credits,
          status: "active",
        },
        create: {
          orgId,
          stripeSubId: subscriptionId,
          tier: plan,
          credits: PLANS[plan].credits === -1 ? 999999 : PLANS[plan].credits,
          status: "active",
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubId: subscription.id },
        data: { status: subscription.status },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubId: subscription.id },
        data: { status: "cancelled" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
