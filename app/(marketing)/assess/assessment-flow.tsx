"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
import Link from "next/link";

type Phase = "start" | "question" | "results";

const DIMENSION_LABELS: Record<string, string> = {
  promptQuality: "Prompt Quality",
  efficiency: "Efficiency",
  speed: "Speed",
  responseQuality: "Response Quality",
  iterationIntelligence: "Iteration Intelligence",
};

function getScoreLabel(score: number): string {
  if (score >= 80) return "Expert";
  if (score >= 65) return "Proficient";
  if (score >= 45) return "Intermediate";
  if (score >= 25) return "Developing";
  return "Beginner";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 65) return "text-primary";
  if (score >= 45) return "text-yellow-400";
  if (score >= 25) return "text-orange-400";
  return "text-red-400";
}

export function AssessmentFlow() {
  const [phase, setPhase] = useState<Phase>("start");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<AssessmentState>(createInitialState());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionStartTime = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    (currentState: AssessmentState) => {
      const next = selectNextQuestion(
        currentState.currentTheta,
        currentState.attemptedIds,
        currentState.dimensionCoverage,
        QUESTION_POOL
      );
      if (!next || shouldTerminate(currentState)) {
        setPhase("results");
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }
      setCurrentQuestion(next);
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
      loadNextQuestion(initial);
    },
    [email, loadNextQuestion]
  );

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

      const newState = processAnswer(
        state,
        currentQuestion,
        answerId,
        timeTakenMs
      );
      setState(newState);

      // Brief delay before next question for UX
      setTimeout(() => {
        setIsSubmitting(false);
        loadNextQuestion(newState);
      }, 300);
    },
    [currentQuestion, selectedOption, state, isSubmitting, loadNextQuestion]
  );

  const overallScore = calculateOverallPromptScore(state.dimensionScores);

  // --- START SCREEN ---
  if (phase === "start") {
    return (
      <div className="flex flex-col items-center gap-8 pt-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Free Assessment
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Discover Your{" "}
            <span className="text-primary">AI Proficiency</span>
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Take a quick adaptive assessment to measure your AI fluency across 5
            key dimensions. Get your PromptScore in under 3 minutes.
          </p>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Enter your email to begin. Your results will be sent to this
              address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStart} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <Button type="submit" className="w-full">
                Begin Assessment
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-6 text-center text-sm text-muted-foreground">
          <div>
            <div className="text-2xl font-bold text-foreground">8-12</div>
            <div>Adaptive questions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">~3 min</div>
            <div>To complete</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">5</div>
            <div>Dimensions scored</div>
          </div>
        </div>
      </div>
    );
  }

  // --- QUESTION SCREEN ---
  if (phase === "question" && currentQuestion) {
    const progressPercent = (state.questionCount / 12) * 100;
    const timerPercent =
      (timeLeft / currentQuestion.maxTimeSeconds) * 100;
    const isTimeLow = timeLeft <= 10;

    return (
      <div className="flex flex-col gap-6">
        {/* Progress bar */}
        <div className="flex flex-col gap-2">
          <Progress value={progressPercent}>
            <ProgressLabel>
              Question {state.questionCount + 1}
            </ProgressLabel>
            <ProgressValue />
          </Progress>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isTimeLow ? "animate-pulse bg-destructive" : "bg-primary"
              }`}
            />
            <span className={isTimeLow ? "text-destructive font-medium" : "text-muted-foreground"}>
              {timeLeft}s remaining
            </span>
          </div>
          <div className="h-1 flex-1 mx-4 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 rounded-full ${
                isTimeLow ? "bg-destructive" : "bg-primary"
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg leading-relaxed">
              {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                disabled={isSubmitting}
                className={`flex items-start gap-3 rounded-lg border p-4 text-left text-sm transition-all ${
                  selectedOption === option.id
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                } ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                    selectedOption === option.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {option.id}
                </span>
                <span className="leading-relaxed">{option.text}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Button
          onClick={() => handleSubmitAnswer()}
          disabled={!selectedOption || isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? "Processing..." : "Submit Answer"}
        </Button>
      </div>
    );
  }

  // --- RESULTS SCREEN ---
  if (phase === "results") {
    return (
      <div className="flex flex-col items-center gap-8 pt-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your <span className="text-primary">PromptScore</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Based on {state.questionCount} adaptive questions
          </p>
        </div>

        {/* Overall score */}
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className={`text-7xl font-bold tabular-nums ${getScoreColor(overallScore)}`}>
              {overallScore}
            </div>
            <div className="mt-2 text-lg font-medium text-muted-foreground">
              {getScoreLabel(overallScore)}
            </div>
          </CardContent>
        </Card>

        {/* Dimension breakdown */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Dimension Breakdown</CardTitle>
            <CardDescription>
              Your performance across 5 AI proficiency dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {Object.entries(DIMENSION_LABELS).map(([key, label]) => {
              const score = Math.round(state.dimensionScores[key] || 50);
              return (
                <div key={key} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{label}</span>
                    <span className={`font-bold tabular-nums ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="w-full text-center">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <p className="text-muted-foreground">
              Want to assess your entire team? Get detailed analytics,
              benchmarks, and ATS integration.
            </p>
            <div className="flex gap-3">
              <Link href="/sign-up">
                <Button>Start Free Trial</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline">View Plans</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
