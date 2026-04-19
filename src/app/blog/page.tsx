"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const posts = [
  {
    title: "Why AI Proficiency Assessments Matter in 2026",
    excerpt: "As AI tools become integral to every role, organizations need reliable ways to measure and validate AI skills across their workforce.",
    date: "Apr 15, 2026",
    tag: "Industry",
    category: "Engineering",
  },
  {
    title: "Introducing Adaptive Testing: How It Works",
    excerpt: "A deep dive into the AI engine behind our adaptive assessments and why it produces more accurate results in less time.",
    date: "Apr 10, 2026",
    tag: "Product",
    category: "Product",
  },
  {
    title: "Building a Certification Program with InpromptiFy",
    excerpt: "Step-by-step guide to creating, deploying, and managing verifiable AI certification programs for your organization.",
    date: "Apr 5, 2026",
    tag: "Guide",
    category: "Guides",
  },
  {
    title: "The State of AI Skills: 2026 Report",
    excerpt: "Key findings from analyzing 150,000+ assessments across 40 countries. Where are the biggest skill gaps?",
    date: "Mar 28, 2026",
    tag: "Research",
    category: "Engineering",
  },
];

const categories = ["All", "Engineering", "Product", "Guides"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      <Nav />
      <main className="bg-[#0a0a0f] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
          <div className="max-w-xl">
            <span className="section-label">[ Blog ]</span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-2 text-white">
              Latest updates
            </h1>
            <p className="text-lg text-gray-400 mt-4">
              Insights on AI assessment, proficiency measurement, and workforce readiness.
            </p>
          </div>

          <div className="flex gap-2 mt-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  activeCategory === cat
                    ? "bg-orange-500/10 text-white border border-orange-500/20"
                    : "text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {filtered.map((post) => (
              <div
                key={post.title}
                className="glass-strong p-6 rounded-2xl group cursor-pointer hover:border-orange-500/20 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 font-mono">
                    {post.tag}
                  </span>
                  <span className="text-xs text-white/30">{post.date}</span>
                </div>
                <h2 className="text-lg font-semibold text-white group-hover:text-orange-300 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
