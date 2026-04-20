'use client'

import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    monthly: 0,
    annual: 0,
    priceLabel: '$0',
    period: '/forever',
    description: 'Try it out. No credit card required.',
    features: [
      '5 assessments per month',
      'Basic role templates',
      'Limited reports',
      'Public self-test version',
      'Email support',
    ],
    cta: 'Get Started',
    ctaLink: '/sign-up',
    external: false,
    highlighted: false,
  },
  {
    name: 'Starter',
    monthly: 79,
    annual: 59,
    priceLabel: '',
    period: '',
    description: 'For SMBs and recruiters screening AI skills.',
    features: [
      '50 assessments per month',
      'All role templates',
      'Full analytics + export',
      'PromptScore breakdowns',
      'Candidate invite links',
      'Priority email support',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/sign-up',
    external: false,
    highlighted: false,
  },
  {
    name: 'Business',
    monthly: 599,
    annual: 479,
    priceLabel: '',
    period: '',
    description: 'For growing companies hiring at scale.',
    features: [
      'Unlimited assessments',
      'ATS integrations (Greenhouse, Lever)',
      'Team seats (up to 25)',
      'Company benchmarking',
      'API + webhooks',
      'Priority support',
      'Custom assessment builder',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/sign-up',
    external: false,
    highlighted: true,
  },
  {
    name: 'Enterprise',
    monthly: 0,
    annual: 0,
    priceLabel: 'Custom',
    period: '',
    description: 'For large organizations with advanced needs.',
    features: [
      'Everything in Business',
      'Unlimited team members',
      'SSO / SAML + SCIM',
      'SOC 2 compliance',
      'Bias audit reports',
      'Advanced benchmarking',
      'Dedicated CSM',
      'On-premise option',
      'Custom models + sandbox',
    ],
    cta: 'Book a Demo',
    ctaLink: 'https://agentmail.to/enterprise',
    external: true,
    highlighted: false,
  },
]

export function PricingContent() {
  const [annual, setAnnual] = useState(true)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="section-label">[ Pricing ]</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2 text-white">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-400 mt-4">
            Start free. Scale as you grow. No surprises.
          </p>

          {/* Monthly / Annual toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-white/40'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                annual ? 'bg-orange-500' : 'bg-white/10'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  annual ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-white/40'}`}>
              Annual <span className="text-orange-400 text-xs font-mono">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const price = plan.priceLabel
              ? plan.priceLabel
              : annual
              ? `$${plan.annual}`
              : `$${plan.monthly}`
            const period =
              plan.priceLabel === 'Custom'
                ? ''
                : plan.priceLabel
                ? plan.period
                : annual
                ? '/mo billed annually'
                : '/month'

            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 flex flex-col transition-all duration-300 hover:scale-[1.02] ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-orange-500/[0.08] to-transparent border-2 border-orange-500/30 shadow-lg shadow-orange-500/5 relative'
                    : 'glass-strong'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-wider bg-orange-500 text-white px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{price}</span>
                  {period && <span className="text-xs text-white/30">{period}</span>}
                </div>
                <p className="text-sm text-gray-400 mt-2">{plan.description}</p>

                <ul className="mt-6 space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-orange-400 flex-shrink-0 mt-0.5"
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

                {plan.external ? (
                  <a
                    href={plan.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 w-full py-2.5 rounded-lg text-sm font-medium transition-all text-center block ${
                      plan.highlighted ? 'glow-btn' : 'ghost-btn'
                    }`}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href={plan.ctaLink}
                    className={`mt-8 w-full py-2.5 rounded-lg text-sm font-medium transition-all text-center block ${
                      plan.highlighted ? 'glow-btn' : 'ghost-btn'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {/* FAQ-style trust section */}
        <div className="max-w-3xl mx-auto mt-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently asked</h2>
          <div className="space-y-4 text-left">
            {[
              {
                q: 'What counts as an assessment?',
                a: "One assessment = one candidate completing a full task (sandbox session + scoring). Partial attempts or abandoned sessions don't count against your limit.",
              },
              {
                q: 'Can I try before I buy?',
                a: 'Yes. The Free tier gives you 5 assessments per month with no credit card required. The public self-test on our homepage also gives a taste of the experience.',
              },
              {
                q: 'What happens if I exceed my monthly limit?',
                a: "You'll be notified when you're approaching your limit. Assessments aren't cut off mid-session. You can upgrade anytime or wait for the next billing cycle.",
              },
              {
                q: 'Do you offer annual discounts?',
                a: 'Yes — 20% off when you pay annually. Toggle the switch above to see annual pricing.',
              },
            ].map((item) => (
              <details
                key={item.q}
                className="glass-strong rounded-xl p-5 group cursor-pointer"
              >
                <summary className="text-sm font-medium text-white flex items-center justify-between list-none">
                  {item.q}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-white/30 group-open:rotate-180 transition-transform"
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <p className="text-sm text-gray-400 mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
