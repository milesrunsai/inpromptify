'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

const questions = [
  {
    difficulty: 'INTERMEDIATE',
    category: 'AI Fundamentals',
    text: 'Which technique allows a large language model to generate more accurate responses by first producing a step-by-step reasoning process?',
    options: [
      { id: 'A', text: 'Fine-tuning' },
      { id: 'B', text: 'Chain-of-thought prompting' },
      { id: 'C', text: 'Tokenization' },
      { id: 'D', text: 'Gradient descent' },
    ],
    correctId: 'B',
  },
  {
    difficulty: 'ADVANCED',
    category: 'RAG Architecture',
    text: 'In a Retrieval-Augmented Generation pipeline, what is the primary purpose of the embedding model?',
    options: [
      { id: 'A', text: 'Generate the final response text' },
      { id: 'B', text: 'Rank documents by publication date' },
      { id: 'C', text: 'Convert text into vector representations for similarity search' },
      { id: 'D', text: 'Compress the context window size' },
    ],
    correctId: 'C',
  },
  {
    difficulty: 'BEGINNER',
    category: 'Prompt Engineering',
    text: 'What is "few-shot prompting"?',
    options: [
      { id: 'A', text: 'Training a model on a small dataset' },
      { id: 'B', text: "Providing examples in the prompt to guide the model's response" },
      { id: 'C', text: 'Using multiple models simultaneously' },
      { id: 'D', text: 'Limiting the output token count' },
    ],
    correctId: 'B',
  },
  {
    difficulty: 'INTERMEDIATE',
    category: 'AI Safety',
    text: 'Which approach helps prevent an LLM from generating harmful or biased outputs?',
    options: [
      { id: 'A', text: 'Increasing temperature to maximum' },
      { id: 'B', text: 'Removing all training data filters' },
      { id: 'C', text: 'RLHF (Reinforcement Learning from Human Feedback)' },
      { id: 'D', text: 'Using a larger context window' },
    ],
    correctId: 'C',
  },
]

export function HeroQuiz() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const totalQuestions = questions.length
  const progressPercent = Math.round((completedCount / totalQuestions) * 100)
  const question = questions[currentQ]

  const handleSubmit = useCallback(() => {
    if (!selected || submitted) return
    setSubmitted(true)

    const isCorrect = selected === questions[currentQ].correctId
    if (isCorrect) setCorrectCount((c) => c + 1)
    const newCompleted = completedCount + 1

    setCompletedCount(newCompleted)

    setTimeout(() => {
      if (newCompleted >= totalQuestions) {
        setFinished(true)
      } else {
        setCurrentQ((q) => q + 1)
        setSelected(null)
        setSubmitted(false)
      }
    }, 1500)
  }, [selected, submitted, currentQ, completedCount, totalQuestions])

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <span className="ml-3 text-xs text-white/30 font-mono">
          assessment.inpromptify.com
        </span>
      </div>

      {/* Card body */}
      <div className="p-6">
        {finished ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 mb-5">
              <span className="text-2xl font-bold gradient-text">{correctCount}/{totalQuestions}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Assessment Complete</h3>
            <p className="text-sm text-white/40 mb-6">
              {correctCount === totalQuestions
                ? 'Perfect score! You know your AI fundamentals.'
                : correctCount >= 3
                ? 'Great job! You have solid AI knowledge.'
                : correctCount >= 2
                ? "Good start — there's room to grow."
                : 'Keep learning — AI proficiency takes practice.'}
            </p>
            <p className="text-sm text-orange-400 font-medium mb-5">See how your team stacks up</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/sign-up"
                className="glow-btn w-full py-2.5 text-sm font-medium inline-block text-center"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/40 font-mono">
                Question {currentQ + 1} of {totalQuestions}
              </span>
              <span className="text-xs text-orange-400 font-mono">
                {progressPercent}% complete
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full mb-6">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Difficulty badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 text-[11px] font-mono">
                {question.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] text-white/40 text-[11px] font-mono">
                {question.category}
              </span>
            </div>

            {/* Question */}
            <p className="text-sm text-white/80 leading-relaxed mb-5">
              {question.text}
            </p>

            {/* Options */}
            <div className="space-y-2.5">
              {question.options.map((opt) => {
                const isSelected = selected === opt.id
                const isCorrect = opt.id === question.correctId
                let borderClass = 'border-white/[0.06] bg-white/[0.02]'
                let idClass = 'bg-white/[0.04] text-white/30'
                let textClass = 'text-white/50'

                if (submitted && isCorrect) {
                  borderClass = 'border-emerald-500/40 bg-emerald-500/[0.08]'
                  idClass = 'bg-emerald-500/20 text-emerald-400'
                  textClass = 'text-white/90'
                } else if (submitted && isSelected && !isCorrect) {
                  borderClass = 'border-red-500/40 bg-red-500/[0.08]'
                  idClass = 'bg-red-500/20 text-red-400'
                  textClass = 'text-white/90'
                } else if (isSelected) {
                  borderClass = 'border-orange-500/40 bg-orange-500/[0.08]'
                  idClass = 'bg-orange-500/20 text-orange-400'
                  textClass = 'text-white/90'
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => !submitted && setSelected(opt.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all w-full text-left ${borderClass} ${
                      !submitted ? 'hover:border-white/[0.12] cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono ${idClass}`}
                    >
                      {opt.id}
                    </span>
                    <span className={`text-sm ${textClass}`}>
                      {opt.text}
                    </span>
                    {submitted && isCorrect && (
                      <span className="ml-auto text-emerald-400">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.3 4.3L6 11.6 2.7 8.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                    {submitted && isSelected && !isCorrect && (
                      <span className="ml-auto text-red-400">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    )}
                    {!submitted && isSelected && (
                      <span className="ml-auto text-orange-400">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.3 4.3L6 11.6 2.7 8.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!selected || submitted}
              className={`mt-5 w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
                selected && !submitted
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white cursor-pointer hover:shadow-lg hover:shadow-orange-500/20'
                  : 'bg-white/[0.06] text-white/30 cursor-not-allowed'
              }`}
            >
              {submitted ? (selected === question.correctId ? 'Correct!' : 'Incorrect — see answer above') : 'Submit Answer'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
