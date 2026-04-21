"use client";
import { useState } from "react";
import Link from "next/link";

const codeExamples = [
  {
    label: "Python",
    code: `import inpromptify

client = inpromptify.Client(api_key="your-api-key")

# Create an assessment
assessment = client.assessments.create(
    title="AI Fundamentals",
    difficulty="adaptive",
    questions=25,
    categories=["prompting", "architecture", "safety"]
)

# Send to candidate
invite = client.invites.send(
    assessment_id=assessment.id,
    email="candidate@example.com"
)

print(f"Assessment URL: {invite.url}")`,
  },
  {
    label: "TypeScript",
    code: `import { InpromptiFy } from "@inpromptify/sdk";

const client = new InpromptiFy({ apiKey: "your-api-key" });

// Create an assessment
const assessment = await client.assessments.create({
  title: "AI Fundamentals",
  difficulty: "adaptive",
  questions: 25,
  categories: ["prompting", "architecture", "safety"],
});

// Send to candidate
const invite = await client.invites.send({
  assessmentId: assessment.id,
  email: "candidate@example.com",
});

console.log(\`Assessment URL: \${invite.url}\`);`,
  },
  {
    label: "cURL",
    code: `# Create an assessment
curl -X POST https://api.inpromptify.com/v1/assessments \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "AI Fundamentals",
    "difficulty": "adaptive",
    "questions": 25,
    "categories": ["prompting", "architecture", "safety"]
  }'

# Send invite
curl -X POST https://api.inpromptify.com/v1/invites \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "assessment_id": "asmt_abc123",
    "email": "candidate@example.com"
  }'`,
  },
];

export default function CTASection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="reveal text-center mb-12">
          <span className="section-label">[ Get Started ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4 text-white">
            Get started in <span className="text-orange-500">seconds</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Integrate InpromptiFy into your workflow with our simple API. SDKs
            available for Python, TypeScript, and more.
          </p>
        </div>

        <div className="reveal stagger-1 glass-strong rounded-2xl overflow-hidden">
          <div className="flex items-center gap-1 px-4 py-3 border-b border-white/[0.06]">
            {codeExamples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                  activeTab === i
                    ? "bg-orange-500/10 text-orange-400"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="text-sm text-white/60 font-mono leading-relaxed">
              <code>{codeExamples[activeTab].code}</code>
            </pre>
          </div>
        </div>

        <div className="reveal stagger-2 text-center mt-10">
          <Link href="/signup" className="glow-btn px-10 py-4 text-base">
            Start for free
          </Link>
          <p className="mt-4 text-xs text-white/30">
            No credit card required -- Free tier includes unlimited practice assessments
          </p>
        </div>
      </div>
    </section>
  );
}
