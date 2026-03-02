import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import crypto from "crypto";

function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string,
  tolerance = 300
): boolean {
  const parts = sigHeader.split(",").reduce<Record<string, string>>((acc, part) => {
    const [key, val] = part.split("=");
    if (key && val) acc[key.trim()] = val.trim();
    return acc;
  }, {});

  const timestamp = parts["t"];
  const v1Signature = parts["v1"];
  if (!timestamp || !v1Signature) return false;

  // Check timestamp tolerance (prevent replay attacks)
  const ts = parseInt(timestamp, 10);
  if (Math.abs(Math.floor(Date.now() / 1000) - ts) > tolerance) return false;

  // Compute expected signature
  const signedPayload = `${timestamp}.${payload}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  // Constant-time comparison
  return crypto.timingSafeEqual(Buffer.from(v1Signature), Buffer.from(expected));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Verify signature if webhook secret is configured
    if (webhookSecret) {
      if (!sig || !verifyStripeSignature(body, sig, webhookSecret)) {
        console.error("Webhook signature verification failed");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else {
      console.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification");
    }

    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.metadata?.email || session.customer_email;
      const plan = session.metadata?.plan;

      if (email && plan) {
        const sql = getSql();
        await sql`
          UPDATE users SET plan = ${plan}, updated_at = NOW()
          WHERE email = ${email}
        `;
        console.log(`Plan updated: ${email} → ${plan}`);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const email = subscription.metadata?.email;
      if (email) {
        const sql = getSql();
        await sql`
          UPDATE users SET plan = 'free', updated_at = NOW()
          WHERE email = ${email}
        `;
        console.log(`Subscription cancelled: ${email} → free`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
