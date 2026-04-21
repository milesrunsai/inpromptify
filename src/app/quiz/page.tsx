"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { QUIZ_QUESTIONS, getLetterGrade, getPercentileEstimate } from "@/lib/quizQuestions";

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZ_QUESTIONS.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const questionStartTime = useRef<number>(0);
  const completionSent = useRef(false);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) { setFinished(true); return; }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [started, finished, timeLeft]);

  const selectAnswer = useCallback((index: number) => {
    if (finished) return;
    const next = [...answers];
    next[currentQ] = index;
    setAnswers(next);
    setShowExplanation(true);

    // Fire-and-forget: record response
    const q = QUIZ_QUESTIONS[currentQ];
    const responseTimeMs = questionStartTime.current ? Date.now() - questionStartTime.current : undefined;
    fetch("/api/quiz/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        questionId: q.id,
        answerIndex: index,
        isCorrect: index === q.correctIndex,
        responseTimeMs,
      }),
    }).catch(() => {});
  }, [answers, currentQ, finished, sessionId]);

  const nextQuestion = useCallback(() => {
    setShowExplanation(false);
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      questionStartTime.current = Date.now();
    } else {
      setFinished(true);
    }
  }, [currentQ]);

  // Send completion data when quiz finishes
  useEffect(() => {
    if (finished && sessionId && !completionSent.current) {
      completionSent.current = true;
      const finalScore = answers.reduce<number>((acc, a, i) => acc + (a === QUIZ_QUESTIONS[i].correctIndex ? 1 : 0), 0);
      fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          score: finalScore,
          totalQuestions: QUIZ_QUESTIONS.length,
          timeSpentSeconds: 300 - timeLeft,
        }),
      }).catch(() => {});
    }
  }, [finished, sessionId, answers, timeLeft]);

  const score = answers.reduce<number>((acc, a, i) => acc + (a === QUIZ_QUESTIONS[i].correctIndex ? 1 : 0), 0);
  const grade = getLetterGrade(score, QUIZ_QUESTIONS.length);
  const percentile = getPercentileEstimate(score, QUIZ_QUESTIONS.length);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!started) {
    return (
      <>
        <Nav />
        <main className="bg-[#111118] min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl w-full py-20">
            <div className="text-center mb-12">
              <p className="text-[11px] font-mono text-orange-400/70 uppercase tracking-wider mb-3">Free Assessment</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                AI Fundamentals Quiz
              </h1>
              <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
                10 questions. 5 minutes. Find out where you stand on AI fundamentals — prompt engineering,
                model selection, hallucination awareness, and more.
              </p>
            </div>

            <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-8 text-center">
              <div className="grid grid-cols-3 gap-px bg-white/[0.04] rounded-lg overflow-hidden mb-8 max-w-sm mx-auto">
                <div className="bg-[#0C1120] px-4 py-3">
                  <span className="text-lg font-bold text-white block">10</span>
                  <span className="text-[11px] text-gray-600">questions</span>
                </div>
                <div className="bg-[#0C1120] px-4 py-3">
                  <span className="text-lg font-bold text-white block">5 min</span>
                  <span className="text-[11px] text-gray-600">time limit</span>
                </div>
                <div className="bg-[#0C1120] px-4 py-3">
                  <span className="text-lg font-bold text-white block">Free</span>
                  <span className="text-[11px] text-gray-600">no signup</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-8 max-w-md mx-auto text-left">
                <p>Topics covered:</p>
                <ul className="grid grid-cols-2 gap-1 text-[13px]">
                  {["Prompt Engineering", "Model Selection", "Hallucination Awareness", "Ethical AI Use", "Chain-of-Thought", "RAG Concepts", "Few-Shot Prompting", "AI Limitations", "Temperature & Parameters", "When NOT to Use AI"].map((t) => (
                    <li key={t} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-orange-400/60 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setSessionId(crypto.randomUUID());
                  questionStartTime.current = Date.now();
                  completionSent.current = false;
                  setStarted(true);
                }}
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white px-8 py-3 rounded-md text-sm font-medium transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (finished) {
    const scoreColor = score >= 8 ? "text-orange-300" : score >= 6 ? "text-orange-400" : score >= 4 ? "text-orange-400/70" : "text-orange-500/50";
    const gradeColor = score >= 8 ? "border-orange-400/30 bg-orange-400/[0.08]" : score >= 6 ? "border-orange-500/25 bg-orange-400/[0.06]" : score >= 4 ? "border-orange-500/15 bg-orange-400/[0.04]" : "border-orange-600/10 bg-orange-500/[0.02]";

    return (
      <>
        <Nav />
        <main className="bg-[#111118] min-h-screen">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 pb-20 md:pb-28">
            <div className="text-center mb-8">
              <p className="text-[11px] font-mono text-orange-400/70 uppercase tracking-wider mb-3">Your Results</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                AI Fundamentals Score
              </h1>
            </div>

            {/* Score Card */}
            <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-8 mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
                <div className="text-center">
                  <span className={`text-6xl font-bold ${scoreColor}`}>{score}</span>
                  <span className="text-2xl text-gray-600">/{QUIZ_QUESTIONS.length}</span>
                  <p className="text-sm text-gray-500 mt-1">correct answers</p>
                </div>
                <div className={`border rounded-xl px-6 py-4 text-center ${gradeColor}`}>
                  <span className={`text-4xl font-bold ${scoreColor}`}>{grade}</span>
                  <p className="text-sm text-gray-500 mt-1">letter grade</p>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-bold text-white">{percentile}th</span>
                  <p className="text-sm text-gray-500 mt-1">percentile</p>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-6">
                <p className="text-sm text-gray-400 text-center mb-6">
                  {score >= 8
                    ? "Excellent. You have a strong grasp of AI fundamentals. Ready for the full PromptScore assessment?"
                    : score >= 6
                      ? "Solid foundation. You understand the key concepts. See how you perform with live AI in the full assessment."
                      : score >= 4
                        ? "Room to improve. The full assessment will show exactly where to focus your learning."
                        : "The AI landscape is evolving fast. The full assessment gives you a detailed breakdown of your strengths and gaps."
                  }
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/test/demo"
                    className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
                  >
                    Take the Full PromptScore Assessment
                  </Link>
                  <button
                    onClick={() => {
                      setStarted(false);
                      setFinished(false);
                      setCurrentQ(0);
                      setAnswers(new Array(QUIZ_QUESTIONS.length).fill(null));
                      setTimeLeft(300);
                      setShowExplanation(false);
                      setEmail("");
                      setEmailSaved(false);
                    }}
                    className="inline-flex items-center justify-center text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]"
                  >
                    Retake Quiz
                  </button>
                </div>

                {/* Optional email capture */}
                <div className="border-t border-white/[0.06] mt-6 pt-6">
                  {emailSaved ? (
                    <p className="text-sm text-gray-500">Results saved to {email}</p>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email to save results"
                        className="flex-1 w-full sm:w-auto bg-transparent border border-white/[0.08] rounded-md px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-orange-500/40"
                      />
                      <button
                        onClick={() => {
                          if (!email) return;
                          setEmailSaved(true);
                          fetch("/api/quiz/complete", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              sessionId,
                              email,
                              score,
                              totalQuestions: QUIZ_QUESTIONS.length,
                              timeSpentSeconds: 300 - timeLeft,
                            }),
                          }).catch(() => {});
                        }}
                        className="whitespace-nowrap text-sm text-orange-400 hover:text-orange-300 px-3 py-2 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Review Answers */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Review Your Answers</h3>
              {QUIZ_QUESTIONS.map((q, i) => {
                const isCorrect = answers[i] === q.correctIndex;
                return (
                  <div key={q.id} className="bg-[#0C1120] border border-white/[0.06] rounded-lg p-5">
                    <div className="flex items-start gap-3 mb-2">
                      <span className={`text-sm font-mono mt-0.5 ${isCorrect ? "text-orange-300" : "text-orange-500/50"}`}>
                        {isCorrect ? "✓" : "✗"}
                      </span>
                      <div>
                        <p className="text-sm text-white mb-1">{q.question}</p>
                        <p className="text-[12px] text-gray-600">
                          Your answer: <span className={isCorrect ? "text-orange-300" : "text-orange-500/50"}>
                            {answers[i] !== null ? q.options[answers[i]!] : "Not answered"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-[12px] text-orange-400/70 mt-0.5">
                            Correct: {q.options[q.correctIndex]}
                          </p>
                        )}
                        <p className="text-[12px] text-gray-500 mt-2 italic">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Active quiz
  const q = QUIZ_QUESTIONS[currentQ];
  const selected = answers[currentQ];

  return (
    <>
      <Nav />
      <main className="bg-[#111118] min-h-screen">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 pb-12 md:pb-20">
          {/* Progress bar + timer */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {currentQ + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <div className="w-32 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQ + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
            <span className={`text-sm font-mono ${timeLeft <= 60 ? "text-orange-300 animate-pulse" : "text-gray-500"}`}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>

          {/* Category */}
          <p className="text-[11px] font-mono text-orange-400/70 uppercase tracking-wider mb-3">{q.category}</p>

          {/* Question */}
          <h2 className="text-lg md:text-xl font-semibold text-white mb-6 leading-relaxed">
            {q.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {q.options.map((opt, i) => {
              let optStyle = "border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]";
              if (showExplanation) {
                if (i === q.correctIndex) {
                  optStyle = "border-orange-400/40 bg-orange-400/[0.06]";
                } else if (i === selected && i !== q.correctIndex) {
                  optStyle = "border-orange-600/30 bg-orange-500/[0.04]";
                } else {
                  optStyle = "border-white/[0.04] opacity-50";
                }
              } else if (selected === i) {
                optStyle = "border-orange-500/40 bg-orange-400/[0.06]";
              }

              return (
                <button
                  key={i}
                  onClick={() => !showExplanation && selectAnswer(i)}
                  disabled={showExplanation}
                  className={`w-full text-left border rounded-lg px-5 py-3.5 text-sm transition-all ${optStyle}`}
                >
                  <span className="text-gray-500 font-mono mr-3">{String.fromCharCode(65 + i)}.</span>
                  <span className={showExplanation && i === q.correctIndex ? "text-orange-300" : "text-gray-300"}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation + Next */}
          {showExplanation && (
            <div className="mb-6">
              <div className="bg-[#0C1120] border border-white/[0.06] rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400">{q.explanation}</p>
              </div>
              <button
                onClick={nextQuestion}
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                {currentQ < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "See Results"}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
