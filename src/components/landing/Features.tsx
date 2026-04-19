"use client";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Visualization sub-components                                       */
/* ------------------------------------------------------------------ */

function AdaptiveTestingViz() {
  const bars = [
    { label: "Q1", height: 30, color: "bg-orange-500/60" },
    { label: "Q2", height: 45, color: "bg-orange-500/70" },
    { label: "Q3", height: 60, color: "bg-orange-500/80" },
    { label: "Q4", height: 40, color: "bg-orange-500/60" },
    { label: "Q5", height: 75, color: "bg-orange-500/90" },
    { label: "Q6", height: 55, color: "bg-orange-500/70" },
    { label: "Q7", height: 85, color: "bg-orange-400" },
    { label: "Q8", height: 65, color: "bg-orange-500/80" },
  ];

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-white/40 font-mono">Difficulty Adaptation</span>
        <span className="text-xs text-orange-400 font-mono">Live</span>
      </div>
      <div className="flex items-end justify-between gap-2 h-40">
        {bars.map((bar) => (
          <div key={bar.label} className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`w-full rounded-t-md ${bar.color} transition-all duration-700`}
              style={{ height: `${bar.height}%` }}
            />
            <span className="text-[10px] text-white/30 font-mono">{bar.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[10px] text-white/20">
        <span>Easy</span>
        <span>Difficulty Level</span>
        <span>Hard</span>
      </div>
    </div>
  );
}

function SkillMapViz() {
  const skills = [
    { name: "Prompting", value: 88 },
    { name: "Architecture", value: 72 },
    { name: "Fine-tuning", value: 65 },
    { name: "Deployment", value: 80 },
    { name: "Safety", value: 90 },
    { name: "Evaluation", value: 75 },
  ];
  const cx = 120;
  const cy = 110;
  const maxR = 80;

  const points = skills.map((s, i) => {
    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
    const r = (s.value / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      lx: cx + (maxR + 18) * Math.cos(angle),
      ly: cy + (maxR + 18) * Math.sin(angle),
      name: s.name,
      value: s.value,
    };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-white/40 font-mono">Skill Radar</span>
        <span className="text-xs text-orange-400 font-mono">6 dimensions</span>
      </div>
      <svg viewBox="0 0 240 220" className="w-full">
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <polygon
            key={scale}
            points={skills
              .map((_, i) => {
                const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                const r = maxR * scale;
                return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
              })
              .join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
        ))}
        <polygon
          points={polygonPoints}
          fill="rgba(249,115,22,0.15)"
          stroke="rgba(249,115,22,0.6)"
          strokeWidth="1.5"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill="#f97316" />
            <text
              x={p.lx}
              y={p.ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white/30 text-[8px]"
            >
              {p.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function RealTimeScoringViz() {
  const scores = [
    { label: "Fundamentals", value: 92 },
    { label: "Prompting", value: 87 },
    { label: "Architecture", value: 74 },
    { label: "Deployment", value: 81 },
  ];

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-white/40 font-mono">Score Breakdown</span>
        <span className="text-xs text-orange-400 font-mono">Real-time</span>
      </div>
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f97316"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${84 * 2.51} ${251 - 84 * 2.51}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">84%</span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {scores.map((s) => (
          <div key={s.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-white/40">{s.label}</span>
              <span className="text-[11px] text-white/60 font-mono">{s.value}</span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${s.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomAssessmentsViz() {
  const items = [
    { icon: "A", label: "Multiple Choice", desc: "4 options per question" },
    { icon: "B", label: "Code Challenge", desc: "Live code execution" },
    { icon: "C", label: "Free Response", desc: "AI-graded answers" },
    { icon: "D", label: "Scenario Based", desc: "Real-world problems" },
  ];

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-white/40 font-mono">Question Types</span>
        <span className="text-xs text-orange-400 font-mono">Drag to reorder</span>
      </div>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all cursor-grab"
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-md bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-mono">
              {item.icon}
            </span>
            <div>
              <p className="text-sm text-white/70">{item.label}</p>
              <p className="text-[10px] text-white/30">{item.desc}</p>
            </div>
            <span className="ml-auto text-white/20">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 3h4M4 6h4M4 9h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamAnalyticsViz() {
  const teams = [
    { name: "Engineering", score: 88, color: "from-orange-500 to-amber-500" },
    { name: "Product", score: 72, color: "from-orange-500/80 to-amber-500/80" },
    { name: "Design", score: 65, color: "from-orange-500/60 to-amber-500/60" },
    { name: "Marketing", score: 58, color: "from-orange-500/40 to-amber-500/40" },
  ];

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-white/40 font-mono">Team Performance</span>
        <span className="text-xs text-orange-400 font-mono">4 teams</span>
      </div>
      <div className="space-y-4">
        {teams.map((t) => (
          <div key={t.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-white/60">{t.name}</span>
              <span className="text-sm text-white/80 font-mono">{t.score}</span>
            </div>
            <div className="w-full h-2 bg-white/[0.06] rounded-full">
              <div
                className={`h-full bg-gradient-to-r ${t.color} rounded-full transition-all duration-700`}
                style={{ width: `${t.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationsViz() {
  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-white/40 font-mono">Certificate Preview</span>
        <span className="text-xs text-orange-400 font-mono">Verified</span>
      </div>
      <div className="border border-white/[0.06] rounded-xl p-6 bg-white/[0.02]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 mx-auto mb-4 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Certificate of Proficiency</p>
          <p className="text-lg font-semibold text-white/90 mb-1">AI Fundamentals</p>
          <p className="text-xs text-white/40 mb-4">Issued to Alex Chen</p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-white/30">
            <span>Score: 92/100</span>
            <span>|</span>
            <span>Advanced Level</span>
            <span>|</span>
            <span>Valid 2 years</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-[10px] text-white/20 font-mono">ID: CERT-2026-AF-0847</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature Illustration Switcher                                      */
/* ------------------------------------------------------------------ */

function FeatureIllustration({ activeTab }: { activeTab: number }) {
  switch (activeTab) {
    case 0:
      return <AdaptiveTestingViz />;
    case 1:
      return <SkillMapViz />;
    case 2:
      return <RealTimeScoringViz />;
    case 3:
      return <CustomAssessmentsViz />;
    case 4:
      return <TeamAnalyticsViz />;
    case 5:
      return <CertificationsViz />;
    default:
      return <AdaptiveTestingViz />;
  }
}

/* ------------------------------------------------------------------ */
/*  Tab Data                                                           */
/* ------------------------------------------------------------------ */

const tabs = [
  {
    label: "Adaptive Testing",
    description:
      "Our AI engine adjusts question difficulty in real-time based on performance, delivering a precise measurement of proficiency in fewer questions.",
    features: [
      "Dynamic difficulty scaling",
      "Bayesian skill estimation",
      "Reduced assessment time by 40%",
      "Precise confidence intervals",
    ],
  },
  {
    label: "Skill Mapping",
    description:
      "Map proficiency across multiple AI dimensions with our radar-based skill visualization. Identify strengths and pinpoint areas for improvement.",
    features: [
      "6-dimension skill radar",
      "Comparative benchmarking",
      "Growth tracking over time",
      "Team-wide skill gaps",
    ],
  },
  {
    label: "Real-time Scoring",
    description:
      "Get instant, transparent scoring with detailed breakdowns across every competency area. No waiting, no black boxes.",
    features: [
      "Instant score calculation",
      "Category-level breakdown",
      "Percentile rankings",
      "Score confidence metrics",
    ],
  },
  {
    label: "Custom Assessments",
    description:
      "Build assessments tailored to your organization's specific AI stack and competency requirements with our drag-and-drop builder.",
    features: [
      "Drag-and-drop question builder",
      "Multiple question formats",
      "AI-powered grading",
      "Custom scoring rubrics",
    ],
  },
  {
    label: "Team Analytics",
    description:
      "Understand your organization's AI readiness with team-level analytics, department comparisons, and progress tracking dashboards.",
    features: [
      "Department-level insights",
      "Progress tracking",
      "Benchmark comparisons",
      "Export-ready reports",
    ],
  },
  {
    label: "Certifications",
    description:
      "Issue verifiable, blockchain-anchored certificates that validate AI proficiency. Shareable on LinkedIn and embeddable in portfolios.",
    features: [
      "Verifiable credentials",
      "LinkedIn integration",
      "Custom branding",
      "Expiration management",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Main Features Component                                            */
/* ------------------------------------------------------------------ */

export default function Features() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="reveal text-center mb-16">
          <span className="section-label">[ Core Features ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4 text-white">
            Everything you need to{" "}
            <span className="gradient-text">measure AI proficiency</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            A comprehensive platform built for organizations that take AI skills
            seriously.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="reveal stagger-1">
            <div className="flex flex-wrap gap-2 mb-8">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    activeTab === i
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:border-white/[0.12] hover:text-white/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                {tabs[activeTab].label}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {tabs[activeTab].description}
              </p>
            </div>

            <ul className="space-y-3">
              {tabs[activeTab].features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/60">
                  <span className="flex-shrink-0 w-5 h-5 rounded-md bg-orange-500/10 text-orange-400 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal stagger-2">
            <FeatureIllustration activeTab={activeTab} />
          </div>
        </div>
      </div>
    </section>
  );
}
