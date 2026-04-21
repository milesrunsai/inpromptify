"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Turnstile } from "@/components/turnstile";

/* ---------- constants ---------- */
const OAUTH_ERRORS: Record<string, string> = {
  oauth_denied: "Authentication was cancelled.",
  oauth_error: "Something went wrong with Google sign-in. Please try again.",
  oauth_invalid: "Invalid OAuth response. Please try again.",
  oauth_state: "Session expired. Please try signing in again.",
  oauth_token: "Failed to authenticate with Google. Please try again.",
  oauth_userinfo: "Could not retrieve your Google account info. Please try again.",
  oauth_no_email: "No email found on your Google account.",
};

function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const strengthColors = [
  "bg-gray-200",
  "bg-red-500",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-green-500",
  "bg-emerald-500",
];

/* ---------- types ---------- */
type AuthTab = "sign-in" | "sign-up";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: AuthTab;
}

/* ---------- OAuth buttons (shared) ---------- */
function OAuthButtons() {
  return (
    <div className="space-y-2 mb-6">
      <a
        href="/api/auth/google"
        className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <svg className="size-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </a>
      <a
        href="/api/auth/linkedin"
        className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        Continue with LinkedIn
      </a>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs text-gray-400">or</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

/* ---------- main component ---------- */
export function AuthModal({ open, onClose, defaultTab = "sign-in" }: AuthModalProps) {
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>(defaultTab);

  // Sign-in state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInTurnstile, setSignInTurnstile] = useState("");

  // Sign-up state
  const [name, setName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpTurnstile, setSignUpTurnstile] = useState("");

  const strength = useMemo(() => getPasswordStrength(signUpPassword), [signUpPassword]);

  // Sync defaultTab when modal opens
  useEffect(() => {
    if (open) setTab(defaultTab);
  }, [open, defaultTab]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError("");
    setSignInLoading(true);

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signInEmail, password: signInPassword, turnstileToken: signInTurnstile }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSignInError(data.error || "Sign in failed");
        setSignInLoading(false);
        return;
      }
      onClose();
      router.push("/dashboard");
      router.refresh();
    } catch {
      setSignInError("Something went wrong. Please try again.");
      setSignInLoading(false);
    }
  }, [signInEmail, signInPassword, signInTurnstile, onClose, router]);

  const handleSignUp = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError("");

    if (signUpPassword.length < 8) {
      setSignUpError("Password must be at least 8 characters");
      return;
    }
    if (signUpPassword !== confirmPassword) {
      setSignUpError("Passwords do not match");
      return;
    }

    setSignUpLoading(true);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: signUpEmail, password: signUpPassword, confirmPassword, turnstileToken: signUpTurnstile }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSignUpError(data.error || "Sign up failed");
        setSignUpLoading(false);
        return;
      }
      onClose();
      router.push("/dashboard");
      router.refresh();
    } catch {
      setSignUpError("Something went wrong. Please try again.");
      setSignUpLoading(false);
    }
  }, [name, signUpEmail, signUpPassword, confirmPassword, signUpTurnstile, onClose, router]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-gray-200 shadow-2xl shadow-black/20 p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Inpromptify" width={48} height={48} className="h-12 w-auto" />
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            onClick={() => { setTab("sign-in"); setSignInError(""); setSignUpError(""); }}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === "sign-in"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab("sign-up"); setSignInError(""); setSignUpError(""); }}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === "sign-up"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* ---------- SIGN IN TAB ---------- */}
        {tab === "sign-in" && (
          <>
            <h1 className="text-gray-900 text-xl font-bold text-center mb-1">
              Sign in to Inpromptify
            </h1>
            <p className="text-gray-500 text-sm text-center mb-6">
              Welcome back! Please enter your credentials.
            </p>

            <OAuthButtons />
            <Divider />

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="modal-si-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="modal-si-email"
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="modal-si-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="modal-si-password"
                  type="password"
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your password"
                />
              </div>

              {signInError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {signInError}
                </p>
              )}

              <div className="flex justify-center">
                <Turnstile onVerify={setSignInTurnstile} onExpire={() => setSignInTurnstile("")} />
              </div>

              <button
                type="submit"
                disabled={signInLoading}
                className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {signInLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <button onClick={() => setTab("sign-up")} className="text-orange-500 hover:text-orange-600 font-medium">
                Sign up
              </button>
            </p>
          </>
        )}

        {/* ---------- SIGN UP TAB ---------- */}
        {tab === "sign-up" && (
          <>
            <h1 className="text-gray-900 text-xl font-bold text-center mb-1">
              Create your account
            </h1>
            <p className="text-gray-500 text-sm text-center mb-6">
              Get started with AI proficiency assessments.
            </p>

            <OAuthButtons />
            <Divider />

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="modal-su-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="modal-su-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="modal-su-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="modal-su-email"
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="modal-su-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="modal-su-password"
                  type="password"
                  required
                  minLength={8}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Min. 8 characters"
                />
                {signUpPassword.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= strength ? strengthColors[strength] : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{strengthLabels[strength]}</p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="modal-su-confirm" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="modal-su-confirm"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Re-enter your password"
                />
              </div>

              {signUpError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {signUpError}
                </p>
              )}

              <div className="flex justify-center">
                <Turnstile onVerify={setSignUpTurnstile} onExpire={() => setSignUpTurnstile("")} />
              </div>

              <button
                type="submit"
                disabled={signUpLoading}
                className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {signUpLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <button onClick={() => setTab("sign-in")} className="text-orange-500 hover:text-orange-600 font-medium">
                Sign in
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
