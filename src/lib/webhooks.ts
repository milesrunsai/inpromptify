import crypto from "crypto";
import { getSql } from "@/lib/db";

interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export async function dispatchWebhooks(userId: number, event: string, data: Record<string, unknown>) {
  try {
    const sql = getSql();
    const webhooks = await sql`
      SELECT id, url, secret, events
      FROM webhooks
      WHERE user_id = ${userId}
        AND is_active = true
        AND ${event} = ANY(events)
        AND failure_count < 10
    `;

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    const body = JSON.stringify(payload);

    for (const webhook of webhooks) {
      try {
        const signature = crypto
          .createHmac("sha256", webhook.secret)
          .update(body)
          .digest("hex");

        const response = await fetch(webhook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-InpromptiFy-Signature": `sha256=${signature}`,
            "X-InpromptiFy-Event": event,
            "X-InpromptiFy-Delivery": crypto.randomUUID(),
          },
          body,
          signal: AbortSignal.timeout(10000),
        });

        if (response.ok) {
          await sql`
            UPDATE webhooks
            SET last_triggered_at = NOW(), failure_count = 0
            WHERE id = ${webhook.id}
          `;
        } else {
          await sql`
            UPDATE webhooks
            SET failure_count = failure_count + 1, last_triggered_at = NOW()
            WHERE id = ${webhook.id}
          `;
        }
      } catch {
        await sql`
          UPDATE webhooks
          SET failure_count = failure_count + 1
          WHERE id = ${webhook.id}
        `;
      }
    }
  } catch (error) {
    console.error("Webhook dispatch error:", error);
  }
}
