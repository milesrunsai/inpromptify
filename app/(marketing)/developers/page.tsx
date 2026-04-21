import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developers",
  description:
    "API documentation, webhook events, SDK snippets, and Postman collection for the Inpromptify assessment platform.",
};

const webhookEvents = [
  {
    event: "assessment.created",
    description: "Fired when a new assessment is initiated for a candidate.",
    payload: `{
  "event": "assessment.created",
  "data": {
    "id": "asm_abc123",
    "orgId": "org_xyz",
    "candidateEmail": "candidate@example.com",
    "status": "PENDING",
    "createdAt": "2026-04-20T12:00:00Z"
  }
}`,
  },
  {
    event: "assessment.completed",
    description:
      "Fired when a candidate finishes the assessment. Includes the full score breakdown.",
    payload: `{
  "event": "assessment.completed",
  "data": {
    "id": "asm_abc123",
    "score": 82,
    "dimensionScores": {
      "promptQuality": 85,
      "contextAwareness": 78,
      "iterationStrategy": 80,
      "outputEvaluation": 88,
      "toolOrchestration": 79
    },
    "completedAt": "2026-04-20T12:15:00Z"
  }
}`,
  },
  {
    event: "score.updated",
    description:
      "Fired when a score is recalculated (e.g., after review or recalibration).",
    payload: `{
  "event": "score.updated",
  "data": {
    "id": "asm_abc123",
    "previousScore": 78,
    "score": 82,
    "updatedAt": "2026-04-20T14:00:00Z"
  }
}`,
  },
];

const sdkSnippets = [
  {
    language: "TypeScript",
    code: `import { Inpromptify } from "@inpromptify/sdk";

const client = new Inpromptify({
  apiKey: process.env.INPROMPTIFY_API_KEY,
});

// Create an assessment
const assessment = await client.assessments.create({
  candidateEmail: "candidate@example.com",
  templateId: "default",
});

// Get results
const result = await client.assessments.get(assessment.id);
console.log(result.score);          // 82
console.log(result.dimensionScores); // { promptQuality: 85, ... }`,
  },
  {
    language: "Python",
    code: `from inpromptify import Inpromptify

client = Inpromptify(api_key=os.environ["INPROMPTIFY_API_KEY"])

# Create an assessment
assessment = client.assessments.create(
    candidate_email="candidate@example.com",
    template_id="default",
)

# Get results
result = client.assessments.get(assessment.id)
print(result.score)            # 82
print(result.dimension_scores) # {"prompt_quality": 85, ...}`,
  },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="section-label">[ Developers ]</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mt-2">
            Developer Documentation
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-400">
            REST API, webhook events, and SDK clients. Everything you need to
            integrate AI proficiency assessment into your workflow.
          </p>
        </div>

        {/* API Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-white">API Overview</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="font-semibold text-white">Base URL</h3>
              <code className="mt-2 block text-sm text-orange-400">
                https://api.inpromptify.com/v1
              </code>
              <p className="mt-3 text-sm text-gray-400">
                All API requests use HTTPS. Authentication via Bearer token in
                the Authorization header.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="font-semibold text-white">Authentication</h3>
              <code className="mt-2 block text-sm text-gray-400 font-mono">
                Authorization: Bearer sk_live_...
              </code>
              <p className="mt-3 text-sm text-gray-400">
                API keys are scoped to your organization. Generate keys from
                the dashboard under Settings.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="font-semibold text-white">Rate Limits</h3>
              <p className="mt-2 text-sm text-gray-400">
                100 requests/minute for standard endpoints. Assessment creation
                is limited to your plan&apos;s credit allocation.
              </p>
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-white">Key Endpoints</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold text-white">Method</th>
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold text-white">Endpoint</th>
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold text-white hidden sm:table-cell">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {[
                  { method: "POST", endpoint: "/assessments", desc: "Create a new assessment" },
                  { method: "GET", endpoint: "/assessments/:id", desc: "Get assessment details and scores" },
                  { method: "GET", endpoint: "/assessments", desc: "List assessments (paginated)" },
                  { method: "GET", endpoint: "/org/analytics", desc: "Aggregate team analytics" },
                  { method: "POST", endpoint: "/webhooks", desc: "Register a webhook endpoint" },
                ].map((row) => (
                  <tr key={row.endpoint + row.method} className="bg-white/[0.01]">
                    <td className="px-4 sm:px-6 py-3">
                      <span className="rounded bg-orange-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-orange-400">
                        {row.method}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 font-mono text-gray-400">
                      {row.endpoint}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-gray-400 hidden sm:table-cell">
                      {row.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Webhooks */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-white">Webhook Events</h2>
          <p className="mt-3 text-gray-400">
            Configure webhook endpoints in your dashboard. All payloads are
            signed with HMAC-SHA256 for verification.
          </p>
          <div className="mt-8 space-y-6">
            {webhookEvents.map((wh) => (
              <div
                key={wh.event}
                className="glass-strong rounded-2xl overflow-hidden"
              >
                <div className="border-b border-white/[0.06] px-4 sm:px-6 py-4">
                  <code className="text-sm font-semibold text-orange-400">
                    {wh.event}
                  </code>
                  <p className="mt-1 text-sm text-gray-400">
                    {wh.description}
                  </p>
                </div>
                <pre className="overflow-x-auto p-4 sm:p-6 text-sm text-gray-400">
                  <code>{wh.payload}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* SDK Snippets */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Quickstart SDKs
          </h2>
          <p className="mt-3 text-gray-400">
            Official client libraries for TypeScript and Python. Install and
            start making API calls in under a minute.
          </p>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {sdkSnippets.map((snippet) => (
              <div
                key={snippet.language}
                className="glass-strong rounded-2xl overflow-hidden"
              >
                <div className="border-b border-white/[0.06] px-4 sm:px-6 py-3">
                  <span className="text-sm font-semibold text-white">
                    {snippet.language}
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 sm:p-6 text-sm text-gray-400">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Postman */}
        <div className="glass-strong rounded-2xl p-8 sm:p-10 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Postman Collection
          </h2>
          <p className="mt-3 text-gray-400">
            Import our Postman collection to explore the API interactively.
            Includes pre-configured environments for sandbox and production.
          </p>
          <p className="mt-4 text-sm text-white/30">
            Collection available after sign-up in your developer settings.
          </p>
        </div>
      </div>
    </div>
  );
}
