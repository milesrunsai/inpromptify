"use client";

import { useState, useEffect, useRef, use, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface TestData {
  id: string;
  title: string;
  description: string;
  model: string;
  task_prompt: string;
  expected_outcomes: string;
  max_attempts: number;
  time_limit_minutes: number;
  token_budget: number;
  custom_criteria?: Array<{
    name: string;
    description: string;
    type: string;
    weight: number;
    config: Record<string, unknown>;
  }>;
}

type SandboxState = "loading" | "ready" | "active" | "submitting" | "submitted" | "timeup";

export default function TestSandboxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [test, setTest] = useState<TestData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900);
  const [isTyping, setIsTyping] = useState(false);
  const [sandboxState, setSandboxState] = useState<SandboxState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showMobileTask, setShowMobileTask] = useState(false);
  const [cheatEvents, setCheatEvents] = useState<Array<{type: string; timestamp: string}>>([]);
  const [pasteWarning, setPasteWarning] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Anti-cheat: track paste, tab switches, right-click
  useEffect(() => {
    const logCheat = (type: string) => {
      setCheatEvents(prev => [...prev, { type, timestamp: new Date().toISOString() }]);
    };
    const onPaste = () => { logCheat("paste"); setPasteWarning(true); setTimeout(() => setPasteWarning(false), 4000); };
    const onVisChange = () => { if (document.hidden) logCheat("tab_switch"); };
    const onContextMenu = (e: MouseEvent) => { e.preventDefault(); logCheat("right_click"); };
    document.addEventListener("paste", onPaste);
    document.addEventListener("visibilitychange", onVisChange);
    document.addEventListener("contextmenu", onContextMenu);
    return () => {
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("visibilitychange", onVisChange);
      document.removeEventListener("contextmenu", onContextMenu);
    };
  }, []);

  // Load test data
  useEffect(() => {
    fetch(`/api/tests/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => {
        if (d && d.title) {
          const t: TestData = {
            id: d.id?.toString() || id,
            title: d.title,
            description: d.description || "",
            model: d.model || "gpt-4o",
            task_prompt: d.task_prompt || "",
            expected_outcomes: d.expected_outcomes || "",
            max_attempts: d.max_attempts || 5,
            time_limit_minutes: d.time_limit_minutes || 15,
            token_budget: d.token_budget || 2000,
            custom_criteria: d.custom_criteria || undefined,
          };
          setTest(t);
          setTimeLeft(t.time_limit_minutes * 60);
          setSandboxState("ready");
        } else {
          setError("Test not found");
        }
      })
      .catch(() => setError("Failed to load test"));
  }, [id]);

  // Timer
  useEffect(() => {
    if (sandboxState !== "active") return;
    if (!test) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setSandboxState("timeup");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sandboxState, test]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const sendMessage = useCallback(async () => {
    if (!test || !input.trim() || isTyping || attempts >= test.max_attempts || timeLeft === 0) return;

    const promptText = input.trim();
    const userMsg: Message = { role: "user", content: promptText, timestamp: new Date().toISOString() };
    const newAttempt = attempts + 1;

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttempts(newAttempt);
    setIsTyping(true);
    setError(null);
    if (sandboxState === "ready") setSandboxState("active");

    try {
      const res = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          testId: test.id,
          taskDescription: test.task_prompt,
          attemptNumber: newAttempt,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get AI response");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, timestamp: data.timestamp },
      ]);
      setTokensUsed((t) => t + (data.tokensUsed?.total || 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, attempts, test, timeLeft, sandboxState]);

  const handleFinalSubmit = async () => {
    if (!test || messages.length === 0) return;
    setSandboxState("submitting");
    setShowSubmitConfirm(false);

    const timeSpentSeconds = test.time_limit_minutes * 60 - timeLeft;

    try {
      const res = await fetch("/api/test/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: test.id,
          messages,
          attemptsUsed: attempts,
          tokensUsed,
          timeSpentSeconds,
          maxAttempts: test.max_attempts,
          tokenBudget: test.token_budget,
          timeLimitMinutes: test.time_limit_minutes,
          taskDescription: test.task_prompt,
          expectedOutcome: test.expected_outcomes,
          customCriteria: test.custom_criteria,
        }),
      });

      if (!res.ok) throw new Error("Evaluation failed");
      const scores = await res.json();

      // Save to sessionStorage for results page
      sessionStorage.setItem(
        `test-result-${test.id}`,
        JSON.stringify({
          ...scores,
          testName: test.title,
          testDescription: test.description,
          taskDescription: test.task_prompt,
          tokenBudget: test.token_budget,
          maxAttempts: test.max_attempts,
          timeLimitMinutes: test.time_limit_minutes,
          messages,
          timeSpentSeconds,
        })
      );

      // Save to database
      const guestInfo = sessionStorage.getItem(`guest-${test.id}`);
      const guest = guestInfo ? JSON.parse(guestInfo) : null;
      const inviteToken = sessionStorage.getItem(`invite-token-${test.id}`);
      
      fetch("/api/test/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: test.id,
          candidateName: guest?.name,
          candidateEmail: guest?.email,
          score: scores.promptScore,
          efficiency: scores.dimensions?.efficiency?.score,
          speed: scores.dimensions?.speed?.score,
          accuracy: scores.dimensions?.promptQuality?.score,
          tokensUsed,
          attemptsUsed: attempts,
          timeSpentMinutes: Math.ceil(timeSpentSeconds / 60),
          messages,
          inviteToken,
          scoringResult: scores,
          cheatEvents,
        }),
      }).then(r => r?.json()).then(d => {
        if (d?.attemptId) sessionStorage.setItem(`attempt-id-${test.id}`, String(d.attemptId));
      }).catch(() => {});

      setSandboxState("submitted");
      router.push(`/test/${test.id}/results`);
    } catch {
      setError("Failed to submit. Please try again.");
      setSandboxState("active");
    }
  };

  useEffect(() => {
    if (sandboxState === "timeup" && messages.length > 0) {
      handleFinalSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sandboxState]);

  if (sandboxState === "loading" || !test) {
    if (error) {
      return (
        <div className="h-screen flex items-center justify-center bg-[#0A0F1C]">
          <div className="text-center">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <Link href="/" className="text-sm text-indigo-400">Back to Home</Link>
          </div>
        </div>
      );
    }
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0F1C]">
        <div className="text-sm text-gray-500">Loading test...</div>
      </div>
    );
  }

  const startTest = () => {
    setSandboxState("active");
  };

  const modelLabel = test.model === "gpt-4o" ? "GPT-4o" : test.model === "claude" ? "Claude" : test.model === "gemini" ? "Gemini" : test.model;
  const timeWarning = timeLeft < 120;
  const timeCritical = timeLeft < 30;
  const tokensWarning = tokensUsed > test.token_budget * 0.8;
  const attemptsWarning = attempts >= test.max_attempts - 1;
  const isDisabled = attempts >= test.max_attempts || timeLeft === 0 || sandboxState === "submitting" || sandboxState === "submitted";

  if (sandboxState === "ready") {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <Link href="/" className="font-mono text-sm text-white inline-block mb-6">
              <img src="/logo.png" alt="InpromptiFy" width={18} height={18} className="inline-block" />
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">{test.title}</h1>
            <p className="text-sm text-gray-500">{test.description || test.task_prompt.slice(0, 120) + "..."}</p>
          </div>

          <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-white mb-4">How You Are Scored</h2>
            <p className="text-[13px] text-gray-500 mb-5">Your performance is measured across 5 dimensions, producing a composite PromptScore (0-100).</p>
            <div className="space-y-3">
              {[
                { name: "Prompt Quality", weight: "30%", desc: "Clarity, specificity, structure, and constraints in your prompts." },
                { name: "Efficiency", weight: "15%", desc: "Fewer attempts and less token usage means higher efficiency." },
                { name: "Speed", weight: "15%", desc: "Completing the task well within the time limit." },
                { name: "Response Quality", weight: "25%", desc: "How well the AI output matches the task requirements." },
                { name: "Iteration IQ", weight: "15%", desc: "How effectively you refine and improve between attempts." },
              ].map((d) => (
                <div key={d.name} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[12px] font-mono text-indigo-400 shrink-0 w-10 text-right">{d.weight}</span>
                  <div>
                    <span className="text-[13px] font-medium text-white">{d.name}</span>
                    <p className="text-[12px] text-gray-500 mt-0.5">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">Time Limit: <span className="text-white font-medium">{test.time_limit_minutes} min</span></span>
                <span className="text-gray-400">Attempts: <span className="text-white font-medium">{test.max_attempts}</span></span>
                <span className="text-gray-400">Token Budget: <span className="text-white font-medium">{test.token_budget.toLocaleString()}</span></span>
              </div>
              <span className="text-gray-500">{modelLabel}</span>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 mb-8 text-[12px] text-gray-500 leading-relaxed">
            <strong className="text-gray-400">Tips:</strong> Write clear, specific prompts with context, constraints, and formatting instructions. Quality over quantity — fewer well-crafted prompts score higher than many vague ones. Each iteration should meaningfully build on the previous response.
          </div>

          <div className="text-center">
            <button onClick={startTest} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-colors">
              Start Assessment
            </button>
            <p className="text-[11px] text-gray-600 mt-3">Timer begins when you click start.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0A0F1C]">
      {/* Top Bar */}
      <div className="bg-[#0C1120] border-b border-white/[0.06] px-3 sm:px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link href="/" className="font-mono text-sm text-white shrink-0">
            <img src="/logo.png" alt="InpromptiFy" width={18} height={18} className="inline-block" />
          </Link>
          <span className="text-xs text-white/10 hidden sm:inline">|</span>
          <div className="min-w-0 hidden sm:block">
            <span className="text-sm font-medium text-white truncate">{test.title}</span>
            <span className="text-xs text-gray-600 ml-2">{modelLabel}</span>
          </div>
          <button onClick={() => setShowMobileTask(!showMobileTask)} className="md:hidden text-xs text-indigo-400 font-medium px-2 py-1 rounded border border-indigo-500/20 hover:bg-indigo-500/10">
            {showMobileTask ? "Chat" : "Task"}
          </button>
        </div>
        <div className="flex items-center gap-2 sm:gap-5">
          <div className="text-center hidden sm:block">
            <div className="text-[10px] text-gray-600 uppercase tracking-wide">Attempts</div>
            <div className={`text-sm font-mono font-bold ${attemptsWarning ? "text-red-400" : "text-white"}`}>{attempts}/{test.max_attempts}</div>
          </div>
          <div className="text-center hidden sm:block">
            <div className="text-[10px] text-gray-600 uppercase tracking-wide">Tokens</div>
            <div className={`text-sm font-mono font-bold ${tokensWarning ? "text-red-400" : "text-white"}`}>{tokensUsed.toLocaleString()}/{test.token_budget.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-600 uppercase tracking-wide">Time</div>
            <div className={`text-sm font-mono font-bold ${timeCritical ? "text-red-400 animate-pulse" : timeWarning ? "text-red-400" : "text-white"}`}>{formatTime(timeLeft)}</div>
          </div>
          <button
            onClick={() => messages.length > 0 ? setShowSubmitConfirm(true) : undefined}
            disabled={messages.length === 0 || sandboxState === "submitting"}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/[0.04] disabled:text-gray-600 text-white px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            {sandboxState === "submitting" ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Scoring...
              </span>
            ) : "Submit Final"}
          </button>
        </div>
      </div>

      {/* Mobile stats bar */}
      <div className="sm:hidden bg-[#0C1120] border-b border-white/[0.04] px-3 py-1.5 flex items-center justify-between text-xs">
        <span className={attemptsWarning ? "text-red-400 font-bold" : "text-gray-500"}>{attempts}/{test.max_attempts} attempts</span>
        <span className={tokensWarning ? "text-red-400 font-bold" : "text-gray-500"}>{tokensUsed.toLocaleString()} tokens</span>
        <span className="text-gray-600">{modelLabel}</span>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C1120] rounded-xl border border-white/[0.06] shadow-2xl shadow-black/40 max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Submit Final Answer?</h3>
            <p className="text-sm text-gray-400 mb-1">This will end the test and score your responses.</p>
            <p className="text-xs text-gray-600 mb-5">
              {attempts} attempt{attempts !== 1 ? "s" : ""} used -- {tokensUsed.toLocaleString()} tokens -- {formatTime(test.time_limit_minutes * 60 - timeLeft)} elapsed
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 border border-white/[0.08] hover:border-white/[0.14] text-gray-400 py-2 rounded-md text-sm font-medium transition-colors">Keep Working</button>
              <button onClick={handleFinalSubmit} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-md text-sm font-medium transition-colors">Submit & Score</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Task Description */}
        <div className={`${showMobileTask ? "block" : "hidden"} md:block w-full md:w-[360px] shrink-0 bg-[#0C1120] border-r border-white/[0.06] overflow-y-auto`}>
          <div className="p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Task Description</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">{test.task_prompt}</p>
            {test.expected_outcomes && (
              <>
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Expected Outcome</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{test.expected_outcomes}</p>
              </>
            )}
            <div className="mt-5 p-3 bg-indigo-500/[0.06] rounded-md border border-indigo-500/[0.12]">
              <p className="text-xs text-indigo-400/80 leading-relaxed">
                <strong>Tip:</strong> Write clear, specific prompts. Include context about your target audience, desired format, and constraints. Quality over quantity — fewer well-crafted prompts score higher.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Chat */}
        <div className={`${showMobileTask ? "hidden" : "flex"} md:flex flex-1 flex-col`}>
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-xs">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">Ready to begin</h3>
                  <p className="text-xs text-gray-600">Type your first prompt to start interacting with {modelLabel}.</p>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-4 py-2.5 ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-[#0C1120] border border-white/[0.06] text-gray-300"}`}>
                  {msg.role === "assistant" && <span className="text-[10px] font-medium text-gray-600 block mb-1">{modelLabel}</span>}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#0C1120] border border-white/[0.06] rounded-lg px-4 py-2.5">
                  <span className="text-[10px] font-medium text-gray-600 block mb-1">{modelLabel}</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-2 text-sm">
                  {error}
                  <button onClick={() => setError(null)} className="ml-2 text-red-500 hover:text-red-400">x</button>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {pasteWarning && (
              <div className="px-4 py-1.5 bg-amber-500/10 border-t border-amber-500/20">
                <p className="text-[11px] text-amber-400">Paste detected — your prompt originality is being tracked.</p>
              </div>
            )}
          <div className="border-t border-white/[0.06] bg-[#0C1120] p-3">
            {isDisabled && sandboxState !== "submitting" ? (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">
                  {timeLeft === 0 ? "Time is up. Submitting your responses..." : attempts >= test.max_attempts ? "Maximum attempts reached. Submit your final answer above." : "Test completed."}
                </p>
              </div>
            ) : (
              <div className="flex gap-2 items-end">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={sandboxState === "submitting" ? "Scoring in progress..." : "Type your prompt... (Enter to send, Shift+Enter for new line)"}
                  disabled={isDisabled || isTyping}
                  rows={1}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 disabled:opacity-40 resize-none"
                />
                <button onClick={sendMessage} disabled={!input.trim() || isTyping || isDisabled} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/[0.04] disabled:text-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shrink-0">
                  {isTyping ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : "Send"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
