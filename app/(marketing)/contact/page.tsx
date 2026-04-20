import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with InpromptiFy. Book a demo or ask a question.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-hero-heading sm:text-5xl">
        Get in touch
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Whether you want a demo, have a question, or want to explore enterprise pricing —
        we respond within 24 hours.
      </p>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        <div className="liquid-glass rounded-xl p-8">
          <h2 className="text-lg font-semibold text-hero-heading">Book a Demo</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            See InpromptiFy in action. We will walk you through the assessment engine,
            scoring dimensions, and team analytics.
          </p>
          <div className="mt-6">
            <a
              href="mailto:hello@inpromptify.com?subject=Demo Request"
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 inline-block"
            >
              Request Demo
            </a>
          </div>
        </div>

        <div className="liquid-glass rounded-xl p-8">
          <h2 className="text-lg font-semibold text-hero-heading">Enterprise</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Custom pricing, SSO/SCIM, dedicated CSM, and SLA. For organizations
            with 200+ employees.
          </p>
          <div className="mt-6">
            <a
              href="mailto:enterprise@inpromptify.com?subject=Enterprise Inquiry"
              className="liquid-glass rounded-full px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/5 inline-block"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>

      <div className="mt-16 liquid-glass rounded-xl p-8">
        <h2 className="text-lg font-semibold text-hero-heading">General Inquiries</h2>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <p>
            Email:{" "}
            <a href="mailto:hello@inpromptify.com" className="text-primary hover:underline">
              hello@inpromptify.com
            </a>
          </p>
          <p>
            Developer support:{" "}
            <a href="mailto:dev@inpromptify.com" className="text-primary hover:underline">
              dev@inpromptify.com
            </a>
          </p>
          <p>
            Already a customer?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in to your dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
