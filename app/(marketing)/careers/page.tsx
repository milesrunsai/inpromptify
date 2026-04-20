import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join InpromptiFy and help build the standard for AI proficiency assessment.",
};

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-hero-heading sm:text-5xl">
        Careers
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        We are a small, fast team building the AI proficiency standard.
        No open roles right now, but we are always interested in exceptional people.
      </p>

      <div className="mt-16 liquid-glass rounded-xl p-8">
        <h2 className="text-lg font-semibold text-hero-heading">
          No open positions
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We are not actively hiring, but if you think you would be a good fit —
          especially in engineering, psychometrics, or enterprise sales — reach out.
        </p>
        <div className="mt-6">
          <a
            href="mailto:careers@inpromptify.com?subject=Interested in joining"
            className="liquid-glass rounded-full px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/5 inline-block"
          >
            Send an introduction
          </a>
        </div>
      </div>
    </div>
  );
}
