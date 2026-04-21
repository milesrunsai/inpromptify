"use client";

import { useState } from "react";
import Link from "next/link";
import { ds } from "@/lib/designSystem";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 0,
    description: "Try it out",
    features: ["3 assessments per month", "Basic scoring (5 dimensions)", "Claude Haiku model", "Public PromptScore profile"],
    cta: "Current Plan",
    current: true,
    highlight: false,
  },
  {
    name: "Professional",
    monthlyPrice: 49,
    description: "For consultants and freelancers",
    features: ["25 assessments per month", "Claude Haiku + Sonnet models", "Detailed score breakdowns", "PDF report export", "Shareable PromptScore card", "Email support"],
    cta: "Upgrade",
    current: false,
    highlight: false,
  },
  {
    name: "Team",
    monthlyPrice: 199,
    description: "For growing companies",
    features: ["150 assessments per month", "10 team seats", "All AI models", "Team analytics dashboard", "Custom scoring rubrics", "Invite links (no account required)", "CSV + PDF export", "Priority support"],
    cta: "Upgrade",
    current: false,
    highlight: true,
  },
  {
    name: "Business",
    monthlyPrice: 599,
    description: "For departments and large teams",
    features: ["500 assessments per month", "50 team seats", "ATS integrations (Greenhouse, Lever)", "Custom branding", "API access", "SSO authentication", "Dedicated account manager", "Priority support + SLA"],
    cta: "Upgrade",
    current: false,
    highlight: false,
  },
  {
    name: "Enterprise",
    monthlyPrice: -1,
    description: "For organizations at scale",
    features: ["Unlimited assessments", "Unlimited seats", "SSO / SAML / SCIM", "White-label option", "Custom model endpoints", "Dedicated success manager", "Custom SLA + uptime guarantee"],
    cta: "Contact Sales",
    current: false,
    highlight: false,
  },
];

export default function BillingPage() {
  const [annual, setAnnual] = useState(false);

  const getPrice = (monthlyPrice: number) => {
    if (monthlyPrice === -1) return "Custom";
    if (monthlyPrice === 0) return "$0";
    if (annual) return `$${Math.round(monthlyPrice * 0.8)}`;
    return `$${monthlyPrice}`;
  };

  const handleUpgrade = async (planName: string) => {
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName.toLowerCase(), annual }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.demo) {
        alert("Stripe is not configured yet. Billing will be available soon.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={ds.page}>
      <div className="mb-8">
        <h1 className={ds.pageTitle}>Plans & Billing</h1>
        <p className={ds.pageSubtitle}>Manage your subscription and usage.</p>
      </div>

      {/* Current Plan Summary */}
      <div className={`${ds.card} p-5 mb-8`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={ds.sectionLabel}>Current Plan</p>
            <p className="text-lg font-semibold text-white mt-1">Free / Starter</p>
            <p className="text-[13px] text-gray-500 mt-0.5">3 assessments per month, basic scoring</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-500 uppercase tracking-wider">Usage This Month</p>
            <p className="text-lg font-semibold text-white mt-1">0 / 3</p>
            <p className="text-[11px] text-gray-600">assessments used</p>
          </div>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-3 mb-8">
        <span className={`text-sm font-medium ${!annual ? "text-white" : "text-gray-500"}`}>Monthly</span>
        <button onClick={() => setAnnual(!annual)}
          className={`relative w-10 h-5 rounded-full transition-colors ${annual ? "bg-orange-500" : "bg-white/[0.12]"}`}>
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${annual ? "translate-x-5" : ""}`} />
        </button>
        <span className={`text-sm font-medium ${annual ? "text-white" : "text-gray-500"}`}>
          Annual <span className="ml-1.5 text-xs text-emerald-400 font-medium">Save 20%</span>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {plans.map((plan) => (
          <div key={plan.name}
            className={`rounded-lg p-5 flex flex-col ${plan.highlight ? "bg-orange-500/10 border-2 border-orange-500/30" : plan.current ? "bg-[#0C1120] border-2 border-emerald-500/30" : "bg-[#0C1120] border border-white/[0.06]"}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-400">{plan.name}</span>
              {plan.current && <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Current</span>}
              {plan.highlight && <span className="text-[10px] font-medium text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">Popular</span>}
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-bold text-white">{getPrice(plan.monthlyPrice)}</span>
              {plan.monthlyPrice > 0 && <span className="text-sm text-gray-500">/mo</span>}
            </div>
            <p className="text-[12px] text-gray-500 mb-4">{plan.description}</p>

            <ul className="space-y-2 mb-5 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-[12px] text-gray-400">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {feature}
                </li>
              ))}
            </ul>

            {plan.current ? (
              <div className="text-center py-2 px-4 rounded-md text-[13px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                Current Plan
              </div>
            ) : plan.name === "Enterprise" ? (
              <Link href="/contact" className="block text-center py-2 px-4 rounded-md text-[13px] font-medium text-gray-400 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] transition-colors">
                Contact Sales
              </Link>
            ) : (
              <button onClick={() => handleUpgrade(plan.name)}
                className={`w-full py-2 px-4 rounded-md text-[13px] font-medium transition-colors ${plan.highlight ? "bg-orange-500 hover:bg-orange-400 text-white" : "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]"}`}>
                Upgrade
              </button>
            )}
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl">
        <h2 className="text-[15px] font-semibold text-white mb-4">Common questions</h2>
        <div className="space-y-4">
          {[
            { q: "What counts as an assessment?", a: "A single candidate taking a single test. Three candidates on the same test = 3 assessments." },
            { q: "Can I switch plans?", a: "Upgrade anytime. Downgrades take effect at next billing cycle." },
            { q: "Do you offer education discounts?", a: "50% off Professional and Team for verified .edu institutions." },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-white/[0.04] pb-4">
              <h3 className="text-[13px] font-medium text-white mb-1">{faq.q}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
