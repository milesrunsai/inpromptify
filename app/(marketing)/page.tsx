import Link from "next/link";
import { VideoHero } from "@/components/marketing/video-hero";
import { LogoMarquee } from "@/components/marketing/logo-marquee";
import { SocialProofSection } from "@/components/marketing/social-proof-section";

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
      <section className="relative overflow-hidden bg-background min-h-screen flex flex-col items-center justify-center">
        <VideoHero />
        <div className="relative z-10 flex flex-col items-center justify-center pt-20 px-4 text-center">
          <h1
            className="text-[120px] sm:text-[180px] lg:text-[230px] font-normal leading-none tracking-tighter bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(223deg, #E8E8E9 0%, #3A7BBF 104.15%)",
            }}
          >
            IF
          </h1>
          <p className="mt-6 max-w-xl text-lg text-hero-sub opacity-80 leading-relaxed">
            The most powerful AI proficiency assessment
            <br />
            ever deployed in talent acquisition
          </p>
          <Link
            href="/assess"
            className="liquid-glass mt-10 rounded-full px-[29px] py-[24px] text-sm font-medium text-foreground transition-colors hover:bg-white/5"
          >
            Start Free Assessment
          </Link>
        </div>
        <div className="relative z-10 mt-auto w-full max-w-5xl mx-auto px-4">
          <LogoMarquee />
        </div>
      </section>

      {/* Social Proof / Video Section */}
      <SocialProofSection />

      {/* Features Grid */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-hero-heading sm:text-4xl">
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
                className="liquid-glass rounded-xl p-6 transition-all hover:scale-[1.02]"
              >
                <h3 className="text-lg font-semibold text-hero-heading">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-hero-heading sm:text-4xl">
              Built for the people who decide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you are hiring, training, or certifying -- InpromptiFy
              gives your team the data to make decisions about AI readiness.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="liquid-glass rounded-xl p-8"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  {useCase.audience}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-hero-heading">
                  {useCase.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-hero-heading sm:text-4xl">
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
                className="liquid-glass rounded-lg px-6 py-4"
              >
                <p className="text-sm font-semibold text-hero-heading">
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="liquid-glass rounded-2xl p-12 text-center sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight text-hero-heading sm:text-4xl">
              See where you stand in 3 minutes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Take the free mini-assessment. No account required. Get your
              PromptScore instantly and see how you compare.
            </p>
            <div className="mt-8">
              <Link
                href="/assess"
                className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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
