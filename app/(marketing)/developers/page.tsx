import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developers",
  description:
    "API documentation, webhook events, SDK snippets, and Postman collection for the InpromptiFy assessment platform.",
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
    code: `import { InpromptiFy } from "@inpromptify/sdk";

const client = new InpromptiFy({
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
    code: `from inpromptify import InpromptiFy

client = InpromptiFy(api_key=os.environ["INPROMPTIFY_API_KEY"])

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
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Developer Documentation
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            REST API, webhook events, and SDK clients. Everything you need to
            integrate AI proficiency assessment into your workflow.
          </p>
        </div>
      </section>

      {/* API Overview */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight">API Overview</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <h3 className="font-semibold">Base URL</h3>
              <code className="mt-2 block text-sm text-primary">
                https://api.inpromptify.com/v1
              </code>
              <p className="mt-3 text-sm text-muted-foreground">
                All API requests use HTTPS. Authentication via Bearer token in
                the Authorization header.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <h3 className="font-semibold">Authentication</h3>
              <code className="mt-2 block text-sm text-muted-foreground">
                Authorization: Bearer sk_live_...
              </code>
              <p className="mt-3 text-sm text-muted-foreground">
                API keys are scoped to your organization. Generate keys from
                the dashboard under Settings.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <h3 className="font-semibold">Rate Limits</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                100 requests/minute for standard endpoints. Assessment creation
                is limited to your plan&apos;s credit allocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight">Key Endpoints</h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-border/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-card">
                  <th className="px-6 py-3 text-left font-semibold">Method</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Endpoint
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[
                  {
                    method: "POST",
                    endpoint: "/assessments",
                    desc: "Create a new assessment",
                  },
                  {
                    method: "GET",
                    endpoint: "/assessments/:id",
                    desc: "Get assessment details and scores",
                  },
                  {
                    method: "GET",
                    endpoint: "/assessments",
                    desc: "List assessments (paginated)",
                  },
                  {
                    method: "GET",
                    endpoint: "/org/analytics",
                    desc: "Aggregate team analytics",
                  },
                  {
                    method: "POST",
                    endpoint: "/webhooks",
                    desc: "Register a webhook endpoint",
                  },
                ].map((row) => (
                  <tr key={row.endpoint} className="bg-card/50">
                    <td className="px-6 py-3">
                      <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                        {row.method}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono text-muted-foreground">
                      {row.endpoint}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {row.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Webhooks */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight">Webhook Events</h2>
          <p className="mt-3 text-muted-foreground">
            Configure webhook endpoints in your dashboard. All payloads are
            signed with HMAC-SHA256 for verification.
          </p>
          <div className="mt-8 space-y-6">
            {webhookEvents.map((wh) => (
              <div
                key={wh.event}
                className="rounded-xl border border-border/50 bg-card"
              >
                <div className="border-b border-border/50 px-6 py-4">
                  <code className="text-sm font-semibold text-primary">
                    {wh.event}
                  </code>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {wh.description}
                  </p>
                </div>
                <pre className="overflow-x-auto p-6 text-sm text-muted-foreground">
                  <code>{wh.payload}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDK Snippets */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight">
            Quickstart SDKs
          </h2>
          <p className="mt-3 text-muted-foreground">
            Official client libraries for TypeScript and Python. Install and
            start making API calls in under a minute.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {sdkSnippets.map((snippet) => (
              <div
                key={snippet.language}
                className="rounded-xl border border-border/50 bg-card"
              >
                <div className="border-b border-border/50 px-6 py-3">
                  <span className="text-sm font-semibold">
                    {snippet.language}
                  </span>
                </div>
                <pre className="overflow-x-auto p-6 text-sm text-muted-foreground">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Postman */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Postman Collection
            </h2>
            <p className="mt-3 text-muted-foreground">
              Import our Postman collection to explore the API interactively.
              Includes pre-configured environments for sandbox and production.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Collection available after sign-up in your developer settings.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
