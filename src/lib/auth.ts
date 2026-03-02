import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import Credentials from "next-auth/providers/credentials";
import { getSql } from "./db";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const sql = getSql();
        const rows = await sql`
          SELECT id, name, email, password_hash, role, plan, avatar_url, prompt_score
          FROM users WHERE email = ${credentials.email as string}
        `;

        if (rows.length === 0) return null;

        const user = rows[0];
        if (!user.password_hash) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash as string
        );
        if (!valid) return null;

        return {
          id: String(user.id),
          name: user.name as string,
          email: user.email as string,
          image: user.avatar_url as string | null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },
  callbacks: {
    async signIn({ user, account }) {
      if ((account?.provider === "google" || account?.provider === "linkedin") && user.email) {
        const sql = getSql();
        const idColumn = account.provider === "google" ? "google_id" : "linkedin_id";
        
        // Check if user exists
        const existing = await sql`SELECT id, google_id, linkedin_id FROM users WHERE email = ${user.email}`;
        if (existing.length === 0) {
          // Auto-create account for OAuth users
          if (account.provider === "google") {
            await sql`
              INSERT INTO users (name, email, google_id, avatar_url)
              VALUES (${user.name || "User"}, ${user.email}, ${account.providerAccountId}, ${user.image || null})
            `;
          } else {
            await sql`
              INSERT INTO users (name, email, linkedin_id, avatar_url)
              VALUES (${user.name || "User"}, ${user.email}, ${account.providerAccountId}, ${user.image || null})
            `;
          }
        } else if (!existing[0][idColumn]) {
          // Link OAuth to existing account
          if (account.provider === "google") {
            await sql`
              UPDATE users SET google_id = ${account.providerAccountId}, avatar_url = COALESCE(avatar_url, ${user.image || null})
              WHERE email = ${user.email}
            `;
          } else {
            await sql`
              UPDATE users SET linkedin_id = ${account.providerAccountId}, avatar_url = COALESCE(avatar_url, ${user.image || null})
              WHERE email = ${user.email}
            `;
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Fetch DB user to get role/plan
        const sql = getSql();
        const rows = await sql`SELECT id, role, plan, prompt_score FROM users WHERE email = ${token.email!}`;
        if (rows.length > 0) {
          token.userId = String(rows[0].id);
          token.role = rows[0].role as string;
          token.plan = rows[0].plan as string;
          token.promptScore = rows[0].prompt_score as number | null;

          // Auto-grant admin role + business plan to admin email
          const ADMIN_EMAILS = ["inpromptyou@gmail.com"];
          if (ADMIN_EMAILS.includes(token.email!)) {
            if (rows[0].role !== "admin" || rows[0].plan !== "business") {
              await sql`UPDATE users SET role = 'admin', plan = 'business' WHERE id = ${rows[0].id}`;
            }
            token.role = "admin";
            token.plan = "business";
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = session.user as any;
        user.id = token.userId;
        user.role = token.role;
        user.plan = token.plan;
        user.promptScore = token.promptScore;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
