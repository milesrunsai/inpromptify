import type { Metadata } from "next";
import { PricingContent } from "@/components/marketing/pricing-content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for AI proficiency assessment. Start free, scale as you grow.",
};

export default function PricingPage() {
  return <PricingContent />;
}
