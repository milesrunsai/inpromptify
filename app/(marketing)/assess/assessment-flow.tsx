"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  createInitialState,
  processAnswer,
  selectNextQuestion,
  shouldTerminate,
  calculateOverallPromptScore,
  type AssessmentState,
  type Question,
} from "@/lib/assessment-engine";
import { QUESTION_POOL } from "@/lib/question-bank";
import { createIntegrityTracker, type IntegritySignals } from "@/lib/anti-cheat";
import { seededShuffle } from "@/lib/shuffle";
import Link from "next/link";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Phase = "start" | "question" | "results";

const DIMENSION_LABELS: Record<string, string> = {
  promptQuality: "Prompt Quality",
  efficiency: "Efficiency",
  speed: "Speed",
  responseQuality: "Response Quality",
  iterationIntelligence: "Iteration Intelligence",
};

function getScoreLabel(score: number): string {
  if (score >= 97) return "Grandmaster";
  if (score >= 92) return "Master";
  if (score >= 85) return "Expert";
  if (score >= 75) return "Advanced";
  if (score >= 65) return "Proficient";
  if (score >= 45) return "Intermediate";
  if (score >= 25) return "Developing";
  return "Beginner";
}

function getScoreColor(score: number): string {
  if (score >= 92) return "text-purple-400";
  if (score >= 85) return "text-green-400";
  if (score >= 75) return "text-emerald-400";
  if (score >= 65) return "text-primary";
  if (score >= 45) return "text-yellow-400";
  if (score >= 25) return "text-orange-400";
  return "text-red-400";
}

function getScoreRingColor(score: number): string {
  if (score >= 92) return "#c084fc";
  if (score >= 85) return "#4ade80";
  if (score >= 75) return "#34d399";
  if (score >= 65) return "#f97316";
  if (score >= 45) return "#facc15";
  return "#f87171";
}

function getHireRecommendation(score: number): {
  label: string;
  color: string;
  bg: string;
  description: string;
} {
  if (score >= 75)
    return {
      label: "Strong Hire",
      color: "text-green-400",
      bg: "bg-green-400/10 border-green-400/30",
      description:
        "Candidate demonstrates advanced AI fluency with strong prompt engineering and iteration skills.",
    };
  if (score >= 55)
    return {
      label: "Hire",
      color: "text-primary",
      bg: "bg-primary/10 border-primary/30",
      description:
        "Candidate shows solid AI proficiency suitable for roles requiring regular AI interaction.",
    };
  if (score >= 40)
    return {
      label: "Maybe",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10 border-yellow-400/30",
      description:
        "Candidate has foundational AI skills but may need additional training for AI-heavy roles.",
    };
  return {
    label: "No Hire",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/30",
    description:
      "Candidate would benefit from structured AI literacy training before taking on AI-dependent work.",
  };
}

function ScoreRing({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const ringColor = getScoreRingColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="180" height="180" className="-rotate-90">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/30"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-6xl font-bold tabular-nums"
          style={{ color: ringColor }}
        >
          {score}
        </span>
        <span className="text-sm text-muted-foreground font-medium">
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}

export function AssessmentFlow({
  initialEmail,
  initialName,
  autoStart = false,
}: {
  initialEmail?: string;
  initialName?: string;
  autoStart?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>(autoStart && initialEmail ? "question" : "start");
  const [email, setEmail] = useState(initialEmail || "");
  const [state, setState] = useState<AssessmentState>(createInitialState());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<Question["options"]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingResults, setIsSubmittingResults] = useState(false);
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);
  const [integritySignals, setIntegritySignals] = useState<IntegritySignals | null>(null);
  const [copied, setCopied] = useState(false);
  const [showResumeText, setShowResumeText] = useState(false);
  const [displayName, setDisplayName] = useState(initialName || "");
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);
  const [displayAnonymous, setDisplayAnonymous] = useState(false);

  const questionStartTime = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackerRef = useRef<ReturnType<typeof createIntegrityTracker> | null>(null);

  const startTimer = useCallback((seconds: number) => {
    setTimeLeft(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const loadNextQuestion = useCallback(
    (currentState: AssessmentState, userEmail: string) => {
      const next = selectNextQuestion(
        currentState.currentTheta,
        currentState.attemptedIds,
        currentState.dimensionCoverage,
        QUESTION_POOL
      );
      if (!next || shouldTerminate(currentState)) {
        // Stop integrity tracker and capture signals
        if (trackerRef.current) {
          setIntegritySignals(trackerRef.current.getSignals());
          trackerRef.current.stop();
        }
        setPhase("results");
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }
      setCurrentQuestion(next);
      setShuffledOptions(seededShuffle(next.options, userEmail + next.id));
      setSelectedOption(null);
      questionStartTime.current = Date.now();
      startTimer(next.maxTimeSeconds);
    },
    [startTimer]
  );

  const handleStart = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      const initial = createInitialState();
      setState(initial);
      setPhase("question");
      // Start integrity tracking
      trackerRef.current = createIntegrityTracker();
      trackerRef.current.start();
      loadNextQuestion(initial, email);
    },
    [email, loadNextQuestion]
  );

  // Auto-start for logged-in users
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (autoStart && initialEmail && !autoStartedRef.current) {
      autoStartedRef.current = true;
      const initial = createInitialState();
      setState(initial);
      trackerRef.current = createIntegrityTracker();
      trackerRef.current.start();
      loadNextQuestion(initial, initialEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-submit when time runs out
  useEffect(() => {
    if (phase === "question" && timeLeft === 0 && currentQuestion) {
      handleSubmitAnswer(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleSubmitAnswer = useCallback(
    (timedOut = false) => {
      if (!currentQuestion || isSubmitting) return;
      setIsSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const timeTakenMs = Date.now() - questionStartTime.current;
      const answerId = timedOut ? "__timeout__" : selectedOption || "__timeout__";

      // Record answer timing for integrity tracking
      if (trackerRef.current) {
        trackerRef.current.recordAnswer(timeTakenMs);
      }

      const newState = processAnswer(
        state,
        currentQuestion,
        answerId,
        timeTakenMs
      );
      setState(newState);

      // Enforce 5s minimum — show "Processing..." if answered too fast
      const delay = timeTakenMs < 5000 ? 5000 - timeTakenMs : 300;
      setTimeout(() => {
        setIsSubmitting(false);
        loadNextQuestion(newState, email);
      }, delay);
    },
    [currentQuestion, selectedOption, state, isSubmitting, loadNextQuestion, email]
  );

  // Keyboard shortcuts for question phase
  useEffect(() => {
    if (phase !== "question" || !currentQuestion || isSubmitting) return;
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toUpperCase();
      const idx = key.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
      if (idx >= 0 && idx < shuffledOptions.length) {
        setSelectedOption(shuffledOptions[idx].id);
        setTimeout(() => handleSubmitAnswer(), 200);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, currentQuestion, isSubmitting, shuffledOptions, handleSubmitAnswer]);

  const overallScore = calculateOverallPromptScore(state.dimensionScores);

  // --- START SCREEN ---
  if (phase === "start") {
    return (
      <>
        <style>{`header, nav, footer, [role="banner"], [role="contentinfo"] { display: none !important; }`}</style>
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="w-full max-w-md px-6">
            <div className="text-center mb-10">
              <p className="text-xs font-medium text-orange-500 uppercase tracking-widest mb-3">AI Proficiency Assessment</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Discover Your AI Proficiency
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                Adaptive assessment across 5 dimensions. Takes about 3 minutes.
              </p>
            </div>

            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-sm"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="leaderboard"
                  checked={showOnLeaderboard}
                  onChange={(e) => setShowOnLeaderboard(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="leaderboard" className="text-sm text-gray-600">
                  Show my score on the public leaderboard
                </label>
              </div>
              {showOnLeaderboard && (
                <div className="flex items-center gap-2 ml-6">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={displayAnonymous}
                    onChange={(e) => setDisplayAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-600">
                    Display as anonymous
                  </label>
                </div>
              )}
              <button
                type="submit"
                className="w-full px-8 py-3.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors text-sm"
              >
                Begin Assessment
              </button>
            </form>

            <div className="grid grid-cols-3 gap-4 mt-10 text-center">
              <div>
                <div className="text-xl font-bold text-gray-900">8-12</div>
                <div className="text-xs text-gray-400">Questions</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">~3 min</div>
                <div className="text-xs text-gray-400">To complete</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">5</div>
                <div className="text-xs text-gray-400">Dimensions</div>
              </div>
            </div>
          </div>

          {/* Logo watermark */}
          <img src="/logo.png" alt="" className="fixed bottom-6 left-6 h-5 w-auto opacity-20" />
        </div>
      </>
    );
  }

  // --- QUESTION SCREEN ---
  if (phase === "question" && currentQuestion) {
    const isTimeLow = timeLeft <= 10;
    const isTimeWarn = timeLeft <= 20;

    return (
      <>
        <style>{`header, nav, footer, [role="banner"], [role="contentinfo"] { display: none !important; }`}</style>
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* Progress line at top */}
          <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-10">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${(state.questionCount / 12) * 100}%` }}
            />
          </div>

          {/* Top bar: question counter + timer */}
          <div className="fixed top-4 left-0 right-0 px-6 sm:px-8 flex items-center justify-between z-10">
            <span className="text-xs sm:text-sm font-mono text-gray-400">
              {state.questionCount + 1} / 12
            </span>
            <span className={`text-lg sm:text-2xl font-mono font-bold tabular-nums transition-colors duration-500 ${
              isTimeLow ? "text-red-500" : isTimeWarn ? "text-yellow-500" : "text-gray-300"
            }`}>
              {timeLeft}s
            </span>
          </div>

          {/* Question content — vertically centered with safe top/bottom padding */}
          <div className="min-h-full flex items-center justify-center px-5 sm:px-6 py-20 sm:py-24">
          <div className="w-full max-w-2xl">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 leading-relaxed mb-8 sm:mb-10 text-center">
              {currentQuestion.text}
            </h2>

            <div className="space-y-3">
              {shuffledOptions.map((option, idx) => (
                <button
                  key={option.id}
                  onClick={() => {
                    if (isSubmitting) return;
                    setSelectedOption(option.id);
                    setTimeout(() => handleSubmitAnswer(), 200);
                  }}
                  disabled={isSubmitting}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                    selectedOption === option.id
                      ? "bg-orange-50 border-orange-500 text-gray-900 ring-2 ring-orange-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50/50"
                  } ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
                >
                  <span className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 ${
                      selectedOption === option.id
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm sm:text-base leading-relaxed">{option.text}</span>
                  </span>
                </button>
              ))}
            </div>

            {/* Keyboard hint — hide on mobile */}
            <p className="hidden sm:block text-center text-xs text-gray-300 mt-8">Press A–D to answer</p>
          </div>
          </div>

          {/* Logo watermark — hide on mobile to save space */}
          <img src="/logo.png" alt="" className="fixed bottom-6 left-6 h-5 w-auto opacity-20 hidden sm:block" />
        </div>
      </>
    );
  }

  // --- RESULTS SCREEN ---
  if (phase === "results") {
    const radarData = Object.entries(DIMENSION_LABELS).map(([key, label]) => ({
      dimension: label,
      score: Math.round(state.dimensionScores[key] || 50),
    }));

    const thetaData = state.thetaHistory.map((theta, i) => ({
      question: i + 1,
      theta: Math.round(theta),
    }));

    const recommendation = getHireRecommendation(overallScore);

    // Submit to leaderboard if not already done
    const handleSubmitToLeaderboard = async () => {
      if (!email || !showOnLeaderboard || isSubmittingResults) return;
      
      setIsSubmittingResults(true);
      try {
        const response = await fetch('/api/assessment-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            displayName: displayName || email.split('@')[0],
            score: overallScore,
            dimensionScores: state.dimensionScores,
            showOnLeaderboard,
          }),
        });
        
        const data = await response.json();
        if (data.success && data.rank) {
          setLeaderboardRank(data.rank);
        }
      } catch (error) {
        console.error('Failed to submit to leaderboard:', error);
      }
      setIsSubmittingResults(false);
    };

    // Auto-submit on results load if opted in
    React.useEffect(() => {
      if (showOnLeaderboard && email && !leaderboardRank && !isSubmittingResults) {
        handleSubmitToLeaderboard();
      }
    }, [showOnLeaderboard, email, leaderboardRank, isSubmittingResults]);

    const resultData = btoa(JSON.stringify({
      score: overallScore,
      dimensions: state.dimensionScores,
      role: "General Assessment",
      date: new Date().toISOString().split("T")[0],
      name: email?.split("@")[0] || undefined,
    }));
    const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/results/${resultData}`;
    const shareText = `I scored ${overallScore}/100 (${getScoreLabel(overallScore)}) on the Inpromptify AI Proficiency Assessment. Think you can beat it?`;

    return (
      <>
        <style>{`header, nav, footer, [role="banner"], [role="contentinfo"] { display: none !important; }`}</style>
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-16">

            {/* Score hero */}
            <div className="text-center mb-16">
              <p className="text-xs font-medium text-orange-500 uppercase tracking-widest mb-6">Assessment Complete</p>
              <ScoreRing score={overallScore} />
              <p className="mt-2 text-sm text-gray-400">
                Based on {state.questionCount} adaptive questions
              </p>
              {leaderboardRank && (
                <p className="mt-4 text-sm text-gray-500">
                  🏆 You ranked #{leaderboardRank} on today's leaderboard!
                </p>
              )}
              <span className={`inline-block mt-3 text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full ${
                overallScore >= 75 ? "bg-green-50 text-green-700" :
                overallScore >= 55 ? "bg-orange-50 text-orange-700" :
                overallScore >= 40 ? "bg-yellow-50 text-yellow-700" :
                "bg-red-50 text-red-700"
              }`}>
                {recommendation.label}
              </span>
              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">{recommendation.description}</p>
            </div>

            {/* Dimension breakdown */}
            <div className="border-t border-gray-100 pt-10 mb-12">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">Dimension Breakdown</h3>
              <div className="space-y-5">
                {Object.entries(DIMENSION_LABELS).map(([key, label]) => {
                  const score = Math.round(state.dimensionScores[key] || 50);
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">{label}</span>
                        <span className="text-sm font-bold text-gray-900 tabular-nums">{score}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-500 transition-all duration-1000"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Radar chart */}
            <div className="border-t border-gray-100 pt-10 mb-12">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">Skill Profile</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                    />
                    <Radar
                      dataKey="score"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.15}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Difficulty progression */}
            <div className="border-t border-gray-100 pt-10 mb-12">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Difficulty Progression</h3>
              <p className="text-xs text-gray-400 mb-6">How the assessment adapted to your skill level</p>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={thetaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="question"
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                      axisLine={{ stroke: "#e5e7eb" }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[10, 90]}
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                      axisLine={{ stroke: "#e5e7eb" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        color: "#111827",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="theta"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ fill: "#f97316", r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Share — subtle row */}
            <div className="border-t border-gray-100 pt-10 mb-12">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </button>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                  {copied ? "Copied" : "Copy link"}
                </button>
                {showOnLeaderboard && (
                  <Link 
                    href="/leaderboard" 
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-orange-200 bg-orange-50 text-sm text-orange-700 hover:bg-orange-100 transition-colors"
                  >
                    🏆 View Leaderboard
                  </Link>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pb-8">
              <p className="text-sm text-gray-500 mb-4">
                Want to assess your entire team?
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/sign-up" className="px-6 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">
                  Start Free Trial
                </Link>
                <Link href="/pricing" className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
                  View Plans
                </Link>
              </div>
            </div>

          </div>
          {/* Logo watermark */}
          <img src="/logo.png" alt="" className="fixed bottom-6 left-6 h-5 w-auto opacity-20" />
        </div>
      </>
    );
  }

  return null;
}
