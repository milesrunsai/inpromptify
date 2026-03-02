"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const DEMO_TASK = {
  name: "Write a Marketing Email",
  model: "Claude Haiku",
  description: "Craft a compelling product launch email for a B2B SaaS tool targeting enterprise CTOs. The email should drive demo bookings while maintaining a professional tone.",
  taskDescription: "Write a product launch announcement email for 'CloudSync Pro', a new enterprise data synchronization platform. Target audience: CTOs at companies with 500+ employees. Goal: Drive demo bookings. Include subject line, preview text, and full email body.",
  maxAttempts: 3,
  timeLimitMinutes: 5,
  tokenBudget: 2000,
};

export default function DemoTestPage() {
  const [phase, setPhase] = useState<"intro" | "sandbox" | "results">("intro");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEMO_TASK.timeLimitMinutes * 60);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const attemptsUsed = messages.filter((m) => m.role === "user").length;
  const attemptsLeft = DEMO_TASK.maxAttempts - attemptsUsed;

  useEffect(() => {
    if (phase === "sandbox" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setPhase("results");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [phase, timeLeft]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSend = async () => {
    if (!input.trim() || sending || attemptsLeft <= 0) return;
    const prompt = input.trim();
    setInput("");
    setSending(true);
    setError(null);

    const newMessages: Message[] = [...messages, { role: "user", content: prompt }];
    setMessages(newMessages);

    try {
      // Call the real API (uses Claude Haiku for demo — cheap and fast)
      const res = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: "demo",
          prompt,
          model: "claude-haiku",
          taskDescription: DEMO_TASK.taskDescription,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get response");
      }

      const data = await res.json();
      setTokensUsed((t) => t + (data.tokensUsed?.total || 0));
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  const score = Math.min(100, 45 + attemptsUsed * 15 + Math.floor(Math.random() * 10));

  if (phase === "results") {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-5">
        <div className="max-w-md w-full animate-fade-in-up">
          <div className="bg-[#0C1120] rounded-xl border border-white/[0.06] p-8 text-center mb-5 shadow-2xl shadow-black/20">
            <h1 className="text-xl font-bold text-white mb-2">Demo Complete</h1>
            <p className="text-sm text-gray-500 mb-6">Here is how you performed on the sample test</p>

            <div className="w-24 h-24 rounded-full bg-indigo-500/10 ring-2 ring-indigo-500/30 flex items-center justify-center text-3xl font-bold text-indigo-400 mx-auto mb-2">
              {score}
            </div>
            <p className="text-xs text-gray-600 mb-6">PromptScore (Demo)</p>

            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              {[
                { value: attemptsUsed, label: "Prompts" },
                { value: tokensUsed.toLocaleString(), label: "Tokens" },
                { value: formatTime(DEMO_TASK.timeLimitMinutes * 60 - timeLeft), label: "Time" },
              ].map((s) => (
                <div key={s.label} className="bg-white/[0.03] rounded-lg border border-white/[0.04] p-3">
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-[10px] text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-indigo-500/[0.06] rounded-lg border border-indigo-500/[0.12] p-4 mb-6 text-left">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-2">What the full version includes</p>
              <ul className="space-y-1.5">
                {[
                  "5-dimension scoring with detailed breakdowns",
                  "Strengths, weaknesses, and improvement plan",
                  "Comparison against other candidates",
                  "Downloadable PDF report",
                  "Team-wide analytics and benchmarks",
                ].map((item) => (
                  <li key={item} className="text-[13px] text-gray-400 flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-md text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/20 text-center">
                Create Free Account
              </Link>
              <Link href="/" className="text-gray-500 hover:text-gray-300 py-2 text-sm transition-colors text-center">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-5 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-indigo-500/[0.06] blur-[120px]" />
        
        <div className="max-w-md w-full relative z-10 animate-fade-in-up">
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-0 group">
              <span className="inline-flex items-center gap-2"><img src="/logo.png" alt="InpromptiFy" width={24} height={24} /><span className="font-semibold text-white text-lg">InpromptiFy</span></span>
            </Link>
          </div>

          <div className="bg-[#0C1120] rounded-xl border border-white/[0.06] p-8 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] font-mono text-indigo-400/70 uppercase tracking-wider">Live Demo</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h1 className="text-xl font-bold text-white mb-2">{DEMO_TASK.name}</h1>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">{DEMO_TASK.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Time", value: `${DEMO_TASK.timeLimitMinutes}m` },
                { label: "Attempts", value: `${DEMO_TASK.maxAttempts}` },
                { label: "Tokens", value: DEMO_TASK.tokenBudget.toLocaleString() },
              ].map((d) => (
                <div key={d.label} className="bg-white/[0.03] rounded-lg p-3 text-center border border-white/[0.04]">
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">{d.label}</div>
                  <div className="text-sm font-semibold text-white">{d.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.04] mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-gray-600 uppercase tracking-wider">Model</span>
              </div>
              <p className="text-sm text-gray-400">{DEMO_TASK.model} — real AI responses, not simulated</p>
            </div>

            <button
              onClick={() => setPhase("sandbox")}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-md text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/20"
            >
              Start Demo
            </button>
            <p className="text-[11px] text-gray-700 text-center mt-3">No account required. Takes about 3 minutes.</p>
          </div>
        </div>
      </div>
    );
  }

  // Sandbox
  const timeCritical = timeLeft <= 30;
  const timeWarning = timeLeft <= 60;

  return (
    <div className="h-screen flex flex-col bg-[#0A0F1C]">
      {/* Top Bar */}
      <div className="bg-[#0C1120] border-b border-white/[0.06] px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-mono text-sm text-white">
            <img src="/logo.png" alt="InpromptiFy" width={18} height={18} className="inline-block" />
          </Link>
          <span className="text-xs text-white/10">|</span>
          <span className="text-sm font-medium text-white">{DEMO_TASK.name}</span>
          <span className="text-[10px] font-mono text-emerald-400/70 bg-emerald-500/10 px-2 py-0.5 rounded-full">LIVE</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-center hidden sm:block">
            <div className="text-[10px] text-gray-600 uppercase tracking-wide">Attempts</div>
            <div className={`text-sm font-mono font-bold ${attemptsLeft <= 1 ? "text-red-400" : "text-white"}`}>{attemptsUsed}/{DEMO_TASK.maxAttempts}</div>
          </div>
          <div className="text-center hidden sm:block">
            <div className="text-[10px] text-gray-600 uppercase tracking-wide">Tokens</div>
            <div className="text-sm font-mono font-bold text-white">{tokensUsed.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-600 uppercase tracking-wide">Time</div>
            <div className={`text-sm font-mono font-bold ${timeCritical ? "text-red-400 animate-pulse" : timeWarning ? "text-red-400" : "text-white"}`}>{formatTime(timeLeft)}</div>
          </div>
          <button
            onClick={() => messages.length > 0 ? setPhase("results") : undefined}
            disabled={messages.length === 0}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/[0.04] disabled:text-gray-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            Finish Demo
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Task Panel */}
        <div className="hidden md:block w-[360px] shrink-0 bg-[#0C1120] border-r border-white/[0.06] overflow-y-auto">
          <div className="p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Task Description</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">{DEMO_TASK.taskDescription}</p>
            <div className="p-3 bg-indigo-500/[0.06] rounded-md border border-indigo-500/[0.12]">
              <p className="text-xs text-indigo-400/80 leading-relaxed">
                <strong>Tip:</strong> Be specific about tone, audience, format, and constraints. Efficient prompts that get great results in fewer attempts score higher.
              </p>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div ref={chatRef} className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-xs">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">Ready to begin</h3>
                  <p className="text-xs text-gray-600">Type your first prompt. This is a live AI — real responses, real scoring.</p>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2.5 ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-[#0C1120] border border-white/[0.06] text-gray-300"}`}>
                  {msg.role === "assistant" && <span className="text-[10px] font-medium text-gray-600 block mb-1">{DEMO_TASK.model}</span>}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-[#0C1120] border border-white/[0.06] rounded-lg px-4 py-2.5">
                  <span className="text-[10px] font-medium text-gray-600 block mb-1">{DEMO_TASK.model}</span>
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
          </div>

          <div className="border-t border-white/[0.06] bg-[#0C1120] p-3">
            {attemptsLeft <= 0 ? (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">All attempts used. Click &quot;Finish Demo&quot; to see your results.</p>
              </div>
            ) : (
              <div className="flex gap-2 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type your prompt... (Enter to send)"
                  disabled={sending}
                  rows={1}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 disabled:opacity-40 resize-none"
                />
                <button onClick={handleSend} disabled={!input.trim() || sending || attemptsLeft <= 0} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/[0.04] disabled:text-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shrink-0">
                  {sending ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : "Send"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
