import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = "Inpromptify <noreply@inpromptify.com>";

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

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Verify your Inpromptify account",
      html: `
        <h2>Welcome to Inpromptify, ${name || "there"}!</h2>
        <p>Click the link below to verify your email address:</p>
        <p><a href="${url}" style="color: #f97316; font-weight: bold;">Verify Email</a></p>
        <p>If you didn't create this account, you can safely ignore this email.</p>
      `,
    });
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }
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

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Reset your Inpromptify password",
      html: `
        <h2>Password Reset</h2>
        <p>Hi ${name || "there"},</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${url}" style="color: #f97316; font-weight: bold;">Reset Password</a></p>
        <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      `,
    });
  } catch (err) {
    console.error("Failed to send password reset email:", err);
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping welcome email");
    return;
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to Inpromptify!",
      html: `
        <h2>Welcome aboard, ${name || "there"}!</h2>
        <p>Thanks for joining Inpromptify — the AI proficiency assessment platform.</p>
        <p>Get started by taking your first assessment or setting up your organization.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #f97316; font-weight: bold;">Go to Dashboard</a></p>
      `,
    });
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }
}
