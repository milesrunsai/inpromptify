"use client";
import { useState } from "react";

const faqs = [
  {
    question: "What types of AI skills does InpromptiFy assess?",
    answer:
      "InpromptiFy covers a comprehensive range of AI competencies including prompt engineering, LLM fundamentals, RAG architecture, fine-tuning, AI safety and ethics, model evaluation, deployment strategies, and more. Our question bank is continuously updated to reflect the latest developments in AI.",
  },
  {
    question: "How does adaptive difficulty work?",
    answer:
      "Our AI engine uses Item Response Theory (IRT) and Bayesian estimation to dynamically adjust question difficulty in real-time. If you answer correctly, the next question gets harder; if you answer incorrectly, it gets easier. This converges on your true skill level in fewer questions than a fixed-difficulty test.",
  },
  {
    question: "Can I create custom assessments for my organization?",
    answer:
      "Yes. Our drag-and-drop assessment builder lets you create custom tests with multiple question types including multiple choice, code challenges, free response, and scenario-based questions. You can set custom scoring rubrics, time limits, and passing thresholds.",
  },
  {
    question: "How is scoring calculated?",
    answer:
      "Scoring uses a combination of correctness, difficulty weighting, and time-based factors. Each question contributes to category-level scores which roll up into an overall proficiency score. AI-graded free response questions use rubric-based evaluation for consistency.",
  },
  {
    question: "Are certifications verifiable?",
    answer:
      "Yes. All certificates issued through InpromptiFy include a unique verification ID and QR code. Anyone can verify a certificate's authenticity through our public verification portal. Enterprise plans include blockchain-anchored verification for tamper-proof credential integrity.",
  },
  {
    question: "What integrations are available?",
    answer:
      "InpromptiFy integrates with popular ATS platforms (Greenhouse, Lever, Ashby), LMS systems (Canvas, Moodle), SSO providers (Okta, Auth0), and communication tools (Slack, Teams). Our REST API and webhooks enable custom integrations with any platform.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Yes. Our free tier includes unlimited practice assessments, basic skill reports, and access to our public question bank. Paid plans add features like custom assessments, team analytics, certifications, API access, and priority support.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="reveal text-center mb-16">
          <span className="section-label">[ FAQ ]</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4 text-white">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="reveal glass-strong rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm text-white/80 pr-4">{faq.question}</span>
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-md bg-white/[0.04] text-white/40 flex items-center justify-center transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`accordion-content ${isOpen ? "open" : ""}`}
                >
                  <div className="px-6 pb-4">
                    <p className="text-sm text-white/40 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
