import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why InpromptiFy exists — AI is reshaping every industry, but most people are using it wrong.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="max-w-3xl">
          <span className="section-label">[ About InpromptiFy ]</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2 text-white leading-tight">
            AI is taking jobs.{" "}
            <span className="gradient-text">But only from those who cannot use it.</span>
          </h1>
          <p className="text-lg text-gray-400 mt-6 leading-relaxed">
            The statistics are clear. AI is automating tasks across every industry at an
            unprecedented pace. But here is what most people miss: AI does not replace skilled
            users. It replaces unskilled ones.
          </p>
        </div>

        {/* The Problem Section */}
        <div className="grid lg:grid-cols-2 gap-12 mt-20 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              The real problem is not AI. It is how people use it.
            </h2>
            <div className="mt-6 space-y-4 text-gray-400 leading-relaxed">
              <p>
                AI is only powerful when it is used correctly. A poorly written prompt to GPT-4
                wastes tokens, produces garbage output, and costs real money. The difference
                between a proficient AI user and an amateur is not what model they use. It is
                how they use it.
              </p>
              <p>
                Most professionals today are stuck on ChatGPT. They do not know that Claude
                handles long documents better. They do not understand that Gemini has a 2 million
                token context window. They have never heard of RAG, function calling, or
                multi-agent workflows. They are paying enterprise rates for consumer-level
                output.
              </p>
              <p>
                Older employees are particularly affected. Not because they lack intelligence,
                but because no one is measuring their AI fluency or showing them what they are
                missing. Companies are spending thousands on AI licenses while their teams
                use 5% of the capability.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
              alt="AI technology visualization"
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
          </div>
        </div>

        {/* Why Proficiency Matters */}
        <div className="mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            AI proficiency is not optional. It is the new literacy.
          </h2>
          <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto">
            Without the right skills, expensive models are wasted. With the right skills,
            even free models outperform the competition.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {[
              {
                stat: "$600B+",
                label: "Annual AI skills gap",
                detail:
                  "Companies are investing in AI tools their teams cannot fully utilize. The gap between AI spending and AI competency is growing every quarter.",
              },
              {
                stat: "73%",
                label: "Only use ChatGPT",
                detail:
                  "Most professionals have never tried Claude, Gemini, Mistral, or open-source models. They do not know what they are missing or which model fits their workflow.",
              },
              {
                stat: "5x",
                label: "Cost difference",
                detail:
                  "A proficient AI user produces the same output in one prompt that an amateur needs five attempts to achieve. At enterprise token pricing, that difference is thousands per month.",
              },
              {
                stat: "89%",
                label: "Cannot iterate effectively",
                detail:
                  "When the first AI output is wrong, most users give up or start over. Proficient users refine, add constraints, and converge in 2-3 iterations.",
              },
              {
                stat: "40+",
                label: "Niches we assess",
                detail:
                  "From prompt engineering and RAG to AI agents, evaluation frameworks, safety protocols, and tool orchestration. Every skill a business needs, measured.",
              },
              {
                stat: "< 3min",
                label: "Time to score",
                detail:
                  "Our adaptive engine measures real AI proficiency in under 3 minutes. No long tests, no trivia, no wasted time. Just applied judgment under pressure.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="glass-strong p-6 rounded-2xl hover:border-orange-500/10 transition-all duration-300"
              >
                <div className="text-3xl font-bold gradient-text">{item.stat}</div>
                <h3 className="text-sm font-semibold text-white mt-2">{item.label}</h3>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Cover */}
        <div className="grid lg:grid-cols-2 gap-12 mt-24 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80"
              alt="Neural network visualization"
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Every niche a business could want to test on.
            </h2>
            <div className="mt-6 space-y-4 text-gray-400 leading-relaxed">
              <p>
                InpromptiFy does not just test prompt engineering. We cover the full spectrum
                of AI proficiency that modern businesses need:
              </p>
              <ul className="space-y-3">
                {[
                  "Prompt engineering across multiple models (GPT-4, Claude, Gemini, Mistral, open-source)",
                  "RAG architecture, chunking strategies, and retrieval optimization",
                  "AI agent workflows, function calling, and multi-step orchestration",
                  "Output evaluation, hallucination detection, and quality assurance",
                  "AI safety, bias mitigation, prompt injection defense, and compliance",
                  "Workflow optimization, token efficiency, and cost management",
                  "Model selection for specific use cases (when to use which model and why)",
                  "Iteration intelligence (refining outputs, adding constraints, converging on quality)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                Whether you are hiring a marketing team that needs content generation skills or
                a dev team that needs agentic workflow expertise, we have the assessment for it.
              </p>
            </div>
          </div>
        </div>

        {/* How We Connect */}
        <div className="mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            How we connect and integrate
          </h2>
          <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto">
            InpromptiFy plugs into the tools your HR and engineering teams already use.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {[
              {
                title: "ATS Integration",
                detail:
                  "Greenhouse, Lever, Workday, BambooHR, Ashby. One-click candidate assessment directly from your hiring pipeline.",
              },
              {
                title: "LMS Embedding",
                detail:
                  "Canvas, Moodle, Blackboard via LTI. Embed assessments into your existing learning management system.",
              },
              {
                title: "Zapier and Make",
                detail:
                  "Connect to Slack, Teams, Notion, Google Sheets, and 5,000+ apps. Automate assessment triggers and notifications.",
              },
              {
                title: "REST API",
                detail:
                  "Full API with webhooks. Create assessments, pull scores, sync results to your own systems programmatically.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass-strong p-6 rounded-2xl hover:border-orange-500/10 transition-all duration-300"
              >
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Founder */}
        <div className="mt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[3/4] max-w-sm mx-auto lg:mx-0 rounded-2xl overflow-hidden">
              <img
                src="/miles.jpg"
                alt="Miles Cass, Founder of InpromptiFy"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-lg font-bold text-white">Miles Cass</h3>
                <p className="text-sm text-gray-400">Founder and CEO</p>
                <p className="text-xs text-white/30 mt-1">Perth, Western Australia</p>
                <div className="flex items-center gap-3 mt-2">
                  <a
                    href="https://x.com/milesdoesai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-white transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/miles-cass-0a01973b7/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div>
              <span className="section-label">[ The Founder ]</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                Built by someone who lives in AI.
              </h2>
              <div className="mt-6 space-y-4 text-gray-400 leading-relaxed">
                <p>
                  I am Miles Cass from Perth, Western Australia. I spend 17 hours a day on my
                  computer building with AI. Not browsing. Not scrolling. Building.
                </p>
                <p>
                  I started using AI in high school and went full time the day I graduated at 18.
                  While my mates were figuring out uni applications, I was deep in prompt
                  engineering, testing every model that launched, breaking things, learning what
                  actually works and what is just hype.
                </p>
                <p>
                  The idea for InpromptiFy came from watching the gap widen. Companies were spending
                  massive budgets on AI tools, but their employees could barely write a decent prompt.
                  Older workers were stuck on ChatGPT because nobody showed them there were better
                  options for their specific tasks. New hires claimed "AI proficiency" on their
                  resumes with nothing to back it up.
                </p>
                <p>
                  I am building InpromptiFy to change that. To measure, test, compare, and benchmark
                  AI proficiency across every industry. To set the standard that tells employers
                  exactly how capable their team is with AI. And to make sure the next generation of
                  employees does not just use AI, but uses it well.
                </p>
                <p>
                  I also love competition. The idea of a universal scale where people can measure
                  and compare their AI capabilities excites me. Imagine posting your PromptScore
                  on X or LinkedIn and seeing how you stack up against others in your field. Not
                  a vanity metric. A real, verified measure of how well you use the most important
                  technology of our generation. That is the future I am building.
                </p>
                <p>
                  No VC money. No board meetings. No one telling me to water it down. Just relentless
                  focus on building the most accurate AI proficiency assessment on the market.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="glass-strong rounded-2xl p-8 sm:p-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white">
              See where your team stands
            </h2>
            <p className="text-gray-400 mt-3">
              Take the free 3-minute assessment. No account required. Get your PromptScore instantly.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/assess"
                className="glow-btn px-8 py-3 text-sm font-medium inline-block text-center"
              >
                Start Free Assessment
              </Link>
              <Link
                href="/contact"
                className="ghost-btn px-8 py-3 text-sm inline-block text-center"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
