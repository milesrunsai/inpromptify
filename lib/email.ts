import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = "InpromptiFy <noreply@inpromptify.com>";

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping verification email");
    return;
  }

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your InpromptiFy account",
    html: `
      <h2>Welcome to InpromptiFy, ${name || "there"}!</h2>
      <p>Click the link below to verify your email address:</p>
      <p><a href="${url}" style="color: #f97316; font-weight: bold;">Verify Email</a></p>
      <p>If you didn't create this account, you can safely ignore this email.</p>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping password reset email");
    return;
  }

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your InpromptiFy password",
    html: `
      <h2>Password Reset</h2>
      <p>Hi ${name || "there"},</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${url}" style="color: #f97316; font-weight: bold;">Reset Password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping welcome email");
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to InpromptiFy!",
    html: `
      <h2>Welcome aboard, ${name || "there"}!</h2>
      <p>Thanks for joining InpromptiFy — the AI proficiency assessment platform.</p>
      <p>Get started by taking your first assessment or setting up your organization.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #f97316; font-weight: bold;">Go to Dashboard</a></p>
    `,
  });
}
