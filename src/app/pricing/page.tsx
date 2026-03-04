"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [annual, setAnnual] = useState(false);
  const [teamSize, setTeamSize] = useState(20);

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
                  href={plan.name === "Enterprise" ? "/contact" : isLoggedIn ? "/dashboard/billing" : "/signup"}
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

          {/* Competitor Stack Comparison */}
          <div className="mt-20 mb-20">
            <div className="text-center mb-10">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Compare</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                InpromptiFy vs. The Competitor Stack
              </h2>
              <p className="text-sm text-gray-500 max-w-lg mx-auto">
                See what it actually costs to get the same AI proficiency testing by stitching together multiple tools.
              </p>
            </div>

            {/* Team Size Slider */}
            <div className="max-w-md mx-auto mb-10">
              <label className="block text-sm text-gray-400 mb-2 text-center">
                Team size: <span className="text-white font-semibold">{teamSize} people</span>
              </label>
              <input
                type="range"
                min={5}
                max={200}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-1.5 bg-white/[0.08] rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-gray-600 mt-1">
                <span>5</span>
                <span>200</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* InpromptiFy Side */}
              <div className="bg-indigo-600/[0.06] border-2 border-indigo-500/30 rounded-xl p-7">
                <div className="flex items-center gap-3 mb-6">
                  <img src="/logo.png" alt="InpromptiFy" width={28} height={28} className="rounded" />
                  <h3 className="text-lg font-bold text-white">InpromptiFy</h3>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {teamSize <= 10 ? "Professional" : teamSize <= 50 ? "Team" : "Business"} Plan
                    </span>
                    <span className="text-white font-mono">
                      ${teamSize <= 10 ? (annual ? 39 : 49) : teamSize <= 50 ? (annual ? 159 : 199) : (annual ? 479 : 599)}/mo
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Live AI sandbox assessments</span>
                    <span className="text-emerald-400 text-[12px]">Included</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">5-dimension scoring engine</span>
                    <span className="text-emerald-400 text-[12px]">Included</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Anti-cheat + integrity</span>
                    <span className="text-emerald-400 text-[12px]">Included</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Team analytics + heatmap</span>
                    <span className="text-emerald-400 text-[12px]">Included</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Certifications + badges</span>
                    <span className="text-emerald-400 text-[12px]">Included</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">LinkedIn verification export</span>
                    <span className="text-emerald-400 text-[12px]">Included</span>
                  </div>
                </div>
                <div className="border-t border-indigo-500/20 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-400">Total annual cost</span>
                    <span className="text-2xl font-bold text-white">
                      ${((teamSize <= 10 ? (annual ? 39 : 49) : teamSize <= 50 ? (annual ? 159 : 199) : (annual ? 479 : 599)) * 12).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 text-right">/year</p>
                </div>
              </div>

              {/* Competitor Stack Side */}
              <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-7 h-7 rounded bg-white/[0.06] flex items-center justify-center">
                    <span className="text-[11px] text-gray-500 font-mono">+</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-400">Competitor Stack</h3>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">TestGorilla (skills testing)</span>
                    <span className="text-gray-400 font-mono">${Math.round(75 * (teamSize / 10))}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">HireVue (video + assessment)</span>
                    <span className="text-gray-400 font-mono">$200/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">LinkedIn Verified Skills</span>
                    <span className="text-gray-500 text-[12px]">$0 (no scoring)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Custom integration dev</span>
                    <span className="text-gray-400 font-mono">~$5,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">AI sandbox environment</span>
                    <span className="text-red-400 text-[12px]">Not available</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Anti-cheat monitoring</span>
                    <span className="text-red-400 text-[12px]">Not available</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Live AI proficiency scoring</span>
                    <span className="text-red-400 text-[12px]">Not available</span>
                  </div>
                </div>
                <div className="border-t border-white/[0.06] pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-500">Total annual cost</span>
                    <span className="text-2xl font-bold text-gray-400">
                      ${((Math.round(75 * (teamSize / 10)) + 200) * 12 + 5000).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 text-right">/year + gaps</p>
                </div>
              </div>
            </div>

            {/* Savings callout */}
            {(() => {
              const inpromptifyCost = (teamSize <= 10 ? (annual ? 39 : 49) : teamSize <= 50 ? (annual ? 159 : 199) : (annual ? 479 : 599)) * 12;
              const competitorCost = (Math.round(75 * (teamSize / 10)) + 200) * 12 + 5000;
              const savings = competitorCost - inpromptifyCost;
              const savingsPct = Math.round((savings / competitorCost) * 100);
              return savings > 0 ? (
                <div className="max-w-4xl mx-auto mt-6">
                  <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" alt="InpromptiFy" width={24} height={24} className="rounded" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-400">
                          You save ${savings.toLocaleString()}/year ({savingsPct}%) with InpromptiFy
                        </p>
                        <p className="text-[12px] text-gray-500">
                          Plus you get live AI sandbox testing that no competitor stack offers.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/signup"
                      className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Feature comparison table */}
            <div className="max-w-4xl mx-auto mt-12">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 text-center">Feature Comparison</h3>
              <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-[11px] text-gray-500 uppercase tracking-wider px-5 py-3">Capability</th>
                      <th className="text-center text-[11px] text-indigo-400 uppercase tracking-wider px-5 py-3">
                        <span className="flex items-center justify-center gap-1.5">
                          <img src="/logo.png" alt="" width={14} height={14} className="rounded" />
                          InpromptiFy
                        </span>
                      </th>
                      <th className="text-center text-[11px] text-gray-500 uppercase tracking-wider px-5 py-3">TestGorilla</th>
                      <th className="text-center text-[11px] text-gray-500 uppercase tracking-wider px-5 py-3">HireVue</th>
                      <th className="text-center text-[11px] text-gray-500 uppercase tracking-wider px-5 py-3">LinkedIn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Live AI sandbox testing", us: true, tg: false, hv: false, li: false },
                      { feature: "Real-time prompt scoring", us: true, tg: false, hv: false, li: false },
                      { feature: "5-dimension AI proficiency score", us: true, tg: false, hv: false, li: false },
                      { feature: "Anti-cheat + integrity tracking", us: true, tg: "partial", hv: "partial", li: false },
                      { feature: "Custom role-based assessments", us: true, tg: true, hv: true, li: false },
                      { feature: "Team analytics + heatmap", us: true, tg: true, hv: true, li: false },
                      { feature: "Certification badges", us: true, tg: false, hv: false, li: "partial" },
                      { feature: "LinkedIn verification export", us: true, tg: false, hv: false, li: true },
                      { feature: "Skill decay tracking", us: true, tg: false, hv: false, li: false },
                      { feature: "Agent operations testing", us: true, tg: false, hv: false, li: false },
                      { feature: "API access", us: true, tg: true, hv: true, li: "partial" },
                    ].map((row) => {
                      const cell = (val: boolean | string) => {
                        if (val === true) return <span className="text-emerald-400">&#10003;</span>;
                        if (val === "partial") return <span className="text-amber-400 text-[11px]">Partial</span>;
                        return <span className="text-gray-600">&mdash;</span>;
                      };
                      return (
                        <tr key={row.feature} className="border-b border-white/[0.03]">
                          <td className="text-[13px] text-gray-400 px-5 py-2.5">{row.feature}</td>
                          <td className="text-center px-5 py-2.5">{cell(row.us)}</td>
                          <td className="text-center px-5 py-2.5">{cell(row.tg)}</td>
                          <td className="text-center px-5 py-2.5">{cell(row.hv)}</td>
                          <td className="text-center px-5 py-2.5">{cell(row.li)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
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
