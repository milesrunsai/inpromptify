import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Enterprise AI Skills Assessment & Training Platform",
  description: "Comprehensive AI competency assessment and training solutions for enterprise. IRT-calibrated scoring, role-specific assessments, and workforce AI development.",
  keywords: "enterprise AI assessment, AI skills testing, workforce AI training, AI competency platform, AI hiring assessment, enterprise AI solutions, IRT scoring",
};

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-[#111118] text-white">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-xs font-medium uppercase tracking-wider text-orange-500">[ Enterprise Platform ]</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-4 leading-tight">
            Enterprise AI Competency Platform
          </h1>
          <p className="text-lg text-white/60 mb-4 max-w-3xl mx-auto mt-6">
            Assess, develop, and certify AI skills across your organization.
            Built on Item Response Theory (IRT) — the same psychometric framework behind the GMAT, GRE, and medical licensing boards.
          </p>
          <p className="text-sm text-white/40 max-w-2xl mx-auto mb-8">
            AI Engineer job postings are up 143% year-over-year. Gartner predicts 40% of enterprise applications will include AI agents by end of 2026.
            Your workforce readiness starts here.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="mailto:enterprise@inpromptify.com"
              className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Book a Demo
            </a>
            <a
              href="mailto:enterprise@inpromptify.com"
              className="border border-white/20 text-white px-8 py-4 rounded-lg text-lg hover:bg-white/5 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Value Prop: Assessment → Diagnosis → Training → Platform */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">How InpromptiFy Works for Enterprise</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Assessment", description: "IRT-calibrated adaptive testing measures true AI proficiency across 5 dimensions in under 15 minutes." },
              { step: "02", title: "Diagnosis", description: "Identify skill gaps by role, department, and dimension. Pinpoint exactly where your workforce needs development." },
              { step: "03", title: "Training", description: "Personalized learning paths based on assessment results. Targeted upskilling where it matters most." },
              { step: "04", title: "Platform", description: "Continuous measurement, benchmarking, and certification. Track ROI and progress organization-wide." },
            ].map((item) => (
              <div key={item.step} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <div className="text-2xl font-bold text-orange-500 mb-3">{item.step}</div>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">The Enterprise AI Challenge</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Hiring Challenges</h3>
              <ul className="space-y-2 text-white/50 text-sm">
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">--</span> 66% won't hire without AI skills</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">--</span> $50K+ cost per bad AI hire</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">--</span> No standardized assessment methods</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">--</span> AI Engineer postings up 143% YoY</li>
              </ul>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Workforce Gaps</h3>
              <ul className="space-y-2 text-white/50 text-sm">
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">--</span> 78% lack functional AI literacy</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">--</span> Fragmented training approaches</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">--</span> No measurement of progress</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">--</span> Skills become obsolete rapidly</li>
              </ul>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Competitive Risk</h3>
              <ul className="space-y-2 text-white/50 text-sm">
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">--</span> AI-first competitors emerging</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">--</span> 40% of enterprise apps will include AI agents by 2026</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">--</span> Talent retention challenges</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">--</span> Market position erosion</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Specific Assessments */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">Role-Specific AI Assessments</h2>
          <p className="text-center text-white/50 mb-12 max-w-2xl mx-auto text-sm">
            Each assessment is calibrated for the AI competencies that matter most for the role.
            Scoring weights adjust automatically across 5 dimensions: Prompt Engineering, Model Selection, AI Ethics, Practical Application, and Emerging Tech.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { role: "Software Engineers", desc: "Code generation, debugging with AI, architecture decisions, tool integration, and AI-assisted development workflows." },
              { role: "Product Managers", desc: "AI feasibility assessment, roadmap prioritization, stakeholder communication, and AI-powered product strategy." },
              { role: "Data Scientists", desc: "Model selection, evaluation methodology, RAG architectures, fine-tuning strategy, and production ML pipelines." },
              { role: "Marketing", desc: "AI content generation, campaign optimization, audience analysis, creative workflows, and marketing automation." },
              { role: "Executives", desc: "AI strategy, ROI evaluation, risk assessment, vendor selection, and organizational AI transformation leadership." },
              { role: "HR / Talent", desc: "AI-assisted recruiting, workforce planning, skills gap analysis, training program design, and AI policy development." },
            ].map((item) => (
              <div key={item.role} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-orange-500 mb-2">{item.role}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Coverage */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">Real-Time Model Knowledge</h2>
          <p className="text-center text-white/50 mb-12 max-w-2xl mx-auto text-sm">
            Our question bank updates within 48 hours of new model releases. Assessments always reflect the current AI landscape.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Claude Opus 4.7", provider: "Anthropic", desc: "Extended thinking, advanced reasoning, and complex multi-step tasks." },
              { name: "GPT-5.4", provider: "OpenAI", desc: "Multimodal capabilities, function calling, and enterprise integration patterns." },
              { name: "Gemini 3.1 Pro", provider: "Google", desc: "Long-context processing, grounding, and multi-modal understanding." },
            ].map((model) => (
              <div key={model.name} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-center">
                <p className="text-base font-semibold mb-1">{model.name}</p>
                <p className="text-xs text-orange-500 mb-3">{model.provider}</p>
                <p className="text-sm text-white/50">{model.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-xs mt-6">
            50+ AI models tracked across all major providers. Questions updated within 48 hours of new model releases.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Complete AI Competency Solution</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Assessment & Hiring</h3>
              <ul className="space-y-4">
                {[
                  "IRT-calibrated evaluation across 5 competency dimensions",
                  "ATS integration for seamless candidate screening",
                  "Free-text prompt evaluation — not just multiple choice",
                  "Bias-free, objective competency measurement",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-0.5">--</span>
                    <span className="text-white/60 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Training & Development</h3>
              <ul className="space-y-4">
                {[
                  "Personalized learning paths based on assessment results",
                  "Industry-specific AI application training",
                  "Continuous certification and skill validation",
                  "ROI tracking and progress analytics",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-0.5">--</span>
                    <span className="text-white/60 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Pricing */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">Enterprise Pricing</h2>
          <p className="text-center text-white/50 mb-12 text-sm">
            Built on IRT scoring methodology used by GMAT, GRE, and medical licensing boards.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Starter",
                price: "$10K",
                period: "/year",
                features: ["500 assessments/year", "5 role templates", "Team dashboard", "CSV export", "Email support"],
              },
              {
                name: "Professional",
                price: "$25K",
                period: "/year",
                features: ["2,000 assessments/year", "All role templates", "Advanced analytics", "ATS integrations", "Priority support"],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "$50K",
                period: "/year",
                features: ["Unlimited assessments", "Custom templates", "SSO + SCIM", "White-label option", "Dedicated success manager"],
              },
              {
                name: "Custom",
                price: "$100K+",
                period: "/year",
                features: ["Everything in Enterprise", "On-premise deployment", "Custom integrations", "SLA guarantee", "Executive briefings"],
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 flex flex-col ${
                  "highlighted" in tier && tier.highlighted
                    ? "bg-white/[0.06] ring-2 ring-orange-500 shadow-xl shadow-orange-500/10"
                    : "bg-white/[0.03] border border-white/[0.08]"
                }`}
              >
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-xs text-white/30">{tier.period}</span>
                </div>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-orange-500 mt-0.5">--</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:enterprise@inpromptify.com"
                  className="mt-6 block w-full text-center rounded-lg py-2.5 text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Contact Sales
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your AI Capabilities?</h2>
          <p className="text-white/50 mb-8 text-sm">
            Join enterprises building AI-competitive workforces with InpromptiFy.
            IRT-calibrated assessments across 6 role categories, 5 scoring dimensions, and 50+ tracked AI models.
          </p>
          <a
            href="mailto:enterprise@inpromptify.com"
            className="bg-orange-500 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors inline-block"
          >
            Book a Demo
          </a>
        </div>
      </section>
    </div>
  );
}
