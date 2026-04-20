import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, { typescript: true });
}

let _stripe: Stripe | null = null;
export function getStripeClient() {
  if (!_stripe) _stripe = getStripe();
  return _stripe;
}

/** @deprecated Use getStripeClient() for lazy initialization */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true })
  : (null as unknown as Stripe);

export const PLANS = {
  FREE: {
    name: "Free",
    credits: 5,
    priceId: null,
    price: 0,
  },
  STARTER: {
    name: "Starter",
    credits: 50,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    price: 49,
  },
  BUSINESS: {
    name: "Business",
    credits: 500,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    price: 199,
  },
  ENTERPRISE: {
    name: "Enterprise",
    credits: -1, // unlimited
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    price: 499,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
