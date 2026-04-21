'use client'

import { useState } from 'react'
import Link from 'next/link'

const posts = [
  {
    slug: 'why-ai-proficiency-assessments-matter',
    title: 'Why AI Proficiency Assessments Matter in 2026',
    excerpt:
      'As AI tools become integral to every role, organizations need reliable ways to measure and validate AI skills across their workforce.',
    date: 'Apr 15, 2026',
    readTime: '5 min read',
    tag: 'Industry',
    category: 'Engineering',
  },
  {
    slug: 'adaptive-testing-how-it-works',
    title: 'Introducing Adaptive Testing: How It Works',
    excerpt:
      'A deep dive into the AI engine behind our adaptive assessments and why it produces more accurate results in less time.',
    date: 'Apr 10, 2026',
    readTime: '6 min read',
    tag: 'Product',
    category: 'Product',
  },
  {
    slug: 'building-certification-program',
    title: 'Building a Certification Program with InpromptiFy',
    excerpt:
      'Step-by-step guide to creating, deploying, and managing verifiable AI certification programs for your organization.',
    date: 'Apr 5, 2026',
    readTime: '7 min read',
    tag: 'Guide',
    category: 'Guides',
  },
  {
    slug: 'why-ai-proficiency-matters-2026',
    title: 'Why AI Proficiency Is the Most Important Skill of 2026',
    excerpt:
      'The AI skills gap is widening fast. Discover why AI proficiency has become the defining career skill of 2026 and what organizations must do to keep up.',
    date: 'Apr 18, 2026',
    readTime: '6 min read',
    tag: 'Industry',
    category: 'Industry',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
  },
  {
    slug: 'chatgpt-is-not-enough',
    title: 'Why ChatGPT Alone Is Not Enough for AI Proficiency',
    excerpt:
      'Knowing one AI model is like knowing one programming language. True AI proficiency requires multi-model literacy across ChatGPT, Claude, Gemini, and beyond.',
    date: 'Apr 16, 2026',
    readTime: '7 min read',
    tag: 'Guide',
    category: 'Guides',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
  },
  {
    slug: 'measuring-ai-skills-hiring',
    title: 'How to Measure AI Skills When Hiring in 2026',
    excerpt:
      'Self-reported AI skills on resumes are unreliable. Learn practical approaches to objectively measure AI proficiency during your hiring process.',
    date: 'Apr 14, 2026',
    readTime: '6 min read',
    tag: 'Industry',
    category: 'Industry',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  },
  {
    slug: 'ai-assessment-vs-resume',
    title: 'AI Assessments vs Resumes: Why Traditional Hiring Fails',
    excerpt:
      'Resumes cannot capture AI proficiency. Explore why skill-based AI assessments outperform traditional resume screening for modern roles.',
    date: 'Apr 12, 2026',
    readTime: '5 min read',
    tag: 'Industry',
    category: 'Industry',
    image: 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=1200&q=80',
  },
  {
    slug: 'prompt-engineering-for-business',
    title: 'Prompt Engineering for Business: A Practical Guide',
    excerpt:
      'A hands-on guide to prompt engineering techniques that deliver real business ROI, from zero-shot prompts to chain-of-thought reasoning.',
    date: 'Apr 10, 2026',
    readTime: '8 min read',
    tag: 'Guide',
    category: 'Guides',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
  },
  {
    slug: 'ai-upskilling-workforce',
    title: 'AI Upskilling: How to Train Your Workforce for the AI Era',
    excerpt:
      'A strategic playbook for upskilling your existing workforce in AI, including training strategies, measurement frameworks, and ROI calculations.',
    date: 'Apr 8, 2026',
    readTime: '7 min read',
    tag: 'Leadership',
    category: 'Leadership',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
  },
  {
    slug: 'rag-explained-simply',
    title: 'RAG Explained Simply: What Every Professional Should Know',
    excerpt:
      'Retrieval-Augmented Generation is reshaping how businesses use AI. Here is a jargon-free explanation of RAG and why it matters for your work.',
    date: 'Apr 6, 2026',
    readTime: '6 min read',
    tag: 'Engineering',
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
  },
  {
    slug: 'ai-agents-future-work',
    title: 'AI Agents and the Future of Work',
    excerpt:
      'AI agents are moving beyond chatbots into autonomous workflows. Understand what AI agents are, how they work, and what they mean for the future of work.',
    date: 'Apr 4, 2026',
    readTime: '7 min read',
    tag: 'Industry',
    category: 'Industry',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
  },
  {
    slug: 'five-dimensions-ai-proficiency',
    title: 'The Five Dimensions of AI Proficiency',
    excerpt:
      'AI proficiency is not one skill but five. Learn about the dimensions InpromptiFy measures: prompt engineering, model understanding, output evaluation, ethical awareness, and workflow integration.',
    date: 'Apr 2, 2026',
    readTime: '6 min read',
    tag: 'Product',
    category: 'Product',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80',
  },
  {
    slug: 'ai-certification-landscape',
    title: 'The AI Certification Landscape in 2026',
    excerpt:
      'A comprehensive overview of AI certifications available in 2026, how they compare, and which ones actually matter for your career.',
    date: 'Mar 30, 2026',
    readTime: '5 min read',
    tag: 'Industry',
    category: 'Industry',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
  },
  {
    slug: 'ai-bias-assessment',
    title: 'Understanding Bias in AI Assessments',
    excerpt:
      'Fairness in AI assessment is critical. Explore the techniques and challenges involved in building unbiased AI proficiency evaluations.',
    date: 'Mar 28, 2026',
    readTime: '6 min read',
    tag: 'Engineering',
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80',
  },
  {
    slug: 'enterprise-ai-readiness',
    title: 'Enterprise AI Readiness: A Framework for Leaders',
    excerpt:
      'A practical maturity model for enterprise AI readiness, from initial exploration to full organizational integration.',
    date: 'Mar 26, 2026',
    readTime: '7 min read',
    tag: 'Leadership',
    category: 'Leadership',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80',
  },
  {
    slug: 'cost-of-ai-illiteracy',
    title: 'The Hidden Cost of AI Illiteracy in Your Organization',
    excerpt:
      'AI illiteracy costs more than you think. From wasted tokens to missed opportunities, discover the hidden price of an AI-unskilled workforce.',
    date: 'Mar 24, 2026',
    readTime: '5 min read',
    tag: 'Industry',
    category: 'Industry',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
  },
  {
    slug: 'ai-proficiency-benchmarks',
    title: 'AI Proficiency Benchmarks: What Good Looks Like',
    excerpt:
      'What does strong AI proficiency actually look like? Explore benchmarking frameworks that help individuals and teams understand where they stand.',
    date: 'Mar 22, 2026',
    readTime: '6 min read',
    tag: 'Product',
    category: 'Product',
    image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=1200&q=80',
  },
  {
    slug: 'building-ai-first-culture',
    title: 'Building an AI-First Culture: From Assessment to Action',
    excerpt:
      'Building an AI-first culture starts with understanding where your team stands. Learn how to move from assessment to training to full AI integration.',
    date: 'Mar 20, 2026',
    readTime: '8 min read',
    tag: 'Leadership',
    category: 'Leadership',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
  },
]

const categories = ['All', 'Engineering', 'Product', 'Guides', 'Industry', 'Leadership']

export function BlogContent() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-xl">
          <span className="section-label">[ Blog ]</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2 text-white">
            Latest updates
          </h1>
          <p className="text-lg text-gray-400 mt-4">
            Insights on AI assessment, proficiency measurement, and workforce
            readiness.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mt-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${
                activeCategory === cat
                  ? 'bg-orange-500/10 text-white border border-orange-500/20'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="glass-strong p-6 rounded-2xl group cursor-pointer hover:border-orange-500/20 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 block"
            >
              {post.image && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 font-mono">
                  {post.tag}
                </span>
                <span className="text-xs text-white/30">{post.date}</span>
                <span className="text-xs text-white/30">{post.readTime}</span>
              </div>
              <h2 className="text-lg font-semibold text-white group-hover:text-orange-300 transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                {post.excerpt}
              </p>
              <span className="inline-block mt-4 text-xs text-orange-400/60 group-hover:text-orange-400 transition-colors">
                Read more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
