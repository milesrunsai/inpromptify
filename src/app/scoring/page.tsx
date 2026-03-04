import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "How Scoring Works — InpromptiFy",
  description: "Understand the PromptScore methodology: 5 weighted dimensions that measure AI proficiency objectively.",
};

const dimensions = [
  {
    name: "Prompt Quality",
    weight: 25,
    color: "indigo",
    description: "How well-constructed are your prompts? We analyze clarity, specificity, structure, formatting instructions, constraints, and context-setting.",
    highScore: [
      "Clear, structured instructions with numbered steps",
      "Explicit constraints (word count, tone, what to avoid)",
      "Role/persona setting for the AI",
      "Audience awareness baked into the prompt",
    ],
    lowScore: [
      "Vague, one-line prompts with no structure",
      "No constraints or formatting guidance",
      "Missing context about who the output is for",
      "Copy-pasting the same prompt repeatedly",
    ],
    antiGaming: "We analyze linguistic patterns, not just length. A 500-word prompt full of filler scores lower than a precise 100-word prompt with clear structure.",
  },
  {
    name: "Efficiency",
    weight: 25,
    color: "violet",
    description: "How economically do you use your resources? Measured by attempts used vs. allowed and tokens consumed vs. budget.",
    highScore: [
      "Achieving the goal in 1-2 attempts",
      "Using less than 50% of the token budget",
      "Getting it right the first time",
    ],
    lowScore: [
      "Using all available attempts",
      "Burning through the entire token budget",
      "Repeating similar prompts without meaningful changes",
    ],
    antiGaming: "Using fewer attempts only helps if the output quality is good. A single bad prompt scores lower than two well-crafted iterations.",
  },
  {
    name: "Speed",
    weight: 15,
    color: "fuchsia",
    description: "How quickly do you complete the task? Faster completion (with quality maintained) indicates confidence and fluency with AI tools.",
    highScore: [
      "Completing in 20-50% of the allotted time",
      "Quick, decisive prompting without long pauses",
      "Finishing with significant time remaining",
    ],
    lowScore: [
      "Using 90-100% of available time",
      "Long pauses suggesting uncertainty",
      "Running out the clock",
    ],
    antiGaming: "Completing in under 15% of the time triggers a review flag. Suspiciously fast completions are capped to prevent gaming.",
  },
  {
    name: "Response Quality",
    weight: 20,
    color: "slate",
    description: "How good is the AI output you elicited? We evaluate the final response against the task requirements, expected keywords, structure, and constraints.",
    highScore: [
      "Response covers all required elements",
      "Proper structure (headings, lists, sections as needed)",
      "Matches the expected tone and audience",
      "Contains relevant domain-specific content",
    ],
    lowScore: [
      "Response misses key requirements",
      "No structure or formatting",
      "Wrong tone for the audience",
      "Generic output that could apply to any task",
    ],
    antiGaming: "We evaluate the best (final) response, not just the first. This rewards smart iteration — improving your output across attempts.",
  },
  {
    name: "Iteration Intelligence",
    weight: 15,
    color: "purple",
    description: "When you iterate, do you improve? We track whether subsequent prompts build on AI feedback, introduce new requirements, and produce better results.",
    highScore: [
      "Each prompt meaningfully different from the last",
      "Referencing AI output ('change X to Y', 'instead of...')",
      "Introducing new vocabulary and requirements",
      "Responses improving in quality across attempts",
    ],
    lowScore: [
      "Repeating the same prompt verbatim",
      "Random changes without clear direction",
      "No reference to what the AI previously produced",
      "Response quality staying flat or declining",
    ],
    antiGaming: "Single-attempt completions receive a neutral score (60) for this dimension — you're not penalized for getting it right the first time.",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20", bar: "bg-indigo-500" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20", bar: "bg-violet-500" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", bar: "bg-purple-500" },
  fuchsia: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-400", border: "border-fuchsia-500/20", bar: "bg-fuchsia-500" },
  slate: { bg: "bg-indigo-400/10", text: "text-indigo-300", border: "border-indigo-400/20", bar: "bg-indigo-400" },
};

export default function ScoringPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#0A0F1C] min-h-screen">
        {/* Header */}
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">How Scoring Works</h1>
          <p className="text-gray-400 max-w-xl mb-3">
            Every PromptScore is calculated from 5 weighted dimensions that together measure
            how effectively someone uses AI to accomplish a task. No black boxes — here is exactly
            what we measure and why.
          </p>
          <p className="text-sm text-gray-500">
            Methodology based on research into AI-assisted productivity from
            Harvard Business School, Wharton, and enterprise prompting benchmarks.
          </p>
        </div>

        {/* Score Scale */}
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 pb-12">
          <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Score Scale</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { grade: "S", range: "95-100", label: "Exceptional", color: "text-indigo-200 bg-indigo-400/15 border-indigo-300/30" },
                { grade: "A", range: "80-94", label: "Strong Hire", color: "text-indigo-300 bg-indigo-500/[0.1] border-indigo-400/25" },
                { grade: "B", range: "65-79", label: "Hire", color: "text-indigo-400 bg-indigo-500/[0.07] border-indigo-500/20" },
                { grade: "C", range: "50-64", label: "Consider", color: "text-indigo-400/70 bg-indigo-500/[0.04] border-indigo-500/15" },
                { grade: "D", range: "35-49", label: "Below Avg", color: "text-indigo-500/50 bg-indigo-500/[0.03] border-indigo-500/10" },
                { grade: "F", range: "0-34", label: "Not Ready", color: "text-indigo-600/50 bg-indigo-600/[0.02] border-indigo-600/10" },
              ].map((g) => (
                <div key={g.grade} className={`rounded-md border p-3 text-center ${g.color}`}>
                  <div className="text-2xl font-bold">{g.grade}</div>
                  <div className="text-[11px] font-mono mt-0.5">{g.range}</div>
                  <div className="text-[10px] mt-1 opacity-70">{g.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weight Overview */}
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 pb-12">
          <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Dimension Weights</h2>
            <div className="space-y-3">
              {dimensions.map((dim) => {
                const c = colorMap[dim.color];
                return (
                  <div key={dim.name} className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 w-40 shrink-0">{dim.name}</span>
                    <div className="flex-1 h-3 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${dim.weight}%` }} />
                    </div>
                    <span className="text-sm font-mono text-gray-500 w-10 text-right">{dim.weight}%</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-600 mt-4">
              Weights are calibrated so that efficient, high-quality first prompts score highest.
              This reflects real-world productivity — the best AI users get great results fast.
            </p>
          </div>
        </div>

        {/* Detailed Dimensions */}
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-xl font-bold text-white mb-6">The Five Dimensions</h2>

          <div className="space-y-6">
            {dimensions.map((dim) => {
              const c = colorMap[dim.color];
              return (
                <div key={dim.name} className="bg-[#0C1120] rounded-lg border border-white/[0.06] overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${c.bg} ${c.text} border ${c.border}`}>
                        {dim.weight}%
                      </span>
                      <h3 className="text-lg font-bold text-white">{dim.name}</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-5">{dim.description}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-5">
                      <div>
                        <h4 className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mb-2">High Score Looks Like</h4>
                        <ul className="space-y-1.5">
                          {dim.highScore.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                              <svg className="w-3.5 h-3.5 mt-0.5 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-semibold text-indigo-500/60 uppercase tracking-wider mb-2">Low Score Looks Like</h4>
                        <ul className="space-y-1.5">
                          {dim.lowScore.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                              <svg className="w-3.5 h-3.5 mt-0.5 text-indigo-500/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-md p-3">
                      <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Anti-Gaming</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{dim.antiGaming}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Criteria */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-16">
            <h2 className="text-xl font-bold text-white mb-3">Custom Scoring Criteria</h2>
            <p className="text-sm text-gray-400 mb-6 max-w-xl">
              Employers can add custom criteria on top of the standard 5 dimensions. When custom criteria
              are used, the final score blends standard dimensions (50%) with custom criteria (50%).
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { type: "Keyword", desc: "Must-include and must-not-include terms in the output" },
                { type: "Tone", desc: "Professional, casual, technical, or creative tone matching" },
                { type: "Length", desc: "Word count within a specified min/max range" },
                { type: "Rubric", desc: "Free-form criteria matched against response content" },
              ].map((c) => (
                <div key={c.type} className="bg-[#0C1120] border border-white/[0.06] rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-1">{c.type}</h3>
                  <p className="text-xs text-gray-500">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-xl font-bold text-white mb-3">See it in action</h2>
            <p className="text-sm text-gray-400 mb-6">Try a free demo assessment and get your PromptScore with a full breakdown.</p>
            <div className="flex justify-center gap-3">
              <Link href="/test/demo" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-md text-sm font-medium transition-colors">
                Take the Demo
              </Link>
              <Link href="/signup" className="bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] text-gray-400 px-6 py-3 rounded-md text-sm font-medium transition-colors">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
