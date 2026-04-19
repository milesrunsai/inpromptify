"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    priceLabel: "Free",
    description: "For individuals exploring AI assessment",
    features: [
      "5 assessments per month",
      "Basic skill reports",
      "Community question bank",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    monthly: 29,
    annual: 23,
    priceLabel: "",
    description: "For teams building AI-ready workforce",
    features: [
      "Unlimited assessments",
      "Adaptive testing engine",
      "Skill radar charts",
      "Team analytics (up to 50)",
      "Custom assessments",
      "API access",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    monthly: 0,
    annual: 0,
    priceLabel: "Custom",
    description: "For organizations at scale",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Digital certifications",
      "SSO & SCIM",
      "Custom integrations",
      "Dedicated CSM",
      "SLA guarantee",
      "On-premise option",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <Nav />
      <main className="bg-[#0a0a0f] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
          <div className="text-center max-w-xl mx-auto">
            <span className="section-label">[ Pricing ]</span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-2 text-white">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-gray-400 mt-4">
              Start free. Scale as you grow. No surprises.
            </p>

            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-sm ${!annual ? "text-white" : "text-white/40"}`}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  annual ? "bg-orange-500" : "bg-white/10"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    annual ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
              <span className={`text-sm ${annual ? "text-white" : "text-white/40"}`}>
                Annual <span className="text-orange-400 text-xs font-mono">-20%</span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-12 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const price = plan.priceLabel
                ? plan.priceLabel
                : annual
                ? `$${plan.annual}`
                : `$${plan.monthly}`;
              const period = plan.priceLabel ? "" : annual ? "/mo billed annually" : "/month";

              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-6 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/5 ${
                    plan.highlighted
                      ? "bg-gradient-to-b from-orange-500/[0.08] to-transparent border border-orange-500/20"
                      : "glass-strong"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{price}</span>
                    {period && (
                      <span className="text-sm text-white/30">{period}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{plan.description}</p>

                  <ul className="mt-6 space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          className="text-orange-400 flex-shrink-0"
                        >
                          <path
                            d="M11.5 3.5L5.25 9.75 2.5 7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.name === "Enterprise" ? "/contact" : isLoggedIn ? "/dashboard/billing" : "/signup"}
                    className={`mt-8 w-full py-2.5 rounded-lg text-sm font-medium transition-all text-center block ${
                      plan.highlighted
                        ? "glow-btn"
                        : "ghost-btn"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
