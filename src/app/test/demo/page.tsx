"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useIntegrity } from "@/hooks/useIntegrity";
import type { IntegrityReport } from "@/lib/integrity";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface StageEvaluation {
  score: number;
  relevance: number;
  specificity: number;
  structure: number;
  effectiveness: number;
  reasoning: string;
}

interface StageResult {
  messages: Message[];
  tokensUsed: number;
  timeSpent: number;
  attemptsUsed: number;
  evaluation?: StageEvaluation;
}

const STAGES = [
  {
    id: "email",
    name: "Email Writing",
    icon: "01",
    description: "Write a product launch announcement email for 'CloudSync Pro', a new enterprise data synchronization platform. Target audience: CTOs at companies with 500+ employees. Goal: Drive demo bookings. Include subject line, preview text, and full email body.",
    tip: "Be specific about tone, audience, format, and constraints. Efficient prompts that get great results in fewer attempts score higher.",
    maxAttempts: 3,
    timeLimitMinutes: 5,
    tokenBudget: 2000,
  },
  {
    id: "data",
    name: "Data Analysis",
    icon: "02",
    description: "You have a dataset of 10,000 e-commerce transactions from Q4 2025. Columns: order_id, date, customer_segment (enterprise/SMB/consumer), product_category, revenue, region, return_rate. Use AI to write a complete analysis that identifies the top 3 revenue growth opportunities and the biggest risk area. Include specific metrics you would look for.",
    tip: "Structure your analysis request clearly. Ask for specific metrics, comparisons, and actionable recommendations.",
    maxAttempts: 3,
    timeLimitMinutes: 5,
    tokenBudget: 2000,
  },
  {
    id: "agent",
    name: "Agent Design",
    icon: "03",
    description: "Design an AI agent workflow for a customer support team (200 tickets/day). The agent should triage incoming tickets, attempt to resolve common issues (password resets, billing questions, feature how-tos), and know when to escalate to a human. Define: the workflow steps, safety guardrails, escalation rules, and success metrics.",
    tip: "Think about what could go wrong. Good agent design includes error handling, safety limits, and human oversight.",
    maxAttempts: 3,
    timeLimitMinutes: 5,
    tokenBudget: 2000,
  },
];

const AVAILABLE_MODELS = [
  { id: "claude-haiku", name: "Claude Haiku", provider: "Anthropic", badge: "Fast" },
  { id: "claude-sonnet", name: "Claude Sonnet", provider: "Anthropic", badge: "Powerful" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", badge: "Fast" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", badge: "Powerful" },
];

export default function DemoTestPage() {
  const [phase, setPhase] = useState<"intro" | "sandbox" | "results">("intro");
  const [currentStage, setCurrentStage] = useState(0);
  const [stageResults, setStageResults] = useState<StageResult[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(STAGES[0].timeLimitMinutes * 60);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("claude-haiku");
  const [stageStartTime, setStageStartTime] = useState(0);
  const [integrityReports, setIntegrityReports] = useState<IntegrityReport[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const integrity = useIntegrity();

  const stage = STAGES[currentStage];
  const attemptsUsed = messages.filter((m) => m.role === "user").length;
  const attemptsLeft = stage.maxAttempts - attemptsUsed;

  useEffect(() => {
    if (phase === "sandbox" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            finishStage();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const finishStage = useCallback(async () => {
    clearInterval(timerRef.current);
    const timeSpent = (stage.timeLimitMinutes * 60) - timeLeft;
    const userPrompts = messages.filter(m => m.role === "user").map(m => m.content);
    const aiResponses = messages.filter(m => m.role === "assistant").map(m => m.content);

    // Evaluate prompt quality via AI
    let evaluation: StageEvaluation = { score: 0, relevance: 0, specificity: 0, structure: 0, effectiveness: 0, reasoning: "Not evaluated" };
    if (userPrompts.length > 0) {
      try {
        const evalRes = await fetch("/api/test/evaluate-stage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskDescription: stage.description, userPrompts, aiResponses }),
        });
        if (evalRes.ok) evaluation = await evalRes.json();
      } catch { /* keep default */ }
    }

    const result: StageResult = { messages: [...messages], tokensUsed, timeSpent, attemptsUsed, evaluation };
    const newResults = [...stageResults, result];
    setStageResults(newResults);

    // Capture integrity report for this stage
    const report = integrity.getReport(userPrompts, aiResponses);
    setIntegrityReports(prev => [...prev, report]);
    integrity.reset();

    if (currentStage < STAGES.length - 1) {
      const nextStage = currentStage + 1;
      setCurrentStage(nextStage);
      setMessages([]);
      setTokensUsed(0);
      setTimeLeft(STAGES[nextStage].timeLimitMinutes * 60);
      setStageStartTime(Date.now());
      setError(null);
    } else {
      setPhase("results");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStage, messages, tokensUsed, timeLeft, stageResults, attemptsUsed, stage.timeLimitMinutes, integrity]);

  const startAssessment = () => {
    setPhase("sandbox");
    setStageStartTime(Date.now());
  };

  const handleSend = async () => {
    if (!input.trim() || sending || attemptsLeft <= 0) return;
    const prompt = input.trim();
    setInput("");
    setSending(true);
    setError(null);

    const newMessages: Message[] = [...messages, { role: "user", content: prompt }];
    setMessages(newMessages);

    try {
      const res = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: "demo",
          prompt,
          model: selectedModel,
          taskDescription: stage.description,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.error && !data.response) {
        setError(data.error);
        setMessages(messages); // revert
      } else {
        if (data.error) setError(data.error);
        setMessages([...newMessages, { role: "assistant", content: data.response }]);
        setTokensUsed((prev) => prev + (data.tokensUsed?.total || 0));
      }
    } catch {
      setError("Failed to connect. Please try again.");
      setMessages(messages);
    } finally {
      setSending(false);
    }
  };

  const timeCritical = timeLeft <= 30;
  const timeWarning = timeLeft <= 60;

  // Intro
  if (phase === "intro") {
    return (
      <div className="bg-[#0A0F1C] min-h-screen flex flex-col">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
          <Link href="/" className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">InpromptiFy</Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-5">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Live Demo</p>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-3">AI Proficiency Assessment</h1>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Complete 3 real-world AI tasks. Your prompting skill, efficiency, and iteration strategy
                are scored across 5 dimensions to produce your PromptScore.
              </p>
            </div>

            {/* Stages Preview */}
            <div className="space-y-3 mb-8">
              {STAGES.map((s, i) => (
                <div key={s.id} className="bg-[#0C1120] border border-white/[0.06] rounded-lg px-5 py-3 flex items-center gap-4">
                  <span className="text-[11px] font-mono text-indigo-400/60 w-6">{s.icon}</span>
                  <div className="flex-1">
                    <span className="text-sm text-white font-medium">{s.name}</span>
                    <span className="text-[11px] text-gray-600 ml-2">{s.maxAttempts} attempts, {s.timeLimitMinutes} min</span>
                  </div>
                  <span className="text-[11px] text-gray-600">{i === 0 ? "Email" : i === 1 ? "Analysis" : "Agent Design"}</span>
                </div>
              ))}
            </div>

            {/* Model Selection */}
            <div className="bg-[#0C1120] border border-white/[0.06] rounded-lg p-5 mb-8">
              <h3 className="text-sm font-semibold text-white mb-3">Choose your AI model</h3>
              <p className="text-[12px] text-gray-500 mb-4">All models are real — your score reflects how well you prompt, regardless of model choice.</p>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`text-left border rounded-lg px-4 py-3 transition-all ${
                      selectedModel === m.id
                        ? "border-indigo-500/40 bg-indigo-500/[0.06]"
                        : "border-white/[0.06] hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white font-medium">{m.name}</span>
                      <span className="text-[10px] text-indigo-400/60 bg-indigo-500/10 px-1.5 py-0.5 rounded">{m.badge}</span>
                    </div>
                    <span className="text-[11px] text-gray-500">{m.provider}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startAssessment}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-md text-sm font-medium transition-colors"
              >
                Start Assessment
              </button>
              <p className="text-[11px] text-gray-600 mt-3">No account required. Takes about 10-15 minutes.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results
  if (phase === "results") {
    const allResults = stageResults;
    const totalTokens = allResults.reduce((sum, r) => sum + r.tokensUsed, 0);
    const totalTime = allResults.reduce((sum, r) => sum + r.timeSpent, 0);
    const totalAttempts = allResults.reduce((sum, r) => sum + r.attemptsUsed, 0);
    const maxAttempts = STAGES.reduce((sum, s) => sum + s.maxAttempts, 0);
    const maxTokens = STAGES.reduce((sum, s) => sum + s.tokenBudget, 0);
    const maxTime = STAGES.reduce((sum, s) => sum + s.timeLimitMinutes * 60, 0);

    // Calculate dimension scores
    const promptQualityScore = allResults.length > 0
      ? Math.round(allResults.reduce((sum, r) => sum + (r.evaluation?.score || 0), 0) / allResults.length)
      : 0;
    const efficiencyScore = Math.round(Math.max(0, Math.min(100,
      (1 - totalAttempts / maxAttempts) * 50 + (1 - totalTokens / maxTokens) * 50
    )));
    const speedScore = Math.round(Math.max(0, Math.min(100,
      (1 - totalTime / maxTime) * 100
    )));
    const completionScore = Math.round((allResults.filter(r => r.attemptsUsed > 0).length / STAGES.length) * 100);

    // Integrity penalty: low integrity directly reduces score
    const avgIntegrity = integrityReports.length > 0
      ? integrityReports.reduce((s, r) => s + r.integrityScore, 0) / integrityReports.length
      : 100;
    const integrityMultiplier = Math.max(0.3, avgIntegrity / 100); // 30%-100% of score preserved

    // PromptScore: prompt quality is the PRIMARY driver (40%), completion (25%), efficiency (20%), speed (15%)
    // Then multiplied by integrity
    const rawScore = Math.round(
      promptQualityScore * 0.40 +
      completionScore * 0.25 +
      efficiencyScore * 0.20 +
      speedScore * 0.15
    );
    const overallScore = Math.min(100, Math.max(0, Math.round(rawScore * integrityMultiplier)));
    const grade = overallScore >= 90 ? "A+" : overallScore >= 80 ? "A" : overallScore >= 70 ? "B" : overallScore >= 60 ? "C" : overallScore >= 50 ? "D" : "F";

    return (
      <div className="bg-[#0A0F1C] min-h-screen flex flex-col">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
          <Link href="/" className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">InpromptiFy</Link>
          <span className="text-gray-600">|</span>
          <span className="text-sm text-gray-400">Assessment Complete</span>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">Your Results</p>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">PromptScore</h1>
            </div>

            {/* Big Score */}
            <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-8 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
                <div className="text-center">
                  <span className="text-7xl font-bold text-indigo-300">{overallScore}</span>
                  <span className="text-2xl text-gray-600">/100</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="border border-indigo-500/20 bg-indigo-500/[0.06] rounded-xl px-6 py-4 text-center">
                    <span className="text-3xl font-bold text-indigo-300">{grade}</span>
                    <p className="text-[11px] text-gray-500 mt-1">Grade</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-bold text-white">{STAGES.length}/{STAGES.length}</span>
                    <p className="text-[11px] text-gray-500 mt-1">Tasks completed</p>
                  </div>
                </div>
              </div>

              {/* Dimension Bars */}
              <div className="space-y-3 mb-6">
                {[
                  { label: "Prompt Quality", score: promptQualityScore },
                  { label: "Task Completion", score: completionScore },
                  { label: "Efficiency", score: efficiencyScore },
                  { label: "Speed", score: speedScore },
                ].map((dim) => (
                  <div key={dim.label}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-gray-400">{dim.label}</span>
                      <span className="text-gray-500 font-mono">{dim.score}/100</span>
                    </div>
                    <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${dim.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Stage Breakdown */}
              <div className="border-t border-white/[0.06] pt-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Per-Task Breakdown</h3>
                <div className="space-y-2">
                  {STAGES.map((s, i) => {
                    const r = allResults[i];
                    return (
                      <div key={s.id} className="bg-white/[0.02] rounded-lg px-4 py-2.5">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-mono text-indigo-400/60">{s.icon}</span>
                          <span className="text-sm text-white">{s.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[12px] text-gray-500 font-mono">
                          <span className={`font-semibold ${(r?.evaluation?.score || 0) >= 70 ? "text-indigo-300" : (r?.evaluation?.score || 0) >= 40 ? "text-indigo-400" : "text-indigo-500/60"}`}>
                            {r?.evaluation?.score ?? "—"}/100
                          </span>
                          <span>{r?.attemptsUsed || 0}/{s.maxAttempts} attempts</span>
                          <span>{r?.tokensUsed || 0} tokens</span>
                          <span>{r ? formatTime(r.timeSpent) : "—"}</span>
                        </div>
                        </div>
                        {r?.evaluation?.reasoning && (
                          <p className="text-[10px] text-gray-600 mt-1 pl-7">{r.evaluation.reasoning}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Integrity & Dependency */}
              {integrityReports.length > 0 && (() => {
                const avgIntegrity = Math.round(integrityReports.reduce((s, r) => s + r.integrityScore, 0) / integrityReports.length);
                const avgDependency = Math.round(integrityReports.reduce((s, r) => s + r.dependencyScore, 0) / integrityReports.length);
                const totalPastes = integrityReports.reduce((s, r) => s + r.pasteCount, 0);
                const totalTabSwitches = integrityReports.reduce((s, r) => s + r.tabSwitchCount, 0);
                const allFlags = [...new Set(integrityReports.flatMap(r => r.flags))];
                const integrityColor = avgIntegrity >= 80 ? "text-indigo-300" : avgIntegrity >= 50 ? "text-indigo-400" : "text-indigo-500/60";
                const dependencyColor = avgDependency <= 20 ? "text-indigo-300" : avgDependency <= 50 ? "text-indigo-400" : "text-indigo-500/60";

                return (
                  <div className="border-t border-white/[0.06] pt-6 mt-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-4">Integrity Analysis</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/[0.02] rounded-lg p-4 text-center">
                        <span className={`text-3xl font-bold ${integrityColor}`}>{avgIntegrity}</span>
                        <span className="text-lg text-gray-600">/100</span>
                        <p className="text-[11px] text-gray-500 mt-1">Integrity Score</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">Higher = more trusted</p>
                      </div>
                      <div className="bg-white/[0.02] rounded-lg p-4 text-center">
                        <span className={`text-3xl font-bold ${dependencyColor}`}>{avgDependency}</span>
                        <span className="text-lg text-gray-600">/100</span>
                        <p className="text-[11px] text-gray-500 mt-1">AI Dependency Score</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">Lower = more independent</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                        <span className="text-sm font-mono text-white">{totalPastes}</span>
                        <p className="text-[10px] text-gray-600">Paste events</p>
                      </div>
                      <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                        <span className="text-sm font-mono text-white">{totalTabSwitches}</span>
                        <p className="text-[10px] text-gray-600">Tab switches</p>
                      </div>
                      <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                        <span className="text-sm font-mono text-white">{Math.round(integrityReports.reduce((s, r) => s + r.typingNaturalness, 0) / integrityReports.length)}</span>
                        <p className="text-[10px] text-gray-600">Typing score</p>
                      </div>
                      <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                        <span className="text-sm font-mono text-white">{Math.round(integrityReports.reduce((s, r) => s + r.aiLikenessScore, 0) / integrityReports.length)}</span>
                        <p className="text-[10px] text-gray-600">AI likeness</p>
                      </div>
                    </div>
                    {allFlags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {allFlags.map(flag => (
                          <span key={flag} className="text-[10px] font-mono text-indigo-400/60 bg-indigo-500/[0.06] border border-indigo-500/10 px-2 py-0.5 rounded">
                            {flag.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="border-t border-white/[0.06] pt-6 mt-6 text-center text-[12px] text-gray-600">
                Model: {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || selectedModel} | Total tokens: {totalTokens} | Time: {formatTime(totalTime)}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/signup" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors">
                Sign Up for Full Assessment
              </Link>
              <Link href="/certifications" className="inline-flex items-center justify-center text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-md text-sm transition-colors border border-white/[0.06] hover:border-white/[0.12]">
                View Certifications
              </Link>
            </div>
            <p className="text-center text-[12px] text-gray-600">
              This is a demo assessment. Full assessments include all 5 scoring dimensions with detailed AI analysis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sandbox (active test)
  return (
    <div className="bg-[#0A0F1C] min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0A0F1C]/95 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">InpromptiFy</Link>
          <span className="text-gray-600">|</span>
          <span className="text-sm text-white font-medium">{stage.name}</span>
          <span className="text-[10px] font-mono text-indigo-400/70 bg-indigo-500/10 px-2 py-0.5 rounded-full">LIVE</span>
        </div>

        <div className="flex items-center gap-4 text-[13px]">
          {/* Stage Progress */}
          <div className="flex items-center gap-1.5">
            {STAGES.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < currentStage ? "bg-indigo-400" : i === currentStage ? "bg-indigo-500 animate-pulse" : "bg-white/[0.08]"
                }`}
              />
            ))}
            <span className="text-gray-500 ml-1 text-[11px]">{currentStage + 1}/{STAGES.length}</span>
          </div>

          <div className="h-4 w-px bg-white/[0.08]" />

          <div className="text-gray-500">Attempts <span className={`font-mono font-bold ${attemptsLeft <= 1 ? "text-indigo-300 animate-pulse" : "text-white"}`}>{attemptsUsed}/{stage.maxAttempts}</span></div>
          <div className="text-gray-500">Tokens <span className="font-mono font-bold text-white">{tokensUsed}</span></div>
          <div className="text-gray-500">Time <span className={`font-mono font-bold ${timeCritical ? "text-indigo-300 animate-pulse" : timeWarning ? "text-indigo-400" : "text-white"}`}>{formatTime(timeLeft)}</span></div>

          <button
            onClick={finishStage}
            disabled={attemptsUsed === 0}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/[0.04] disabled:text-gray-600 text-white px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
          >
            {currentStage < STAGES.length - 1 ? "Next Task" : "Finish"}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Task Description */}
          <div className="bg-indigo-500/[0.04] border border-indigo-500/10 rounded-lg p-5 mb-2">
            <h2 className="text-sm font-semibold text-indigo-300 mb-2">Task: {stage.name}</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-3">{stage.description}</p>
            <p className="text-[12px] text-gray-500 italic"><strong className="text-gray-400">Tip:</strong> {stage.tip}</p>
          </div>

          {messages.length === 0 && (
            <div className="text-center py-8">
              <h3 className="text-sm font-semibold text-white mb-1">Ready to begin</h3>
              <p className="text-[12px] text-gray-500">Type your first prompt. This is a live AI — real responses, real scoring.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-lg px-4 py-3 ${
                msg.role === "user"
                  ? "bg-indigo-600/20 border border-indigo-500/20"
                  : "bg-[#0C1120] border border-white/[0.06]"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-gray-500">
                    {msg.role === "user" ? "You" : AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || "AI"}
                  </span>
                </div>
                <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="bg-[#0C1120] border border-white/[0.06] rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[11px] text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg px-4 py-2 text-sm">
              {error}
              <button onClick={() => setError(null)} className="ml-2 text-indigo-400 hover:text-indigo-300">dismiss</button>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] bg-[#0A0F1C] px-4 py-3">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); integrity.onInputChange(e.target.value); }}
            onKeyDown={(e) => { integrity.onKeyDown(e); if (e.key === "Enter" && !e.shiftKey) handleSend(); }}
            disabled={sending || attemptsLeft <= 0}
            placeholder={attemptsLeft <= 0 ? `No attempts left — click "${currentStage < STAGES.length - 1 ? "Next Task" : "Finish"}"` : "Type your prompt... (Enter to send)"}
            className="flex-1 bg-[#0C1120] border border-white/[0.06] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim() || attemptsLeft <= 0}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/[0.04] disabled:text-gray-600 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
