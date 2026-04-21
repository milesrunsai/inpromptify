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

interface YesterdayEntry {
  rank: number;
  name: string;
  score: number;
  totalQuestions: number;
}

type Phase = "loading" | "intro" | "email" | "quiz" | "results" | "already-taken";

// CSS keyframes injected once
const styleId = "daily-quiz-styles";
function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.2), 0 0 40px rgba(249, 115, 22, 0.1); }
      50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.4), 0 0 60px rgba(249, 115, 22, 0.2); }
    }
    @keyframes fade-slide-up {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes score-pop {
      0% { transform: scale(0.5); opacity: 0; }
      60% { transform: scale(1.08); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes particle-float {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-120px) rotate(720deg); opacity: 0; }
    }
    .animate-pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
    .animate-fade-slide-up { animation: fade-slide-up 0.5s ease-out both; }
    .animate-score-pop { animation: score-pop 0.6s ease-out both; }
  `;
  document.head.appendChild(style);
}

function ConfettiParticles() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    duration: `${1.5 + Math.random() * 1.5}s`,
    color: ["#f97316", "#f59e0b", "#eab308", "#fb923c", "#fbbf24"][i % 5],
    size: 4 + Math.random() * 4,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: "40%",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animation: `particle-float ${p.duration} ease-out ${p.delay} forwards`,
          }}
        />
      ))}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const styles =
    rank === 1
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      : rank === 2
      ? "bg-gray-400/20 text-gray-300 border-gray-400/30"
      : rank === 3
      ? "bg-orange-700/20 text-orange-400 border-orange-700/30"
      : "bg-white/[0.04] text-white/40 border-white/[0.06]";
  return (
    <span
      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${styles}`}
    >
      {rank}
    </span>
  );
}

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
  const [todayStats, setTodayStats] = useState({ participants: 0, topScore: 0, avgScore: 0 });
  const [yesterdayLeaders, setYesterdayLeaders] = useState<YesterdayEntry[]>([]);
  const [questionVisible, setQuestionVisible] = useState(true);
  const questionStartRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { injectStyles(); }, []);

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
      setTodayStats(statusData.todayStats || { participants: 0, topScore: 0, avgScore: 0 });
      setYesterdayLeaders(statusData.yesterdayLeaders || []);

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

  // Entrance animation for questions
  useEffect(() => {
    if (phase !== "quiz") return;
    setQuestionVisible(false);
    const t = setTimeout(() => setQuestionVisible(true), 50);
    return () => clearTimeout(t);
  }, [currentIndex, phase]);

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
    ? `I scored ${result.attempt.score}/${result.attempt.totalQuestions} on today's Inpromptify Daily AI Challenge! Can you beat me? inpromptify.com/daily`
    : "";

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/daily/results?date=${result?.attempt.date || ""}&score=${result?.attempt.score || 0}`
    : "";

  // Timer color for quiz background glow
  const timerColor =
    timeLeft > 20 ? "rgba(34, 197, 94, 0.06)" :
    timeLeft > 10 ? "rgba(234, 179, 8, 0.06)" :
    "rgba(239, 68, 68, 0.08)";

  const timerBorderColor =
    timeLeft > 20 ? "border-green-500/20" :
    timeLeft > 10 ? "border-yellow-500/20" :
    "border-red-500/20";

  const timerTextColor =
    timeLeft > 20 ? "text-green-400" :
    timeLeft > 10 ? "text-yellow-400" :
    "text-red-400";

  return (
    <div className="relative pt-24 pb-16 min-h-screen grid-pattern">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(249,115,22,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative section-frame">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Loading */}
          {phase === "loading" && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-white/60 mt-4 text-sm">
                {submitting ? "Submitting your answers..." : "Loading daily challenge..."}
              </p>
            </div>
          )}

          {/* ===== INTRO PHASE ===== */}
          {phase === "intro" && (
            <div>
              {/* Hero */}
              <div className="text-center mb-10">
                <span className="section-label">[ Daily Challenge ]</span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  Daily AI <span className="gradient-text">Challenge</span>
                </h1>
                <p className="text-sm text-white/50 mt-2">{todayDate}</p>

                {/* Live stats bar */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mt-5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {todayStats.participants} played today
                  </span>
                  {todayStats.participants > 0 && (
                    <>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full glass text-xs text-white/60">
                        Avg: {todayStats.avgScore}/5
                      </span>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full glass text-xs text-white/60">
                        Top: {todayStats.topScore}/5
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Main card — split layout */}
              <div className="glass-strong p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* LEFT: Rules as mini stat cards */}
                  <div>
                    <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                      How it works
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "5", label: "Questions" },
                        { value: "30s", label: "Per question" },
                        { value: "1x", label: "Per day" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="glass rounded-xl p-4 text-center"
                        >
                          <div className="text-2xl sm:text-3xl font-bold gradient-text">
                            {stat.value}
                          </div>
                          <div className="text-[11px] text-white/40 mt-1 uppercase tracking-wide">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-white/30 mt-3">
                      Everyone gets the same questions. One attempt per day.
                    </p>
                  </div>

                  {/* RIGHT: Leaderboard preview */}
                  <div>
                    <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                      Today&apos;s leaderboard
                    </h3>
                    {leaderboard.length > 0 ? (
                      <div className="space-y-1.5">
                        {leaderboard.slice(0, 5).map((entry) => (
                          <div
                            key={entry.rank}
                            className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                          >
                            <RankBadge rank={entry.rank} />
                            <span className="flex-1 text-sm text-white/60 truncate">
                              {entry.name}
                            </span>
                            <span className="text-sm font-bold text-white tabular-nums">
                              {entry.score}/5
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[180px] rounded-xl glass">
                        <p className="text-sm text-white/30">
                          Be the first to play today
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setPhase("email")}
                    className="glow-btn w-full sm:w-auto px-10 py-4 text-base animate-pulse-glow"
                  >
                    Start Today&apos;s Challenge
                  </button>
                  <p className="text-xs text-white/30 mt-3">
                    Free, no account required — just enter your email
                  </p>
                </div>
              </div>

              {/* Yesterday's top scorers */}
              {yesterdayLeaders.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4 text-center">
                    Yesterday&apos;s top performers
                  </h3>
                  <div className="glass-strong p-5">
                    <div className="space-y-1.5">
                      {yesterdayLeaders.map((entry) => (
                        <div
                          key={entry.rank}
                          className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02]"
                        >
                          <RankBadge rank={entry.rank} />
                          <span className="flex-1 text-sm text-white/60 truncate">
                            {entry.name}
                          </span>
                          <span className="text-sm font-bold text-white tabular-nums">
                            {entry.score}/{entry.totalQuestions}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Full assessment link */}
              <div className="mt-8 text-center">
                <Link
                  href="/assess"
                  className="text-sm text-white/40 hover:text-orange-400/80 transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-orange-400/40"
                >
                  Take the full 10-minute assessment for your complete PromptScore
                </Link>
              </div>
            </div>
          )}

          {/* ===== EMAIL PHASE ===== */}
          {phase === "email" && (
            <div className="text-center animate-fade-slide-up">
              <span className="section-label">[ Daily Challenge ]</span>
              <h2 className="text-2xl font-bold text-white mb-2">Enter your email</h2>
              <p className="text-sm text-white/50 mb-8">
                To track your score and leaderboard position
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

          {/* ===== QUIZ PHASE ===== */}
          {phase === "quiz" && questions[currentIndex] && (
            <div className="relative">
              {/* Background glow that shifts with time */}
              <div
                className="absolute inset-0 -m-8 rounded-3xl transition-colors duration-1000 pointer-events-none"
                style={{ backgroundColor: timerColor }}
              />

              <div className="relative">
                {/* Progress bar */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                      style={{ width: `${(currentIndex / questions.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/40 tabular-nums">
                    {currentIndex + 1}/{questions.length}
                  </span>
                </div>

                {/* Timer — bigger, more prominent */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs text-white/40 uppercase tracking-wider">
                    Question {currentIndex + 1}
                  </span>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${timerBorderColor}`}
                    style={{ backgroundColor: timerColor }}
                  >
                    <svg className={`w-5 h-5 ${timerTextColor} transition-colors duration-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <span className={`text-lg font-mono tabular-nums font-bold ${timerTextColor} transition-colors duration-500`}>
                      {timeLeft}s
                    </span>
                  </div>
                </div>

                {/* Question with entrance animation */}
                <div
                  className={`transition-all duration-300 ${
                    questionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                >
                  <div className="glass-strong p-6 sm:p-8 mb-6">
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
              </div>
            </div>
          )}

          {/* ===== RESULTS PHASE ===== */}
          {phase === "results" && result && (
            <div className="text-center">
              <span className="section-label">[ Results ]</span>

              {/* Score card */}
              <div className="glass-strong p-8 sm:p-10 mb-8 relative overflow-hidden">
                {result.attempt.score >= 4 && <ConfettiParticles />}

                <div className="relative">
                  <div className="text-7xl sm:text-8xl font-bold gradient-text mb-2 animate-score-pop">
                    {result.attempt.score}/{result.attempt.totalQuestions}
                  </div>
                  <p className="text-lg text-white/60">
                    {result.percentile >= 85
                      ? "Outstanding performance."
                      : result.percentile >= 60
                      ? "Strong result."
                      : result.percentile >= 30
                      ? "Solid attempt."
                      : "Room to improve."}
                  </p>

                  <div className="flex items-center justify-center gap-6 mt-6">
                    {result.totalParticipants > 1 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">Top {Math.max(1, 100 - result.percentile)}%</div>
                        <div className="text-xs text-white/40">today</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">#{result.rank}</div>
                      <div className="text-xs text-white/40">your rank</div>
                    </div>
                    {result.attempt.streak > 1 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{result.attempt.streak}</div>
                        <div className="text-xs text-white/40">day streak</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Share buttons — full width stacked */}
              <div className="mb-8 space-y-3">
                <p className="text-sm text-white/40 mb-4">Share your result</p>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Post on X
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Share on LinkedIn
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(shareText)}
                  className="flex items-center justify-center gap-3 w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Copy to clipboard
                </button>
              </div>

              {/* Full leaderboard — top 20 */}
              {leaderboard.length > 0 && (
                <div className="glass-strong p-6 mb-8 text-left">
                  <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                    Today&apos;s leaderboard
                  </h3>
                  <div className="space-y-1.5">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                          result && entry.rank === result.rank
                            ? "bg-orange-500/10 border border-orange-500/20"
                            : "bg-white/[0.02] hover:bg-white/[0.04]"
                        }`}
                      >
                        <RankBadge rank={entry.rank} />
                        <span className="flex-1 text-sm text-white/60 truncate">{entry.name}</span>
                        <span className="text-sm font-bold text-white tabular-nums">{entry.score}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="glass-strong p-8">
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

          {/* ===== ALREADY TAKEN ===== */}
          {phase === "already-taken" && existingAttempt && (
            <div className="text-center">
              <span className="section-label">[ Already Completed ]</span>
              <h1 className="text-3xl font-bold text-white mb-2">
                You&apos;ve already taken today&apos;s challenge
              </h1>
              <p className="text-sm text-white/50 mb-8">{todayDate}</p>

              <div className="glass-strong p-8 sm:p-10 mb-8 relative overflow-hidden">
                {existingAttempt.score >= 4 && <ConfettiParticles />}
                <div className="relative">
                  <div className="text-7xl sm:text-8xl font-bold gradient-text mb-2">
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
              </div>

              {/* Share */}
              <div className="mb-8 space-y-3">
                <p className="text-sm text-white/40 mb-4">Share your result</p>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `I scored ${existingAttempt.score}/${existingAttempt.totalQuestions} on today's Inpromptify Daily AI Challenge! Can you beat me? inpromptify.com/daily`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Post on X
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/daily/results?date=${existingAttempt.date}&score=${existingAttempt.score}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Share on LinkedIn
                </a>
              </div>

              {/* Today's leaderboard — full */}
              {leaderboard.length > 0 && (
                <div className="glass-strong p-6 mb-8 text-left">
                  <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                    Today&apos;s leaderboard
                  </h3>
                  <div className="space-y-1.5">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                      >
                        <RankBadge rank={entry.rank} />
                        <span className="flex-1 text-sm text-white/60 truncate">{entry.name}</span>
                        <span className="text-sm font-bold text-white tabular-nums">{entry.score}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-white/40 mb-6">
                Come back tomorrow for a new challenge.
              </p>

              <Link href="/assess" className="glow-btn px-8 py-3 text-sm font-medium inline-block">
                Take Full Assessment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
