import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const INTEGRATIONS = [
  {
    category: "Applicant Tracking Systems",
    platforms: [
      { name: "Greenhouse", desc: "Send assessment links from Greenhouse. Results sync back as scorecards.", status: "api" },
      { name: "Lever", desc: "Trigger assessments from Lever pipeline stages. Scores appear in candidate profiles.", status: "api" },
      { name: "Ashby", desc: "Integrate via API to embed assessments into your Ashby hiring workflow.", status: "api" },
      { name: "Workable", desc: "Add AI proficiency testing as an assessment step in Workable.", status: "api" },
      { name: "BambooHR", desc: "Connect assessments to BambooHR candidate records via webhook.", status: "api" },
      { name: "SmartRecruiters", desc: "Embed InpromptiFy assessments in SmartRecruiters pipelines.", status: "coming" },
    ],
  },
  {
    category: "HR Platforms",
    platforms: [
      { name: "Rippling", desc: "Assess employee AI skills during onboarding or internal training.", status: "api" },
      { name: "Deel", desc: "Add AI proficiency screening for remote hiring workflows.", status: "api" },
      { name: "Gusto", desc: "Integrate AI skill assessments into your Gusto HR pipeline.", status: "coming" },
    ],
  },
  {
    category: "Recruitment Agencies",
    platforms: [
      { name: "Bullhorn", desc: "Add verified PromptScores to candidate profiles in Bullhorn.", status: "api" },
      { name: "JobAdder", desc: "Trigger assessments and receive results in JobAdder.", status: "api" },
      { name: "Vincere", desc: "Embed AI proficiency data in Vincere candidate records.", status: "coming" },
    ],
  },
  {
    category: "Communication & Workflow",
    platforms: [
      { name: "Slack", desc: "Get real-time notifications when candidates complete assessments.", status: "webhook" },
      { name: "Microsoft Teams", desc: "Push assessment results and alerts to Teams channels.", status: "webhook" },
      { name: "Zapier", desc: "Connect InpromptiFy to 5,000+ apps. Trigger workflows on assessment events.", status: "webhook" },
      { name: "Make (Integromat)", desc: "Build custom automations with assessment data via webhooks.", status: "webhook" },
    ],
  },
  {
    category: "Assessment Platforms",
    platforms: [
      { name: "TestGorilla", desc: "Complement TestGorilla's skill tests with live AI proficiency scoring.", status: "api" },
      { name: "Codility", desc: "Add AI-assisted coding assessments alongside traditional code tests.", status: "coming" },
      { name: "HackerRank", desc: "Pair HackerRank coding tests with InpromptiFy AI proficiency scores.", status: "coming" },
    ],
  },
];

const STATUS_STYLES: Record<string, { label: string; style: string }> = {
  api: { label: "API Ready", style: "text-orange-300 bg-orange-400/[0.08] border-orange-400/20" },
  webhook: { label: "Via Webhooks", style: "text-violet-400 bg-violet-500/[0.06] border-violet-500/15" },
  coming: { label: "Coming Soon", style: "text-gray-500 bg-white/[0.03] border-white/[0.06]" },
};

export default function IntegrationsPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#0A0F1C] min-h-screen">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-[11px] font-mono text-orange-400/70 uppercase tracking-wider mb-3">Integrations</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Connect InpromptiFy to your hiring stack
            </h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
              Use our REST API and webhooks to integrate AI proficiency assessments into any
              ATS, HR platform, or recruitment tool. No vendor lock-in.
            </p>
          </div>

          {/* How Integration Works */}
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden mb-16">
            <div className="bg-[#0C1120] p-7">
              <span className="text-[11px] font-mono text-gray-600 block mb-4">REST API</span>
              <h3 className="text-base font-semibold text-white mb-2">Create + Invite + Score</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Create assessments, send invite links, and retrieve scored results — all via API.
                Full CRUD operations on tests and candidates.
              </p>
            </div>
            <div className="bg-[#0C1120] p-7">
              <span className="text-[11px] font-mono text-gray-600 block mb-4">Webhooks</span>
              <h3 className="text-base font-semibold text-white mb-2">Real-time event push</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Receive instant notifications when candidates complete tests, scores are calculated,
                or invitations are sent. HMAC-signed payloads for security.
              </p>
            </div>
            <div className="bg-[#0C1120] p-7">
              <span className="text-[11px] font-mono text-gray-600 block mb-4">Embed</span>
              <h3 className="text-base font-semibold text-white mb-2">White-label assessments</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Embed the assessment experience directly in your platform with customizable branding.
                Business and Enterprise plans.
              </p>
            </div>
          </div>

          {/* Platform Grid */}
          {INTEGRATIONS.map((category) => (
            <div key={category.category} className="mb-12">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{category.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.platforms.map((platform) => {
                  const statusConfig = STATUS_STYLES[platform.status];
                  return (
                    <div key={platform.name} className="bg-[#0C1120] border border-white/[0.06] rounded-lg p-5 hover:border-white/[0.12] transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-white">{platform.name}</h3>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${statusConfig.style}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{platform.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* API Quick Start */}
          <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-8 mb-12">
            <h2 className="text-lg font-bold text-white mb-2">Quick Start</h2>
            <p className="text-sm text-gray-500 mb-6">Three API calls to integrate AI proficiency testing into your pipeline.</p>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-orange-300 bg-orange-400/10 px-1.5 py-0.5 rounded">1. CREATE</span>
                  <code className="text-sm text-white">POST /api/v1/tests/create</code>
                </div>
                <pre className="bg-white/[0.02] rounded-md p-3 text-[12px] text-gray-400 overflow-x-auto">{`curl -X POST https://inpromptify.com/api/v1/tests/create \\
  -H "Authorization: Bearer sk-inp-..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "AI Proficiency Screen",
    "taskPrompt": "Write a marketing email for a B2B SaaS launch",
    "maxAttempts": 3,
    "timeLimitMinutes": 10,
    "tokenBudget": 2000
  }'`}</pre>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">2. INVITE</span>
                  <code className="text-sm text-white">POST /api/v1/tests/:id/invite</code>
                </div>
                <pre className="bg-white/[0.02] rounded-md p-3 text-[12px] text-gray-400 overflow-x-auto">{`curl -X POST https://inpromptify.com/api/v1/tests/42/invite \\
  -H "Authorization: Bearer sk-inp-..." \\
  -d '{"email": "candidate@company.com", "name": "Jane Smith"}'`}</pre>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">3. RESULTS</span>
                  <code className="text-sm text-white">GET /api/v1/tests/:id/results</code>
                </div>
                <pre className="bg-white/[0.02] rounded-md p-3 text-[12px] text-gray-400 overflow-x-auto">{`// Response
{
  "candidates": [
    {
      "name": "Jane Smith",
      "email": "candidate@company.com",
      "score": 82,
      "grade": "A",
      "percentile": 78,
      "dimensions": {
        "promptQuality": 88,
        "efficiency": 76,
        "speed": 85,
        "responseQuality": 80,
        "iterationIQ": 74
      },
      "recommendation": "Strong Hire",
      "completedAt": "2026-03-04T12:00:00Z"
    }
  ]
}`}</pre>
              </div>
            </div>
          </div>

          {/* Webhook Events */}
          <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-8 mb-12">
            <h2 className="text-lg font-bold text-white mb-2">Webhook Events</h2>
            <p className="text-sm text-gray-500 mb-6">Subscribe to events and receive real-time HTTPS POST notifications.</p>
            <div className="space-y-3">
              {[
                { event: "test.created", desc: "Fired when a new assessment is created via API or dashboard" },
                { event: "candidate.invited", desc: "Fired when a candidate receives an assessment invitation" },
                { event: "candidate.scored", desc: "Fired when a candidate completes an assessment and is scored" },
                { event: "test.completed", desc: "Fired when all invited candidates have completed an assessment" },
              ].map((evt) => (
                <div key={evt.event} className="flex items-start gap-4 bg-white/[0.02] rounded-lg px-4 py-3">
                  <code className="text-[12px] font-mono text-orange-400 shrink-0 mt-0.5">{evt.event}</code>
                  <p className="text-[13px] text-gray-500">{evt.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-[12px] text-gray-600 mb-2">All webhook payloads are signed with HMAC-SHA256:</p>
              <pre className="bg-white/[0.02] rounded-md p-3 text-[12px] text-gray-400 overflow-x-auto">{`// Verify signature
const signature = crypto
  .createHmac("sha256", webhookSecret)
  .update(requestBody)
  .digest("hex");

if (signature === request.headers["x-inpromptify-signature"].replace("sha256=", "")) {
  // Valid webhook
}`}</pre>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to integrate?</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
              API access is available on Business plans and above. Start with a free account and upgrade when you need programmatic access.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                Get API Access
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
