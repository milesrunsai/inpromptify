import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || "hello@inpromptify.com";

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600_000 }); // 1 hour window
    return true;
  }
  if (entry.count >= 3) return false; // 3 submissions per hour
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const { name, email, company, role, seats, testsPerMonth, addOns, annual, message, estimatedMonthly } = body;

    if (!name?.trim() || !email?.trim() || !company?.trim()) {
      return NextResponse.json({ error: "Name, email, and company are required." }, { status: 400 });
    }

    // Format the add-ons list
    const activeAddOns = addOns && typeof addOns === "object"
      ? Object.entries(addOns).filter(([, v]) => v).map(([k]) => k).join(", ") || "None"
      : "None";

    const subject = `Enterprise inquiry from ${name} at ${company}`;
    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 0;">
        <div style="margin-bottom: 24px;">
          <span style="color: #f97316; font-family: monospace; font-size: 14px;">[</span>
          <span style="font-weight: 700; font-size: 14px;">InpromptiFy</span>
          <span style="color: #f97316; font-family: monospace; font-size: 14px;">]</span>
        </div>
        <h1 style="font-size: 20px; font-weight: 600; color: #111; margin-bottom: 16px;">New Enterprise Inquiry</h1>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; font-weight: 600; width: 140px;">Name</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; font-weight: 600;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #f97316;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; font-weight: 600;">Company</td>
            <td style="padding: 8px 0;">${company}</td>
          </tr>
          ${role ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; font-weight: 600;">Role</td><td style="padding: 8px 0;">${role}</td></tr>` : ""}
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; font-weight: 600;">Team Seats</td>
            <td style="padding: 8px 0;">${seats || "Not specified"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; font-weight: 600;">Tests/Month</td>
            <td style="padding: 8px 0;">${testsPerMonth ? Number(testsPerMonth).toLocaleString() : "Not specified"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; font-weight: 600;">Add-ons</td>
            <td style="padding: 8px 0;">${activeAddOns}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; font-weight: 600;">Billing</td>
            <td style="padding: 8px 0;">${annual ? "Annual" : "Monthly"}</td>
          </tr>
          ${estimatedMonthly ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; font-weight: 600;">Estimated</td><td style="padding: 8px 0; font-weight: 700; color: #111;">$${estimatedMonthly}/mo</td></tr>` : ""}
        </table>

        ${message ? `
        <div style="margin-top: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
          <p style="font-size: 12px; font-weight: 600; color: #666; margin: 0 0 8px 0;">Additional Notes</p>
          <p style="font-size: 14px; color: #333; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        ` : ""}

        <p style="font-size: 12px; color: #999; margin-top: 24px;">
          Submitted from inpromptify.com/contact at ${new Date().toISOString()}
        </p>
      </div>
    `;

    if (RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "InpromptiFy <noreply@inpromptify.com>",
          to: NOTIFY_EMAIL,
          reply_to: email,
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("[contact] Failed to send:", err);
        // Still return success to the user — we log the error server-side
      } else {
        console.log(`[contact] Enterprise inquiry sent from ${email} at ${company}`);
      }
    } else {
      console.warn("[contact] No RESEND_API_KEY — logging inquiry:", { name, email, company, seats, testsPerMonth });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[contact] Error:", e);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}
