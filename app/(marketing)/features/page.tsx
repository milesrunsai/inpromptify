import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Adaptive testing, skill mapping, team analytics, and certifications. See how InpromptiFy measures real AI proficiency.",
};

const categories = [
  {
    label: "Assessment",
    features: [
      {
        icon: "\u{1F9E0}",
        title: "Adaptive Testing Engine",
        desc: "AI-powered difficulty adjustment that finds your exact skill level in half the time.",
      },
      {
        icon: "\u{1F4CA}",
        title: "Skill Radar Charts",
        desc: "Multi-dimensional proficiency visualization across AI competency areas.",
      },
      {
        icon: "\u26A1",
        title: "Real-time Scoring",
        desc: "Instant results with detailed breakdowns, percentiles, and improvement suggestions.",
      },
      {
        icon: "\u{1F6E0}\uFE0F",
        title: "Assessment Builder",
        desc: "Drag-and-drop editor with AI-assisted question generation and 10K+ question bank.",
      },
    ],
  },
  {
    label: "Analytics",
    features: [
      {
        icon: "\u{1F465}",
        title: "Team Dashboards",
        desc: "Organization-wide analytics, department comparisons, and training ROI tracking.",
      },
      {
        icon: "\u{1F3C5}",
        title: "Digital Certifications",
        desc: "Verifiable badges with unique URLs, LinkedIn integration, and custom branding.",
      },
    ],
  },
  {
    label: "Security",
    features: [
      {
        icon: "\u{1F512}",
        title: "Anti-Cheat & Proctoring",
        desc: "Browser lockdown, copy-paste detection, and optional AI-powered proctoring.",
      },
    ],
  },
  {
    label: "Integration",
    features: [
      {
        icon: "\u{1F517}",
        title: "API & Webhooks",
        desc: "RESTful API, real-time webhooks, and SDKs in Python, TypeScript, and Go.",
      },
      {
        icon: "\u{1F393}",
        title: "LMS Integrations",
        desc: "Native integrations with Canvas, Moodle, Blackboard, and custom LTI support.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <span className="section-label">[ Features ]</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-2">
            Everything you need to{" "}
            <span className="gradient-text">assess AI proficiency</span>
          </h1>
          <p className="text-lg text-white/40 mt-6 leading-relaxed">
            From adaptive testing to verifiable certifications, InpromptiFy
            provides the complete toolkit for measuring and validating AI skills
            at any scale.
          </p>
        </div>

        {categories.map((cat) => (
          <div key={cat.label} className="mt-16">
            <h2 className="text-xs font-medium uppercase tracking-wider text-orange-400/60 mb-6">
              {cat.label}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.features.map((f) => (
                <div key={f.title} className="glass-strong p-6 rounded-2xl">
                  <span className="text-2xl mb-3 block">{f.icon}</span>
                  <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="glass-strong rounded-2xl p-10 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to get started?
            </h2>
            <p className="text-sm text-white/40 mb-6">
              Start measuring AI proficiency across your team today. Free to get
              started, no credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/sign-up"
                className="glow-btn px-8 py-3 text-sm font-medium inline-block"
              >
                Start Free Trial
              </Link>
              <a
                href="https://agentmail.to/enterprise"
                target="_blank"
                rel="noopener noreferrer"
                className="ghost-btn px-8 py-3 text-sm font-medium inline-block"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
