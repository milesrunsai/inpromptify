import { NextRequest, NextResponse } from "next/server";

// ── In-memory rate limiter (per-instance, resets on cold start) ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Rate limit configs: [windowMs, maxRequests]
const RATE_LIMITS: Record<string, [number, number]> = {
  "/api/auth/sign-in": [15 * 60 * 1000, 10],   // 10 attempts per 15 min
  "/api/auth/sign-up": [60 * 60 * 1000, 5],     // 5 sign-ups per hour
  "/api/daily": [60 * 1000, 10],                 // 10 req/min
  "/api/weekly": [60 * 1000, 10],                // 10 req/min
  "/api/ai-chat": [60 * 1000, 20],               // 20 req/min
  "/api/suggest": [60 * 1000, 5],                // 5 req/min
};

function getRateLimitKey(ip: string, path: string): string {
  return `${ip}:${path}`;
}

function checkRateLimit(ip: string, pathname: string): { limited: boolean; retryAfterSec?: number } {
  // Find matching rate limit config
  const configKey = Object.keys(RATE_LIMITS).find((p) => pathname.startsWith(p));
  if (!configKey) return { limited: false };

  const [windowMs, maxReq] = RATE_LIMITS[configKey];
  const key = getRateLimitKey(ip, configKey);
  const now = Date.now();

  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false };
  }

  entry.count++;
  if (entry.count > maxReq) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    return { limited: true, retryAfterSec };
  }

  return { limited: false };
}

// Cleanup stale entries every 5 minutes
if (typeof globalThis !== "undefined") {
  const CLEANUP_INTERVAL = 5 * 60 * 1000;
  const cleanupKey = "__rateLimitCleanup";
  if (!(globalThis as any)[cleanupKey]) {
    (globalThis as any)[cleanupKey] = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of rateLimitMap) {
        if (now > entry.resetAt) rateLimitMap.delete(key);
      }
    }, CLEANUP_INTERVAL);
  }
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip OG image routes and static assets
  if (pathname.startsWith("/api/og")) return NextResponse.next();

  // ── Rate limiting on API routes ──
  if (pathname.startsWith("/api/")) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { limited, retryAfterSec } = checkRateLimit(ip, pathname);
    if (limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSec || 60),
          },
        }
      );
    }
  }

  // ── Protect dashboard routes — lightweight cookie check ──
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("session_token")?.value;
    if (!token) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://js.stripe.com https://accounts.google.com https://us-assets.i.posthog.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' https://fonts.gstatic.com",
      "media-src 'self' https://d8j0ntlcm91z4.cloudfront.net",
      "connect-src 'self' https://api.openai.com https://api.stripe.com https://challenges.cloudflare.com https://accounts.google.com https://www.linkedin.com https://us.i.posthog.com https://us-assets.i.posthog.com",
      "frame-src https://challenges.cloudflare.com https://js.stripe.com https://accounts.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ")
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
