# InpromptiFy — Project Bible

**Last updated:** 2026-04-20
**Status:** Rebuilding from scratch (v1)
**Domain:** inpromptify.com (Vercel, transferable)
**GitHub:** milesrunsai/inpromptify (new account)
**Old repos:** flinchify/promptify (archive), flinchify/inpromptify (archive)
**PAT:** github_pat_11CCF555Y0... (milesrunsai account — ROTATE AFTER SETUP)

---

## What It Is
AI Proficiency Assessment platform for hiring + upskilling. B2B enterprise SaaS play.
- Adaptive assessments that measure real AI fluency (not just MCQ trivia)
- 5 scoring dimensions (prompt quality, etc.)
- Team analytics, certifications, LinkedIn badges
- Target buyers: HR/TA/L&D leaders at 200+ employee companies

## Tech Stack (confirmed, no changes)
- **Next.js 14** (App Router) + TypeScript + Tailwind + shadcn/ui
- **Neon Postgres** + Prisma
- **Clerk auth** (SSO/SAML/SCIM — GA as of April 16 2026)
- **Stripe** (usage-based credits + subscriptions)
- **PostHog** + **Sentry** (mandatory from v1)
- Dark theme, orange accent, NO emojis on site

## Design Direction
- Professional enterprise B2B — "even Jeff Bezos would use it"
- No fake testimonials, no aspirational trust logos
- Real data only, no mocks/placeholders
- Clear pricing table (TestGorilla/iMocha style)

---

## V1 Pages (exact, non-negotiable)

### / (Landing)
- Hero with video bg or Loom embed of assessment flow
- Features grid
- Use cases section
- Trust section (only real logos or "Built with" honestly)
- CTA funneling to mini-assessment
- NO fake testimonials, NO "0+ assessments" placeholder

### /pricing
- Clear comparison table: Free / Starter / Business / Enterprise
- Real prices for Starter/Business
- Exact limits and features per tier
- Annual toggle with 20% discount
- 1 credit = 1 full assessment, overages at $15-25

### /developers
- OpenAPI spec
- Webhook examples (assessment.completed, score.updated)
- Postman collection
- Quickstart SDK snippets (TypeScript, Python)

### /integrations
- Cards for: Greenhouse, Lever, Workday, BambooHR, Ashby
- LMS: Canvas, Moodle
- Zapier/Make.com
- Even if connections are Phase 2, page must exist

### /features (NEW)
- Detailed breakdown: adaptive testing, scoring dimensions, analytics, certifications
- Buyers expect this page

### Auth routes
- Clerk handles /sign-in, /sign-up, /onboarding

### /assess
- 3-minute ungated mini-assessment (adaptive MCQ)
- Capture email → results page → "Upgrade to see full report + team features"
- Rate limiting and abuse protection

### /dashboard (post-login)
- Org switcher (Clerk Organizations)
- Recent assessments list
- Basic team overview
- Assessment detail views
- Team management

---

## V1 Technical Deliverables

- Multi-tenant orgs (Clerk Organizations)
- Assessment model with adaptive MCQ engine (branching logic based on confidence/response time)
- 5-dimension scoring
- Stripe subscription + credit system
- Basic team analytics (average score, heat map stub)
- Rate limiting on public mini-assessment
- PostHog events + Sentry error tracking

## Explicitly NOT in V1 (no scope creep)
- Real LLM sandbox / custom models (Phase 2 Enterprise)
- ATS one-click OAuth (stub the page, ship Zapier first)
- On-prem / air-gapped deployment
- Bias audit dashboard (stub data only)

---

## Prisma Schema

```prisma
model Organization {
  id            String         @id @default(cuid())
  name          String
  slug          String         @unique
  clerkOrgId    String         @unique
  members       Membership[]
  assessments   Assessment[]
  subscriptions Subscription[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Membership {
  id     String       @id @default(cuid())
  org    Organization @relation(fields: [orgId], references: [id])
  orgId  String
  user   User         @relation(fields: [userId], references: [id])
  userId String
  role   Role         @default(MEMBER)
}

model User {
  id          String       @id @default(cuid())
  clerkUserId String       @unique
  email       String       @unique
  memberships Membership[]
}

model Assessment {
  id              String           @id @default(cuid())
  org             Organization     @relation(fields: [orgId], references: [id])
  orgId           String
  candidateEmail  String
  status          AssessmentStatus
  overallScore    Int?             // 0-100
  dimensionScores Json?            // {promptQuality: 85, efficiency: 92, ...}
  responses       Json
  completedAt     DateTime?
  createdAt       DateTime         @default(now())
  creditsUsed     Int              @default(1)
}

model Subscription {
  id                String       @id @default(cuid())
  org               Organization @relation(fields: [orgId], references: [id])
  orgId             String
  stripeSubId       String       @unique
  tier              Tier
  credits           Int          // remaining monthly credits
  status            String
  currentPeriodEnds DateTime
}

enum Role { ADMIN MEMBER }
enum AssessmentStatus { PENDING IN_PROGRESS COMPLETED CANCELLED }
enum Tier { FREE STARTER BUSINESS ENTERPRISE }
```

---

## Env Vars Required

```
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_POSTHOG_KEY=
SENTRY_DSN=
```

---

## Folder Structure

```
/app
  /(marketing)        ← landing, pricing, developers, integrations, features
    /page.tsx
  /assess
    /page.tsx          ← public mini-assessment
  /dashboard
    /page.tsx
    /assessments/...
    /team/...
  /api
    /trpc/...
    /webhooks/stripe.ts
    /webhooks/clerk.ts
  /auth               ← Clerk middleware
/components
/lib
/prisma
```

---

## Marketing Strategy (for reference)

### Primary (80% effort): LinkedIn-first B2B engine
- Daily/every-other-day founder posts (AI skills gap thought leadership)
- Sales Navigator + cold outreach to Heads of Talent, CHROs, Learning Directors
- Targeted ads to HR/TA/L&D at 200+ employee companies

### Content/SEO flywheel
- Blog/whitepapers: "The $600B AI skills gap", role-specific guides
- Webinars co-hosted with HR influencers
- Ungated micro-tool (the 3-min assessment) as lead gen

### Product-Led Growth (20% effort)
- Shareable LinkedIn badges
- Free tier, no credit card
- Candidate-side virality (people posting their PromptScore)

### NOT doing
- TikTok/Instagram consumer virality
- Paid Google/Facebook ads
- PR blitz until 5-10 real customer logos

### 90-day plan
- Weeks 1-4: Fix site, ship /developers, /integrations, Greenhouse + Zapier. 8-10 LinkedIn posts.
- Weeks 5-8: 2 webinars, first 5-10 paid pilots, testimonials.
- Weeks 9-12: ABM for 20 target accounts, measure demo requests.

---

## Integration Roadmap

### Must-have (weeks 4-6): ATS
- Greenhouse, Lever, Workday, BambooHR, Ashby
- Zapier / Make.com (quick win, 1 week)

### High-impact (months 2-3)
- SSO: SAML 2.0, SCIM, Okta/Azure AD/Google Workspace (Clerk covers this)
- Slack & Teams notifications
- Analytics/benchmarking API for BI tools
- LMS expansion: Workday Learning, Cornerstone

### Enterprise-only (month 3+)
- Custom model endpoints (BYOK)
- On-prem / air-gapped (Docker + Helm)
- White-label / embedded iframe
- HRIS webhooks

---

## Competitors
- TestGorilla, iMocha, CodeSignal, Eightfold
- Our differentiator: AI-native assessment (not just coding tests), adaptive difficulty, PromptScore as a credential

## Cost Warnings
- Neon bills for compute + storage — monitor sandbox/LLM costs
- Clerk MAU pricing becomes real at scale (50+ users per org)
- Must have observability (PostHog + Sentry) or flying blind
