"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 0,
    description: "Try it out",
    features: [
      "3 assessments per month",
      "Basic scoring (5 dimensions)",
      "Claude Haiku model",
      "Public PromptScore profile",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Professional",
    monthlyPrice: 49,
    description: "For consultants and freelancers",
    features: [
      "25 assessments per month",
      "Claude Haiku + Sonnet models",
      "Detailed score breakdowns",
      "PDF report export",
      "Shareable PromptScore card",
      "Email support",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Team",
    monthlyPrice: 199,
    description: "For growing companies",
    features: [
      "150 assessments per month",
      "10 team seats",
      "All AI models",
      "Team analytics dashboard",
      "Custom scoring rubrics",
      "Invite links (no account required)",
      "CSV + PDF export",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Business",
    monthlyPrice: 599,
    description: "For departments and large teams",
    features: [
      "500 assessments per month",
      "50 team seats",
      "ATS integrations (Greenhouse, Lever)",
      "Custom branding",
      "API access",
      "SSO authentication",
      "Dedicated account manager",
      "Priority support + SLA",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Enterprise",
    monthlyPrice: -1,
    description: "For organizations assessing at scale",
    features: [
      "Unlimited assessments",
      "Unlimited seats",
      "SSO / SAML / SCIM",
      "White-label option",
      "Unlimited API access",
      "Custom model endpoints",
      "Dedicated success manager",
      "Custom SLA + uptime guarantee",
      "On-premise deployment available",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const getPrice = (monthlyPrice: number) => {
    if (monthlyPrice === -1) return "Custom";
    if (monthlyPrice === 0) return "$0";
    if (annual) return `$${Math.round(monthlyPrice * 0.8)}`;
    return `$${monthlyPrice}`;
  };

  return (
    <>
      <Nav />
      <main className="bg-[#0A0F1C] min-h-screen">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-2xl mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Pricing</h1>
            <p className="text-gray-400">
              Start free. No credit card needed. Scale when your hiring pipeline demands it.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-3 mb-10">
            <span className={`text-sm font-medium ${!annual ? "text-white" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-10 h-5 rounded-full transition-colors ${annual ? "bg-indigo-600" : "bg-white/[0.12]"}`}
              aria-label="Toggle annual pricing"
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${annual ? "translate-x-5" : ""}`} />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-white" : "text-gray-500"}`}>
              Annual
              <span className="ml-1.5 text-xs text-emerald-400 font-medium">Save 20%</span>
            </span>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg p-6 flex flex-col ${
                  plan.highlight
                    ? "bg-indigo-600/10 border-2 border-indigo-500/30"
                    : "bg-[#0C1120] border border-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-400">{plan.name}</span>
                  {plan.highlight && (
                    <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-white">{getPrice(plan.monthlyPrice)}</span>
                  {plan.monthlyPrice > 0 && <span className="text-sm text-gray-500">/mo</span>}
                  {plan.monthlyPrice === -1 && <span className="text-sm text-gray-500"> pricing</span>}
                </div>
                <p className="text-sm text-gray-500 mb-5">{plan.description}</p>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-400">
                      <svg className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === "Enterprise" ? "/contact" : "/signup"}
                  className={`block text-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    plan.highlight
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.08]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mt-20">
            <h2 className="text-xl font-bold text-white mb-6">Common questions</h2>
            <div className="space-y-5">
              {[
                { q: "What counts as an assessment?", a: "A single candidate taking a single test. Three candidates on the same test = 3 assessments toward your monthly limit." },
                { q: "Can I switch plans?", a: "Upgrade anytime. Downgrades take effect at the next billing cycle." },
                { q: "Do you offer education discounts?", a: "50% off Professional and Team for verified .edu institutions. Contact us with your .edu address." },
                { q: "Which AI models are supported?", a: "Free and Professional plans include Claude Haiku and Sonnet. Team and above unlock all models including GPT-4o and Gemini. Enterprise customers can bring their own model endpoints." },
                { q: "Is candidate data secure?", a: "All data encrypted at rest and in transit. SOC 2 Type II compliant. GDPR ready. Enterprise plans offer data residency options." },
              ].map((faq) => (
                <div key={faq.q} className="border-b border-white/[0.06] pb-5">
                  <h3 className="text-sm font-semibold text-white mb-1">{faq.q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
