const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "InpromptiFy <noreply@inpromptify.com>";

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn(`[email] No RESEND_API_KEY — would send to ${to}: ${subject}`);
    return { success: false, reason: "no_api_key" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[email] Failed to send to ${to}:`, err);
      return { success: false, reason: err };
    }

    return { success: true };
  } catch (e) {
    console.error(`[email] Error sending to ${to}:`, e);
    return { success: false, reason: "network_error" };
  }
}

export async function sendInviteEmail(
  to: string,
  candidateName: string,
  testTitle: string,
  inviteUrl: string
) {
  const subject = `You've been invited to take an AI assessment: ${testTitle}`;
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 0;">
      <div style="margin-bottom: 24px;">
        <span style="color: #f97316; font-family: monospace; font-size: 14px;">[</span>
        <span style="font-weight: 700; font-size: 14px;">InpromptiFy</span>
        <span style="color: #f97316; font-family: monospace; font-size: 14px;">]</span>
      </div>
      <h1 style="font-size: 20px; font-weight: 600; color: #111; margin-bottom: 8px;">Hi ${candidateName},</h1>
      <p style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
        You've been invited to take an AI proficiency assessment: <strong>${testTitle}</strong>.
      </p>
      <p style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        This assessment measures how effectively you use AI tools across 5 dimensions:
        prompt quality, efficiency, speed, response quality, and iteration intelligence.
      </p>
      <a href="${inviteUrl}" style="display: inline-block; background: #f97316; color: white; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none;">
        Start Assessment
      </a>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">
        No account required. The link expires in 30 days.
      </p>
    </div>
  `;
  return sendEmail(to, subject, html);
}

export async function sendResultsEmail(
  to: string,
  employerName: string,
  candidateName: string,
  testTitle: string,
  score: number
) {
  const grade = score >= 95 ? "S" : score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : score >= 35 ? "D" : "F";
  const recommendation = score >= 80 ? "Strong Hire" : score >= 65 ? "Hire" : score >= 50 ? "Consider with Training" : "Not Recommended";

  const subject = `Assessment completed: ${candidateName} scored ${score}/100 on ${testTitle}`;
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 0;">
      <div style="margin-bottom: 24px;">
        <span style="color: #f97316; font-family: monospace; font-size: 14px;">[</span>
        <span style="font-weight: 700; font-size: 14px;">InpromptiFy</span>
        <span style="color: #f97316; font-family: monospace; font-size: 14px;">]</span>
      </div>
      <h1 style="font-size: 20px; font-weight: 600; color: #111; margin-bottom: 8px;">Hi ${employerName},</h1>
      <p style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
        <strong>${candidateName}</strong> has completed the assessment: <strong>${testTitle}</strong>.
      </p>
      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <div style="text-align: center;">
          <div style="font-size: 48px; font-weight: 700; color: #111;">${score}</div>
          <div style="font-size: 14px; color: #666; margin-top: 4px;">PromptScore (Grade: ${grade})</div>
          <div style="font-size: 13px; font-weight: 600; color: ${score >= 65 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"}; margin-top: 8px;">
            ${recommendation}
          </div>
        </div>
      </div>
      <a href="https://inpromptify.com/dashboard/candidates" style="display: inline-block; background: #f97316; color: white; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none;">
        View Full Results
      </a>
    </div>
  `;
  return sendEmail(to, subject, html);
}
