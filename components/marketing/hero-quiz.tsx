'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { HERO_QUIZ_BANK, type HeroQuestion } from './quiz-questions'

function selectRandomQuestions(bank: HeroQuestion[], count: number): HeroQuestion[] {
  const shuffled = [...bank]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

export function HeroQuiz() {
  const questions = useMemo(() => selectRandomQuestions(HERO_QUIZ_BANK, 4), [])

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
  }, [selected, submitted, currentQ, completedCount, totalQuestions, questions])

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <span className="ml-3 text-xs text-white/30 font-mono hidden sm:inline">
          assessment.inpromptify.com
        </span>
      </div>

      {/* Card body */}
      <div className="p-4 sm:p-6">
        {finished ? (
          <div className="text-center py-4 sm:py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 mb-5">
              <span className="text-2xl font-bold gradient-text">{correctCount}/{totalQuestions}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Assessment Complete</h3>
            <p className="text-sm text-gray-400 mb-6">
              {correctCount === totalQuestions
                ? 'Perfect score! You really know how to use AI.'
                : correctCount >= 3
                ? 'Great job! You have solid AI skills.'
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
                    className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border transition-all w-full text-left ${borderClass} ${
                      !submitted ? 'hover:border-white/[0.12] cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono ${idClass}`}
                    >
                      {opt.id}
                    </span>
                    <span className={`text-xs sm:text-sm ${textClass}`}>
                      {opt.text}
                    </span>
                    {submitted && isCorrect && (
                      <span className="ml-auto text-emerald-400 flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.3 4.3L6 11.6 2.7 8.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                    {submitted && isSelected && !isCorrect && (
                      <span className="ml-auto text-red-400 flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    )}
                    {!submitted && isSelected && (
                      <span className="ml-auto text-orange-400 flex-shrink-0">
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
