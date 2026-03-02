import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "About — InpromptiFy",
  description: "InpromptiFy is an AI proficiency assessment platform built in Australia. We help companies measure how effectively their teams use AI.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#0A0F1C] min-h-screen">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24">
          <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">About</p>
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">Building the standard for AI proficiency</h1>
          <p className="text-base text-gray-500 leading-relaxed mb-12 max-w-xl">
            InpromptiFy is an AI skills assessment platform. We help companies measure, benchmark, and improve how their teams use AI tools.
          </p>

          <div className="space-y-10 text-[15px] text-gray-400 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">The problem we solve</h2>
              <p className="mb-3">
                Organizations are spending billions on AI tools, but most have no way to measure whether their people can actually use them effectively. Research from Harvard and Wharton shows a 10x variation in prompt effectiveness between users performing the same task. That gap translates directly into wasted tokens, wasted time, and missed value.
              </p>
              <p>
                InpromptiFy gives companies a standardized way to assess AI proficiency across their workforce. Create an assessment in 30 seconds, send it to your team, and get scored results with actionable breakdowns.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">What we believe</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span><strong className="text-white">AI skill is measurable.</strong> Prompting is not a soft skill. It is a concrete, observable behavior with quantifiable outcomes: token usage, output quality, iteration count, speed.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span><strong className="text-white">Efficiency matters as much as output.</strong> Two people can get the same result. The one who does it in fewer tokens and fewer attempts is more valuable. We measure that.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span><strong className="text-white">Real tasks, real models.</strong> Assessments run in a sandboxed environment with real LLMs. No multiple choice. No self-reporting. Candidates solve actual tasks under real constraints.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Company</h2>
              <p className="mb-3">
                InpromptiFy is an Australian company, founded in 2026. We are a small, technical team building tools for the era where AI proficiency is a core job skill.
              </p>
              <p>
                The platform is in early access. We are working directly with early customers to refine the scoring methodology and build the features that matter most for hiring and workforce development.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Early access</h2>
              <p className="mb-3">
                We are currently offering free team assessments to the first 100 companies. This includes full access to the platform, scoring, analytics, and PDF reports.
              </p>
              <p>
                If you want to evaluate your team's AI skills or use InpromptiFy for hiring, reach out or sign up directly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
              <p>
                General inquiries: <a href="mailto:hello@inpromptify.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">hello@inpromptify.com</a>
              </p>
              <p className="mt-1">
                Security: <a href="mailto:security@inpromptify.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">security@inpromptify.com</a>
              </p>
            </section>
          </div>

          <div className="mt-14 pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row gap-3">
            <Link href="/signup?plan=team-free" className="inline-flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-md text-sm font-medium transition-colors">
              Assess Your Team Free
            </Link>
            <Link href="/scoring" className="inline-flex items-center justify-center text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]">
              How Scoring Works
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
