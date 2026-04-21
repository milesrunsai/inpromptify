import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      promptScore = 0,
      letterGrade = "N/A",
      percentile = 0,
      dimensions = {},
      feedback = {},
      stats = {},
      testName = "Assessment",
      candidateName = "Candidate",
      candidateEmail = "",
    } = data;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header
    doc.setFontSize(10);
    doc.setTextColor(249, 115, 22); // orange
    doc.text("[InpromptiFy]", 14, y);
    doc.setTextColor(150, 150, 150);
    doc.text("Assessment Report", pageWidth - 14, y, { align: "right" });
    y += 5;
    doc.setDrawColor(230, 230, 230);
    doc.line(14, y, pageWidth - 14, y);
    y += 12;

    // Test + Candidate Info
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 30);
    doc.text(testName, 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`${candidateName}${candidateEmail ? ` (${candidateEmail})` : ""}`, 14, y);
    y += 4;
    doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 14, y);
    y += 14;

    // Score Box
    doc.setFillColor(255, 247, 237);
    doc.roundedRect(14, y, pageWidth - 28, 35, 3, 3, "F");
    doc.setFontSize(36);
    doc.setTextColor(249, 115, 22);
    doc.text(`${promptScore}`, 30, y + 25);
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text("/100", 30 + doc.getTextWidth(`${promptScore}`) + 2, y + 25);
    
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(`Grade: ${letterGrade}`, 90, y + 15);
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`${percentile}th percentile`, 90, y + 25);
    y += 45;

    // Dimensions
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text("Score Breakdown", 14, y);
    y += 8;

    const dimLabels: Record<string, string> = {
      promptQuality: "Prompt Quality",
      efficiency: "Efficiency",
      speed: "Speed",
      responseQuality: "Response Quality",
      iterationIQ: "Iteration IQ",
    };

    for (const [key, label] of Object.entries(dimLabels)) {
      const dim = (dimensions as Record<string, { score?: number; weight?: number }>)[key];
      if (!dim) continue;
      const score = dim.score || 0;
      
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(label, 14, y);
      doc.text(`${score}/100`, pageWidth - 14, y, { align: "right" });
      
      y += 3;
      // Progress bar background
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(14, y, pageWidth - 28, 4, 1, 1, "F");
      // Progress bar fill
      const barWidth = ((pageWidth - 28) * score) / 100;
      doc.setFillColor(249, 115, 22);
      if (barWidth > 0) doc.roundedRect(14, y, barWidth, 4, 1, 1, "F");
      y += 10;
    }

    // Stats
    y += 4;
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text("Statistics", 14, y);
    y += 8;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    const statItems = [
      { label: "Attempts Used", value: `${stats.attemptsUsed || 0} / ${stats.maxAttempts || 0}` },
      { label: "Tokens Used", value: `${(stats.tokensUsed || 0).toLocaleString()} / ${(stats.tokenBudget || 0).toLocaleString()}` },
      { label: "Time Spent", value: `${Math.round((stats.timeSpentSeconds || 0) / 60)} min / ${stats.timeLimitMinutes || 0} min` },
    ];

    for (const stat of statItems) {
      doc.text(stat.label, 14, y);
      doc.text(stat.value, pageWidth - 14, y, { align: "right" });
      y += 6;
    }

    // Feedback
    if (feedback.summary || feedback.topStrengths?.length || feedback.improvementPlan?.length) {
      y += 8;
      doc.setFontSize(13);
      doc.setTextColor(30, 30, 30);
      doc.text("Feedback", 14, y);
      y += 8;

      if (feedback.summary) {
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const lines = doc.splitTextToSize(feedback.summary, pageWidth - 28);
        doc.text(lines, 14, y);
        y += lines.length * 4 + 4;
      }

      if (feedback.topStrengths?.length) {
        doc.setFontSize(9);
        doc.setTextColor(30, 30, 30);
        doc.text("Strengths:", 14, y);
        y += 5;
        doc.setTextColor(80, 80, 80);
        for (const s of feedback.topStrengths.slice(0, 4)) {
          doc.text(`  + ${s}`, 14, y);
          y += 5;
        }
        y += 2;
      }

      if (feedback.improvementPlan?.length) {
        doc.setFontSize(9);
        doc.setTextColor(30, 30, 30);
        doc.text("Areas for Improvement:", 14, y);
        y += 5;
        doc.setTextColor(80, 80, 80);
        for (const s of feedback.improvementPlan.slice(0, 4)) {
          doc.text(`  - ${s}`, 14, y);
          y += 5;
        }
      }
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text("Generated by InpromptiFy - AI Skill Assessment Platform", 14, footerY);
    doc.text("inpromptify.com", pageWidth - 14, footerY, { align: "right" });

    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="InpromptiFy-Report-${candidateName.replace(/\s+/g, "_")}.pdf"`,
      },
    });
  } catch (e) {
    console.error("PDF generation error:", e);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
