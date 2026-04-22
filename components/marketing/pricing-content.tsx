'use client'

import { useState } from 'react'
import Link from 'next/link'

type PricingCategory = 'jobseekers' | 'businesses'

interface Plan {
  name: string
  monthly: number
  annual: number
  priceLabel: string
  period: string
  description: string
  features: string[]
  cta: string
  ctaLink: string
  highlighted: boolean
}

const jobSeekerPlans: Plan[] = [
  {
    name: 'Free',
    monthly: 0,
    annual: 0,
    priceLabel: '$0',
    period: '/forever',
    description: 'Get your AI score and see where you stand.',
    features: [
      'One AI proficiency assessment per month',
      'Basic PromptScore (0-100)',
      'Public leaderboard ranking',
      'Basic score breakdown',
    ],
    cta: 'Get Started',
    ctaLink: '/assess',
    highlighted: false,
  },
  {
    name: 'Pro',
    monthly: 29,
    annual: 23,
    priceLabel: '',
    period: '',
    description: 'Improve your AI skills and stay current.',
    features: [
      'Unlimited AI assessments',
      'Detailed improvement recommendations',
      'Daily skill-building exercises (weak areas)',
      'AI news and model updates',
      'Verified LinkedIn certificate',
      'Score history and progress tracking',
      'Email support',
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/sign-up?plan=pro',
    highlighted: true,
  },
]

const businessPlans: Plan[] = [
  {
    name: 'Team',
    monthly: 99,
    annual: 79,
    priceLabel: '',
    period: '/month for up to 25 people',
    description: 'Assess and benchmark your team\'s AI skills.',
    features: [
      'Everything in Pro',
      'Team dashboard with AI skill scores',
      'Industry benchmarking',
      'Team skill gap analysis',
      'CSV export for HR',
      'Bulk assessment invites',
      'Priority support',
    ],
    cta: 'Start Team Trial',
    ctaLink: '/sign-up?plan=team',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    monthly: 0,
    annual: 0,
    priceLabel: 'Custom',
    period: '',
    description: 'For large organizations hiring AI talent.',
    features: [
      'Everything in Team',
      'Unlimited users',
      'Custom assessment templates',
      'ATS integrations',
      'SSO + SCIM',
      'White-label assessments',
      'Dedicated success manager',
      'SLA + compliance',
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    highlighted: false,
  },
]

export function PricingContent() {
  const [category, setCategory] = useState<PricingCategory>('jobseekers')
  const [annual, setAnnual] = useState(true)
  const plans = category === 'jobseekers' ? jobSeekerPlans : businessPlans

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="section-label">[ Pricing ]</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2 text-white">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-400 mt-4">
            Start free. Scale as you grow. No surprises.
          </p>

          {/* Job Seekers / Businesses tab toggle */}
          <div className="flex items-center justify-center gap-1 mt-8 p-1 rounded-full bg-white/5 max-w-xs mx-auto">
            <button
              onClick={() => setCategory('jobseekers')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                category === 'jobseekers'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Job Seekers
            </button>
            <button
              onClick={() => setCategory('businesses')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                category === 'businesses'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Businesses
            </button>
          </div>

          {/* Monthly / Annual toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
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

        <div className="grid gap-4 mt-12 max-w-3xl mx-auto md:grid-cols-2">
          {plans.map((plan) => {
            const isBusinessPerUser = plan.name === 'Business'
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
                : isBusinessPerUser
                ? annual
                  ? '/user/mo billed annually'
                  : '/user/mo'
                : annual
                ? '/mo billed annually'
                : '/mo'

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
                  <span className="text-4xl sm:text-5xl font-bold text-white">{price}</span>
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

                <Link
                  href={plan.ctaLink}
                  className={`mt-8 w-full py-2.5 rounded-lg text-sm font-medium transition-all text-center block ${
                    plan.highlighted ? 'glow-btn' : 'ghost-btn'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>

        {/* FAQ section */}
        <div className="max-w-3xl mx-auto mt-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently asked</h2>
          <div className="space-y-4 text-left">
            {[
              {
                q: 'What counts as an assessment?',
                a: "One assessment = one full adaptive test (8–12 questions across 5 dimensions, role-weighted scoring). Partial attempts or abandoned sessions don't count against your limit. The Daily Challenge does not count against your assessment limit.",
              },
              {
                q: 'Can I try before I buy?',
                a: 'Yes. The Free tier gives you 3 full assessments per month and unlimited Daily Challenges — no credit card required.',
              },
              {
                q: 'What happens if I exceed my monthly limit?',
                a: "You'll be notified when you're approaching your limit. Upgrade anytime or wait for the next billing cycle.",
              },
              {
                q: 'Do you offer annual discounts?',
                a: 'Yes — save 20% when you pay annually. Toggle the switch above to see annual pricing.',
              },
              {
                q: "What's the difference between PromptScore and the Daily Challenge?",
                a: 'PromptScore is your full adaptive assessment — 8–12 questions, 5-dimension scoring, role-weighted. The Daily Challenge is a quick 5-question benchmark that refreshes every day — great for practice and leaderboard competition.',
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
