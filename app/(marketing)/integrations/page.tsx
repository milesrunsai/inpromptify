import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "Connect InpromptiFy with your ATS, LMS, and automation tools. Greenhouse, Lever, Workday, Zapier, and more.",
};

const integrations = {
  ats: {
    title: "Applicant Tracking Systems",
    description:
      "Embed AI proficiency assessments directly in your hiring pipeline. Scores sync automatically when candidates complete their evaluation.",
    items: [
      {
        name: "Greenhouse",
        description:
          "Trigger assessments from Greenhouse stages. Scores and dimension breakdowns appear as candidate attributes.",
        status: "Coming Soon" as const,
      },
      {
        name: "Lever",
        description:
          "Send assessment links through Lever workflows. Results post back as candidate feedback with full scoring detail.",
        status: "Coming Soon" as const,
      },
      {
        name: "Workday",
        description:
          "Native integration with Workday Recruiting. Assessment results flow into candidate profiles automatically.",
        status: "Coming Soon" as const,
      },
      {
        name: "BambooHR",
        description:
          "Integrate assessments with BambooHR hiring workflows. Track AI proficiency as part of the hiring process.",
        status: "Coming Soon" as const,
      },
      {
        name: "Ashby",
        description:
          "Built-in support for Ashby assessment stages. PromptScores sync as structured data in candidate records.",
        status: "Coming Soon" as const,
      },
    ],
  },
  lms: {
    title: "Learning Management Systems",
    description:
      "Use InpromptiFy assessments as learning checkpoints. Measure skill development before and after AI training programs.",
    items: [
      {
        name: "Canvas",
        description:
          "LTI integration for Canvas. Assign assessments as course activities with automatic grade passback.",
        status: "Coming Soon" as const,
      },
      {
        name: "Moodle",
        description:
          "LTI-compatible integration for Moodle. Embed assessments in course modules with score synchronization.",
        status: "Coming Soon" as const,
      },
    ],
  },
  automation: {
    title: "Automation & Workflow",
    description:
      "Connect InpromptiFy to thousands of tools through automation platforms. Build custom workflows without code.",
    items: [
      {
        name: "Zapier",
        description:
          "Trigger Zaps when assessments complete. Send scores to Slack, update spreadsheets, create tasks, or sync with any Zapier-connected tool.",
        status: "Available" as const,
      },
      {
        name: "Make.com",
        description:
          "Build multi-step automation scenarios with assessment events. Route candidate data to any system in your stack.",
        status: "Available" as const,
      },
    ],
  },
};

function StatusBadge({ status }: { status: "Available" | "Coming Soon" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        status === "Available"
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  );
}

export default function IntegrationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Integrations
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Connect InpromptiFy with the tools your team already uses.
            Assessment data flows where it needs to go — your ATS, LMS, or
            any automation platform.
          </p>
        </div>
      </section>

      {/* Integration Categories */}
      {Object.entries(integrations).map(([key, category]) => (
        <section key={key} className="border-t border-border/50">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-2xl font-bold tracking-tight">
              {category.title}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {category.description}
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-border/50 bg-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{item.name}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Custom Integration CTA */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Need a custom integration?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our REST API and webhook system let you build any integration.
              Enterprise customers get dedicated integration support.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/developers"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-8 text-base"
                )}
              >
                View API Docs
              </Link>
              <Link
                href="#"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 px-8 text-base"
                )}
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
