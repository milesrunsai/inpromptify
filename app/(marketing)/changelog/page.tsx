import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Latest updates and improvements to Inpromptify.",
};

const entries = [
  {
    date: "April 20, 2026",
    title: "Platform Launch",
    items: [
      "Adaptive MCQ assessment engine with real-time theta estimation",
      "85 questions across 5 AI topics",
      "5-dimension scoring: Prompt Quality, Efficiency, Speed, Response Quality, Iteration Intelligence",
      "8 role templates with custom scoring weights",
      "Anti-cheat system with behavioral signal tracking",
      "Team dashboard with org management",
      "Stripe billing with usage-based credits",
      "Admin panel for question bank management",
      "Automated question generation via LLM",
      "PostHog analytics integration",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24">
      <span className="section-label">[ Changelog ]</span>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mt-2">
        Changelog
      </h1>
      <p className="mt-4 text-base sm:text-lg text-gray-400">
        What we shipped, when we shipped it. No fluff.
      </p>

      <div className="mt-16 space-y-16">
        {entries.map((entry) => (
          <div key={entry.date} className="relative">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-orange-400">{entry.date}</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
            <h2 className="text-2xl font-bold text-white">{entry.title}</h2>
            <ul className="mt-4 space-y-2">
              {entry.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-400">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
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
