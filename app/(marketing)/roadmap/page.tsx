import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "What we are building next at InpromptiFy.",
};

const phases = [
  {
    status: "live",
    label: "Live Now",
    title: "Foundation",
    items: [
      "Adaptive MCQ assessment engine",
      "5-dimension scoring with PromptScore credential",
      "8 role-specific assessment templates",
      "Team dashboard and org management",
      "Stripe billing with usage-based credits",
      "API + webhook infrastructure",
      "Anti-cheat and integrity monitoring",
    ],
  },
  {
    status: "building",
    label: "In Progress",
    title: "Enterprise Readiness",
    items: [
      "IRT psychometric calibration pipeline",
      "ATS integrations (Greenhouse, Lever)",
      "Zapier + Make.com connectors",
      "SSO/SAML/SCIM activation",
      "Bias audit dashboard",
      "Benchmarking API for BI tools",
      "Slack and Teams notifications",
    ],
  },
  {
    status: "planned",
    label: "Planned",
    title: "AI Sandbox",
    items: [
      "Live LLM sandbox assessments (E2B microVMs)",
      "Custom model endpoints (BYOK)",
      "Open-ended prompt evaluation with LLM-as-judge",
      "White-label and embedded iframe mode",
      "On-premise deployment option",
    ],
  },
  {
    status: "future",
    label: "Future",
    title: "Platform Scale",
    items: [
      "AI Coach for personalized upskilling",
      "Multi-language assessment support",
      "LMS LTI 1.3 embedding",
      "Predictive ROI analytics",
      "SOC 2 Type II certification",
    ],
  },
];

const statusColors: Record<string, string> = {
  live: "bg-green-500",
  building: "bg-orange-500",
  planned: "bg-yellow-500",
  future: "bg-white/20",
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24">
      <span className="section-label">[ Roadmap ]</span>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mt-2">
        Roadmap
      </h1>
      <p className="mt-4 text-base sm:text-lg text-gray-400">
        Transparency over promises. Here is exactly what we are building and when.
      </p>

      <div className="mt-16 space-y-12">
        {phases.map((phase) => (
          <div key={phase.title} className="glass-strong rounded-xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`h-2.5 w-2.5 rounded-full ${statusColors[phase.status]}`} />
              <span className="text-xs font-medium uppercase tracking-wider text-white/30">
                {phase.label}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{phase.title}</h2>
            <ul className="mt-4 space-y-2">
              {phase.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-400">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/[0.12] shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
