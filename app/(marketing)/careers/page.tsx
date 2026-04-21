import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Inpromptify and help build the standard for AI proficiency assessment.",
};

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24">
      <span className="section-label">[ Careers ]</span>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mt-2">
        Careers
      </h1>
      <p className="mt-4 text-base sm:text-lg text-gray-400">
        We are a small, fast team building the AI proficiency standard.
        No open roles right now, but we are always interested in exceptional people.
      </p>

      <div className="mt-16 glass-strong rounded-xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">
          No open positions
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          We are not actively hiring, but if you think you would be a good fit —
          especially in engineering, psychometrics, or enterprise sales — reach out.
        </p>
        <div className="mt-6">
          <a
            href="mailto:careers@inpromptify.com?subject=Interested in joining"
            className="ghost-btn px-6 py-2.5 text-sm font-medium inline-block"
          >
            Send an introduction
          </a>
        </div>
      </div>
    </div>
  );
}
