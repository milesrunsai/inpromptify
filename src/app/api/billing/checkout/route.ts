import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PLANS: Record<string, { priceId: string; name: string }> = {
  professional: { priceId: "price_1T6PFqH46oIUlUacECXJNy69", name: "Professional" },
  team: { priceId: "price_1T6PGDH46oIUlUacdtCuObxl", name: "Team" },
  business: { priceId: "price_1T6PGNH46oIUlUactpgSiH8R", name: "Business" },
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();
    const planConfig = PLANS[plan];
    if (!planConfig) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ 
        error: "Stripe not configured. Contact support.",
        demo: true,
        plan: planConfig.name,
      }, { status: 503 });
    }

    // Create Stripe Checkout session
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "mode": "subscription",
        "customer_email": session.user.email,
        "line_items[0][price]": planConfig.priceId,
        "line_items[0][quantity]": "1",
        "success_url": `${process.env.NEXTAUTH_URL || "https://inpromptify.com"}/dashboard?upgraded=${plan}`,
        "cancel_url": `${process.env.NEXTAUTH_URL || "https://inpromptify.com"}/pricing`,
        "metadata[plan]": plan,
        "metadata[email]": session.user.email,
      }).toString(),
    });

    const data = await res.json();
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ url: data.url });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
