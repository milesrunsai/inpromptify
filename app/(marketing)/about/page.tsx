import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The mission behind InpromptiFy — building the standard for AI proficiency measurement.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-hero-heading sm:text-5xl">
        The AI skills gap is real. We are closing it.
      </h1>
      <div className="mt-8 space-y-6 text-lg leading-8 text-muted-foreground">
        <p>
          The world adopted AI faster than it learned to use it. Companies are hiring for
          &quot;AI proficiency&quot; with no way to measure it. Resumes lie. Self-assessments
          are useless. Interview questions test knowledge, not ability.
        </p>
        <p>
          InpromptiFy exists to solve this. We built an adaptive assessment engine that measures
          how people actually use AI tools — not whether they can define &quot;chain-of-thought
          prompting&quot; on a quiz, but whether they can deploy it under pressure to produce
          real results.
        </p>
        <p>
          Our five-dimension scoring system — Prompt Quality, Efficiency, Speed, Response Quality,
          and Iteration Intelligence — captures the full picture of AI fluency. The result is a
          single, verifiable credential: the PromptScore.
        </p>
        <h2 className="text-2xl font-bold text-hero-heading pt-4">What we believe</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-primary font-bold shrink-0">01</span>
            <span>AI proficiency is the most important skill of the decade. It should be measured like any other competency.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold shrink-0">02</span>
            <span>Assessment should test applied judgment, not memorized definitions.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold shrink-0">03</span>
            <span>Enterprise buyers deserve psychometric rigor, not marketing fluff.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold shrink-0">04</span>
            <span>The question bank must evolve as fast as the AI landscape. Stale tests are worthless.</span>
          </li>
        </ul>
        <h2 className="text-2xl font-bold text-hero-heading pt-4">Built in Australia</h2>
        <p>
          InpromptiFy is an independent, bootstrapped company. No VC pressure. No growth-at-all-costs.
          Just a relentless focus on building the most accurate AI proficiency assessment on the market.
        </p>
      </div>
    </div>
  );
}
