export interface RolePack {
  id: string;
  label: string;
  desc: string;
  title: string;
  description: string;
  taskPrompt: string;
  expectedOutcomes: string;
  difficulty: string;
  timeLimitMinutes: number;
  maxAttempts: number;
  tokenBudget: number;
  model: string;
  testType: string;
  scoringWeights: { accuracy: number; efficiency: number; speed: number };
  customCriteria: Array<{
    id: string;
    name: string;
    description: string;
    type: "rubric" | "keyword" | "tone" | "length";
    weight: number;
    config: Record<string, unknown>;
  }>;
}

export const ROLE_PACKS: RolePack[] = [
  {
    id: "sales",
    label: "Sales / BDR",
    desc: "Cold outreach email to enterprise prospects",
    title: "Write a Cold Outreach Email to an Enterprise CTO",
    description: "Tests ability to prompt AI for professional sales outreach that drives meetings.",
    taskPrompt: `You are a Business Development Representative at a B2B SaaS company that sells an AI-powered data integration platform called "DataFlow Pro." Your target is CTOs at companies with 500+ employees.

Write a cold outreach email to a CTO who has never heard of your product. The email must:
- Have a compelling subject line
- Reference a specific pain point (data silos, manual ETL, compliance risks)
- Include a clear value proposition with a quantified benefit
- End with a soft call-to-action (not "buy now" — think "15 min chat")
- Be under 200 words in the body
- Sound human, not templated

Use the AI to iterate until you have an email you'd actually send.`,
    expectedOutcomes: "A professional cold email with subject line, personalized opening, clear value prop with metrics, and a soft CTA. Should feel human and specific, not generic.",
    difficulty: "intermediate",
    timeLimitMinutes: 12,
    maxAttempts: 4,
    tokenBudget: 2000,
    model: "claude-haiku",
    testType: "email",
    scoringWeights: { accuracy: 40, efficiency: 30, speed: 30 },
    customCriteria: [
      { id: "rp-s1", name: "Subject Line Quality", description: "Has a compelling, specific subject line that would get opened", type: "rubric", weight: 20, config: {} },
      { id: "rp-s2", name: "Personalization", description: "References specific pain points relevant to CTOs", type: "keyword", weight: 25, config: { mustInclude: ["data", "integration"], mustNotInclude: [] } },
      { id: "rp-s3", name: "Clear CTA", description: "Ends with a soft, specific call to action", type: "rubric", weight: 20, config: {} },
      { id: "rp-s4", name: "Professional Tone", description: "Professional but conversational tone", type: "tone", weight: 15, config: { tone: "professional" } },
      { id: "rp-s5", name: "Conciseness", description: "Email body under 200 words", type: "length", weight: 20, config: { maxWords: 200 } },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    desc: "Product launch blog post and positioning",
    title: "Write a Product Launch Blog Post",
    description: "Tests ability to prompt AI for compelling marketing content with clear positioning.",
    taskPrompt: `You are a Content Marketing Manager launching a new feature for your project management tool: AI-powered task prioritization that automatically re-orders backlogs based on team velocity, deadlines, and dependencies.

Write a blog post announcing this feature. The post must:
- Have an attention-grabbing headline (not clickbait)
- Open with a relatable problem (backlog chaos, missed deadlines)
- Explain the feature in plain language (no jargon)
- Include at least one concrete example or scenario
- End with a CTA to try it (free trial)
- Be 400-600 words
- Target audience: engineering managers and product leads

Use the AI to draft, refine, and polish until it reads like something you'd publish on your company blog.`,
    expectedOutcomes: "A polished blog post with strong headline, problem-solution structure, concrete example, clear feature explanation, and compelling CTA. Should be publishable quality.",
    difficulty: "intermediate",
    timeLimitMinutes: 15,
    maxAttempts: 5,
    tokenBudget: 3000,
    model: "claude-haiku",
    testType: "creative",
    scoringWeights: { accuracy: 35, efficiency: 30, speed: 35 },
    customCriteria: [
      { id: "rp-m1", name: "Headline Quality", description: "Attention-grabbing, specific headline that isn't clickbait", type: "rubric", weight: 20, config: {} },
      { id: "rp-m2", name: "Problem-Solution Structure", description: "Opens with relatable problem, transitions to solution", type: "rubric", weight: 25, config: {} },
      { id: "rp-m3", name: "Concrete Example", description: "Includes at least one specific scenario or use case", type: "rubric", weight: 20, config: {} },
      { id: "rp-m4", name: "Target Length", description: "Post is 400-600 words", type: "length", weight: 15, config: { minWords: 400, maxWords: 600 } },
      { id: "rp-m5", name: "Call to Action", description: "Clear CTA to try the feature", type: "keyword", weight: 20, config: { mustInclude: ["try", "free"], mustNotInclude: [] } },
    ],
  },
  {
    id: "swe",
    label: "Software Engineer",
    desc: "Debug and fix a Python async function",
    title: "Debug a Python Async Connection Pool",
    description: "Tests ability to use AI for systematic debugging of concurrent code.",
    taskPrompt: `You are a senior software engineer debugging a production issue. The following Python async function manages a database connection pool, but it has a race condition that causes connections to leak under high concurrency:

\`\`\`python
import asyncio

class ConnectionPool:
    def __init__(self, max_size=10):
        self.max_size = max_size
        self.connections = []
        self.available = []
    
    async def get_connection(self):
        if self.available:
            conn = self.available.pop()
            return conn
        if len(self.connections) < self.max_size:
            conn = await self._create_connection()
            self.connections.append(conn)
            return conn
        # Wait for available connection
        while not self.available:
            await asyncio.sleep(0.1)
        return self.available.pop()
    
    async def release_connection(self, conn):
        self.available.append(conn)
    
    async def _create_connection(self):
        await asyncio.sleep(0.01)  # Simulate connection creation
        return {"id": len(self.connections), "active": True}
\`\`\`

Use the AI to:
1. Identify the race condition(s)
2. Explain why they occur
3. Provide a corrected version using proper async synchronization
4. Include a brief test to verify the fix works`,
    expectedOutcomes: "Correct identification of race conditions (no lock on shared state, pop() on empty list possible, connection count check not atomic). Fixed version using asyncio.Lock or asyncio.Semaphore. Clear explanation of the concurrency issue.",
    difficulty: "advanced",
    timeLimitMinutes: 20,
    maxAttempts: 4,
    tokenBudget: 3500,
    model: "claude-haiku",
    testType: "code",
    scoringWeights: { accuracy: 45, efficiency: 25, speed: 30 },
    customCriteria: [
      { id: "rp-e1", name: "Bug Identification", description: "Correctly identifies the race condition in get_connection", type: "keyword", weight: 30, config: { mustInclude: ["race condition", "lock"], mustNotInclude: [] } },
      { id: "rp-e2", name: "Explanation Quality", description: "Clear explanation of why the bug occurs under concurrency", type: "rubric", weight: 25, config: {} },
      { id: "rp-e3", name: "Working Fix", description: "Provides corrected code using asyncio.Lock or Semaphore", type: "keyword", weight: 30, config: { mustInclude: ["asyncio", "lock"], mustNotInclude: [] } },
      { id: "rp-e4", name: "Test Included", description: "Includes a test or verification approach", type: "keyword", weight: 15, config: { mustInclude: ["test", "assert"], mustNotInclude: [] } },
    ],
  },
  {
    id: "analyst",
    label: "Data Analyst",
    desc: "SQL query optimization and data insights",
    title: "Optimize a SQL Query and Extract Insights",
    description: "Tests ability to use AI for data analysis, query optimization, and insight generation.",
    taskPrompt: `You are a Data Analyst at an e-commerce company. Your manager has asked you to analyze customer purchasing patterns. You have access to these tables:

- orders (id, customer_id, total_amount, created_at, status)
- customers (id, name, email, signup_date, country)  
- order_items (id, order_id, product_id, quantity, price)
- products (id, name, category, price)

Your tasks:
1. Write a SQL query to find the top 10 customers by lifetime value (total spend), including their country and number of orders
2. The current query your team uses is slow (takes 45s on 10M rows). Optimize it.
3. Write a query to identify customers who haven't ordered in 90+ days but were previously active (3+ orders)
4. Based on the data model, suggest 2-3 actionable business insights the team should investigate

Use the AI to build, optimize, and validate your queries.`,
    expectedOutcomes: "Correct SQL queries with proper JOINs and aggregations. Optimization suggestions (indexes, CTEs, avoiding SELECT *). Churn identification query with date filtering. Business insights that are specific and actionable.",
    difficulty: "intermediate",
    timeLimitMinutes: 18,
    maxAttempts: 5,
    tokenBudget: 3000,
    model: "claude-haiku",
    testType: "data",
    scoringWeights: { accuracy: 40, efficiency: 30, speed: 30 },
    customCriteria: [
      { id: "rp-a1", name: "Correct SQL Syntax", description: "Queries use proper JOIN, GROUP BY, and aggregation functions", type: "keyword", weight: 30, config: { mustInclude: ["SELECT", "JOIN", "GROUP BY"], mustNotInclude: [] } },
      { id: "rp-a2", name: "Optimization Awareness", description: "Mentions indexes, query plan, or performance techniques", type: "keyword", weight: 25, config: { mustInclude: ["index"], mustNotInclude: [] } },
      { id: "rp-a3", name: "Churn Query", description: "Correctly identifies inactive customers with date-based filtering", type: "keyword", weight: 25, config: { mustInclude: ["90", "days"], mustNotInclude: [] } },
      { id: "rp-a4", name: "Business Insights", description: "Provides actionable, specific insights based on the data model", type: "rubric", weight: 20, config: {} },
    ],
  },
  {
    id: "support",
    label: "Customer Support",
    desc: "Handle a frustrated customer complaint",
    title: "Resolve a Frustrated Customer Complaint",
    description: "Tests ability to use AI for empathetic, solution-oriented customer communication.",
    taskPrompt: `You are a Senior Customer Support Specialist at a SaaS company. A long-time customer (3 years, $2,400/year plan) has sent this angry email:

"I've been waiting 5 DAYS for someone to fix my broken dashboard. Every time I call, I get transferred to someone new who asks me to explain everything again. I run reports for my board every Monday and I've now missed TWO board meetings because of this. I'm seriously considering canceling. This is unacceptable for what we pay."

Write a response that:
- Acknowledges the frustration without being defensive
- Takes ownership of the failure
- Provides a concrete resolution plan with timeline
- Offers appropriate compensation
- Retains the customer
- Keeps a professional but warm tone
- Is under 250 words

Use the AI to draft a response, then refine it to sound genuine (not corporate/robotic).`,
    expectedOutcomes: "An empathetic response that acknowledges the specific frustrations (5 days, transfers, missed board meetings), takes ownership, offers concrete next steps with timeline, includes reasonable compensation (credit, extended trial, priority support), and sounds human.",
    difficulty: "intermediate",
    timeLimitMinutes: 10,
    maxAttempts: 4,
    tokenBudget: 1800,
    model: "claude-haiku",
    testType: "email",
    scoringWeights: { accuracy: 35, efficiency: 30, speed: 35 },
    customCriteria: [
      { id: "rp-c1", name: "Empathy & Acknowledgment", description: "Acknowledges specific frustrations (wait time, transfers, missed meetings)", type: "rubric", weight: 25, config: {} },
      { id: "rp-c2", name: "Takes Ownership", description: "Takes responsibility without blaming systems or other teams", type: "rubric", weight: 20, config: {} },
      { id: "rp-c3", name: "Concrete Resolution", description: "Provides specific next steps with timeline", type: "keyword", weight: 25, config: { mustInclude: ["fix", "hours"], mustNotInclude: [] } },
      { id: "rp-c4", name: "Compensation Offered", description: "Offers appropriate goodwill gesture (credit, extension, etc.)", type: "keyword", weight: 15, config: { mustInclude: ["credit"], mustNotInclude: [] } },
      { id: "rp-c5", name: "Response Length", description: "Under 250 words — concise and respectful of customer's time", type: "length", weight: 15, config: { maxWords: 250 } },
    ],
  },
  {
    id: "agent-support",
    label: "Agent Ops: Support",
    desc: "Design an AI agent to handle customer support tickets",
    title: "Design a Customer Support Agent Workflow",
    description: "Tests ability to design, configure, and supervise an AI agent that handles customer support tickets safely and effectively.",
    taskPrompt: `You are an AI Operations Lead at a SaaS company (5,000 customers, ~200 support tickets/day). Your manager wants you to design an AI agent that handles Tier 1 support tickets automatically.

The agent will have access to:
- Customer database (account info, plan, history)
- Knowledge base (200+ articles)
- Ticketing system (read/write)
- Billing system (read-only, can issue credits up to $50)

Design a complete agent workflow that:
1. Triages incoming tickets by category and urgency
2. Attempts to resolve common issues (password resets, billing questions, feature how-tos)
3. Knows when to escalate to a human (and what info to hand off)
4. Includes safety guardrails (what the agent must NEVER do)
5. Has error handling for when the knowledge base doesn't have an answer
6. Includes QA checks to verify response quality before sending
7. Defines success metrics to measure agent performance

Use the AI to build this workflow step by step. Think about what could go wrong and how to prevent it.`,
    expectedOutcomes: "A complete agent workflow with triage logic, resolution paths for common issues, clear escalation rules, safety guardrails (no account deletion, no refunds over $50, no sharing other customer data), error handling, QA checks, and measurable success metrics.",
    difficulty: "advanced",
    timeLimitMinutes: 20,
    maxAttempts: 5,
    tokenBudget: 3500,
    model: "claude-haiku",
    testType: "agent-ops",
    scoringWeights: { accuracy: 45, efficiency: 25, speed: 30 },
    customCriteria: [
      { id: "rp-ao1", name: "Triage Logic", description: "Defines clear categorization and priority rules for incoming tickets", type: "rubric", weight: 20, config: {} },
      { id: "rp-ao2", name: "Safety Guardrails", description: "Specifies what the agent must never do (data access limits, action limits, tone rules)", type: "keyword", weight: 20, config: { mustInclude: ["never", "must not", "limit", "restrict"], mustNotInclude: [] } },
      { id: "rp-ao3", name: "Escalation Rules", description: "Clear criteria for when to hand off to a human with context", type: "keyword", weight: 20, config: { mustInclude: ["escalat", "human", "handoff"], mustNotInclude: [] } },
      { id: "rp-ao4", name: "Error Handling", description: "Covers scenarios where the agent can't resolve the issue", type: "keyword", weight: 20, config: { mustInclude: ["error", "fallback", "unknown"], mustNotInclude: [] } },
      { id: "rp-ao5", name: "Success Metrics", description: "Defines measurable KPIs for agent performance", type: "keyword", weight: 20, config: { mustInclude: ["metric", "rate", "time", "score", "measure"], mustNotInclude: [] } },
    ],
  },
  {
    id: "agent-research",
    label: "Agent Ops: Research",
    desc: "Build a research agent workflow with tools and verification",
    title: "Design a Research Agent with Verification",
    description: "Tests ability to design a multi-step research agent that gathers information, cross-references sources, and produces verified reports.",
    taskPrompt: `You are building an AI research agent for a consulting firm. Analysts currently spend 4-6 hours researching each client's competitive landscape before strategy meetings. You need to design an agent that cuts this to under 30 minutes.

The agent will have access to:
- Web search API
- Company database (Crunchbase-style)
- News aggregator API
- Internal past-reports database
- Document generation tool

Design the agent workflow to:
1. Accept a company name and research brief as input
2. Gather competitive intelligence from multiple sources
3. Cross-reference and verify claims (no hallucinated data)
4. Identify gaps in information and flag them
5. Generate a structured competitive analysis report
6. Include confidence scores for each finding
7. Flag anything that needs human verification before the report goes to the client

Think about: How does the agent avoid hallucination? What happens when sources conflict? How do you ensure the output is reliable enough for a client-facing deliverable?`,
    expectedOutcomes: "A multi-step research workflow with source verification, conflict resolution between sources, confidence scoring, structured output format, human review gates for client-facing content, and clear handling of information gaps.",
    difficulty: "advanced",
    timeLimitMinutes: 20,
    maxAttempts: 5,
    tokenBudget: 3500,
    model: "claude-haiku",
    testType: "agent-ops",
    scoringWeights: { accuracy: 45, efficiency: 25, speed: 30 },
    customCriteria: [
      { id: "rp-ar1", name: "Multi-Source Strategy", description: "Uses multiple sources and cross-references findings", type: "keyword", weight: 20, config: { mustInclude: ["source", "cross-reference", "verify", "compare"], mustNotInclude: [] } },
      { id: "rp-ar2", name: "Anti-Hallucination", description: "Includes mechanisms to prevent or detect fabricated information", type: "keyword", weight: 25, config: { mustInclude: ["hallucin", "verify", "confidence", "source", "cite"], mustNotInclude: [] } },
      { id: "rp-ar3", name: "Information Gaps", description: "Identifies and flags missing or uncertain information", type: "keyword", weight: 20, config: { mustInclude: ["gap", "missing", "unknown", "uncertain", "flag"], mustNotInclude: [] } },
      { id: "rp-ar4", name: "Human Review Gate", description: "Includes human verification step before client delivery", type: "keyword", weight: 20, config: { mustInclude: ["human", "review", "approval", "verify"], mustNotInclude: [] } },
      { id: "rp-ar5", name: "Structured Output", description: "Defines a clear report format with sections and confidence levels", type: "rubric", weight: 15, config: {} },
    ],
  },
];
