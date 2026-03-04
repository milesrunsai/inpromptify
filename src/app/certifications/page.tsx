import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CertBadge from "@/components/CertBadge";

const TIERS = [
  {
    name: "Foundational",
    score: "50-64",
    sampleScore: 57,
    desc: "Demonstrates basic AI proficiency. Understands core prompting concepts and can produce adequate results with guidance.",
    skills: [
      "Basic prompt construction with clear instructions",
      "Awareness of AI limitations and hallucination risks",
      "Ability to iterate on outputs with simple refinements",
      "Understanding of when to use (and not use) AI",
    ],
    ideal: "Entry-level roles, career changers, non-technical staff adopting AI tools",
  },
  {
    name: "Proficient",
    score: "65-79",
    sampleScore: 72,
    desc: "Demonstrates strong AI proficiency. Effectively uses advanced prompting techniques, iterates strategically, and uses AI efficiently.",
    skills: [
      "Advanced prompt engineering (few-shot, chain-of-thought, constraints)",
      "Strategic iteration — each refinement improves output meaningfully",
      "Efficient token and time management",
      "Ability to evaluate and quality-check AI outputs",
      "Understanding of model selection for different tasks",
    ],
    ideal: "Mid-level professionals, team leads, knowledge workers using AI daily",
  },
  {
    name: "Expert",
    score: "80-100",
    sampleScore: 88,
    desc: "Demonstrates top-tier AI proficiency. Masters complex prompting strategies, optimizes for quality and efficiency, and can design AI workflows.",
    skills: [
      "Expert-level prompt engineering across multiple domains",
      "Optimal balance of quality, speed, and cost efficiency",
      "Ability to decompose complex tasks for AI execution",
      "Strong evaluation and verification of AI outputs",
      "Can design and supervise AI agent workflows",
      "Understands model capabilities, parameters, and architecture trade-offs",
    ],
    ideal: "Senior roles, AI leads, ops managers, anyone building or supervising AI systems",
  },
];

export default function CertificationsPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#0A0F1C] min-h-screen">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Certifications</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Prove your AI proficiency. Get certified.
            </h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
              InpromptiFy certifications validate your ability to use AI effectively at work.
              Each tier represents a verified skill level based on live task performance — not
              multiple choice, not self-reported, not course completion.
            </p>
          </div>

          {/* How it works */}
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden mb-16">
            {[
              { step: "01", title: "Take an assessment", desc: "Complete a real-world AI task in a sandboxed environment. Your prompts, iterations, and outputs are scored across 5 dimensions." },
              { step: "02", title: "Get your PromptScore", desc: "Receive a 0-100 score with a detailed breakdown. Your score determines your certification tier." },
              { step: "03", title: "Share your credential", desc: "Add your verified certification to LinkedIn, your resume, or your email signature. Employers can verify it instantly." },
            ].map((item) => (
              <div key={item.step} className="bg-[#0C1120] p-7">
                <span className="text-[11px] font-mono text-gray-600 block mb-4">{item.step}</span>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Tiers */}
          <div className="space-y-8 mb-16">
            <h2 className="text-xl font-bold text-white text-center">Certification Tiers</h2>
            {TIERS.map((tier) => (
              <div key={tier.name} className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="shrink-0">
                    <CertBadge score={tier.sampleScore} showDesc={false} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                      <span className="text-sm text-gray-500 font-mono">Score: {tier.score}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{tier.desc}</p>
                    <div className="mb-4">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills Demonstrated</p>
                      <ul className="space-y-1">
                        {tier.skills.map((skill) => (
                          <li key={skill} className="flex items-start gap-2 text-[13px] text-gray-500">
                            <span className="text-indigo-400/60 mt-0.5 shrink-0">&#10003;</span>
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-[12px] text-gray-600">
                      <span className="font-semibold text-gray-500">Best for:</span> {tier.ideal}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* What makes this different */}
          <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-8 mb-16">
            <h2 className="text-lg font-bold text-white mb-6 text-center">How This Is Different</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-indigo-500/60 mb-3 uppercase tracking-wider">Other certifications</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  {[
                    "Multiple choice quizzes — easily gamed",
                    "Course completion — watching videos is not a skill",
                    "Self-reported usage — no verification",
                    "Tool-specific — only proves you use one product",
                    "Static — pass once, credential lasts forever",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-indigo-500/40 mt-0.5 shrink-0">&times;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-indigo-300 mb-3 uppercase tracking-wider">InpromptiFy Certifications</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  {[
                    "Live task performance — real AI, real work",
                    "5-dimension scoring — not a single pass/fail",
                    "Anti-cheat — paste detection, tab tracking, integrity signals",
                    "Model-agnostic — tests your skill, not tool familiarity",
                    "Verifiable — employers click through to full score breakdown",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5 shrink-0">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to get certified?</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
              Take the assessment and earn your InpromptiFy certification. Free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/test/demo"
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                Take the Assessment
              </Link>
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]"
              >
                Try the Free Quiz First
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
