import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Adaptive testing, five-dimension scoring, team analytics, anti-cheat, and enterprise integrations. See how InpromptiFy measures real AI proficiency.",
};

const heroFeatures = [
  {
    title: "Adaptive Assessment Engine",
    description:
      "Our engine tracks your ability in real-time using theta estimation. Each question is selected based on your performance so far, targeting your weakest dimensions and adjusting difficulty dynamically. No two assessments are the same.",
    details: [
      "Real-time theta tracking adjusts difficulty after every answer",
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
      "A single number does not capture AI proficiency. InpromptiFy scores across five distinct dimensions that map to real-world AI usage patterns. Each dimension is weighted based on the role template selected.",
    details: [
      "Prompt Quality — clarity, specificity, and structure of instructions",
      "Efficiency — token usage optimization and concise prompting",
      "Speed — ability to produce correct answers under time pressure",
      "Response Quality — accuracy evaluation and hallucination detection",
      "Iteration Intelligence — refining outputs through follow-up prompts",
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
          "Curated questions testing applied AI judgment, not definitions. Covers prompt engineering, RAG, agents, evaluation, safety, workflow optimization, and more. Auto-refreshed weekly via LLM generation with human review.",
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
          "SAML 2.0, Okta, Azure AD, and Google Workspace. SCIM provisioning for automatic user sync. Built on Clerk with enterprise-grade auth from day one.",
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
          "Canvas, Moodle, and Blackboard via LTI 1.3. Embed InpromptiFy assessments inside your existing LMS for seamless upskilling and certification workflows.",
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
            The complete AI proficiency{" "}
            <span className="gradient-text">assessment platform</span>
          </h1>
          <p className="text-lg text-gray-400 mt-6 leading-relaxed">
            Not another quiz tool. InpromptiFy is a psychometrically-designed adaptive
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
            From first click to verified PromptScore in under 3 minutes.
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
                description: "8-12 questions that adjust in real-time. The engine finds your exact level without wasting time on questions that are too easy or too hard.",
              },
              {
                step: "04",
                title: "Get your PromptScore",
                description: "Instant results with radar chart, dimension breakdown, hire recommendation, and shareable credential for LinkedIn and X.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass-strong p-6 rounded-2xl"
              >
                <div className="text-2xl font-bold gradient-text mb-3">{item.step}</div>
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
              Take the free 3-minute assessment. No account required.
              Get your PromptScore instantly.
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
