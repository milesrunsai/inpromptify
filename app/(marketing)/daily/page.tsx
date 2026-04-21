"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

interface QuizQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  difficulty: number;
  maxTimeSeconds: number;
}

interface QuizResponse {
  questionId: string;
  selectedOptionId: string;
  timeTakenMs: number;
}

interface AttemptResult {
  attempt: {
    id: string;
    score: number;
    totalQuestions: number;
    streak: number;
    date: string;
  };
  rank: number;
  totalParticipants: number;
  percentile: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  time: string;
}

type Phase = "loading" | "intro" | "email" | "quiz" | "results" | "already-taken";

export default function DailyQuizPage() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [existingAttempt, setExistingAttempt] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [todayStats, setTodayStats] = useState({ participants: 0, topScore: 0 });
  const questionStartRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Load questions on mount
  useEffect(() => {
    Promise.all([
      fetch("/api/daily").then((r) => r.json()),
      fetch("/api/daily/status").then((r) => r.json()),
    ]).then(([quizData, statusData]) => {
      setQuestions(quizData.questions || []);
      setTodayStats(statusData.todayStats || { participants: 0, topScore: 0 });

      if (statusData.taken) {
        setExistingAttempt(statusData.attempt);
        setPhase("already-taken");
      } else {
        setPhase("intro");
      }
    }).catch(() => setPhase("intro"));
  }, []);

  // Load daily leaderboard
  useEffect(() => {
    fetch("/api/leaderboard?tab=daily")
      .then((r) => r.json())
      .then((data) => {
        if (data.entries) {
          setLeaderboard(
            data.entries.slice(0, 20).map((e: any, i: number) => ({
              rank: i + 1,
              name: e.name,
              score: e.score,
              time: e.date,
            }))
          );
        }
      })
      .catch(() => {});
  }, [result, existingAttempt]);

  // Timer countdown
  useEffect(() => {
    if (phase !== "quiz") return;
    setTimeLeft(30);
    questionStartRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit with no answer
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentIndex]);

  const handleAnswer = useCallback(
    (optionId: string | null) => {
      if (timerRef.current) clearInterval(timerRef.current);

      const timeTaken = Date.now() - questionStartRef.current;
      const question = questions[currentIndex];
      if (!question) return;

      const response: QuizResponse = {
        questionId: question.id,
        selectedOptionId: optionId || "",
        timeTakenMs: timeTaken,
      };

      const newResponses = [...responses, response];
      setResponses(newResponses);
      setSelectedOption(null);

      if (currentIndex + 1 >= questions.length) {
        // Submit quiz
        submitQuiz(newResponses);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex, questions, responses]
  );

  async function submitQuiz(finalResponses: QuizResponse[]) {
    setSubmitting(true);
    setPhase("loading");

    try {
      const res = await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase(),
          answers: finalResponses,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setExistingAttempt(data.attempt);
        setPhase("already-taken");
      } else if (res.ok) {
        setResult(data);
        setPhase("results");
      } else {
        alert(data.error || "Something went wrong");
        setPhase("intro");
      }
    } catch {
      alert("Network error. Please try again.");
      setPhase("intro");
    } finally {
      setSubmitting(false);
    }
  }

  function handleStartQuiz() {
    if (!email) return;
    // Check status for this email
    fetch(`/api/daily/status?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.taken) {
          setExistingAttempt(data.attempt);
          setPhase("already-taken");
        } else {
          setCurrentIndex(0);
          setResponses([]);
          setPhase("quiz");
        }
      })
      .catch(() => {
        setCurrentIndex(0);
        setResponses([]);
        setPhase("quiz");
      });
  }

  const shareText = result
    ? `I scored ${result.attempt.score}/${result.attempt.totalQuestions} on today's InpromptiFy Daily AI Challenge! Can you beat me? inpromptify.com/daily`
    : "";

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/daily/results?date=${result?.attempt.date || ""}&score=${result?.attempt.score || 0}`
    : "";

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Loading */}
        {phase === "loading" && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60 mt-4 text-sm">
              {submitting ? "Submitting your answers..." : "Loading daily challenge..."}
            </p>
          </div>
        )}

        {/* Intro */}
        {phase === "intro" && (
          <div className="text-center">
            <span className="inline-block text-xs tracking-[0.2em] uppercase text-orange-500 font-mono mb-4">
              [ Daily Challenge ]
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Daily AI <span className="gradient-text">Challenge</span>
            </h1>
            <p className="text-sm text-white/50 mt-2">{todayDate}</p>

            {todayStats.participants > 0 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="text-xs text-white/40">
                  {todayStats.participants} played today
                </span>
                <span className="text-xs text-white/40">
                  Top score: {todayStats.topScore}/5
                </span>
              </div>
            )}

            <div className="mt-10 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 text-left max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                  <span>questions about AI &amp; prompt engineering</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">30s</span>
                  <span>per question — think fast!</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1x</span>
                  <span>attempt per day — everyone gets the same questions</span>
                </li>
              </ul>

              <button
                onClick={() => setPhase("email")}
                className="glow-btn w-full px-8 py-3.5 text-base mt-8"
              >
                Start Today&apos;s Challenge
              </button>
            </div>
          </div>
        )}

        {/* Email input */}
        {phase === "email" && (
          <div className="text-center">
            <span className="inline-block text-xs tracking-[0.2em] uppercase text-orange-500 font-mono mb-4">
              [ Daily Challenge ]
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">Enter your email</h2>
            <p className="text-sm text-white/50 mb-8">
              To track your score, streak, and leaderboard position
            </p>

            <div className="max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStartQuiz()}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.12] text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 text-sm"
                autoFocus
              />
              <button
                onClick={handleStartQuiz}
                disabled={!email || !email.includes("@")}
                className="glow-btn w-full px-8 py-3.5 text-base mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Begin Quiz
              </button>
              <button
                onClick={() => setPhase("intro")}
                className="text-xs text-white/40 hover:text-white/60 mt-3 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Quiz flow */}
        {phase === "quiz" && questions[currentIndex] && (
          <div>
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-white/40 tabular-nums">
                {currentIndex + 1}/{questions.length}
              </span>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs text-white/40 uppercase tracking-wider">
                Question {currentIndex + 1}
              </span>
              <div className={`flex items-center gap-2 ${timeLeft <= 10 ? "text-red-400" : "text-white/60"}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span className="text-sm font-mono tabular-nums font-bold">{timeLeft}s</span>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
                {questions[currentIndex].text}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentIndex].options.map((option, idx) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedOption(option.id);
                    // Small delay for visual feedback
                    setTimeout(() => handleAnswer(option.id), 200);
                  }}
                  disabled={selectedOption !== null}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                    selectedOption === option.id
                      ? "bg-orange-500/20 border-orange-500/50 text-white"
                      : "bg-white/[0.03] border-white/[0.08] text-white/80 hover:border-orange-500/30 hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-xs font-bold text-white/40 flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm sm:text-base">{option.text}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {phase === "results" && result && (
          <div className="text-center">
            <span className="inline-block text-xs tracking-[0.2em] uppercase text-orange-500 font-mono mb-4">
              [ Results ]
            </span>

            {/* Score card */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 mb-8">
              <div className="text-6xl sm:text-7xl font-bold gradient-text mb-2">
                {result.attempt.score}/{result.attempt.totalQuestions}
              </div>
              <p className="text-lg text-white/60">
                {result.percentile >= 85
                  ? "Outstanding!"
                  : result.percentile >= 60
                  ? "Great job!"
                  : result.percentile >= 30
                  ? "Not bad!"
                  : "Keep practicing!"}
              </p>

              <div className="flex items-center justify-center gap-6 mt-6">
                {result.totalParticipants > 1 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">Top {100 - result.percentile}%</div>
                    <div className="text-xs text-white/40">today</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">#{result.rank}</div>
                  <div className="text-xs text-white/40">rank</div>
                </div>
                {result.attempt.streak > 1 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{result.attempt.streak}</div>
                    <div className="text-xs text-white/40">day streak</div>
                  </div>
                )}
              </div>
            </div>

            {/* Share buttons */}
            <div className="mb-8">
              <p className="text-sm text-white/40 mb-3">Share your score</p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Post
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareText);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Copy
                </button>
              </div>
            </div>

            {/* Today's leaderboard */}
            {leaderboard.length > 0 && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold text-white mb-4">Today&apos;s Leaderboard</h3>
                <div className="space-y-2">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.03]"
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        entry.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                        entry.rank === 2 ? "bg-gray-400/20 text-gray-300" :
                        entry.rank === 3 ? "bg-orange-700/20 text-orange-400" :
                        "bg-white/[0.04] text-white/40"
                      }`}>
                        {entry.rank}
                      </span>
                      <span className="flex-1 text-sm text-white/70 truncate">{entry.name}</span>
                      <span className="text-sm font-bold text-white tabular-nums">{entry.score}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white">Want a full assessment?</h3>
              <p className="text-sm text-white/60 mt-2">
                Take the 10-minute PromptScore test for a comprehensive AI proficiency evaluation.
              </p>
              <Link href="/assess" className="glow-btn px-8 py-3 text-sm font-medium inline-block mt-4">
                Take Full Assessment
              </Link>
            </div>
          </div>
        )}

        {/* Already taken */}
        {phase === "already-taken" && existingAttempt && (
          <div className="text-center">
            <span className="inline-block text-xs tracking-[0.2em] uppercase text-orange-500 font-mono mb-4">
              [ Already Completed ]
            </span>
            <h1 className="text-3xl font-bold text-white mb-2">
              You&apos;ve already taken today&apos;s challenge
            </h1>
            <p className="text-sm text-white/50 mb-8">{todayDate}</p>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 mb-8">
              <div className="text-6xl font-bold gradient-text mb-2">
                {existingAttempt.score}/{existingAttempt.totalQuestions}
              </div>
              <p className="text-white/60">Your score today</p>
              {existingAttempt.streak > 1 && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
                  <span className="text-orange-400 font-bold">{existingAttempt.streak}</span>
                  <span className="text-sm text-orange-400/70">day streak</span>
                </div>
              )}
            </div>

            {/* Share */}
            <div className="mb-8">
              <p className="text-sm text-white/40 mb-3">Share your score</p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `I scored ${existingAttempt.score}/${existingAttempt.totalQuestions} on today's InpromptiFy Daily AI Challenge! Can you beat me? inpromptify.com/daily`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Post
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/daily/results?date=${existingAttempt.date}&score=${existingAttempt.score}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Today's leaderboard */}
            {leaderboard.length > 0 && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold text-white mb-4">Today&apos;s Leaderboard</h3>
                <div className="space-y-2">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.03]"
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        entry.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                        entry.rank === 2 ? "bg-gray-400/20 text-gray-300" :
                        entry.rank === 3 ? "bg-orange-700/20 text-orange-400" :
                        "bg-white/[0.04] text-white/40"
                      }`}>
                        {entry.rank}
                      </span>
                      <span className="flex-1 text-sm text-white/70 truncate">{entry.name}</span>
                      <span className="text-sm font-bold text-white tabular-nums">{entry.score}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-white/40">
              Come back tomorrow for a new challenge!
            </p>

            <div className="mt-6">
              <Link href="/assess" className="glow-btn px-8 py-3 text-sm font-medium inline-block">
                Take Full Assessment
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
