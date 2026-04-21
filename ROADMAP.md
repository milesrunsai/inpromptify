# Roadmap

## Phase 1 — v1 (Current)
- [x] Next.js 16 + TypeScript + Tailwind + shadcn/ui
- [x] 6 marketing pages with real content
- [x] Clerk auth with SSO/SAML/SCIM support
- [x] Adaptive MCQ engine (rule-based theta + dimension scoring)
- [x] 85 seed questions across 5 AI topics
- [x] 8 role templates with custom scoring weights
- [x] Anti-cheat system (blur, paste, timing, shuffle)
- [x] Results page (radar chart, theta curve, score ring, hire recommendation, share)
- [x] Dashboard (overview, assessments, team, settings)
- [x] Admin question management (approve/reject, generate via LLM)
- [x] Stripe integration (checkout, webhooks, portal)
- [x] API routes (assessments CRUD, billing, webhooks)
- [x] PostHog analytics + consent banner
- [x] Rate limiting
- [x] IRT infrastructure (CalibrationResponse model, 2PL implementation)
- [x] Prisma schema (Organization, User, Membership, Assessment, Subscription, QuestionBank, PendingQuestion, CalibrationResponse)

## Phase 2 — Enterprise Features (Months 2-4)
- [ ] IRT calibration pipeline (R/mirt or Python/py-irt) — requires 1,000+ responses
- [ ] Switch adaptive engine to real IRT-CAT (EAP theta + Fisher information selection)
- [ ] Bias audit dashboard (DIF analysis)
- [ ] Validation whitepaper
- [ ] ATS OAuth integrations (Greenhouse, Lever first)
- [ ] Zapier/Make.com live connectors
- [ ] SSO/SCIM activation and documentation
- [ ] Benchmarking API for BI tools
- [ ] Slack/Teams notifications

## Phase 3 — Platform (Months 4-6)
- [ ] Live LLM sandbox (secure prompt execution environment)
- [ ] Custom model endpoints (BYOK: OpenAI, Anthropic, Azure)
- [ ] White-label / embedded iframe mode
- [ ] On-prem / air-gapped deployment (Docker + Helm)
- [ ] Advanced analytics + predictive ROI

## Phase 4 — Scale (Months 6-12)
- [ ] Full ATS marketplace presence
- [ ] LMS LTI 1.3 embedding
- [ ] AI Coach (personalized upskilling recommendations)
- [ ] Multi-language assessment support
- [ ] SOC 2 Type II certification
