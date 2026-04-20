'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/* ───────────────────────── Scroll Reveal Hook ───────────────────────── */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Mark the container and all .reveal children as visible
            entry.target.querySelectorAll('.reveal, .reveal-scale').forEach((child) => {
              child.classList.add('visible')
            })
            if (entry.target.classList.contains('reveal') || entry.target.classList.contains('reveal-scale')) {
              entry.target.classList.add('visible')
            }
          }
        })
      },
      { threshold: 0.1 }
    )
    // Observe the container itself
    observer.observe(el)
    // Also observe direct .reveal children for staggered reveals
    el.querySelectorAll('.reveal, .reveal-scale').forEach((child) => {
      observer.observe(child)
    })
    return () => observer.disconnect()
  }, [])

  return ref
}

/* ───────────────────────── Bold Statement ───────────────────────── */

export function BoldStatement() {
  const ref = useReveal()
  return (
    <section ref={ref} className="bg-[#e8e4e0] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-2xl sm:text-3xl lg:text-4xl leading-relaxed reveal">
          <span className="text-gray-400 font-normal">Unlock the potential of </span>
          <span className="text-gray-900 font-bold">AI proficiency measurement.</span>
          <br />
          <span className="text-gray-400 font-normal">InpromptiFy equips businesses to assess, benchmark, and certify their workforce, </span>
          <span className="text-gray-900 font-bold">redefining how organizations measure AI readiness.</span>
        </p>
      </div>
    </section>
  )
}

/* ───────────────────────── Features ───────────────────────── */

const featureTabs = [
  {
    label: 'Adaptive Testing',
    description:
      'Our AI engine adjusts question difficulty in real-time based on your responses. No more wasting time on questions that are too easy or too hard — every assessment is calibrated to your exact skill level.',
    features: ['Dynamic difficulty adjustment', 'Response pattern analysis', 'Confidence-weighted scoring', 'Branching question paths'],
  },
  {
    label: 'Skill Mapping',
    description:
      'Visualize proficiency across dimensions with interactive radar charts. Identify gaps, track growth over time, and get personalized recommendations for improvement.',
    features: ['Multi-dimensional radar charts', 'Gap analysis reports', 'Growth tracking over time', 'Personalized learning paths'],
  },
  {
    label: 'Real-time Scoring',
    description:
      'Get instant results the moment you finish. Our AI scoring engine provides detailed breakdowns, comparative analysis, and actionable insights in seconds — not days.',
    features: ['Instant score computation', 'Detailed section breakdowns', 'Percentile comparisons', 'Actionable improvement tips'],
  },
  {
    label: 'Custom Assessments',
    description:
      'Build assessments for any AI tool, framework, or methodology. Use our question bank or create your own with our intuitive editor and AI-assisted question generation.',
    features: ['Drag-and-drop builder', 'AI question generation', '10,000+ question bank', 'Custom branding options'],
  },
  {
    label: 'Team Analytics',
    description:
      'Organization-wide proficiency dashboards give you full visibility into team capabilities. Track training ROI, identify skill gaps, and make data-driven hiring decisions.',
    features: ['Team proficiency heatmaps', 'Department comparisons', 'Training ROI metrics', 'Export-ready reports'],
  },
  {
    label: 'Certifications',
    description:
      'Issue verifiable digital certificates and badges. Each certificate includes a unique verification URL, blockchain-backed validation, and integrations with LinkedIn and other platforms.',
    features: ['Verifiable digital badges', 'Unique certificate URLs', 'LinkedIn integration', 'Custom certificate templates'],
  },
]

function AdaptiveTestingViz() {
  const levels = [
    { label: 'Q1', difficulty: 40 }, { label: 'Q2', difficulty: 55 },
    { label: 'Q3', difficulty: 45 }, { label: 'Q4', difficulty: 70 },
    { label: 'Q5', difficulty: 65 }, { label: 'Q6', difficulty: 80 },
    { label: 'Q7', difficulty: 75 }, { label: 'Q8', difficulty: 90 },
  ]
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-white/40">Difficulty Curve</span>
        <span className="text-xs font-mono text-orange-400">Adaptive Mode</span>
      </div>
      <div className="flex items-end gap-2 h-40">
        {levels.map((l) => (
          <div key={l.label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-gradient-to-t from-orange-600/40 to-orange-400/60 transition-all"
              style={{ height: `${l.difficulty}%` }}
            />
            <span className="text-[10px] text-white/30 font-mono">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillMapViz() {
  const skills = ['Prompting', 'Fine-tuning', 'RAG', 'Agents', 'Evaluation', 'Safety']
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs font-mono text-white/40 mb-6">Skill Radar</span>
      <div className="relative w-48 h-48">
        {[1, 0.66, 0.33].map((s) => (
          <div
            key={s}
            className="absolute border border-white/[0.08] rounded-full"
            style={{
              transform: `scale(${s})`,
              top: `${(1 - s) * 50}%`,
              left: `${(1 - s) * 50}%`,
              width: `${s * 100}%`,
              height: `${s * 100}%`,
            }}
          />
        ))}
        {skills.map((skill, i) => {
          const angle = (i / skills.length) * 360 - 90
          const rad = (angle * Math.PI) / 180
          const x = 50 + 56 * Math.cos(rad)
          const y = 50 + 56 * Math.sin(rad)
          return (
            <span
              key={skill}
              className="absolute text-[10px] text-white/40 font-mono -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {skill}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function RealTimeScoringViz() {
  const sections = [
    { label: 'Fundamentals', score: 92 }, { label: 'Prompting', score: 87 },
    { label: 'Architecture', score: 74 }, { label: 'Deployment', score: 81 },
  ]
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-white/40">Score Breakdown</span>
        <span className="text-2xl font-bold gradient-text">84%</span>
      </div>
      <div className="space-y-3">
        {sections.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-white/50">{s.label}</span>
              <span className="text-xs text-white/60 font-mono">{s.score}%</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                style={{ width: `${s.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CustomAssessmentsViz() {
  return (
    <div className="space-y-3">
      <span className="text-xs font-mono text-white/40">Assessment Builder</span>
      {['Multiple Choice', 'Code Challenge', 'Free Response', 'Scenario Based'].map((type, i) => (
        <div
          key={type}
          className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.08] bg-white/[0.02]"
        >
          <span className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center text-xs text-orange-400 font-mono">
            {i + 1}
          </span>
          <span className="text-sm text-white/60">{type}</span>
          <span className="ml-auto text-[10px] text-white/20 font-mono">drag</span>
        </div>
      ))}
    </div>
  )
}

function TeamAnalyticsViz() {
  const teams = [
    { name: 'Engineering', score: 88 }, { name: 'Product', score: 72 },
    { name: 'Design', score: 65 }, { name: 'Marketing', score: 58 },
  ]
  return (
    <div>
      <span className="text-xs font-mono text-white/40">Team Proficiency</span>
      <div className="mt-4 space-y-3">
        {teams.map((t) => (
          <div key={t.name} className="flex items-center gap-4">
            <span className="text-xs text-white/50 w-20">{t.name}</span>
            <div className="flex-1 h-2 bg-white/[0.06] rounded-full">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                style={{ width: `${t.score}%` }}
              />
            </div>
            <span className="text-xs text-white/40 font-mono w-8 text-right">{t.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CertificationsViz() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-48 rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 mb-4">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.5L10 13.77l-4.94 2.34.94-5.5-4-3.9 5.61-.87L10 1z"
              stroke="white" strokeWidth="1.5" strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-xs font-medium text-white/70">AI Fundamentals</p>
        <p className="text-[10px] text-white/30 mt-1">Certified Proficient</p>
        <div className="mt-3 pt-3 border-t border-white/[0.08]">
          <p className="text-[9px] text-white/20 font-mono">verify.inpromptify.com/c/a1b2c3</p>
        </div>
      </div>
      <span className="text-xs text-white/40">Verifiable digital certificate</span>
    </div>
  )
}

const featureIllustrations = [
  AdaptiveTestingViz, SkillMapViz, RealTimeScoringViz,
  CustomAssessmentsViz, TeamAnalyticsViz, CertificationsViz,
]

export function FeaturesSection() {
  const [active, setActive] = useState(0)
  const tab = featureTabs[active]
  const Illustration = featureIllustrations[active]
  const ref = useReveal()

  return (
    <section ref={ref} className="relative py-24 overflow-hidden section-frame">
      <div className="absolute inset-0 grid-pattern" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-12">
          <span className="section-label">[ What we offer ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-white">
            Not just another quiz platform.
            <br />
            <span className="gradient-text">A complete assessment engine.</span>
          </h2>
        </div>

        <div className="reveal stagger-1 flex flex-wrap justify-center gap-1 mb-8 sm:mb-12">
          {featureTabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActive(i)}
              className={`relative px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                i === active
                  ? 'text-white bg-orange-500/10 border border-orange-500/20'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="reveal stagger-2 grid lg:grid-cols-2 gap-12 items-center">
          <div key={active}>
            <h3 className="text-2xl font-semibold mb-4 text-white">{tab.label}</h3>
            <p className="text-gray-400 leading-relaxed mb-6">{tab.description}</p>
            <ul className="space-y-3">
              {tab.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-md bg-orange-500/10 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-orange-400">
                      <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-strong p-8 rounded-2xl min-h-[340px] flex flex-col justify-center">
            <Illustration />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Stats ───────────────────────── */

function useCountUp(target: number, suffix = '', duration = 2000) {
  const [display, setDisplay] = useState('0' + suffix)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const value = Math.round(eased * target)
            setDisplay(value.toLocaleString() + suffix)
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix, duration])

  return { ref, display }
}

export function StatsSection() {
  const counter1 = useCountUp(150000, '+')
  const sectionRef = useReveal()

  return (
    <section ref={sectionRef} className="relative py-24 section-frame overflow-hidden bg-white">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label">[ By the numbers ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-gray-900">Built for scale.</h2>
        </div>

        <div className="reveal stagger-1 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2 bg-gray-50 border border-gray-100 rounded-2xl p-8" ref={counter1.ref}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-5xl font-bold gradient-text">{counter1.display}</p>
                <p className="text-sm text-gray-600 mt-2">Assessments completed across 40+ countries</p>
              </div>
              <div className="text-white/[0.06]">
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" className="opacity-50">
                  {[[20,15],[25,20],[30,18],[35,22],[40,25],[45,20],[50,18],[55,22],[60,15],[65,20],[70,25],[75,30],[80,22],[85,18],[90,20],[95,25],[30,30],[35,35],[50,35],[55,40],[70,35],[75,40],[80,38],[60,42],[65,38]].map(([cx,cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="2" fill="currentColor" className={i % 3 === 0 ? 'text-orange-500/40' : 'text-white/10'} />
                  ))}
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-orange-400">
                <path d="M10 1L12.5 6.5L18.5 7.3L14.25 11.4L15.3 17.3L10 14.5L4.7 17.3L5.75 11.4L1.5 7.3L7.5 6.5L10 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">Enterprise Ready</p>
              <p className="text-xs text-gray-600 mt-1">SOC 2 compliant, GDPR ready</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-orange-400">
                <path d="M11 1L3 12H10L9 19L17 8H10L11 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">Instant Results</p>
              <p className="text-xs text-gray-600 mt-1">Real-time AI-powered scoring</p>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-4 grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-orange-400">
                    <path d="M7 5L2 10L7 15M13 5L18 10L13 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Developer First</p>
                  <p className="text-xs text-gray-600 mt-1">API access, webhooks, integrations</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-orange-400">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10 5V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">99.9% Uptime</p>
                  <p className="text-xs text-gray-600 mt-1">Globally distributed infrastructure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Use Cases ───────────────────────── */

const useCasesData = [
  {
    label: 'Hiring',
    title: 'Hire AI-ready talent with confidence',
    description: 'Pre-screen candidates with validated AI proficiency assessments. Filter for real skills, not buzzwords. Reduce interview cycles and make data-driven hiring decisions.',
  },
  {
    label: 'Training',
    title: 'Measure training effectiveness in real-time',
    description: 'Deploy pre- and post-training assessments to quantify learning outcomes. Track skill progression across your organization and optimize training investments.',
  },
  {
    label: 'Certification',
    title: 'Issue industry-recognized AI certifications',
    description: 'Create certification programs that validate real-world AI skills. Our proctoring, anti-cheat, and verification systems ensure certificate integrity.',
  },
  {
    label: 'Education',
    title: 'Integrate AI assessments into your curriculum',
    description: 'Universities and bootcamps use InpromptiFy to benchmark student AI literacy. LMS integrations, cohort analytics, and automated grading included.',
  },
]

function HiringMockup() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-white/40">Candidate Pipeline</span>
        <span className="text-xs text-orange-400 font-mono">12 candidates</span>
      </div>
      {[
        { name: 'Sarah Chen', score: 94, status: 'Pass' },
        { name: 'James Wilson', score: 78, status: 'Pass' },
        { name: 'Maya Patel', score: 62, status: 'Review' },
        { name: 'Tom Baker', score: 45, status: 'Fail' },
      ].map((c) => (
        <div key={c.name} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.08] bg-white/[0.02]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center text-[10px] font-mono text-white/50">
            {c.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <span className="text-sm text-white/60 flex-1">{c.name}</span>
          <span className="text-xs font-mono text-white/40">{c.score}%</span>
          <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
            c.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-400'
              : c.status === 'Review' ? 'bg-amber-500/10 text-amber-400'
              : 'bg-red-500/10 text-red-400'
          }`}>{c.status}</span>
        </div>
      ))}
    </div>
  )
}

function TrainingMockup() {
  return (
    <div>
      <span className="text-xs font-mono text-white/40">Training Progress</span>
      <div className="mt-4 space-y-4">
        {[
          { label: 'Pre-training', score: 42, color: 'from-white/10 to-white/20' },
          { label: 'Post-training', score: 78, color: 'from-orange-500 to-amber-500' },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-white/50">{item.label}</span>
              <span className="text-xs font-mono text-white/40">{item.score}%</span>
            </div>
            <div className="h-3 bg-white/[0.04] rounded-full">
              <div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
            </div>
          </div>
        ))}
        <div className="mt-2 px-3 py-2 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/10">
          <span className="text-xs text-emerald-400 font-mono">+85.7% improvement</span>
        </div>
      </div>
    </div>
  )
}

function CertificationMockup() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-56 rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
        <p className="text-sm font-medium text-white/80">Certified AI Practitioner</p>
        <p className="text-[11px] text-white/30 mt-1">Level 3 — Advanced</p>
        <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-1">
          <p className="text-[10px] text-white/20 font-mono">ID: CERT-2026-A1B2C3</p>
          <p className="text-[10px] text-white/20 font-mono">Issued: Apr 2026</p>
        </div>
      </div>
    </div>
  )
}

function EducationMockup() {
  return (
    <div>
      <span className="text-xs font-mono text-white/40">Cohort Dashboard</span>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { label: 'Students', value: '248' }, { label: 'Avg Score', value: '73%' },
          { label: 'Completion', value: '91%' }, { label: 'Pass Rate', value: '82%' },
        ].map((stat) => (
          <div key={stat.label} className="px-4 py-3 rounded-lg border border-white/[0.08] bg-white/[0.02]">
            <p className="text-lg font-semibold gradient-text">{stat.value}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const useCaseMockups = [HiringMockup, TrainingMockup, CertificationMockup, EducationMockup]

export function UseCasesSection() {
  const [active, setActive] = useState(0)
  const uc = useCasesData[active]
  const Mockup = useCaseMockups[active]
  const ref = useReveal()

  return (
    <section ref={ref} className="relative py-24 section-frame">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-12">
          <span className="section-label">[ Use Cases ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-white">Use Cases</h2>
          <p className="text-gray-300 mt-3 max-w-lg mx-auto">
            From individual skill checks to enterprise-wide proficiency programs
          </p>
        </div>

        <div className="reveal stagger-1 flex flex-wrap justify-center gap-1 mb-8 sm:mb-12">
          {useCasesData.map((uc, i) => (
            <button
              key={uc.label}
              onClick={() => setActive(i)}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg transition-all ${
                i === active
                  ? 'text-white bg-orange-500/10 border border-orange-500/20'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
              }`}
            >
              {uc.label}
            </button>
          ))}
        </div>

        <div className="reveal stagger-2 grid lg:grid-cols-2 gap-12 items-center">
          <div key={active}>
            <h3 className="text-2xl font-semibold mb-4 text-white">{uc.title}</h3>
            <p className="text-gray-300 leading-relaxed">{uc.description}</p>
          </div>
          <div className="glass-strong p-8 rounded-2xl min-h-[280px] flex flex-col justify-center">
            <Mockup />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Testimonials ───────────────────────── */

const testimonials = [
  {
    quote: 'InpromptiFy completely transformed our hiring process. We went from guessing about AI skills to having quantifiable, comparable data on every candidate.',
    name: 'Rachel Torres', title: 'VP of Engineering', company: 'Nexus AI', initials: 'RT', gradient: 'from-orange-500 to-amber-500',
  },
  {
    quote: 'The adaptive testing is genuinely impressive. It finds the exact boundary of what someone knows and gives us a precise skill map. Nothing else comes close.',
    name: 'David Kim', title: 'CTO', company: 'Synthwave Labs', initials: 'DK', gradient: 'from-amber-500 to-yellow-500',
  },
  {
    quote: 'We rolled out InpromptiFy across 2,000 employees in three weeks. The team analytics dashboard gave our L&D team exactly the insights they needed to prioritize training.',
    name: 'Priya Mehta', title: 'Chief People Officer', company: 'ScalePoint', initials: 'PM', gradient: 'from-orange-600 to-orange-400',
  },
  {
    quote: 'Our certification program went from a manual nightmare to a fully automated pipeline. The verifiable digital badges have been a huge hit with our community.',
    name: 'Marcus Johnson', title: 'Director of Education', company: 'AI Academy', initials: 'MJ', gradient: 'from-orange-500 to-red-500',
  },
]

export function TestimonialsSection() {
  const ref = useReveal()

  return (
    <section ref={ref} className="relative py-24 section-frame bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label">[ Testimonials ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-gray-900">
            Trusted by teams worldwide
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <div key={t.name} className={`reveal stagger-${i + 1} bg-gray-50 border border-gray-100 rounded-2xl p-6`}>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-semibold text-white`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.title}, {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── FAQ ───────────────────────── */

const faqs = [
  { q: 'What is InpromptiFy?', a: 'InpromptiFy is an AI-powered proficiency assessment platform that measures, validates, and certifies AI skills. It uses adaptive testing, real-time scoring, and comprehensive skill mapping to provide accurate assessments for individuals and organizations.' },
  { q: 'How does adaptive testing work?', a: "Our AI engine analyzes your responses in real-time and adjusts the difficulty of subsequent questions. If you answer correctly, questions get harder. If you struggle, they get easier. This zeros in on your exact proficiency level much faster than traditional fixed-difficulty tests." },
  { q: 'What AI skills and tools can be assessed?', a: 'InpromptiFy covers a wide range of AI topics including prompt engineering, model fine-tuning, RAG architectures, AI agents, evaluation methodologies, AI safety, and specific tools like ChatGPT, Claude, Midjourney, and more. You can also create custom assessments for any topic.' },
  { q: 'How long does an assessment take?', a: 'Most assessments take 15-30 minutes thanks to adaptive testing, which eliminates questions that are too easy or too hard for you. Traditional assessments covering the same material would typically take 60-90 minutes.' },
  { q: 'Can I integrate InpromptiFy with my existing tools?', a: 'Yes. We offer a REST API, webhooks, and native integrations with popular HR platforms, LMS systems, and ATS tools. Our developer documentation covers everything you need to get started.' },
  { q: 'Are the certifications verifiable?', a: 'Absolutely. Each certificate includes a unique verification URL that anyone can use to confirm authenticity. Certificates also integrate with LinkedIn and can be added to digital portfolios.' },
  { q: 'Is there a free tier?', a: 'Yes. You can create an account and take assessments for free with our Starter plan. Paid plans unlock custom assessments, team analytics, certifications, API access, and priority support.' },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const ref = useReveal()

  return (
    <section ref={ref} className="relative py-24 section-frame bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-14">
          <span className="section-label">[ FAQ ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-gray-900">
            Frequently asked questions.
          </h2>
        </div>

        <div className="reveal stagger-1 space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className={`flex-shrink-0 ml-4 text-gray-400 transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`}
                >
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <div className={`accordion-content ${openIndex === i ? 'open' : ''}`}>
                <div>
                  <p className="px-4 sm:px-6 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── CTA Section ───────────────────────── */

const codeTabs = [
  {
    label: 'Python',
    code: `from inpromptify import InpromptiFy

client = InpromptiFy()

assessment = client.assessments.create(
    title="AI Fundamentals",
    difficulty="adaptive"
)`,
  },
  {
    label: 'TypeScript',
    code: `import { InpromptiFy } from 'inpromptify';

const client = new InpromptiFy();

const assessment = await client.assessments.create({
  title: 'AI Fundamentals',
  difficulty: 'adaptive',
});`,
  },
  {
    label: 'cURL',
    code: `curl -X POST https://api.inpromptify.com/v1/assessments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "AI Fundamentals",
    "difficulty": "adaptive"
  }'`,
  },
]

export function CTASection() {
  const [activeTab, setActiveTab] = useState(0)
  const ref = useReveal()

  return (
    <section ref={ref} className="relative py-24 section-frame">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="reveal text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Get started in seconds
          </h2>
          <p className="text-gray-300 mt-3">Create your first assessment in minutes</p>
          <button className="glow-btn px-8 py-3.5 text-base mt-6">Start for free</button>
        </div>

        <div className="reveal stagger-1 glass-strong rounded-2xl overflow-hidden max-w-2xl mx-auto">
          <div className="flex items-center gap-0 border-b border-white/[0.06]">
            {codeTabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-3 text-xs font-mono transition-colors ${
                  i === activeTab
                    ? 'text-white bg-white/[0.04] border-b-2 border-orange-500'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-5">
            <pre className="text-sm font-mono leading-relaxed overflow-x-auto">
              <code className="text-gray-300">{codeTabs[activeTab].code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
