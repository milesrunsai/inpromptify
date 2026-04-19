"use client";

const companies = [
  "Anthropic",
  "OpenAI",
  "Google",
  "Meta",
  "Microsoft",
  "Stripe",
  "Databricks",
  "Notion",
];

export default function SocialProof() {
  return (
    <section className="relative py-20 section-frame">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-white/30 mb-10">
          Trusted by leading organizations
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companies.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold text-white/[0.12] tracking-wide select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
