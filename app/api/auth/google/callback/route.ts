import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
}

interface GoogleUserInfo {
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://inpromptify.com";

  if (error) {
    return NextResponse.redirect(`${appUrl}/sign-in?error=oauth_denied`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/sign-in?error=oauth_invalid`);
  }

  // Verify state
  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  cookieStore.set("oauth_state", "", { maxAge: 0, path: "/" });

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${appUrl}/sign-in?error=oauth_state`);
  }

  try {
    const redirectUri = `${appUrl}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${appUrl}/sign-in?error=oauth_token`);
    }

    const tokens: GoogleTokenResponse = await tokenRes.json();

    // Get user info
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );

    if (!userRes.ok) {
      return NextResponse.redirect(`${appUrl}/sign-in?error=oauth_userinfo`);
    }

    const googleUser: GoogleUserInfo = await userRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${appUrl}/sign-in?error=oauth_no_email`);
    }

    const email = googleUser.email.toLowerCase();

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user with random password hash (OAuth user)
      const randomHash = crypto.randomBytes(32).toString("hex");
      user = await prisma.user.create({
        data: {
          email,
          name: googleUser.name ?? null,
          imageUrl: googleUser.picture ?? null,
          passwordHash: randomHash,
          emailVerified: true,
        },
      });
    } else {
      // Update profile info if missing
      if (!user.imageUrl && googleUser.picture) {
        await prisma.user.update({
          where: { id: user.id },
          data: { imageUrl: googleUser.picture },
        });
      }
    }

    await createSession(user.id);

    return NextResponse.redirect(`${appUrl}/dashboard`);
  } catch {
    return NextResponse.redirect(`${appUrl}/sign-in?error=oauth_error`);
  }
}
