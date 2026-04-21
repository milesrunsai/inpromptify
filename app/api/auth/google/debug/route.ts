import { NextResponse } from "next/server";

/** GET /api/auth/google/debug — check Google OAuth config (no secrets leaked) */
export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return NextResponse.json({
    hasClientId: !!clientId,
    clientIdPrefix: clientId ? clientId.slice(0, 20) + "..." : null,
    hasClientSecret: !!clientSecret,
    secretLength: clientSecret?.length ?? 0,
    appUrl: appUrl ?? "(not set — falling back to https://inpromptify.com)",
    redirectUri: `${appUrl ?? "https://inpromptify.com"}/api/auth/google/callback`,
    tip: "Make sure the redirect URI above is EXACTLY what's in Google Cloud Console under Authorized redirect URIs",
  });
}
