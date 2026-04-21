"use client";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Mockup sub-components                                              */
/* ------------------------------------------------------------------ */

function HiringMockup() {
  const candidates = [
    { name: "Sarah Chen", role: "ML Engineer", score: 94, status: "pass" },
    { name: "James Wilson", role: "AI Researcher", score: 87, status: "pass" },
    { name: "Maria Lopez", role: "Data Scientist", score: 72, status: "pass" },
    { name: "Tom Harris", role: "Backend Dev", score: 45, status: "fail" },
  ];

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-white/40 font-mono">Candidate Pipeline</span>
        <span className="text-xs text-orange-400 font-mono">4 candidates</span>
      </div>
      <div className="space-y-3">
        {candidates.map((c) => (
          <div
            key={c.name}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.02]"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center text-xs text-orange-400 font-mono">
              {c.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/70 truncate">{c.name}</p>
              <p className="text-[10px] text-white/30">{c.role}</p>
            </div>
            <span className="text-sm font-mono text-white/60">{c.score}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                c.status === "pass"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {c.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrainingMockup() {
  const data = [
    { label: "Fundamentals", pre: 45, post: 82 },
    { label: "Prompting", pre: 52, post: 89 },
    { label: "Architecture", pre: 38, post: 71 },
    { label: "Deployment", pre: 30, post: 65 },
  ];

  const avgImprovement = Math.round(
    data.reduce((sum, d) => sum + (d.post - d.pre), 0) / data.length
  );

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-white/40 font-mono">Training Impact</span>
        <span className="text-xs text-emerald-400 font-mono">+{avgImprovement}% avg improvement</span>
      </div>
      <div className="space-y-4">
        {data.map((d) => (
          <div key={d.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/40">{d.label}</span>
              <span className="text-[10px] text-white/30 font-mono">
                {d.pre} → {d.post}
              </span>
            </div>
            <div className="relative w-full h-2 bg-white/[0.06] rounded-full">
              <div
                className="absolute h-full bg-white/[0.08] rounded-full"
                style={{ width: `${d.pre}%` }}
              />
              <div
                className="absolute h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${d.post}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2">
        <div className="w-3 h-1.5 bg-white/[0.08] rounded-full" />
        <span className="text-[10px] text-white/20">Pre-training</span>
        <div className="w-3 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full ml-3" />
        <span className="text-[10px] text-white/20">Post-training</span>
      </div>
    </div>
  );
}

function CertificationMockup() {
  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-white/40 font-mono">Certificate</span>
        <span className="text-xs text-orange-400 font-mono">Blockchain Verified</span>
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
          <p className="text-lg font-semibold text-white/90 mb-1">AI Engineering</p>
          <p className="text-xs text-white/40 mb-4">Issued to Jordan Lee</p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-white/30">
            <span>Score: 88/100</span>
            <span>|</span>
            <span>Expert Level</span>
            <span>|</span>
            <span>Valid 2 years</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-[10px] text-white/20 font-mono">ID: CERT-2026-AE-1294</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EducationMockup() {
  const stats = [
    { label: "Students", value: "248" },
    { label: "Avg Score", value: "73%" },
    { label: "Completion", value: "91%" },
    { label: "Pass Rate", value: "82%" },
  ];

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-white/40 font-mono">Course Dashboard</span>
        <span className="text-xs text-orange-400 font-mono">Fall 2026</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02] text-center"
          >
            <p className="text-2xl font-bold text-white/90 font-mono">{s.value}</p>
            <p className="text-[10px] text-white/30 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05]">
        <p className="text-xs text-emerald-400">
          Course performance is 15% above university average
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mockup Switcher                                                    */
/* ------------------------------------------------------------------ */

function UseCaseMockup({ activeTab }: { activeTab: number }) {
  switch (activeTab) {
    case 0:
      return <HiringMockup />;
    case 1:
      return <TrainingMockup />;
    case 2:
      return <CertificationMockup />;
    case 3:
      return <EducationMockup />;
    default:
      return <HiringMockup />;
  }
}

/* ------------------------------------------------------------------ */
/*  Tab Data                                                           */
/* ------------------------------------------------------------------ */

const useCases = [
  {
    label: "Hiring",
    title: "Screen AI talent with confidence",
    description:
      "Replace guesswork with data-driven hiring decisions. Our adaptive assessments accurately measure AI proficiency so you can identify top candidates faster.",
    bullets: [
      "Pre-screen candidates before interviews",
      "Benchmark against industry standards",
      "Reduce mis-hires by 60%",
      "Custom assessments per role",
    ],
  },
  {
    label: "Training",
    title: "Measure training effectiveness",
    description:
      "Quantify the impact of your AI training programs with pre/post assessments. Track skill development over time and identify knowledge gaps.",
    bullets: [
      "Pre/post training comparisons",
      "Individual learning paths",
      "ROI measurement for programs",
      "Gap analysis reports",
    ],
  },
  {
    label: "Certification",
    title: "Issue verifiable credentials",
    description:
      "Create and issue professional AI certifications that employers trust. Blockchain-anchored verification ensures credential integrity.",
    bullets: [
      "Tamper-proof verification",
      "LinkedIn badge integration",
      "Custom certification tiers",
      "Automated renewal workflows",
    ],
  },
  {
    label: "Education",
    title: "Enhance your AI curriculum",
    description:
      "Give educators powerful tools to assess student AI proficiency, track class-wide progress, and ensure learning outcomes are met.",
    bullets: [
      "Course-level analytics",
      "Student progress tracking",
      "Automated grading",
      "LMS integration ready",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function UseCases() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="use-cases" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="reveal text-center mb-16">
          <span className="section-label">[ Use Cases ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4 text-white">
            Built for <span className="text-orange-500">every team</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            From startups to enterprises, InpromptiFy adapts to your assessment needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="reveal stagger-1">
            <div className="flex flex-wrap gap-2 mb-8">
              {useCases.map((uc, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    activeTab === i
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:border-white/[0.12] hover:text-white/60"
                  }`}
                >
                  {uc.label}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                {useCases[activeTab].title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {useCases[activeTab].description}
              </p>
            </div>

            <ul className="space-y-3">
              {useCases[activeTab].bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/60">
                  <span className="flex-shrink-0 w-5 h-5 rounded-md bg-orange-500/10 text-orange-400 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal stagger-2">
            <UseCaseMockup activeTab={activeTab} />
          </div>
        </div>
      </div>
    </section>
  );
}
