import { NextRequest, NextResponse } from "next/server";

/** POST /api/evaluate-text — AI evaluation of text answers */
export async function POST(req: NextRequest) {
  try {
    const { questionText, userAnswer, correctAnswer } = await req.json();

    if (!questionText || !userAnswer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Quick heuristic scoring for now (replace with OpenAI later)
    const score = evaluateTextAnswer(questionText, userAnswer, correctAnswer);
    
    return NextResponse.json({ 
      score,
      isCorrect: score >= 0.7,
      feedback: score >= 0.8 ? "Excellent" : score >= 0.6 ? "Good" : "Needs improvement"
    });
    
  } catch (error) {
    console.error("Text evaluation error:", error);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}

function evaluateTextAnswer(questionText: string, userAnswer: string, correctAnswer?: string): number {
  const answer = userAnswer.toLowerCase().trim();
  
  // Basic quality indicators
  const hasSpecificLanguage = /write|create|generate|analyze|explain|describe/.test(answer);
  const hasStructure = /\.|,|;|\n/.test(answer);
  const hasContext = answer.length > 100;
  const isNotGeneric = !/please|help|can you|simple|basic/.test(answer);
  
  // Prompt engineering specific checks
  const isPromptLike = /prompt|instruct|tell|ask|command/.test(answer.toLowerCase());
  const hasDetails = /specific|detailed|example|format|style/.test(answer.toLowerCase());
  
  let score = 0.3; // Base score
  
  if (hasSpecificLanguage) score += 0.2;
  if (hasStructure) score += 0.1;
  if (hasContext) score += 0.2;
  if (isNotGeneric) score += 0.1;
  if (isPromptLike) score += 0.2;
  if (hasDetails) score += 0.15;
  
  // Length penalty for too short/long
  if (answer.length < 30) score -= 0.3;
  if (answer.length > 400) score -= 0.1;
  
  return Math.min(1, Math.max(0, score));
}