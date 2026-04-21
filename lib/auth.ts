import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const SESSION_COOKIE = "session_token";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

/** Create a new session for a user and set the cookie */
export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

/** Read the session cookie and return the user, or null */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    // Expired — clean up
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session.user;
}

/** Get the current user from the session cookie */
export async function getCurrentUser() {
  return getSession();
}

/** Require authentication — redirects to /sign-in if no session */
export async function requireAuth() {
  const user = await getSession();
  if (!user) redirect("/sign-in");
  return user;
}

/** Get the user's first org (if any) via membership */
export async function getUserOrg(userId: string) {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    include: { org: true },
    orderBy: { org: { createdAt: "asc" } },
  });
  return membership?.org ?? null;
}

/** Destroy the current session */
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
