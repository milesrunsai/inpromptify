import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features",
  description:
    "IRT-calibrated adaptive testing, five-dimension scoring, anti-cheat architecture, role-specific assessments, and enterprise integrations. See how Inpromptify measures real AI proficiency.",
};

const heroFeatures = [
  {
    title: "Adaptive Assessment Engine",
    description:
      "Our engine tracks your ability in real-time using theta estimation, built on Item Response Theory (IRT) — the same psychometric framework behind the GMAT, GRE, and medical licensing exams. Each question is selected based on your performance so far, targeting your weakest dimensions and adjusting difficulty dynamically. No two assessments are the same.",
    details: [
      "IRT-calibrated theta tracking adjusts difficulty after every answer",
      "Branching question paths based on dimension coverage gaps",
      "Confidence-weighted scoring using response time as a signal",
      "Terminates intelligently when your score stabilizes (8-12 questions)",
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    imageAlt: "Data analytics dashboard",
  },
  {
    title: "Five-Dimension Scoring",
    description:
      "A single number does not capture AI proficiency. Inpromptify scores across five distinct dimensions that map to real-world AI usage patterns. Each dimension is weighted based on the role template selected.",
    details: [
      "Prompt Engineering — clarity, specificity, and structure of instructions",
      "Model Selection — choosing the right model for the task and budget",
      "AI Ethics — responsible use, bias awareness, and safety practices",
      "Practical Application — solving real problems with AI tools effectively",
      "Emerging Tech — staying current with new models, tools, and techniques",
    ],
    image: "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=800&q=80",
    imageAlt: "AI neural network visualization",
  },
];

const featureGrid = [
  {
    category: "Assessment",
    items: [
      {
        title: "100+ Question Bank",
        description:
          "Curated questions testing applied AI judgment, not definitions. Covers prompt engineering, RAG, agents, evaluation, safety, workflow optimization, and more. Questions updated within 48 hours of new model releases.",
      },
      {
        title: "8 Role Templates",
        description:
          "Pre-built assessment profiles for Software Engineers, Data Scientists, Product Managers, Marketing Strategists, Finance Analysts, Clinical Researchers, Legal Professionals, and HR. Each template adjusts scoring weights to match what matters for that role.",
      },
      {
        title: "Anti-Cheat System",
        description:
          "Tab-switch detection, paste prevention, minimum answer time enforcement, seeded option randomization, and behavioral signal tracking. Every assessment generates an integrity score that flags suspicious patterns.",
      },
      {
        title: "PromptScore Credential",
        description:
          "A verified 0-100 score that candidates can share on LinkedIn and X. Includes a five-dimension radar chart breakdown, hire/no-hire recommendation, and shareable results card. The standardized measure of AI fluency.",
      },
    ],
  },
  {
    category: "Analytics and Reporting",
    items: [
      {
        title: "Team Dashboard",
        description:
          "Organization-wide view of AI proficiency. Average scores, dimension breakdowns per department, skill gap identification, and improvement tracking over time. See exactly where your team needs training.",
      },
      {
        title: "Theta Progression Charts",
        description:
          "Visualize how difficulty adapted during each assessment. The theta curve shows exactly how the engine zeroed in on a candidate's true ability level, providing transparency into the scoring process.",
      },
      {
        title: "Benchmarking",
        description:
          "Compare your team's scores against industry averages. Understand where you stand relative to other companies in your sector. Identify whether your hiring bar is above or below market.",
      },
      {
        title: "Export and API",
        description:
          "Full REST API with webhook notifications. Export results to CSV, connect to your BI tools (Power BI, Tableau), or pipe scores directly into your ATS via Zapier or native integrations.",
      },
    ],
  },
  {
    category: "Enterprise Security",
    items: [
      {
        title: "SSO and SCIM",
        description:
          "SAML 2.0, Okta, Azure AD, and Google Workspace. SCIM provisioning for automatic user sync. Enterprise-grade auth from day one.",
      },
      {
        title: "SOC 2 Ready",
        description:
          "Enterprise-grade data handling, encryption at rest and in transit, audit logging, and compliance-ready infrastructure. Built on Neon PostgreSQL with Vercel edge deployment.",
      },
      {
        title: "Bias Audit Framework",
        description:
          "Differential Item Functioning (DIF) analysis to detect questions that unfairly advantage or disadvantage specific groups. IRT calibration pipeline ensures psychometric validity as the question bank grows.",
      },
      {
        title: "Rate Limiting and Abuse Protection",
        description:
          "IP-based and email-based rate limiting on all public endpoints. Assessment attempt caps prevent gaming. Behavioral anomaly detection flags suspicious usage patterns for review.",
      },
    ],
  },
  {
    category: "Integrations",
    items: [
      {
        title: "ATS Platforms",
        description:
          "Greenhouse, Lever, Workday, BambooHR, and Ashby. Embed assessments directly into your hiring pipeline. Pull candidates, send assessments, and push scores back automatically.",
      },
      {
        title: "Learning Management",
        description:
          "Canvas, Moodle, and Blackboard via LTI 1.3. Embed Inpromptify assessments inside your existing LMS for seamless upskilling and certification workflows.",
      },
      {
        title: "Automation",
        description:
          "Zapier and Make.com connectors for Slack, Teams, Notion, Google Sheets, email, and 5,000+ apps. Trigger assessments, sync results, and automate notifications without code.",
      },
      {
        title: "Developer API",
        description:
          "Full REST API with TypeScript and Python SDKs. Webhook events for assessment.completed, score.updated, and credits.low. OpenAPI spec and Postman collection available.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="section-label">[ Features ]</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2 text-white leading-tight">
            The complete AI proficiency assessment platform
          </h1>
          <p className="text-lg text-gray-400 mt-6 leading-relaxed">
            Not another quiz tool. Inpromptify is a psychometrically-designed adaptive
            engine that measures how well people actually use AI — across every model,
            every workflow, and every role.
          </p>
        </div>

        {/* Hero Features — alternating image/text */}
        <div className="mt-20 space-y-24">
          {heroFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "order-2 lg:order-1" : ""}>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {feature.title}
                </h2>
                <p className="text-gray-400 mt-4 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {feature.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                      <span className="text-sm text-gray-400">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden ${index % 2 === 1 ? "order-1 lg:order-2" : ""}`}>
                <img
                  src={feature.image}
                  alt={feature.imageAlt}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
              </div>
            </div>
          ))}
        </div>

        {/* IRT-Calibrated Scoring */}
        <div className="mt-24">
          <h2 className="text-xs font-medium uppercase tracking-wider text-orange-400/60 mb-6">
            Methodology
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-base font-semibold text-white mb-2">IRT-Calibrated Scoring</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Item Response Theory (IRT) is the gold standard in psychometric assessment — the same methodology used by the GMAT, GRE, USMLE, and other high-stakes standardized tests. Each question in our bank has calibrated difficulty and discrimination parameters. Your ability estimate (theta) updates after every response, converging on your true proficiency level with mathematical precision. This means fewer questions, more accurate scores, and defensible results for hiring decisions.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-base font-semibold text-white mb-2">Model Knowledge Flywheel</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The AI landscape moves fast. When a new model launches — Claude Opus 4.7, GPT-5.4, Gemini 3.1 Pro — our question bank updates within 48 hours. We track 50+ AI models across all major providers. New capabilities, API changes, and best practices are reflected in assessment questions automatically. Your assessments always measure current, relevant AI knowledge — not last year's landscape.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-base font-semibold text-white mb-2">Anti-Cheat Architecture</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Traditional MCQ assessments are easy to game. Inpromptify uses free-text prompt evaluation alongside multiple choice — candidates must demonstrate they can actually write effective prompts, not just recognize correct answers. Combined with tab-switch detection, paste prevention, response time analysis, and behavioral pattern matching, our integrity system ensures assessment results you can trust for real hiring decisions.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-base font-semibold text-white mb-2">Role-Specific Assessments</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                AI proficiency looks different for every role. Our 6 role categories — Software Engineers, Product Managers, Data Scientists, Marketing, Executives, and HR/Talent — each have calibrated scoring weights across 5 dimensions: Prompt Engineering, Model Selection, AI Ethics, Practical Application, and Emerging Tech. A PM and an engineer take the same platform but are measured on what matters for their function.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Grid by Category */}
        <div className="mt-24 space-y-16">
          {featureGrid.map((category) => (
            <div key={category.category}>
              <h2 className="text-xs font-medium uppercase tracking-wider text-orange-400/60 mb-6">
                {category.category}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {category.items.map((item) => (
                  <div
                    key={item.title}
                    className="glass-strong p-6 rounded-2xl hover:border-orange-500/10 transition-all duration-300"
                  >
                    <h3 className="text-base font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            How it works
          </h2>
          <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto">
            From first click to verified PromptScore in under 15 minutes.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {[
              {
                step: "01",
                title: "Enter your email",
                description: "No account needed. Just an email to track your score and prevent repeat gaming.",
              },
              {
                step: "02",
                title: "Select your role",
                description: "Choose from 8 role templates or take the general assessment. Scoring weights adjust to match.",
              },
              {
                step: "03",
                title: "Answer adaptive questions",
                description: "8-12 IRT-calibrated questions that adjust in real-time. The engine finds your exact level without wasting time on questions that are too easy or too hard.",
              },
              {
                step: "04",
                title: "Get your PromptScore",
                description: "Instant results with radar chart, 5-dimension breakdown, hire recommendation, and shareable credential for LinkedIn and X.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass-strong p-6 rounded-2xl"
              >
                <div className="text-2xl font-bold text-orange-500 mb-3">{item.step}</div>
                <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="glass-strong rounded-2xl p-8 sm:p-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white">
              See it in action
            </h2>
            <p className="text-gray-400 mt-3">
              Take the free assessment. No account required.
              Get your PromptScore instantly.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/assess"
                className="glow-btn px-8 py-3 text-sm font-medium inline-block text-center"
              >
                Start Free Assessment
              </Link>
              <a
                href="mailto:enterprise@inpromptify.com"
                className="ghost-btn px-8 py-3 text-sm inline-block text-center"
              >
                Book a Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
