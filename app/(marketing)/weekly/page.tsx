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
    weekId: string;
    totalTimeMs: number;
  };
  rank: number;
  totalParticipants: number;
  percentile: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  totalQuestions: number;
  totalTimeMs: number;
  isYou: boolean;
}

interface WeeklyStatus {
  taken: boolean;
  attempt?: {
    id: string;
    score: number;
    totalQuestions: number;
    weekId: string;
    totalTimeMs: number;
  };
  weekId: string;
  endsAt: string;
  prize: boolean;
  participants: number;
}

type Phase = "loading" | "signed-out" | "intro" | "quiz" | "results" | "already-taken";

// CSS keyframes injected once
const styleId = "weekly-quiz-styles";
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
    @keyframes gold-shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .animate-pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
    .animate-fade-slide-up { animation: fade-slide-up 0.5s ease-out both; }
    .animate-score-pop { animation: score-pop 0.6s ease-out both; }
    .animate-gold-shimmer {
      background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b, #fbbf24);
      background-size: 200% auto;
      animation: gold-shimmer 3s linear infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
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

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function Countdown({ endsAt }: { endsAt: string }) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    function update() {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeStr("Ended");
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      setTimeStr(parts.join(" "));
    }
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return <span className="tabular-nums">{timeStr}</span>;
}

export default function WeeklyChallengeePage() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [status, setStatus] = useState<WeeklyStatus | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionVisible, setQuestionVisible] = useState(true);
  const questionStartRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { injectStyles(); }, []);

  // Load status on mount
  useEffect(() => {
    fetch("/api/weekly/status")
      .then((r) => {
        if (r.status === 401) {
          setPhase("signed-out");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setStatus(data);
        if (data.taken) {
          setPhase("already-taken");
        } else {
          setPhase("intro");
        }
      })
      .catch(() => setPhase("signed-out"));
  }, []);

  // Load leaderboard
  useEffect(() => {
    if (phase === "signed-out" || phase === "loading") return;
    fetch("/api/weekly/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.entries) setLeaderboard(data.entries);
      })
      .catch(() => {});
  }, [phase, result]);

  // Timer countdown
  useEffect(() => {
    if (phase !== "quiz") return;
    setTimeLeft(45);
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
        // Submit
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
      const res = await fetch("/api/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalResponses }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setStatus((prev) => prev ? { ...prev, taken: true, attempt: data.attempt } : prev);
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
    fetch("/api/weekly")
      .then((r) => r.json())
      .then((data) => {
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          setCurrentIndex(0);
          setResponses([]);
          setPhase("quiz");
        } else {
          alert("No questions available. Please try again later.");
        }
      })
      .catch(() => {
        alert("Failed to load questions. Please try again.");
      });
  }

  const shareText = result
    ? `I scored ${result.attempt.score}/${result.attempt.totalQuestions} on this week's Inpromptify Weekly Challenge! Can you beat me? inpromptify.com/weekly`
    : "";

  const existingAttempt = status?.attempt;
  const existingShareText = existingAttempt
    ? `I scored ${existingAttempt.score}/${existingAttempt.totalQuestions} on this week's Inpromptify Weekly Challenge! Can you beat me? inpromptify.com/weekly`
    : "";

  // Timer color for quiz background glow
  const timerColor =
    timeLeft > 30 ? "rgba(34, 197, 94, 0.06)" :
    timeLeft > 15 ? "rgba(234, 179, 8, 0.06)" :
    "rgba(239, 68, 68, 0.08)";

  const timerBorderColor =
    timeLeft > 30 ? "border-green-500/20" :
    timeLeft > 15 ? "border-yellow-500/20" :
    "border-red-500/20";

  const timerTextColor =
    timeLeft > 30 ? "text-green-400" :
    timeLeft > 15 ? "text-yellow-400" :
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
                {submitting ? "Submitting your answers..." : "Loading weekly challenge..."}
              </p>
            </div>
          )}

          {/* ===== SIGNED OUT ===== */}
          {phase === "signed-out" && (
            <div className="text-center animate-fade-slide-up">
              <span className="section-label">[ Weekly Challenge ]</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Weekly AI <span className="gradient-text">Challenge</span>
              </h1>
              <p className="text-white/50 mt-4 max-w-lg mx-auto">
                15 harder questions. 45 seconds each. One attempt per week.
                Top scorer wins a cash prize.
              </p>

              {/* Prize banner */}
              <div className="glass-strong p-6 sm:p-8 mt-8 border border-amber-500/20">
                <div className="text-3xl sm:text-4xl font-bold animate-gold-shimmer mb-2">
                  $50 AUD Weekly Prize
                </div>
                <p className="text-white/60 text-sm">
                  Top scorer each week wins $50 AUD cash. First 3 months.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <Link href="/sign-in" className="glow-btn w-full sm:w-auto px-10 py-4 text-base inline-block animate-pulse-glow">
                  Sign in to compete
                </Link>
                <p className="text-xs text-white/30">
                  Free account required for weekly challenges
                </p>
              </div>

              {/* Rules preview */}
              <div className="glass-strong p-6 sm:p-8 mt-10">
                <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                  How it works
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: "15", label: "Questions" },
                    { value: "45s", label: "Per question" },
                    { value: "1x", label: "Per week" },
                    { value: "Harder", label: "Difficulty" },
                  ].map((stat) => (
                    <div key={stat.label} className="glass rounded-xl p-4 text-center">
                      <div className="text-2xl sm:text-3xl font-bold gradient-text">
                        {stat.value}
                      </div>
                      <div className="text-[11px] text-white/40 mt-1 uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== INTRO PHASE ===== */}
          {phase === "intro" && status && (
            <div>
              {/* Hero */}
              <div className="text-center mb-10">
                <span className="section-label">[ Weekly Challenge ]</span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  Weekly AI <span className="gradient-text">Challenge</span>
                </h1>
                <p className="text-sm text-white/50 mt-2">{status.weekId}</p>

                {/* Live stats bar */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mt-5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {status.participants} competed this week
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full glass text-xs text-white/60">
                    Ends in <Countdown endsAt={status.endsAt} />
                  </span>
                </div>
              </div>

              {/* Prize banner */}
              {status.prize && (
                <div className="glass-strong p-6 sm:p-8 mb-8 border border-amber-500/20">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold animate-gold-shimmer">
                        $50 AUD Weekly Prize
                      </div>
                      <p className="text-white/50 text-sm mt-1">
                        Top scorer each week wins $50 AUD cash. First 3 months.
                      </p>
                    </div>
                    <div className="glass rounded-xl px-5 py-3 text-center">
                      <div className="text-xs text-white/40 uppercase tracking-wide">This week</div>
                      <div className="text-lg font-bold text-amber-400">#1 wins</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main card — split layout */}
              <div className="glass-strong p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* LEFT: Rules as mini stat cards */}
                  <div>
                    <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                      How it works
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "15", label: "Questions" },
                        { value: "45s", label: "Per question" },
                        { value: "1x", label: "Per week" },
                        { value: "Harder", label: "Difficulty" },
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
                      Everyone gets the same questions. One attempt per week. Ranked by score, then speed.
                    </p>
                  </div>

                  {/* RIGHT: Leaderboard preview */}
                  <div>
                    <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                      This week&apos;s leaderboard
                    </h3>
                    {leaderboard.length > 0 ? (
                      <div className="space-y-1.5">
                        {leaderboard.slice(0, 5).map((entry) => (
                          <div
                            key={entry.rank}
                            className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                              entry.isYou
                                ? "bg-orange-500/10 border border-orange-500/20"
                                : "bg-white/[0.02] hover:bg-white/[0.04]"
                            }`}
                          >
                            <RankBadge rank={entry.rank} />
                            <span className="flex-1 text-sm text-white/60 truncate">
                              {entry.name} {entry.isYou && "(you)"}
                            </span>
                            <span className="text-sm font-bold text-white tabular-nums">
                              {entry.score}/15
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[180px] rounded-xl glass">
                        <p className="text-sm text-white/30">
                          Be the first to compete this week
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                  <button
                    onClick={handleStartQuiz}
                    className="glow-btn w-full sm:w-auto px-10 py-4 text-base animate-pulse-glow"
                  >
                    Start Weekly Challenge
                  </button>
                  <p className="text-xs text-white/30 mt-3">
                    15 questions, 45 seconds each. You cannot pause once started.
                  </p>
                </div>
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

                {/* Timer */}
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
                {result.attempt.score >= 12 && <ConfettiParticles />}

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
                        <div className="text-xs text-white/40">this week</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">#{result.rank}</div>
                      <div className="text-xs text-white/40">your rank</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{formatTime(result.attempt.totalTimeMs)}</div>
                      <div className="text-xs text-white/40">total time</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prize callout for #1 */}
              {result.rank === 1 && status?.prize && (
                <div className="glass-strong p-6 mb-8 border border-amber-500/20">
                  <div className="text-2xl font-bold animate-gold-shimmer mb-1">
                    You&apos;re in first place
                  </div>
                  <p className="text-white/50 text-sm">
                    Hold your position until the week ends to win the cash prize.
                  </p>
                </div>
              )}

              {/* Share buttons */}
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
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? `${window.location.origin}/weekly` : "")}`}
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

              {/* Full leaderboard */}
              {leaderboard.length > 0 && (
                <div className="glass-strong p-6 mb-8 text-left">
                  <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                    This week&apos;s leaderboard
                  </h3>
                  <div className="space-y-1.5">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                          entry.isYou
                            ? "bg-orange-500/10 border border-orange-500/20"
                            : "bg-white/[0.02] hover:bg-white/[0.04]"
                        }`}
                      >
                        <RankBadge rank={entry.rank} />
                        <span className="flex-1 text-sm text-white/60 truncate">
                          {entry.name} {entry.isYou && "(you)"}
                        </span>
                        <span className="text-xs text-white/30 tabular-nums mr-2">
                          {formatTime(entry.totalTimeMs)}
                        </span>
                        <span className="text-sm font-bold text-white tabular-nums">
                          {entry.score}/15
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Countdown to next week */}
              {status && (
                <div className="glass-strong p-6">
                  <p className="text-sm text-white/40">Next challenge in</p>
                  <div className="text-2xl font-bold text-white mt-1">
                    <Countdown endsAt={status.endsAt} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== ALREADY TAKEN ===== */}
          {phase === "already-taken" && existingAttempt && (
            <div className="text-center">
              <span className="section-label">[ Already Completed ]</span>
              <h1 className="text-3xl font-bold text-white mb-2">
                You&apos;ve completed this week&apos;s challenge
              </h1>
              <p className="text-sm text-white/50 mb-8">{status?.weekId}</p>

              <div className="glass-strong p-8 sm:p-10 mb-8 relative overflow-hidden">
                {existingAttempt.score >= 12 && <ConfettiParticles />}
                <div className="relative">
                  <div className="text-7xl sm:text-8xl font-bold gradient-text mb-2">
                    {existingAttempt.score}/{existingAttempt.totalQuestions}
                  </div>
                  <p className="text-white/60">Your score this week</p>
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06]">
                    <span className="text-sm text-white/50">
                      Total time: {formatTime(existingAttempt.totalTimeMs)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="mb-8 space-y-3">
                <p className="text-sm text-white/40 mb-4">Share your result</p>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(existingShareText)}`}
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
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? `${window.location.origin}/weekly` : "")}`}
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

              {/* Full leaderboard */}
              {leaderboard.length > 0 && (
                <div className="glass-strong p-6 mb-8 text-left">
                  <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                    This week&apos;s leaderboard
                  </h3>
                  <div className="space-y-1.5">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                          entry.isYou
                            ? "bg-orange-500/10 border border-orange-500/20"
                            : "bg-white/[0.02] hover:bg-white/[0.04]"
                        }`}
                      >
                        <RankBadge rank={entry.rank} />
                        <span className="flex-1 text-sm text-white/60 truncate">
                          {entry.name} {entry.isYou && "(you)"}
                        </span>
                        <span className="text-xs text-white/30 tabular-nums mr-2">
                          {formatTime(entry.totalTimeMs)}
                        </span>
                        <span className="text-sm font-bold text-white tabular-nums">
                          {entry.score}/15
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Countdown */}
              {status && (
                <div className="glass-strong p-8">
                  <p className="text-sm text-white/40">Next challenge in</p>
                  <div className="text-2xl font-bold text-white mt-1">
                    <Countdown endsAt={status.endsAt} />
                  </div>
                  <p className="text-sm text-white/30 mt-3">
                    Come back next week for a new challenge.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
