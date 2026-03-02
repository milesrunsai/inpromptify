import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroMockup from "@/components/home/HeroMockup";
import ScorePreview from "@/components/home/ScorePreview";
import DashboardPreview from "@/components/home/DashboardPreview";
import BeforeAfter from "@/components/home/BeforeAfter";
import UsageCounter from "@/components/home/UsageCounter";

export default function HomePage() {
  return (
    <>
      <Nav transparent />
      <main className="bg-[#0A0F1C]">
        {/* ─── Hero ─── */}
        <section className="relative min-h-[calc(100vh-56px)] flex items-center overflow-hidden -mt-14 pt-14">
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-indigo-500/[0.06] blur-[120px]" />

          <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28 w-full">
            <div className="max-w-2xl mb-12">
              <p className="text-[13px] font-mono text-indigo-400/80 mb-4 animate-fade-in-up">
                // assess what matters
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold text-white tracking-tight leading-[1.08] mb-5 animate-fade-in-up-delay-1">
                Measure how your team{" "}
                <span className="text-gray-500">actually uses AI.</span>
              </h1>
              <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-lg animate-fade-in-up-delay-2">
                Prompt quality varies 10x between employees. InpromptiFy scores prompting
                efficiency, identifies skill gaps, and shows you where AI spend turns into AI value.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up-delay-3">
                <Link href="/signup?plan=team-free" className="inline-flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-md text-sm font-medium transition-colors">
                  Assess Your Team Free
                </Link>
                <Link href="/test/demo" className="inline-flex items-center justify-center text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]">
                  Try the Demo
                </Link>
              </div>
            </div>

            <div className="animate-fade-in-up-delay-3">
              <HeroMockup />
            </div>
          </div>
        </section>

        {/* ─── Early Access Banner ─── */}
        <section className="border-y border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <UsageCounter />
              </div>
              <span className="hidden sm:block h-4 w-px bg-white/[0.06]" />
              <span className="text-sm text-gray-500">Free team assessments for the first 100 companies</span>
              <Link href="/signup?plan=team-free" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Claim your spot
              </Link>
            </div>
          </div>
        </section>

        {/* ─── The Cost of Bad Prompting ─── */}
        <section className="relative">
          <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-14">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">The Problem</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                Your team is burning money on bad prompts
              </h2>
              <p className="text-sm text-gray-500 max-w-lg mx-auto">
                Every inefficient prompt costs you tokens, time, and output quality.
                Most organizations have no visibility into the problem.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden mb-10">
              {[
                {
                  stat: "10x",
                  label: "Variation in prompt effectiveness",
                  desc: "Harvard and Wharton research shows prompt quality varies by an order of magnitude between users performing the same task. Most teams have no way to measure this.",
                },
                {
                  stat: "30%",
                  label: "Of GenAI projects abandoned",
                  desc: "Gartner predicts nearly a third of generative AI projects will be abandoned after proof of concept — often because teams lack the skills to use the tools effectively.",
                },
                {
                  stat: "$600B",
                  label: "AI spend vs. value gap",
                  desc: "Sequoia Capital identified a $600B gap between AI infrastructure investment and actual revenue generated. The bottleneck is not the models — it is how people use them.",
                },
              ].map((item) => (
                <div key={item.stat} className="bg-[#0C1120] p-7 text-center">
                  <span className="text-4xl md:text-5xl font-bold text-indigo-400 block mb-2">{item.stat}</span>
                  <h3 className="text-sm font-semibold text-white mb-2">{item.label}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-6">
                InpromptiFy measures prompting skill across your team so you can close the gap between AI spend and AI value.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]"
              >
                Calculate Your Waste
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Scoring Preview ─── */}
        <section className="border-y border-white/[0.04]">
          <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Scoring</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                  A score that means something
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  PromptScore evaluates five dimensions: prompt quality, token efficiency,
                  response quality, iteration intelligence, and speed. Each dimension
                  is weighted and scored independently.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Detailed breakdowns show exactly where a candidate excels — or
                  falls short. No more guessing.
                </p>
                <p className="text-sm text-indigo-400/80 font-medium">
                  The same result with fewer tokens means lower costs and faster workflows — that is what efficient prompting looks like.
                </p>
              </div>
              <ScorePreview />
            </div>
          </div>
        </section>

        {/* ─── Dashboard Preview ─── */}
        <section className="relative">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-12">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Dashboard</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                Compare candidates at a glance
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Your employer dashboard shows every test result, ranked and filterable.
              </p>
            </div>
            <DashboardPreview />
          </div>
        </section>

        {/* ─── Free Team Assessment ─── */}
        <section className="border-y border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-14">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">For Teams</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                See how your team actually performs — free
              </h2>
              <p className="text-sm text-gray-500 max-w-xl mx-auto">
                Issue a standardized AI skills assessment to your entire team. Get a breakdown
                of who prompts efficiently, who needs training, and where your biggest cost
                savings are. No credit card required.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                {[
                  "Standardized prompt assessment for up to 25 employees",
                  "Individual PromptScore breakdowns",
                  "Team efficiency heatmap",
                  "Token usage analysis per person",
                  "Exportable PDF report",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-sm text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#0C1120] rounded-xl border border-white/[0.06] p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold text-white">Team Results</h3>
                  <span className="text-[10px] font-mono text-indigo-400/70 uppercase">Live Preview</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "S. Chen", score: 92, efficiency: "Top 5%", bar: "w-[92%]" },
                    { name: "M. Rivera", score: 78, efficiency: "Top 25%", bar: "w-[78%]" },
                    { name: "J. Park", score: 65, efficiency: "Average", bar: "w-[65%]" },
                    { name: "A. Thompson", score: 41, efficiency: "Needs Training", bar: "w-[41%]" },
                  ].map((row) => (
                    <div key={row.name} className="flex items-center gap-3">
                      <span className="text-[13px] text-gray-400 w-24 shrink-0">{row.name}</span>
                      <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${row.score >= 80 ? "bg-indigo-500" : row.score >= 60 ? "bg-indigo-500/60" : "bg-indigo-500/30"} ${row.bar}`} />
                      </div>
                      <span className="text-[11px] font-mono text-gray-600 w-10 text-right">{row.score}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-white/[0.04] flex justify-between">
                  <span className="text-[11px] text-gray-600">Team avg: 69</span>
                  <span className="text-[11px] text-indigo-400/70">Est. savings: $14K/yr</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <Link
                href="/signup?plan=team-free"
                className="inline-flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                Assess Your Team Free
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section className="relative">
          <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-14">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Process</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Three steps. Thirty seconds.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden">
              {[
                { step: "01", title: "Create", desc: "Describe what you want to test. AI generates the task, scoring criteria, and settings in seconds." },
                { step: "02", title: "Assess", desc: "Candidates enter a sandboxed environment and solve the task with a real LLM. Token usage is tracked." },
                { step: "03", title: "Optimize", desc: "Get PromptScores with detailed cost analytics. Identify who needs training and where money is being wasted." },
              ].map((item) => (
                <div key={item.step} className="bg-[#0C1120] p-7">
                  <span className="text-[11px] font-mono text-gray-600 block mb-4">{item.step}</span>
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Before / After ─── */}
        <section className="border-y border-white/[0.04]">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-12">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Why InpromptiFy</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                The old way vs. the better way
              </h2>
            </div>
            <BeforeAfter />
          </div>
        </section>

        {/* ─── Features ─── */}
        <section className="relative">
          <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-14">
              <p className="text-[11px] font-mono text-violet-400/70 uppercase tracking-wider mb-3">Features</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Everything you need to assess AI skills
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden">
              {[
                { title: "Real LLM Sandbox", desc: "Candidates use actual AI models in a controlled, monitored environment." },
                { title: "Prompt Scoring", desc: "Automated 0-100 scoring based on efficiency, quality, and iteration count." },
                { title: "Any Skill, Any Role", desc: "Legal drafting, code debugging, medical reports, ad copy — test anything with custom criteria." },
                { title: "Token Budgets", desc: "Set token limits to measure how efficiently candidates work with AI. Lower usage, same quality — that is the goal." },
                { title: "Cost Analytics", desc: "Track per-employee AI spend and identify optimization opportunities across your organization." },
                { title: "Team Benchmarks", desc: "See how your team compares to industry averages with anonymized benchmark data." },
                { title: "Time Controls", desc: "Configurable time limits keep assessments standardized and fair." },
                { title: "Analytics Dashboard", desc: "Compare candidates side-by-side with detailed performance breakdowns." },
              ].map((f) => (
                <div key={f.title} className="bg-[#0C1120] p-6 hover:bg-[#0E1326] transition-colors">
                  <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pricing Teaser ─── */}
        <section className="border-y border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-10">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Pricing</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                Simple, transparent pricing
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Start free. Scale when you&apos;re ready.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] rounded-xl overflow-hidden max-w-4xl mx-auto">
              {[
                { plan: "Starter", price: "$0", period: "/mo", desc: "3 assessments/month. Try it free.", cta: "Get Started", highlight: false },
                { plan: "Professional", price: "$49", period: "/mo", desc: "25 assessments. PDF reports. Consultants.", cta: "Get Started", highlight: false },
                { plan: "Team", price: "$199", period: "/mo", desc: "150 assessments. 10 seats. Full analytics.", cta: "Start Free Trial", highlight: true },
                { plan: "Business", price: "$599", period: "/mo", desc: "500 assessments. 50 seats. API + SSO.", cta: "Start Free Trial", highlight: false },
              ].map((p) => (
                <div key={p.plan} className={`p-6 ${p.highlight ? "bg-indigo-600/[0.06] border-y border-indigo-500/20 sm:border-y-0 sm:border-x" : "bg-[#0C1120]"}`}>
                  <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{p.plan}</h3>
                  <div className="flex items-baseline gap-0.5 mb-3">
                    <span className="text-2xl font-bold text-white">{p.price}</span>
                    {p.period && <span className="text-sm text-gray-600">{p.period}</span>}
                  </div>
                  <p className="text-[13px] text-gray-500 mb-5">{p.desc}</p>
                  <Link href="/pricing" className={`block text-center text-[13px] font-medium py-2 rounded-md transition-colors ${p.highlight ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 border border-white/[0.06]"}`}>
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Use Cases ─── */}
        <section className="relative">
          <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-14">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Use Cases</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                Built for how you work
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Whether you are hiring, upskilling, or benchmarking — InpromptiFy adapts to your workflow.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden">
              {[
                { label: "01", title: "Hiring", desc: "Screen AI capability in 5 minutes. Send candidates an assessment link, get scored results with hire/no-hire recommendations.", href: "/signup?plan=team-free", cta: "Start Assessing" },
                { label: "02", title: "Team Benchmarking", desc: "Issue a standardized assessment to your entire team. Identify skill gaps, find your strongest AI users, and target training.", href: "/signup?plan=team-free", cta: "Benchmark Your Team" },
                { label: "03", title: "Skill Development", desc: "Practice with real AI models under real constraints. Track your PromptScore over time and build a verified skill profile.", href: "/explore", cta: "Start Practicing" },
              ].map((item) => (
                <div key={item.title} className="bg-[#0C1120] p-7 flex flex-col">
                  <span className="text-[11px] font-mono text-gray-600 block mb-3">{item.label}</span>
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{item.desc}</p>
                  <Link href={item.href} className="text-[13px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    {item.cta} &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="relative">
          <div className="absolute inset-0 dot-grid opacity-15" />
          <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
              Know who can actually prompt.
            </h2>
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
              The gap between good and bad prompting is 10x. Start measuring it —
              free for teams up to 25 people.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup?plan=team-free" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors">
                Assess Your Team Free
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]">
                See Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
