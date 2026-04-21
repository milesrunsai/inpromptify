"use client";

import { useState } from "react";
import { Turnstile } from "@/components/turnstile";

const difficulties = ["Easy", "Medium", "Hard", "Expert"] as const;
const optionLabels = ["A", "B", "C", "D"] as const;

export default function SuggestPage() {
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string>("Medium");
  const [tags, setTags] = useState("");
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const updateOption = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (text.length < 20) {
      setResult({ success: false, message: "Question must be at least 20 characters." });
      return;
    }
    if (options.some((o) => !o.trim())) {
      setResult({ success: false, message: "All four answer options are required." });
      return;
    }
    if (!correctAnswer) {
      setResult({ success: false, message: "Please select the correct answer." });
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          options: optionLabels.map((id, i) => ({ id, text: options[i] })),
          correctOptionId: correctAnswer,
          difficulty,
          tags: tags || undefined,
          email: email || undefined,
          turnstileToken: turnstileToken || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ success: false, message: data.error || "Something went wrong." });
      } else {
        setResult({ success: true, message: data.message });
        // Reset form
        setText("");
        setOptions(["", "", "", ""]);
        setCorrectAnswer(null);
        setDifficulty("Medium");
        setTags("");
        setEmail("");
      }
    } catch {
      setResult({ success: false, message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-24">
      <div className="text-center mb-12">
        <span className="section-label">[ Community ]</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mt-2">
          Suggest a Question
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-400">
          Help us build the world&apos;s best AI proficiency question bank
        </p>
      </div>

      {result?.success ? (
        <div className="glass-strong rounded-2xl p-8 sm:p-12 text-center">
          <div className="text-orange-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Thanks!</h2>
          <p className="mt-2 text-sm text-gray-400">
            Your question will be reviewed by our team.
          </p>
          <button
            onClick={() => setResult(null)}
            className="mt-6 text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            Submit another question
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Question text */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Question <span className="text-white/30">(20–500 characters)</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              minLength={20}
              maxLength={500}
              rows={4}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
              placeholder="Write your AI proficiency question here..."
            />
            <p className="mt-1 text-xs text-white/30 text-right">{text.length}/500</p>
          </div>

          {/* Answer options */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">Answer Options</label>
            <div className="space-y-3">
              {optionLabels.map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white/40 w-6 shrink-0">{label}.</span>
                  <input
                    type="text"
                    value={options[i]}
                    onChange={(e) => updateOption(i, e.target.value)}
                    required
                    className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder={`Option ${label}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Correct answer */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">Correct Answer</label>
            <div className="flex gap-3">
              {optionLabels.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setCorrectAnswer(label)}
                  className={`
                    h-10 w-10 rounded-lg text-sm font-medium transition-all
                    ${correctAnswer === label
                      ? "bg-orange-500 text-white"
                      : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    difficulty === d
                      ? "bg-orange-500 text-white"
                      : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Category / Tags <span className="text-white/30">(optional, comma separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              placeholder="e.g. prompt engineering, ChatGPT, agents"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Your Email <span className="text-white/30">(optional — so we can credit you if approved)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* Turnstile */}
          <Turnstile
            onVerify={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
          />

          {/* Error message */}
          {result && !result.success && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {result.message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="glow-btn w-full py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Question"}
          </button>
        </form>
      )}
    </div>
  );
}
