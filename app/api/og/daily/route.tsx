import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";



export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const score = parseInt(searchParams.get("score") || "0", 10);
  const date = searchParams.get("date") || new Date().toISOString().slice(0, 10);

  const formattedDate = new Date(date + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const label =
    score >= 5 ? "Perfect" : score >= 4 ? "Outstanding" : score >= 3 ? "Great" : score >= 2 ? "Not bad" : "Keep going";

  const accentColor =
    score >= 5 ? "#22c55e" : score >= 4 ? "#f97316" : score >= 3 ? "#eab308" : "#ef4444";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0c0c14",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Orange glow top right */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,115,22,0.15), transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: "60px",
            position: "relative",
          }}
        >
          {/* Top label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#f97316",
                fontWeight: 600,
              }}
            >
              Daily AI Challenge
            </div>
          </div>

          {/* Date */}
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "40px",
            }}
          >
            {formattedDate}
          </div>

          {/* Score circle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              border: `4px solid ${accentColor}`,
              background: `rgba(${score >= 5 ? "34,197,94" : score >= 4 ? "249,115,22" : score >= 3 ? "234,179,8" : "239,68,68"}, 0.08)`,
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span
                style={{
                  fontSize: "80px",
                  fontWeight: 800,
                  color: accentColor,
                  lineHeight: 1,
                }}
              >
                {score}
              </span>
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  marginLeft: "4px",
                }}
              >
                /5
              </span>
            </div>
          </div>

          {/* Label */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "white",
              marginBottom: "12px",
            }}
          >
            {label}
          </div>

          {/* CTA */}
          <div
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Can you beat this score?
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 60px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "white",
              }}
            >
              Inpromptify
            </div>
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            inpromptify.com/daily
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
