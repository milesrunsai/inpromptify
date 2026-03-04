import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScorePreview from "@/components/home/ScorePreview";
import DashboardPreview from "@/components/home/DashboardPreview";
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
                // for hiring managers
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold text-white tracking-tight leading-[1.08] mb-5 animate-fade-in-up-delay-1">
                Screen AI capability{" "}
                <span className="text-gray-500">before you hire.</span>
              </h1>
              <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-lg animate-fade-in-up-delay-2">
                Give candidates a real-world AI task. Get a clear score on how effectively they use AI at work. Five minutes to set up. No resumes, no self-reporting, no guessing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up-delay-3">
                <Link href="/signup?plan=team-free" className="inline-flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-md text-sm font-medium transition-colors">
                  Create Your First Assessment
                </Link>
                <Link href="/test/demo" className="inline-flex items-center justify-center text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]">
                  See the Candidate Experience
                </Link>
              </div>
            </div>

            {/* Mini proof strip */}
            <div className="grid grid-cols-3 gap-px bg-white/[0.04] rounded-lg overflow-hidden max-w-lg animate-fade-in-up-delay-3">
              <div className="bg-[#0C1120] px-4 py-3 text-center">
                <span className="text-lg font-bold text-white block">5 min</span>
                <span className="text-[11px] text-gray-600">setup time</span>
              </div>
              <div className="bg-[#0C1120] px-4 py-3 text-center">
                <span className="text-lg font-bold text-white block">5</span>
                <span className="text-[11px] text-gray-600">scoring dimensions</span>
              </div>
              <div className="bg-[#0C1120] px-4 py-3 text-center">
                <span className="text-lg font-bold text-white block">0-100</span>
                <span className="text-[11px] text-gray-600">AI proficiency score</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Early Access ─── */}
        <section className="border-y border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <UsageCounter />
              </div>
              <span className="hidden sm:block h-4 w-px bg-white/[0.06]" />
              <span className="text-sm text-gray-500">Free for the first 100 companies</span>
              <Link href="/signup?plan=team-free" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Claim your spot
              </Link>
            </div>
          </div>
        </section>

        {/* ─── The Problem ─── */}
        <section className="relative">
          <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-14">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">The Problem</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                You can't tell who's good with AI from a resume
              </h2>
              <p className="text-sm text-gray-500 max-w-lg mx-auto">
                Everyone claims &ldquo;proficient with AI tools.&rdquo; But research shows a 10x gap in actual performance. You need proof, not claims.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden mb-10">
              {[
                {
                  stat: "10x",
                  label: "Variation in AI effectiveness",
                  desc: "Harvard and Wharton research shows prompt quality varies by an order of magnitude between users performing the same task.",
                },
                {
                  stat: "30%",
                  label: "Of GenAI projects abandoned",
                  desc: "Gartner: nearly a third of GenAI projects fail after proof of concept, often because teams lack the skills to use the tools.",
                },
                {
                  stat: "$600B",
                  label: "AI spend vs. value gap",
                  desc: "Sequoia Capital: $600B gap between AI infrastructure investment and revenue. The bottleneck is people, not models.",
                },
              ].map((item) => (
                <div key={item.stat} className="bg-[#0C1120] p-7 text-center">
                  <span className="text-4xl md:text-5xl font-bold text-indigo-400 block mb-2">{item.stat}</span>
                  <h3 className="text-sm font-semibold text-white mb-2">{item.label}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section className="border-y border-white/[0.04]">
          <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-14">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">How It Works</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Three steps. Five minutes.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden">
              {[
                {
                  step: "01",
                  title: "Create an assessment",
                  desc: "Describe the role or task. InpromptiFy generates a real-world AI challenge with scoring criteria, token budget, and time limit. Or choose from role-specific templates.",
                },
                {
                  step: "02",
                  title: "Send to candidates",
                  desc: "Share a link. Candidates enter a sandboxed environment with a real AI model and solve the task. No account required. Everything is tracked: prompts, tokens, time, iterations.",
                },
                {
                  step: "03",
                  title: "Compare and decide",
                  desc: "Each candidate gets a 0-100 AI Proficiency Score across five dimensions. Your dashboard shows everyone ranked, with hire/no-hire recommendations and detailed breakdowns.",
                },
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

        {/* ─── Product Preview ─── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent" />
          <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-14">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">See It In Action</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                Built for clarity. Designed for speed.
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                A clean dashboard that gives you everything you need — assessments, candidates, and analytics — in one view.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="group relative rounded-xl overflow-hidden border border-white/[0.06] bg-[#0C1120] shadow-2xl shadow-indigo-500/[0.03] transition-all hover:border-white/[0.12]">
                <Image
                  src="/images/dashboard-preview-1.jpg"
                  alt="InpromptiFy dashboard showing assessment creation and team onboarding"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                  priority={false}
                />
              </div>
              <div className="group relative rounded-xl overflow-hidden border border-white/[0.06] bg-[#0C1120] shadow-2xl shadow-indigo-500/[0.03] transition-all hover:border-white/[0.12]">
                <Image
                  src="/images/dashboard-preview-2.jpg"
                  alt="InpromptiFy dashboard overview with test management and analytics"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── The Score ─── */}
        <section>
          <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">The Score</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                  Not a gut feeling. A score.
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Every candidate gets an AI Proficiency Score (0-100) based on five independently weighted dimensions: prompt quality, efficiency, speed, response quality, and iteration intelligence.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  Three of five dimensions are fully deterministic — token count, speed, attempt count. The remaining two use hybrid evaluation: structural heuristics plus LLM-as-judge. Every score includes a full audit trail.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { score: "80-100", label: "Strong Hire", color: "text-emerald-400 border-emerald-500/20" },
                    { score: "65-79", label: "Hire", color: "text-blue-400 border-blue-500/20" },
                    { score: "50-64", label: "Consider", color: "text-amber-400 border-amber-500/20" },
                    { score: "0-49", label: "Not Recommended", color: "text-red-400 border-red-500/20" },
                  ].map((band) => (
                    <div key={band.score} className={`border rounded-lg px-3 py-2 ${band.color}`}>
                      <span className="text-[12px] font-mono block">{band.score}</span>
                      <span className="text-[11px] font-semibold">{band.label}</span>
                    </div>
                  ))}
                </div>
                <Link href="/scoring" className="text-[13px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  How scoring works in detail &rarr;
                </Link>
              </div>
              <ScorePreview />
            </div>
          </div>
        </section>

        {/* ─── Dashboard ─── */}
        <section className="border-y border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-12">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Your Dashboard</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                Compare every candidate. Side by side.
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                One view for all results. Filter by score, sort by dimension, export to PDF. Make better hiring decisions with real data.
              </p>
            </div>
            <DashboardPreview />
          </div>
        </section>

        {/* ─── What You Can Test ─── */}
        <section>
          <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-14">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Flexible</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                Test any role. Any task.
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Custom assessments or pre-built role templates. If the job involves AI, you can test for it.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] rounded-xl overflow-hidden">
              {[
                { role: "Sales / BDR", task: "Draft a personalized outreach email using prospect data and AI" },
                { role: "Marketing", task: "Generate ad copy variations and optimize for target audience" },
                { role: "Software Engineering", task: "Debug code and write tests using AI as a pair programmer" },
                { role: "Data Analysis", task: "Extract insights from a dataset using AI-assisted analysis" },
                { role: "Customer Support", task: "Draft support responses that match brand voice and policy" },
                { role: "Legal / Compliance", task: "Summarize a contract and flag risk clauses" },
                { role: "Product Management", task: "Write a PRD from user research notes using AI" },
                { role: "Custom", task: "Create any task with your own criteria, budget, and time limit" },
              ].map((item) => (
                <div key={item.role} className="bg-[#0C1120] p-5 hover:bg-[#0E1326] transition-colors">
                  <h3 className="text-sm font-semibold text-white mb-1">{item.role}</h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{item.task}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Why Not Resumes ─── */}
        <section className="border-y border-white/[0.04]">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-14">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Why This Matters</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                What hiring looks like without this
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#0C1120] border border-red-500/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-red-400/80 mb-4 uppercase tracking-wider">Without InpromptiFy</h3>
                <ul className="space-y-3 text-sm text-gray-500">
                  {[
                    "Resume says 'proficient with ChatGPT' — no way to verify",
                    "Interview question: 'How do you use AI?' — rehearsed answer",
                    "Every candidate sounds equally good on paper",
                    "Hire based on gut feeling, discover skill gaps month 2",
                    "Paying for AI tools nobody uses effectively",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-red-500/60 mt-0.5 shrink-0">&times;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#0C1120] border border-emerald-500/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-emerald-400/80 mb-4 uppercase tracking-wider">With InpromptiFy</h3>
                <ul className="space-y-3 text-sm text-gray-500">
                  {[
                    "Candidate completes a real AI task in 5-10 minutes",
                    "You see exactly how they prompt, iterate, and solve",
                    "0-100 score with hire/no-hire recommendation",
                    "Compare candidates objectively with full audit trail",
                    "Know who will actually use AI effectively on day one",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-emerald-500/80 mt-0.5 shrink-0">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Integrity ─── */}
        <section>
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Test Integrity</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                  Built to be hard to game
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Assessments run in a sandboxed environment. We track paste events, tab switches, and typing patterns as integrity signals. Multi-dimensional scoring means gaming one dimension hurts another. Meta-prompting attempts are detected and penalized.
                </p>
                <Link href="/scoring#anti-gaming" className="text-[13px] font-medium text-indigo-400 hover:text-indigo-300 mt-4 inline-block transition-colors">
                  Full integrity details &rarr;
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Sandboxed environment", desc: "Controlled AI interaction. No external paste, monitored session." },
                  { label: "Behavioral signals", desc: "Tab switches, paste events, typing patterns — logged and flagged." },
                  { label: "Anti-meta-prompting", desc: "Detects attempts to have AI generate the prompt itself." },
                  { label: "Dynamic tasks", desc: "No fixed question bank. Custom criteria per assessment." },
                  { label: "Audit trail", desc: "Every score is explainable. Full breakdown per dimension." },
                ].map((item) => (
                  <div key={item.label} className="bg-[#0C1120] border border-white/[0.04] rounded-lg px-4 py-3">
                    <span className="text-[13px] font-semibold text-white">{item.label}</span>
                    <p className="text-[12px] text-gray-600 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Pricing ─── */}
        <section className="border-y border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-10">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Pricing</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                Start free. Pay when it works.
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                No credit card for free tier. Upgrade when you need more assessments or team seats.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] rounded-xl overflow-hidden max-w-4xl mx-auto">
              {[
                { plan: "Starter", price: "$0", period: "/mo", desc: "3 assessments/month. One seat. Try it free.", cta: "Get Started", highlight: false },
                { plan: "Professional", price: "$49", period: "/mo", desc: "25 assessments. PDF reports. For consultants and recruiters.", cta: "Get Started", highlight: false },
                { plan: "Team", price: "$199", period: "/mo", desc: "150 assessments. 10 seats. Team analytics.", cta: "Start Free Trial", highlight: true },
                { plan: "Business", price: "$599", period: "/mo", desc: "500 assessments. 50 seats. API access. SSO.", cta: "Contact Sales", highlight: false },
              ].map((p) => (
                <div key={p.plan} className={`p-6 ${p.highlight ? "bg-indigo-600/[0.06] border-y border-indigo-500/20 sm:border-y-0 sm:border-x" : "bg-[#0C1120]"}`}>
                  <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{p.plan}</h3>
                  <div className="flex items-baseline gap-0.5 mb-3">
                    <span className="text-2xl font-bold text-white">{p.price}</span>
                    <span className="text-sm text-gray-600">{p.period}</span>
                  </div>
                  <p className="text-[13px] text-gray-500 mb-5">{p.desc}</p>
                  <Link href={p.plan === "Business" ? "/contact" : "/pricing"} className={`block text-center text-[13px] font-medium py-2 rounded-md transition-colors ${p.highlight ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 border border-white/[0.06]"}`}>
                    {p.cta}
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
              Stop guessing who can use AI.{" "}
              <span className="text-gray-500">Start measuring it.</span>
            </h2>
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
              The gap between good and bad AI usage is 10x. A 5-minute assessment shows you who is on which side. Free for teams up to 25.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup?plan=team-free" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors">
                Create Your First Assessment
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]">
                Talk to Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
