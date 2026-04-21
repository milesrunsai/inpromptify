import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  id_token?: string;
}

interface LinkedInUserInfo {
  sub: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
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
  const storedState = cookieStore.get("oauth_state_li")?.value;
  cookieStore.set("oauth_state_li", "", { maxAge: 0, path: "/" });

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${appUrl}/sign-in?error=oauth_state`);
  }

  try {
    const redirectUri = `${appUrl}/api/auth/linkedin/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: process.env.LINKEDIN_CLIENT_ID!,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${appUrl}/sign-in?error=oauth_token`);
    }

    const tokens: LinkedInTokenResponse = await tokenRes.json();

    // Get user info via OpenID Connect userinfo endpoint
    const userRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${appUrl}/sign-in?error=oauth_userinfo`);
    }

    const liUser: LinkedInUserInfo = await userRes.json();

    if (!liUser.email) {
      return NextResponse.redirect(`${appUrl}/sign-in?error=oauth_no_email`);
    }

    const email = liUser.email.toLowerCase();
    const name =
      liUser.name ??
      ([liUser.given_name, liUser.family_name].filter(Boolean).join(" ") ||
      null);

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const randomHash = crypto.randomBytes(32).toString("hex");
      user = await prisma.user.create({
        data: {
          email,
          name,
          imageUrl: liUser.picture ?? null,
          passwordHash: randomHash,
          emailVerified: true,
        },
      });
    } else {
      if (!user.imageUrl && liUser.picture) {
        await prisma.user.update({
          where: { id: user.id },
          data: { imageUrl: liUser.picture },
        });
      }
    }

    await createSession(user.id);

    return NextResponse.redirect(`${appUrl}/dashboard`);
  } catch {
    return NextResponse.redirect(`${appUrl}/sign-in?error=oauth_error`);
  }
}
