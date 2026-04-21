import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Features -- InpromptiFy",
  description: "Everything you need to assess AI proficiency. Adaptive testing, skill mapping, real-time scoring, custom assessments, team analytics, and certifications.",
};

const features = [
  {
    title: "Adaptive Testing Engine",
    desc: "AI-powered difficulty adjustment that finds your exact skill level in half the time.",
  },
  {
    title: "Skill Radar Charts",
    desc: "Multi-dimensional proficiency visualization across AI competency areas.",
  },
  {
    title: "Real-time Scoring",
    desc: "Instant results with detailed breakdowns, percentiles, and improvement suggestions.",
  },
  {
    title: "Assessment Builder",
    desc: "Drag-and-drop editor with AI-assisted question generation and 10K+ question bank.",
  },
  {
    title: "Team Dashboards",
    desc: "Organization-wide analytics, department comparisons, and training ROI tracking.",
  },
  {
    title: "Digital Certifications",
    desc: "Verifiable badges with unique URLs, LinkedIn integration, and custom branding.",
  },
  {
    title: "API & Webhooks",
    desc: "RESTful API, real-time webhooks, and SDKs in Python, TypeScript, and Go.",
  },
  {
    title: "LMS Integrations",
    desc: "Native integrations with Canvas, Moodle, Blackboard, and custom LTI support.",
  },
  {
    title: "Anti-Cheat & Proctoring",
    desc: "Browser lockdown, copy-paste detection, and optional AI-powered proctoring.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#111118] min-h-screen pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <span className="section-label">[ Features ]</span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-2 text-white">
              Everything you need to{" "}
              <span className="gradient-text">assess AI proficiency</span>
            </h1>
            <p className="text-lg text-white/40 mt-6 leading-relaxed">
              From adaptive testing to verifiable certifications, InpromptiFy provides
              the complete toolkit for measuring and validating AI skills at any scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
            {features.map((f) => (
              <div key={f.title} className="glass-strong p-6 rounded-2xl">
                <h3 className="text-base font-semibold mb-2 text-white">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
