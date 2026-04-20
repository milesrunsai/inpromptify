import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Adaptive testing, five scoring dimensions, team analytics, and certifications. See how InpromptiFy measures real AI proficiency.",
};

const dimensions = [
  {
    name: "Prompt Quality",
    description:
      "Evaluates clarity, specificity, and structure of prompts. Measures whether the candidate can articulate intent in a way that produces reliable AI output.",
  },
  {
    name: "Context Awareness",
    description:
      "Assesses the ability to provide relevant background, constraints, and domain context. Tests whether candidates understand how context shapes AI responses.",
  },
  {
    name: "Iteration Strategy",
    description:
      "Measures how candidates refine and improve their approach based on initial results. Evaluates debugging instincts and systematic improvement.",
  },
  {
    name: "Output Evaluation",
    description:
      "Tests critical assessment of AI-generated content. Can the candidate identify errors, hallucinations, and quality issues in AI output?",
  },
  {
    name: "Tool Orchestration",
    description:
      "Evaluates understanding of when and how to use different AI tools. Measures workflow design and multi-tool coordination ability.",
  },
];

const capabilities = [
  {
    category: "Assessment Engine",
    items: [
      {
        title: "Adaptive Difficulty",
        description:
          "Questions branch based on response quality and confidence signals. The assessment gets harder or easier in real time to precisely locate skill level.",
      },
      {
        title: "Time-Aware Scoring",
        description:
          "Response time is factored into confidence modeling. Rapid correct answers indicate deeper fluency than slow deliberation.",
      },
      {
        title: "Anti-Gaming",
        description:
          "Randomized question pools, response pattern analysis, and rate limiting prevent candidates from sharing answers or brute-forcing results.",
      },
    ],
  },
  {
    category: "Analytics & Reporting",
    items: [
      {
        title: "Team Dashboard",
        description:
          "View aggregate scores across your organization. Identify skill gaps by dimension, department, or role.",
      },
      {
        title: "Individual Reports",
        description:
          "Detailed breakdown for each candidate showing performance across all five dimensions with percentile benchmarking.",
      },
      {
        title: "Trend Tracking",
        description:
          "Monitor how AI proficiency changes over time. Measure the impact of training programs with before-and-after data.",
      },
    ],
  },
  {
    category: "Enterprise",
    items: [
      {
        title: "SSO & SCIM",
        description:
          "SAML 2.0 single sign-on and SCIM provisioning for Okta, Azure AD, and Google Workspace. Manage access at scale.",
      },
      {
        title: "Organization Management",
        description:
          "Multi-tenant architecture with role-based access control. Admins manage teams, members take and view assessments.",
      },
      {
        title: "API Access",
        description:
          "Full REST API for programmatic assessment creation, score retrieval, and webhook-driven workflows.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            What InpromptiFy measures and how
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A purpose-built assessment engine that adapts to each candidate and
            scores across five dimensions of AI proficiency. No multiple-choice
            trivia. No self-reported surveys.
          </p>
        </div>
      </section>

      {/* Scoring Dimensions */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Five dimensions of AI fluency
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Each assessment produces a composite PromptScore plus individual
              scores across five research-backed dimensions.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((dim, i) => (
              <div
                key={dim.name}
                className="rounded-xl border border-border/50 bg-card p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-semibold">{dim.name}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {dim.description}
                </p>
              </div>
            ))}
            {/* Summary card */}
            <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-card p-6">
              <h3 className="text-lg font-semibold text-primary">
                PromptScore
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                The composite score (0-100) that combines all five dimensions
                into a single, standardized credential. Shareable on LinkedIn
                and verifiable by employers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      {capabilities.map((section) => (
        <section
          key={section.category}
          className="border-t border-border/50"
        >
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-2xl font-bold tracking-tight">
              {section.category}
            </h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/50 bg-card p-6"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Experience it yourself
            </h2>
            <p className="mt-4 text-muted-foreground">
              The 3-minute mini-assessment is free, ungated, and gives you an
              instant PromptScore. See the adaptive engine in action.
            </p>
            <div className="mt-8">
              <Link
                href="/assess"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-8 text-base"
                )}
              >
                Take the Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
