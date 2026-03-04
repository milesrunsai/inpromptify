"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InviteData {
  testId: number;
  title: string;
  description: string;
  timeLimitMinutes: number;
  maxAttempts: number;
  tokenBudget: number;
  model: string;
  prefillName?: string;
  prefillEmail?: string;
}

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetch(`/api/tests/invite/lookup?token=${token}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          setError(data.error || "Invalid invite");
          return;
        }
        setInvite(data);
        if (data.prefillName) setName(data.prefillName);
        if (data.prefillEmail) setEmail(data.prefillEmail);
      })
      .catch(() => setError("Failed to load invite"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleStart = () => {
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }
    if (!invite) return;
    setStarting(true);

    // Store guest info and invite token for the sandbox to use
    sessionStorage.setItem(`guest-${invite.testId}`, JSON.stringify({ name: name.trim(), email: email.trim() }));
    sessionStorage.setItem(`invite-token-${invite.testId}`, token);

    router.push(`/test/${invite.testId}/sandbox`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-white mb-2">Invalid Invite</h1>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Go to InpromptiFy</Link>
        </div>
      </div>
    );
  }

  if (!invite) return null;

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="relative z-10 flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-0 group">
              <span className="inline-flex items-center gap-2"><img src="/logo.png" alt="InpromptiFy" width={24} height={24} /><span className="font-semibold text-white text-lg">InpromptiFy</span></span>
            </Link>
          </div>

          {/* Invite Card */}
          <div className="bg-[#0C1120] rounded-xl border border-white/[0.06] p-8 shadow-2xl shadow-black/20">
            <div className="text-center mb-6">
              <p className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider mb-3">AI Skills Assessment</p>
              <h1 className="text-xl font-bold text-white mb-2">{invite.title}</h1>
              {invite.description && (
                <p className="text-sm text-gray-500 leading-relaxed">{invite.description}</p>
              )}
            </div>

            {/* Test Details */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Time Limit", value: `${invite.timeLimitMinutes} min` },
                { label: "Attempts", value: `${invite.maxAttempts} max` },
                { label: "Tokens", value: invite.tokenBudget.toLocaleString() },
              ].map((d) => (
                <div key={d.label} className="bg-white/[0.03] rounded-lg p-3 text-center border border-white/[0.04]">
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">{d.label}</div>
                  <div className="text-sm font-semibold text-white">{d.value}</div>
                </div>
              ))}
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2 mb-4">
                {error}
              </div>
            )}

            {/* Guest Info Form */}
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Your email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={starting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-3 rounded-md text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/20"
            >
              {starting ? "Starting..." : "Begin Assessment"}
            </button>

            <p className="text-[11px] text-gray-700 mt-4 text-center">
              No account required. Your results will be shared with the assessment creator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
