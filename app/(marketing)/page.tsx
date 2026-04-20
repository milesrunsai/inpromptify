import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const features = [
  {
    title: "Adaptive Difficulty",
    description:
      "Questions dynamically adjust based on response quality and confidence signals. No two assessments are the same.",
  },
  {
    title: "Five Scoring Dimensions",
    description:
      "Evaluate prompt quality, context awareness, iteration strategy, output evaluation, and tool orchestration.",
  },
  {
    title: "PromptScore Credential",
    description:
      "Candidates receive a verified PromptScore they can share on LinkedIn. A standardized measure of AI fluency.",
  },
  {
    title: "Team Analytics",
    description:
      "Identify skill gaps across your organization with dimension-level breakdowns and benchmarking data.",
  },
  {
    title: "ATS Integration",
    description:
      "Connect with Greenhouse, Lever, Workday, and more. Embed assessments directly in your hiring workflow.",
  },
  {
    title: "Enterprise SSO",
    description:
      "SAML 2.0, SCIM provisioning, and support for Okta, Azure AD, and Google Workspace out of the box.",
  },
];

const useCases = [
  {
    title: "Hiring",
    description:
      "Screen candidates for real AI proficiency before the interview. Replace subjective evaluations with measurable scores across five dimensions.",
    audience: "Talent Acquisition",
  },
  {
    title: "Upskilling",
    description:
      "Baseline your workforce and track improvement over time. Identify which teams need targeted AI training and where skill gaps exist.",
    audience: "Learning & Development",
  },
  {
    title: "Certification",
    description:
      "Issue verifiable PromptScore credentials that candidates and employees can share publicly. Build an AI-ready workforce with proof.",
    audience: "HR Leadership",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Measure AI proficiency.
              <br />
              <span className="text-primary">Not AI trivia.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Adaptive assessments that evaluate how people actually use AI
              tools. Five scoring dimensions. One standardized credential.
              Built for enterprise hiring and workforce development.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/assess"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-8 text-base"
                )}
              >
                Take the 3-Minute Assessment
              </Link>
              <Link
                href="/features"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 px-8 text-base"
                )}
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Assessment infrastructure for the AI era
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Purpose-built to evaluate real AI fluency across your
              organization, not multiple-choice recall.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border/50 bg-card p-6 transition-colors hover:border-primary/30"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for the people who decide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you are hiring, training, or certifying — InpromptiFy
              gives your team the data to make decisions about AI readiness.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-xl border border-border/50 bg-card p-8"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  {useCase.audience}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{useCase.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built With / Trust */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built on proven infrastructure
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Enterprise-grade from day one. SOC 2-ready auth, usage-based
              billing, and observability baked in.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {[
              { name: "Clerk", detail: "Auth & SSO" },
              { name: "Stripe", detail: "Billing" },
              { name: "Neon", detail: "Database" },
              { name: "Vercel", detail: "Hosting" },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-lg border border-border/50 bg-card px-6 py-4"
              >
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-12 text-center sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              See where you stand in 3 minutes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Take the free mini-assessment. No account required. Get your
              PromptScore instantly and see how you compare.
            </p>
            <div className="mt-8">
              <Link
                href="/assess"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-8 text-base"
                )}
              >
                Start Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
