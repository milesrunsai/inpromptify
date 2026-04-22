'use client'

import { useState } from 'react'
import Link from 'next/link'

type PricingCategory = 'jobseekers' | 'businesses'

interface HomepagePlan {
  name: string
  price: string
  annualPrice: string
  period: string
  description: string
  features: string[]
  cta: string
  href: string
  highlighted: boolean
}

const jobSeekerPlans: HomepagePlan[] = [
  {
    name: 'Free',
    price: '$0',
    annualPrice: '$0',
    period: '',
    description: 'Get your AI score. See where you rank.',
    features: [
      '1 assessment/month',
      'Basic PromptScore (0-100)',
      'Leaderboard ranking',
      'Basic improvement tips',
    ],
    cta: 'Take Assessment',
    href: '/assess',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$23',
    annualPrice: '$19',
    period: '/mo',
    description: 'Improve your AI skills and stay current.',
    features: [
      'Unlimited assessments',
      'Daily skill exercises',
      'AI news & model updates',
      'Verified certificate',
      'Progress tracking',
      'Detailed recommendations',
    ],
    cta: 'Go Pro',
    href: '/sign-up?plan=pro',
    highlighted: true,
  },
]

const businessPlans: HomepagePlan[] = [
  {
    name: 'Team',
    price: '$99',
    annualPrice: '$79',
    period: '/mo',
    description: 'Assess your team\'s AI skills.',
    features: [
      'Up to 25 people',
      'Team skill dashboard',
      'Industry benchmarks',
      'Skill gap analysis',
      'CSV export',
    ],
    cta: 'Start Trial',
    href: '/sign-up?plan=team',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    annualPrice: 'Custom',
    period: '',
    description: 'For large organizations hiring AI talent.',
    features: [
      'Unlimited people',
      'Custom assessments',
      'ATS integrations',
      'White-label option',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    highlighted: true,
  },
]

export function HomepagePricing() {
  const [category, setCategory] = useState<PricingCategory>('jobseekers')
  const [annual, setAnnual] = useState(true)
  const plans = category === 'jobseekers' ? jobSeekerPlans : businessPlans

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-medium uppercase tracking-wider text-orange-500">[ Pricing ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-white">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-white/50 mt-4 max-w-xl mx-auto">
            Start free. Upgrade when you need more assessments, analytics, or integrations.
          </p>

          {/* Job Seekers / Businesses tab toggle */}
          <div className="flex items-center justify-center gap-1 mt-8 p-1 rounded-full bg-white/[0.06] max-w-xs mx-auto">
            <button
              onClick={() => setCategory('jobseekers')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                category === 'jobseekers'
                  ? 'bg-white/[0.12] text-white shadow-lg'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Job Seekers
            </button>
            <button
              onClick={() => setCategory('businesses')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                category === 'businesses'
                  ? 'bg-white/[0.12] text-white shadow-lg'
                  : 'text-white/40 hover:text-white/60'
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
                annual ? 'bg-orange-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow ${
                  annual ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-white/40'}`}>
              Annual <span className="text-orange-500 text-xs font-medium">Save 20%</span>
            </span>
          </div>
        </div>

        <div
          className={`grid gap-6 ${
            plans.length === 2
              ? 'sm:grid-cols-2 max-w-3xl mx-auto'
              : 'sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {plans.map((tier) => {
            const displayPrice = tier.price === 'Custom'
              ? 'Custom'
              : annual
              ? tier.annualPrice
              : tier.price
            const displayPeriod = tier.price === 'Custom'
              ? ''
              : tier.period
              ? annual
                ? `${tier.period} billed annually`
                : tier.period
              : ''

            return (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 flex flex-col ${
                  tier.highlighted
                    ? 'bg-white/[0.06] text-white ring-2 ring-orange-500 shadow-xl shadow-orange-500/10'
                    : 'bg-white/[0.03] text-white border border-white/[0.08]'
                }`}
              >
                <h3 className={`text-lg font-semibold ${tier.highlighted ? 'text-white' : 'text-white'}`}>
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${tier.highlighted ? 'text-white' : 'text-white'}`}>
                    {displayPrice}
                  </span>
                  {displayPeriod && (
                    <span className={`text-sm ${tier.highlighted ? 'text-white/40' : 'text-white/40'}`}>
                      {displayPeriod}
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-sm ${tier.highlighted ? 'text-white/40' : 'text-white/50'}`}>
                  {tier.description}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className={`flex items-start gap-2 text-sm ${tier.highlighted ? 'text-white/70' : 'text-white/60'}`}>
                      <svg className={`mt-0.5 h-4 w-4 shrink-0 ${tier.highlighted ? 'text-orange-400' : 'text-orange-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href={tier.href}
                    className={`block w-full text-center rounded-full py-3 text-sm font-medium transition-all ${
                      tier.highlighted
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-white/[0.08] text-white hover:bg-white/[0.12]'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-sm text-white/30 mt-8">
          Annual billing saves 20%. All prices in USD.
        </p>
      </div>
    </section>
  )
}
