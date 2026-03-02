import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "How Scoring Works — InpromptiFy",
  description: "A detailed explanation of the PromptScore methodology: five dimensions, scoring mechanics, anti-gaming measures, and validation approach.",
};

export default function ScoringPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#0A0F1C] min-h-screen">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24">
          <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Methodology</p>
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">How PromptScore works</h1>
          <p className="text-base text-gray-500 leading-relaxed mb-14 max-w-xl">
            PromptScore is a composite metric (0-100) that measures how effectively someone uses AI to accomplish a task. Here is exactly how it is calculated, why those dimensions matter, and what we do to keep it fair.
          </p>

          {/* ─── The Five Dimensions ─── */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-white mb-6">The five scoring dimensions</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Every assessment produces a score across five independent dimensions. Each dimension measures a different aspect of AI proficiency. The final PromptScore is a weighted composite of all five.
            </p>

            <div className="space-y-6">
              {[
                {
                  name: "Prompt Quality",
                  weight: "25%",
                  what: "How well-structured, specific, and clear is the prompt itself?",
                  why: "A good prompt includes constraints, context, formatting instructions, and clear success criteria. This reduces back-and-forth and gets better results on the first attempt.",
                  how: "We evaluate prompt length, structural elements (role framing, constraints, examples), specificity of instructions, and whether the prompt addresses edge cases. Scored via deterministic heuristics plus LLM-as-judge evaluation.",
                },
                {
                  name: "Efficiency",
                  weight: "25%",
                  what: "How many tokens were consumed relative to the budget?",
                  why: "In production, tokens cost money. An employee who achieves the same output with 40% fewer tokens saves the company real money at scale. Efficiency is the most directly measurable dimension.",
                  how: "Token usage is tracked precisely for every prompt and response. Score = (budget - tokens_used) / budget, with diminishing returns for extreme under-usage (which may indicate insufficient effort).",
                },
                {
                  name: "Speed",
                  weight: "15%",
                  what: "How quickly did the candidate complete the task?",
                  why: "Speed combined with quality indicates confidence and familiarity with AI tools. In a work context, faster completion means higher throughput.",
                  how: "Measured as wall-clock time from assessment start to final submission. Scored on a curve relative to the time limit. Penalized only at extremes — we are measuring preparedness, not rushing.",
                },
                {
                  name: "Response Quality",
                  weight: "20%",
                  what: "Does the AI output actually satisfy the task requirements?",
                  why: "The ultimate measure: did the candidate get the AI to produce a useful result? A great prompt that produces a poor output still fails.",
                  how: "Evaluated against the test creator's success criteria using keyword matching, structural analysis, and LLM-as-judge scoring. Custom criteria (rubrics, tone, length) are evaluated separately and factored in.",
                },
                {
                  name: "Iteration Intelligence",
                  weight: "15%",
                  what: "Did the candidate improve strategically between attempts?",
                  why: "Good prompt engineers do not retry randomly. They diagnose what went wrong, adjust their prompt structure, and converge toward better output. This is the dimension that separates skilled users from lucky ones.",
                  how: "We analyze the delta between consecutive prompts: what changed, whether the changes addressed identifiable issues in the previous output, and whether output quality improved. Random re-rolls score poorly. Strategic refinement scores well.",
                },
              ].map((dim) => (
                <div key={dim.name} className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-white">{dim.name}</h3>
                    <span className="text-[12px] font-mono text-indigo-400/80 bg-indigo-500/[0.08] px-2.5 py-0.5 rounded">{dim.weight}</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">What it measures</span>
                      <p className="text-gray-400 mt-0.5">{dim.what}</p>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Why it matters</span>
                      <p className="text-gray-400 mt-0.5">{dim.why}</p>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">How we calculate it</span>
                      <p className="text-gray-400 mt-0.5">{dim.how}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Score Examples ─── */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-white mb-6">What high vs. low scores look like</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#0C1120] border border-emerald-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-emerald-400">87</span>
                  <span className="text-[11px] font-mono text-emerald-400/60 uppercase">Strong Hire</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1 shrink-0">+</span>
                    First prompt included clear role framing, constraints, and format instructions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1 shrink-0">+</span>
                    Used 38% of token budget to produce high-quality output
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1 shrink-0">+</span>
                    Completed in 2 attempts — second attempt refined formatting only
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1 shrink-0">+</span>
                    Finished in 3 minutes 20 seconds (55% of time limit)
                  </li>
                </ul>
              </div>

              <div className="bg-[#0C1120] border border-red-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-red-400">34</span>
                  <span className="text-[11px] font-mono text-red-400/60 uppercase">Not Recommended</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1 shrink-0">-</span>
                    Vague initial prompt: &quot;write me something about marketing&quot;
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1 shrink-0">-</span>
                    Used 94% of token budget across 7 attempts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1 shrink-0">-</span>
                    No strategic improvement between attempts — mostly re-rolls with minor wording changes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1 shrink-0">-</span>
                    Final output partially satisfied criteria but missed key requirements
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ─── Anti-Gaming ─── */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-white mb-4">Test integrity and anti-gaming</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              PromptScore is designed to be hard to game. The assessment measures real behavior under real constraints, not memorized patterns.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Sandboxed environment",
                  desc: "Candidates interact with the AI in a controlled sandbox. They cannot paste pre-written prompts from external sources, and the environment logs all interactions including paste events and tab switches.",
                },
                {
                  title: "Dynamic tasks",
                  desc: "Test creators define the task. There is no fixed question bank to memorize. Each assessment can have unique criteria, making it impractical to prepare canned responses.",
                },
                {
                  title: "Multi-dimensional scoring",
                  desc: "Gaming one dimension (e.g., speed) typically hurts another (e.g., quality or iteration intelligence). The composite score rewards balanced performance, not min-maxing.",
                },
                {
                  title: "Behavioral signals",
                  desc: "We track paste events, tab switches, typing patterns, and time between interactions. These are logged as integrity signals and available to test creators in the results dashboard. They do not block candidates, but they flag anomalies.",
                },
                {
                  title: "LLM-as-judge evaluation",
                  desc: "Response quality is evaluated by a separate LLM call against the test criteria. This is harder to game than keyword matching alone, because the judge evaluates semantic quality, not just surface-level patterns.",
                },
                {
                  title: "Meta-prompting detection",
                  desc: "We detect attempts to instruct the AI to generate the prompt itself (e.g., 'write me the perfect prompt for this task'). These patterns are flagged and penalized in the prompt quality dimension.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-white">{item.title}</span>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Consistency ─── */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-white mb-4">Scoring consistency</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              For a score to be useful in hiring decisions, it needs to be consistent and reproducible.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Deterministic components",
                  desc: "Three of five dimensions (efficiency, speed, iteration count) are calculated from objective, logged data. There is no subjectivity in how many tokens were used or how long the task took.",
                },
                {
                  title: "Hybrid evaluation",
                  desc: "Prompt quality and response quality use a combination of deterministic heuristics (structure detection, keyword matching, length analysis) and LLM-as-judge evaluation. The deterministic layer anchors the score; the LLM layer adds semantic understanding.",
                },
                {
                  title: "Audit trail",
                  desc: "Every score comes with a full audit trail visible in the results page. Test creators can see exactly how each dimension was scored and why. This makes scores explainable and disputable.",
                },
                {
                  title: "Same inputs, same score",
                  desc: "The deterministic components always produce identical scores for identical inputs. The LLM evaluation component has a temperature of 0 and uses structured output to minimize variance. We are actively collecting data on inter-evaluation consistency.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-white">{item.title}</span>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Validation ─── */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-white mb-4">Validation and what we are working on</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              We are honest about where we are. PromptScore is a new metric. Here is what we know and what we are actively researching.
            </p>

            <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-6 space-y-5">
              <div>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">What we know</span>
                <ul className="mt-2 space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1 shrink-0">&#10003;</span>
                    The scoring dimensions are grounded in published research on prompt engineering effectiveness (Harvard/Wharton 10x variation study, Sequoia AI spend analysis)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1 shrink-0">&#10003;</span>
                    Token efficiency and iteration count are objective, reproducible measurements
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1 shrink-0">&#10003;</span>
                    The multi-dimensional approach prevents gaming and provides actionable detail (not just a single number)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1 shrink-0">&#10003;</span>
                    Early users report the score aligns with their subjective assessment of candidate AI skills
                  </li>
                </ul>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">What we are researching</span>
                <ul className="mt-2 space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1 shrink-0">&#8594;</span>
                    Correlation between PromptScore and on-the-job AI productivity (tracking with early customers)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1 shrink-0">&#8594;</span>
                    Inter-evaluation consistency of the LLM-as-judge component (test-retest reliability)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1 shrink-0">&#8594;</span>
                    Optimal dimension weights across different role types (sales vs engineering vs creative)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1 shrink-0">&#8594;</span>
                    Benchmark data for industry-specific scoring norms
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              We will publish validation results as our dataset grows. If you are interested in participating in our validation research, contact us at <a href="mailto:hello@inpromptify.com" className="text-indigo-400 hover:text-indigo-300">hello@inpromptify.com</a>.
            </p>
          </section>

          {/* ─── Letter Grades ─── */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-white mb-6">Score ranges and hire recommendations</h2>

            <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl overflow-hidden">
              {[
                { range: "80-100", grade: "A", label: "Strong Hire", color: "text-emerald-400", desc: "Demonstrates advanced AI proficiency. Efficient, strategic, and produces high-quality output consistently." },
                { range: "65-79", grade: "B", label: "Hire", color: "text-blue-400", desc: "Solid AI skills. Some room for optimization but capable of productive AI-assisted work." },
                { range: "50-64", grade: "C", label: "Consider", color: "text-amber-400", desc: "Adequate skills with notable gaps. Would benefit from AI training before taking on AI-heavy roles." },
                { range: "0-49", grade: "D/F", label: "Not Recommended", color: "text-red-400", desc: "Significant skill gaps. Inefficient prompting, poor iteration strategy, or inability to produce quality output under constraints." },
              ].map((band, i) => (
                <div key={band.range} className={`flex items-start gap-5 px-6 py-5 ${i < 3 ? "border-b border-white/[0.04]" : ""}`}>
                  <div className="w-16 shrink-0">
                    <span className="text-[12px] font-mono text-gray-600">{band.range}</span>
                    <span className={`block text-lg font-bold ${band.color}`}>{band.grade}</span>
                  </div>
                  <div>
                    <span className={`text-sm font-semibold ${band.color}`}>{band.label}</span>
                    <p className="text-sm text-gray-500 mt-0.5">{band.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row gap-3">
            <Link href="/signup?plan=team-free" className="inline-flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-md text-sm font-medium transition-colors">
              Try It Free
            </Link>
            <Link href="/test/demo" className="inline-flex items-center justify-center text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]">
              Take a Demo Assessment
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
