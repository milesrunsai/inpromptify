"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("employer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password.trim()) { setError("All fields are required."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, accountType }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create account"); setLoading(false); return; }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) { setError("Account created but login failed. Please try logging in."); setLoading(false); return; }
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => { signIn("google", { callbackUrl: "/dashboard" }); };
  const handleLinkedInSignup = () => { signIn("linkedin", { callbackUrl: "/dashboard" }); };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 dot-pattern opacity-20" />

      <div className="relative z-10 flex-1 flex">
        {/* Left side - value prop */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-12">
          <div className="max-w-md animate-fade-in-up">
            <p className="text-[11px] font-mono text-orange-400/70 uppercase tracking-wider mb-4">Why InpromptiFy</p>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-6 leading-tight">
              Stop wasting money on inefficient AI usage
            </h2>
            <div className="space-y-5">
              {[
                { stat: "10x", text: "variation in prompt effectiveness between employees doing the same task" },
                { stat: "30%", text: "of GenAI projects abandoned after proof of concept (Gartner)" },
                { stat: "5 min", text: "to assess your entire team's AI prompting skills" },
              ].map((item) => (
                <div key={item.stat} className="flex items-start gap-4">
                  <span className="text-xl font-bold text-orange-400 shrink-0 w-16">{item.stat}</span>
                  <span className="text-sm text-gray-500 leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-white/[0.04]">
              <p className="text-[13px] text-gray-600 italic">
                &ldquo;Prompt quality varies by an order of magnitude between users. Organizations need a way to measure and close this gap.&rdquo;
              </p>
              <p className="text-[12px] text-gray-700 mt-2">-- Harvard Business School research on GenAI productivity</p>
            </div>
          </div>
        </div>

        {/* Right side - form */}
        <div className="flex-1 flex items-center justify-center px-5 py-12">
          <div className="w-full max-w-sm animate-fade-in-up-delay-1">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-0 group mb-6">
                <span className="text-lg font-bold tracking-tight text-white">
                  Inprompti<span className="gradient-text">Fy</span>
                </span>
              </Link>
              <h1 className="text-2xl font-bold text-white mt-4">Create your account</h1>
              <p className="text-gray-500 text-sm mt-2">Free to start. No credit card required.</p>
            </div>

            {/* Card */}
            <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-6 shadow-2xl shadow-black/20">
              {/* OAuth buttons */}
              <div className="space-y-2.5 mb-5">
                <button
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center gap-3 border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.04] hover:border-white/[0.14] transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
                <button
                  onClick={handleLinkedInSignup}
                  className="w-full flex items-center justify-center gap-3 border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.04] hover:border-white/[0.14] transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Continue with LinkedIn
                </button>
              </div>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-[#0a0a0f] px-3 text-gray-600">or</span></div>
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1.5">Full name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">Work email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all"
                    placeholder="Minimum 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">I want to...</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "employer", label: "Hire & Assess", desc: "Create tests, review candidates" },
                      { value: "candidate", label: "Take Tests", desc: "Build my PromptScore" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setAccountType(type.value)}
                        className={`py-3 px-3 rounded-md text-left border transition-all ${
                          accountType === type.value
                            ? "border-orange-500/40 bg-orange-500/10 shadow-sm shadow-orange-500/10"
                            : "border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02]"
                        }`}
                      >
                        <div className={`text-sm font-medium ${accountType === type.value ? "text-orange-400" : "text-gray-400"}`}>{type.label}</div>
                        <div className="text-[11px] text-gray-600 mt-0.5">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 disabled:opacity-60 text-white py-2.5 rounded-md text-sm font-medium transition-all hover:shadow-lg hover:shadow-orange-500/20 mt-1"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="text-[11px] text-gray-700 mt-4 text-center leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-gray-500 hover:text-gray-400 underline transition-colors">Terms</Link> and{" "}
                <Link href="/privacy" className="text-gray-500 hover:text-gray-400 underline transition-colors">Privacy Policy</Link>.
              </p>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
