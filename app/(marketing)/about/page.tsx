import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "The mission behind InpromptiFy — building the standard for AI proficiency measurement.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <span className="section-label">[ About ]</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-2 text-white">
            Measuring AI proficiency,{" "}
            <span className="gradient-text">accurately</span>
          </h1>
          <p className="text-lg text-gray-400 mt-6 leading-relaxed">
            InpromptiFy was built on a simple observation: as AI transforms every
            industry, there&apos;s no reliable way to measure how well people
            actually use these tools. We&apos;re changing that.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-16">
          {[
            {
              title: "Our Mission",
              text: "To create the global standard for AI proficiency measurement. We believe that accurate assessment drives better learning, smarter hiring, and more effective teams.",
            },
            {
              title: "Our Approach",
              text: "We combine psychometric science with modern AI to build assessments that are adaptive, fair, and genuinely useful. No trivia questions — only real-world skill validation.",
            },
            {
              title: "Why We Built This",
              text: "InpromptiFy was started in Australia by a young entrepreneur who saw firsthand how quickly AI was reshaping the workforce — and how few tools existed to measure whether people were actually keeping up. We're building what the industry needs.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="glass-strong p-6 rounded-2xl hover:border-orange-500/10 transition-all duration-300"
            >
              <h3 className="text-base font-semibold mb-3 text-white">
                {card.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
