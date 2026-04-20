import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const posts: Record<
  string,
  { title: string; date: string; tag: string; content: string }
> = {
  "why-ai-proficiency-assessments-matter": {
    title: "Why AI Proficiency Assessments Matter in 2026",
    date: "Apr 15, 2026",
    tag: "Industry",
    content: `As AI tools become integrated into virtually every professional role, the gap between people who can effectively leverage AI and those who cannot is widening rapidly. This isn't just about prompt engineering — it's about understanding when to use AI, how to validate its outputs, and how to integrate AI-assisted workflows into real business processes.

## The Problem with Self-Reported AI Skills

Most organizations today rely on self-assessment or informal gauges of AI proficiency. Candidates claim "proficient with ChatGPT" on resumes, and hiring managers have no way to verify what that actually means. Does it mean they've used it to write a few emails, or that they can architect complex multi-step agent workflows?

The skills gap is real. According to recent workforce surveys, over 80% of knowledge workers use AI tools at least weekly, but fewer than 20% can articulate the limitations of the models they're using or describe when AI-generated outputs might be unreliable.

## What Good Assessment Looks Like

Effective AI proficiency assessment goes beyond trivia questions about transformer architectures. It should measure practical competencies:

- **Prompt Engineering**: Can the person craft effective prompts for different use cases? Do they understand few-shot learning, chain-of-thought, and system prompts?
- **Output Evaluation**: Can they identify hallucinations, biases, and factual errors in AI-generated content?
- **Tool Selection**: Do they know which AI tool or approach fits a given problem?
- **Ethical Awareness**: Do they understand data privacy implications, bias risks, and responsible AI practices?
- **Workflow Integration**: Can they build AI into existing processes rather than treating it as a standalone novelty?

## Why It Matters Now

Organizations investing in AI adoption without measuring proficiency are flying blind. Training budgets are being spent without knowing whether employees are actually improving. Hiring decisions are being made on the basis of buzzwords rather than demonstrated capability.

Standardised AI proficiency assessment gives organisations a common language for AI skills. It helps L&D teams target training where it's needed most, helps hiring managers make better decisions, and gives individuals a credible way to demonstrate their capabilities.

At InpromptiFy, we're building the assessment infrastructure to make this possible — adaptive, fair, and grounded in real-world AI skills rather than theoretical knowledge.`,
  },
  "adaptive-testing-how-it-works": {
    title: "Introducing Adaptive Testing: How It Works",
    date: "Apr 10, 2026",
    tag: "Product",
    content: `Traditional assessments give every test-taker the same set of questions in the same order. This is simple to implement but deeply inefficient — experts waste time on easy questions, while beginners get demoralised by questions far above their level.

Adaptive testing solves this by adjusting question difficulty in real time based on how the test-taker is performing.

## How InpromptiFy's Adaptive Engine Works

Our adaptive testing engine uses a modified Item Response Theory (IRT) model combined with a Bayesian skill estimation approach. Here's the simplified version:

1. **Initial Calibration**: The first few questions are drawn from a calibrated pool spanning beginner to advanced difficulty. Your responses to these seed questions establish an initial skill estimate.

2. **Dynamic Selection**: After the calibration phase, each subsequent question is selected to maximise information gain. If you answered the last question correctly, the next one will be slightly harder. If you got it wrong, slightly easier. The algorithm converges on your true skill level.

3. **Multi-Dimensional Tracking**: Rather than a single difficulty axis, we track proficiency across multiple AI competency dimensions — prompt engineering, model understanding, output evaluation, ethical awareness, and practical application. A question might be easy on one dimension but hard on another.

4. **Confidence Intervals**: The engine doesn't just produce a point estimate of your skill. It maintains a confidence interval that narrows as more questions are answered. The assessment ends when the confidence interval is tight enough to be useful, or when a maximum question count is reached.

## Why This Matters

The practical benefits are significant:

- **Shorter assessments**: Adaptive tests typically reach the same precision as fixed-length tests in 40-60% fewer questions. A 30-minute fixed test can be replaced by a 15-minute adaptive one.
- **Better candidate experience**: Nobody likes spending 10 minutes on questions that are obviously too easy or too hard. Adaptive tests keep test-takers in their zone of proximal development.
- **More accurate results**: By concentrating questions near the test-taker's actual skill level, adaptive tests produce more precise measurements, especially at the extremes.
- **Fairer comparisons**: Two people with the same adaptive score have demonstrated the same level of proficiency, regardless of which specific questions they received.

## Built for AI Skills Specifically

Generic adaptive testing platforms exist, but AI proficiency has unique characteristics that require specialised handling. AI knowledge evolves rapidly — a question about best practices from six months ago might have a different correct answer today. Our question bank is continuously updated and re-calibrated to reflect the current state of AI tools and techniques.

We also handle the inherently practical nature of AI skills. Many of our assessment items aren't traditional multiple-choice — they involve evaluating AI outputs, crafting prompts for specific scenarios, or identifying issues in AI-generated code. The adaptive engine works across all these question types.`,
  },
  "building-certification-program": {
    title: "Building a Certification Program with InpromptiFy",
    date: "Apr 5, 2026",
    tag: "Guide",
    content: `Whether you're an L&D team rolling out AI training, an education provider creating credentials, or an HR department standardising AI skills across the organisation, building a certification program with InpromptiFy is straightforward. This guide walks through the process from start to finish.

## Step 1: Define Your Competency Framework

Before creating assessments, decide what you're measuring. InpromptiFy provides a default AI competency framework covering six dimensions, but you can customise this to match your organisation's specific needs.

Common competency areas include:
- **Foundational AI Knowledge**: Understanding of how AI models work, their capabilities and limitations
- **Prompt Engineering**: Ability to craft effective prompts across different use cases
- **Output Evaluation**: Skill in identifying errors, hallucinations, and biases in AI outputs
- **Tool Proficiency**: Hands-on skill with specific AI tools relevant to your organisation
- **Ethical & Responsible AI**: Understanding of privacy, bias, and responsible use practices
- **Applied AI Workflows**: Ability to integrate AI into real work processes

## Step 2: Create or Curate Assessments

InpromptiFy offers two paths:

**Use our question bank**: We maintain a continuously updated bank of AI proficiency questions across all competency areas and difficulty levels. You can select categories relevant to your certification and let the adaptive engine handle question selection.

**Build custom assessments**: Use the Assessment Builder to create questions specific to your tools, processes, or industry. The builder supports multiple question types including multiple-choice, scenario-based evaluation, prompt crafting, and output analysis.

Most organisations use a combination — our standard bank for foundational knowledge, supplemented with custom questions for organisation-specific tools and workflows.

## Step 3: Set Certification Thresholds

Define what passing looks like. InpromptiFy supports:
- **Single threshold**: Score above X% to earn the certification
- **Multi-level**: Bronze, Silver, Gold tiers based on score ranges
- **Dimension requirements**: Must meet minimum thresholds across all competency areas (prevents someone from passing by being exceptional in one area while having no skills in another)

## Step 4: Deploy and Monitor

Roll out the certification to your target audience. InpromptiFy provides:
- **Unique assessment links** or LMS integration for distribution
- **Real-time dashboards** showing completion rates, score distributions, and pass rates
- **Skill gap analysis** identifying which competency areas have the widest gaps across your organisation
- **Digital certificates** with unique verification URLs that candidates can share on LinkedIn or include in portfolios

## Step 5: Iterate

The first version of any certification program won't be perfect. Use InpromptiFy's analytics to identify questions that are too easy, too hard, or ambiguous. Monitor whether the certification thresholds are producing meaningful differentiation. Update the competency framework as AI tools and best practices evolve.

Certification is not a one-time event — it's an ongoing program that grows with your organisation's AI maturity.`,
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.content.slice(0, 160) };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/blog"
          className="text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          &larr; Back to blog
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 font-mono">
              {post.tag}
            </span>
            <span className="text-xs text-white/30">{post.date}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            {post.title}
          </h1>
        </div>

        <article className="mt-10 prose prose-invert prose-sm max-w-none">
          {post.content.split("\n\n").map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="text-xl font-semibold text-white mt-10 mb-4"
                >
                  {block.replace("## ", "")}
                </h2>
              );
            }
            if (block.startsWith("- **")) {
              const items = block.split("\n").filter(Boolean);
              return (
                <ul key={i} className="space-y-2 my-4">
                  {items.map((item, j) => (
                    <li
                      key={j}
                      className="text-sm text-gray-300 leading-relaxed"
                    >
                      {item
                        .replace(/^- /, "")
                        .split("**")
                        .map((part, k) =>
                          k % 2 === 1 ? (
                            <strong key={k} className="text-white">
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-sm text-gray-300 leading-relaxed mb-4">
                {block}
              </p>
            );
          })}
        </article>
      </div>
    </div>
  );
}
