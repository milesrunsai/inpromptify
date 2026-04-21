import { NextResponse } from "next/server";

/** GET /api/debug/env — check critical env vars are loaded (no values leaked) */
export async function GET() {
  const dbUrl = process.env.DATABASE_URL ?? "";
  let dbHost = "(not set)";
  try {
    const url = new URL(dbUrl);
    dbHost = url.hostname;
  } catch {
    dbHost = dbUrl ? `(invalid URL: starts with "${dbUrl.slice(0, 30)}...")` : "(not set)";
  }

  return NextResponse.json({
    DATABASE_URL_host: dbHost,
    DATABASE_URL_length: dbUrl.length,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    TURNSTILE_SECRET_KEY: !!process.env.TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "(not set)",
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS ?? "(not set)",
    ADMIN_SECRET: !!process.env.ADMIN_SECRET,
  });
}
