import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PromptScore Result";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch score data
  let score = 0;
  let grade = "?";
  let name = "Candidate";
  let testName = "AI Proficiency Assessment";
  let percentile = 50;
  let dims = { pq: 0, eff: 0, spd: 0, rq: 0, iq: 0 };

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "https://inpromptify.com";
    const res = await fetch(`${baseUrl}/api/score/${id}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      score = data.score || 0;
      grade = data.grade || "?";
      name = data.candidateName || "Candidate";
      testName = data.testName || "AI Proficiency Assessment";
      percentile = data.percentile || 50;
      dims = data.dimensions || dims;
    }
  } catch { /* use defaults */ }

  const scoreColor = score >= 80 ? "#10b981" : score >= 65 ? "#f97316" : score >= 50 ? "#f59e0b" : "#ef4444";

  return new ImageResponse(
    (
      <div style={{ background: "#111118", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 60, fontFamily: "system-ui, sans-serif" }}>
        {/* Top: logo + test name */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
              <span style={{ color: "rgba(249,115,22,0.6)", fontSize: 24 }}>[</span>
              <span style={{ color: "white", fontSize: 24, fontWeight: 700 }}>InpromptiFy</span>
              <span style={{ color: "rgba(249,115,22,0.6)", fontSize: 24 }}>]</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 18 }}>{testName}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Verified PromptScore</span>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 12, marginTop: 4 }}>inpromptify.com/score/{id}</span>
          </div>
        </div>

        {/* Center: big score */}
        <div style={{ display: "flex", alignItems: "center", gap: 48, flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 180, height: 180, borderRadius: "50%",
              border: `6px solid ${scoreColor}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.02)",
            }}>
              <span style={{ fontSize: 72, fontWeight: 800, color: "white", lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 20, color: scoreColor, fontWeight: 600, marginTop: 4 }}>Grade {grade}</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, marginTop: 12 }}>
              Top {100 - percentile}% of candidates
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "white" }}>{name}</div>
            {[
              { label: "Prompt Quality", val: dims.pq },
              { label: "Efficiency", val: dims.eff },
              { label: "Speed", val: dims.spd },
              { label: "Response Quality", val: dims.rq },
              { label: "Iteration IQ", val: dims.iq },
            ].map((d) => (
              <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, width: 140 }}>{d.label}</span>
                <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", display: "flex" }}>
                  <div style={{ width: `${d.val}%`, height: "100%", background: scoreColor, borderRadius: 4 }} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600, width: 30, textAlign: "right" }}>{d.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
