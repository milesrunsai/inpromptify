import { NextRequest, NextResponse } from "next/server";

/**
 * Resend Inbound Email Webhook
 * 
 * Receives emails sent to @inpromptify.com addresses and forwards them
 * to the admin email via Resend's sending API.
 * 
 * Setup required:
 * 1. Add MX record: inpromptify.com → inbound-smtp.resend.com (priority 10)
 * 2. In Resend dashboard → Inbound Emails → Add webhook URL:
 *    https://inpromptify.com/api/email/inbound
 */

const ADMIN_EMAIL = "inpromptyou@gmail.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

interface InboundEmail {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
  created_at?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Resend sends inbound emails as webhook events
    const email: InboundEmail = body?.data || body;

    const from = email.from || "unknown sender";
    const to = email.to || "unknown address";
    const subject = email.subject || "(no subject)";
    const htmlBody = email.html || "";
    const textBody = email.text || "";

    if (!RESEND_API_KEY) {
      console.error("[inbound-email] No RESEND_API_KEY configured");
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    // Forward to admin via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "InpromptiFy Mail <noreply@inpromptify.com>",
        to: ADMIN_EMAIL,
        subject: `[Fwd] ${subject} — from ${from} → ${to}`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px;">
            <div style="background: #f5f5f5; padding: 12px 16px; border-radius: 6px; margin-bottom: 16px; font-size: 13px;">
              <strong>From:</strong> ${from}<br/>
              <strong>To:</strong> ${to}<br/>
              <strong>Subject:</strong> ${subject}
            </div>
            <div style="padding: 0 4px;">
              ${htmlBody || textBody.replace(/\n/g, "<br/>")}
            </div>
          </div>
        `,
        text: `Forwarded email\nFrom: ${from}\nTo: ${to}\nSubject: ${subject}\n\n${textBody}`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[inbound-email] Resend send failed:", err);
      return NextResponse.json({ error: "Forward failed" }, { status: 500 });
    }

    console.log(`[inbound-email] Forwarded: ${from} → ${to} → ${ADMIN_EMAIL} | Subject: ${subject}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inbound-email] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
