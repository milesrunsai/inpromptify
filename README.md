# InpromptiFy

AI Proficiency Assessment Platform for hiring and upskilling.

## What It Does

InpromptiFy measures real AI fluency through adaptive assessments that score 5 dimensions: Prompt Quality, Efficiency, Speed, Response Quality, and Iteration Intelligence. Built for HR/TA teams, L&D departments, and organizations scaling AI adoption.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (dark theme, orange accent)
- **Database:** Neon PostgreSQL + Prisma 7
- **Auth:** Clerk (SSO/SAML/SCIM support)
- **Payments:** Stripe (subscriptions + usage-based credits)
- **Analytics:** PostHog + Sentry
- **Deployment:** Vercel

## Features

### Assessment Engine
- Adaptive MCQ with real-time theta estimation and difficulty adjustment
- 85+ questions across 5 AI topics (prompt engineering, RAG, agents, evaluation, safety)
- 5-dimension scoring with weighted role templates (8 pre-built roles)
- Anti-cheat: tab blur detection, paste prevention, option randomization, minimum answer time
- Seeded Fisher-Yates shuffle for deterministic option ordering

### Platform
- 6 marketing pages (landing, pricing with comparison matrix, developers/API docs, integrations, features, assess)
- Public 3-minute mini-assessment with email capture and results (radar chart, theta curve, hire/no-hire recommendation)
- Dashboard with org management, assessments list, team management, settings
- Admin panel: question bank management, approve/reject pending questions
- Automated question generation via LLM (Vercel cron)
- IRT infrastructure (2PL implementation, CalibrationResponse model for future calibration)

### Integrations (stubs/pages ready)
- ATS: Greenhouse, Lever, Workday, BambooHR, Ashby
- LMS: Canvas, Moodle
- Automation: Zapier, Make.com

## Local Development

```bash
git clone https://github.com/milesrunsai/inpromptify.git
cd inpromptify
npm install
cp .env.example .env  # fill in your keys
npx prisma generate
npx prisma db push
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

## Routes (22 total)

### Marketing (static)
- `/` — Landing page
- `/pricing` — Pricing tiers + comparison matrix
- `/developers` — API documentation
- `/integrations` — Integration partners
- `/features` — Feature breakdown
- `/assess` — Public mini-assessment

### Auth
- `/sign-in` — Clerk sign-in
- `/sign-up` — Clerk sign-up

### Dashboard (protected)
- `/dashboard` — Overview with stats
- `/dashboard/assessments` — Assessment management
- `/dashboard/team` — Team members
- `/dashboard/settings` — Org settings + billing
- `/dashboard/admin/questions` — Question bank management

### API
- `GET/POST /api/assessments` — List/create assessments
- `GET/PATCH /api/assessments/:id` — Get/update assessment
- `GET/POST /api/billing` — Billing info + checkout
- `GET/POST/PATCH /api/admin/questions` — Question management
- `POST /api/cron/generate-questions` — LLM question generation
- `POST /api/webhooks/clerk` — Clerk event sync
- `POST /api/webhooks/stripe` — Stripe event handling

## Roadmap

See `ROADMAP.md` for the full phased plan.
