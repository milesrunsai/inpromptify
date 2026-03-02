"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const PRICING = {
  baseFee: 499,
  perSeat: 29,
  minSeats: 5,
  testTiers: [
    { upTo: 2000, perTest: 0.35 },
    { upTo: 5000, perTest: 0.30 },
    { upTo: 10000, perTest: 0.25 },
    { upTo: 25000, perTest: 0.20 },
    { upTo: Infinity, perTest: 0.15 },
  ],
  addOns: {
    sso: { label: "SSO / SAML", price: 99 },
    whiteLabel: { label: "White-label branding", price: 199 },
    customModels: { label: "Custom model endpoints", price: 149 },
    sla: { label: "99.9% SLA guarantee", price: 249 },
    dedicatedSupport: { label: "Dedicated account manager", price: 199 },
  },
  annualDiscount: 0.25,
};

function calculateTestCost(tests: number): number {
  const tier = PRICING.testTiers.find((t) => tests <= t.upTo) || PRICING.testTiers[PRICING.testTiers.length - 1];
  return tests * tier.perTest;
}

function getTestRate(tests: number): number {
  const tier = PRICING.testTiers.find((t) => tests <= t.upTo) || PRICING.testTiers[PRICING.testTiers.length - 1];
  return tier.perTest;
}

type AddOnKey = keyof typeof PRICING.addOns;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    seats: "10",
    testsPerMonth: "2000",
    message: "",
  });
  const [addOns, setAddOns] = useState<Record<AddOnKey, boolean>>({
    sso: false,
    whiteLabel: false,
    customModels: false,
    sla: false,
    dedicatedSupport: false,
  });
  const [annual, setAnnual] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const seats = Math.max(PRICING.minSeats, parseInt(formData.seats) || PRICING.minSeats);
  const tests = parseInt(formData.testsPerMonth) || 2000;

  const baseCost = PRICING.baseFee;
  const seatCost = seats * PRICING.perSeat;
  const testCost = calculateTestCost(tests);
  const addOnCost = (Object.keys(addOns) as AddOnKey[]).reduce(
    (sum, key) => sum + (addOns[key] ? PRICING.addOns[key].price : 0),
    0
  );
  const monthlyTotal = baseCost + seatCost + testCost + addOnCost;
  const finalMonthly = annual ? monthlyTotal * (1 - PRICING.annualDiscount) : monthlyTotal;

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          addOns,
          annual,
          estimatedMonthly: Math.round(finalMonthly),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-white/[0.08] rounded-md text-sm bg-white/[0.04] text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 focus:outline-none";

  return (
    <>
      <Nav />
      <main className="bg-[#0A0F1C] min-h-screen">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-2xl mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Enterprise</h1>
            <p className="text-gray-400">
              Custom pricing for organizations that need scale, security, and control. 
              Configure your plan below and we&apos;ll get back within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Form */}
            <div>
              {submitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-8 text-center">
                  <h2 className="text-xl font-bold text-white mb-2">Request received</h2>
                  <p className="text-gray-400">We&apos;ll review your configuration and get back to you at <strong className="text-white">{formData.email}</strong> within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Work email</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                      <input type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                      <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. Head of Talent" className={inputClass} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Team seats</label>
                      <input type="number" min={PRICING.minSeats} value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: e.target.value })} className={inputClass} />
                      <p className="text-xs text-gray-600 mt-1">Minimum {PRICING.minSeats} seats</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Tests per month</label>
                      <select value={formData.testsPerMonth} onChange={(e) => setFormData({ ...formData, testsPerMonth: e.target.value })} className={inputClass}>
                        <option value="1000">Up to 1,000</option>
                        <option value="2000">Up to 2,000</option>
                        <option value="5000">Up to 5,000</option>
                        <option value="10000">Up to 10,000</option>
                        <option value="25000">Up to 25,000</option>
                        <option value="50000">50,000+</option>
                      </select>
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Add-ons</label>
                    <div className="space-y-2">
                      {(Object.keys(PRICING.addOns) as AddOnKey[]).map((key) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={addOns[key]} onChange={() => setAddOns({ ...addOns, [key]: !addOns[key] })} className="w-4 h-4 rounded border-white/[0.12] bg-white/[0.04] text-indigo-600 focus:ring-indigo-500" />
                          <span className="text-sm text-gray-400">{PRICING.addOns[key].label}</span>
                          <span className="text-xs text-gray-600 ml-auto">${PRICING.addOns[key].price}/mo</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Anything else we should know?</label>
                    <textarea rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Custom requirements, integrations, compliance needs..." className={inputClass} />
                  </div>

                  {submitError && (
                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">{submitError}</div>
                  )}

                  <button type="submit" disabled={submitting} className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 transition-colors">
                    {submitting ? "Submitting..." : "Request Enterprise Quote"}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Live pricing calculator */}
            <div>
              <div className="bg-[#0C1120] border border-white/[0.06] rounded-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold text-white">Estimated pricing</h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${!annual ? "text-white font-medium" : "text-gray-500"}`}>Monthly</span>
                    <button onClick={() => setAnnual(!annual)} className={`relative w-8 h-4 rounded-full transition-colors ${annual ? "bg-indigo-600" : "bg-white/[0.12]"}`}>
                      <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${annual ? "translate-x-4" : ""}`} />
                    </button>
                    <span className={`text-xs ${annual ? "text-white font-medium" : "text-gray-500"}`}>
                      Annual <span className="text-emerald-400">-25%</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Platform base</span>
                    <span className="text-white font-medium">${baseCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{seats} seats x ${PRICING.perSeat}</span>
                    <span className="text-white font-medium">${seatCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{tests.toLocaleString()} tests x ${getTestRate(tests).toFixed(2)}</span>
                    <span className="text-white font-medium">${testCost.toFixed(0)}</span>
                  </div>
                  {(Object.keys(addOns) as AddOnKey[]).filter((k) => addOns[k]).map((key) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-500">{PRICING.addOns[key].label}</span>
                      <span className="text-white font-medium">${PRICING.addOns[key].price}</span>
                    </div>
                  ))}

                  {annual && (
                    <>
                      <div className="border-t border-white/[0.06] pt-3 flex justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-500">${monthlyTotal.toFixed(0)}/mo</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>Annual discount (25%)</span>
                        <span>-${(monthlyTotal * PRICING.annualDiscount).toFixed(0)}</span>
                      </div>
                    </>
                  )}

                  <div className="border-t border-white/[0.12] pt-3 flex justify-between">
                    <span className="text-white font-semibold">Estimated total</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-white">${finalMonthly.toFixed(0)}</span>
                      <span className="text-gray-500 text-xs">/mo</span>
                      {annual && (
                        <div className="text-xs text-gray-500">${(finalMonthly * 12).toLocaleString()}/yr billed annually</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Volume discounts</h3>
                  <div className="space-y-1">
                    {PRICING.testTiers.slice(0, -1).map((tier, i) => (
                      <div key={i} className={`flex justify-between text-xs ${tests <= tier.upTo && (i === 0 || tests > (PRICING.testTiers[i - 1]?.upTo || 0)) ? "text-indigo-400 font-medium" : "text-gray-600"}`}>
                        <span>Up to {tier.upTo.toLocaleString()} tests</span>
                        <span>${tier.perTest.toFixed(2)}/test</span>
                      </div>
                    ))}
                    <div className={`flex justify-between text-xs ${tests > 25000 ? "text-indigo-400 font-medium" : "text-gray-600"}`}>
                      <span>25,000+ tests</span>
                      <span>$0.15/test</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-gray-600 mt-4">
                  Final pricing may vary based on custom requirements. This estimate is for reference only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
