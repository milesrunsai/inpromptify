import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for AI proficiency assessment. Start free, scale as you grow.",
};

const tiers = [
  {
    name: "Free",
    price: { monthly: "$0", annual: "$0" },
    description: "Try InpromptiFy with your team. No credit card required.",
    features: [
      "5 assessments per month",
      "1 admin seat",
      "Basic scoring report",
      "PromptScore credential",
      "Email support",
    ],
    cta: "Get Started",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Starter",
    price: { monthly: "$99", annual: "$79" },
    period: "/mo",
    description: "For growing teams running structured AI hiring.",
    features: [
      "50 assessments per month",
      "5 admin seats",
      "Full 5-dimension scoring",
      "Team analytics dashboard",
      "API access",
      "Zapier integration",
      "Priority email support",
    ],
    cta: "Start Trial",
    href: "/sign-up?plan=starter",
    highlighted: false,
  },
  {
    name: "Business",
    price: { monthly: "$399", annual: "$319" },
    period: "/mo",
    description: "For organizations scaling AI fluency across departments.",
    features: [
      "500 assessments per month",
      "25 admin seats",
      "Full 5-dimension scoring",
      "Advanced team analytics",
      "ATS integrations (Greenhouse, Lever)",
      "Custom assessment templates",
      "SSO (SAML 2.0)",
      "Dedicated support",
    ],
    cta: "Start Trial",
    href: "/sign-up?plan=business",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", annual: "Custom" },
    description:
      "For large organizations with compliance and customization needs.",
    features: [
      "Unlimited assessments",
      "Unlimited seats",
      "Everything in Business",
      "SCIM provisioning",
      "Custom scoring models",
      "Dedicated CSM",
      "SLA guarantee",
      "On-prem evaluation (roadmap)",
    ],
    cta: "Contact Sales",
    href: "#",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Transparent pricing, no surprises
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you need team analytics, integrations, or
            higher volume. All plans include the full adaptive assessment
            engine.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Annual billing saves 20%. All prices in USD.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col rounded-xl border p-8",
                tier.highlighted
                  ? "border-primary bg-card shadow-lg shadow-primary/5"
                  : "border-border/50 bg-card"
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  {tier.price.monthly}
                </span>
                {tier.period && (
                  <span className="text-sm text-muted-foreground">
                    {tier.period}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {tier.description}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href={tier.href}
                  className={cn(
                    buttonVariants({
                      variant: tier.highlighted ? "default" : "outline",
                    }),
                    "w-full"
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Overage / Credits */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Need more assessments?
            </h2>
            <p className="mt-3 text-muted-foreground">
              1 credit = 1 full assessment. Overages are billed at $15-25 per
              assessment depending on your plan. No hidden fees, no per-seat
              surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-center">
            Compare plans
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            See exactly what&apos;s included in every plan.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="py-3 pr-4 text-left font-medium text-muted-foreground">
                    Feature
                  </th>
                  {["Free", "Starter", "Business", "Enterprise"].map((plan) => (
                    <th
                      key={plan}
                      className="px-4 py-3 text-center font-semibold"
                    >
                      {plan}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {[
                  { feature: "Assessments / month", values: ["5", "50", "500", "Unlimited"] },
                  { feature: "Admin seats", values: ["1", "5", "25", "Unlimited"] },
                  { feature: "Adaptive engine", values: [true, true, true, true] },
                  { feature: "5-dimension scoring", values: ["Basic", true, true, true] },
                  { feature: "PromptScore credential", values: [true, true, true, true] },
                  { feature: "Team dashboard", values: [false, true, true, true] },
                  { feature: "API access", values: [false, true, true, true] },
                  { feature: "Zapier / Make", values: [false, true, true, true] },
                  { feature: "ATS integrations", values: [false, false, true, true] },
                  { feature: "Custom templates", values: [false, false, true, true] },
                  { feature: "Role-based assessments", values: [false, false, true, true] },
                  { feature: "Anti-cheat proctoring", values: [false, true, true, true] },
                  { feature: "SSO (SAML 2.0)", values: [false, false, true, true] },
                  { feature: "SCIM provisioning", values: [false, false, false, true] },
                  { feature: "Custom scoring models", values: [false, false, false, true] },
                  { feature: "Dedicated CSM", values: [false, false, false, true] },
                  { feature: "SLA guarantee", values: [false, false, false, true] },
                  { feature: "Overage rate", values: ["—", "$25/ea", "$15/ea", "N/A"] },
                ].map((row) => (
                  <tr key={row.feature}>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {row.feature}
                    </td>
                    {row.values.map((val, i) => (
                      <td key={i} className="px-4 py-3 text-center">
                        {val === true ? (
                          <svg
                            className="mx-auto h-4 w-4 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : val === false ? (
                          <span className="text-muted-foreground/40">—</span>
                        ) : (
                          <span className="text-muted-foreground">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-center">
            Frequently asked questions
          </h2>
          <div className="mt-10 space-y-8">
            {[
              {
                q: "What counts as one assessment?",
                a: "One assessment is a single candidate completing the full adaptive evaluation. The 3-minute public mini-assessment does not consume credits.",
              },
              {
                q: "Can I switch plans at any time?",
                a: "Yes. Upgrades take effect immediately with prorated billing. Downgrades apply at the end of your current billing period.",
              },
              {
                q: "Do you offer volume discounts?",
                a: "Enterprise plans include custom pricing based on volume. Contact our sales team for a quote tailored to your organization.",
              },
              {
                q: "Is there a free trial?",
                a: "The Free plan is permanent, not a trial. Starter and Business plans include a 14-day free trial with full access to all features.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="text-sm font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
