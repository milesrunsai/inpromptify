/**
 * InpromptiFy Integrity Engine
 * 
 * Detects cheating signals and calculates an AI Dependency Score.
 * Tracks: paste events, typing patterns, tab switches, self-plagiarism,
 * input velocity, and AI-likeness of prompts.
 */

export interface IntegrityEvent {
  type: "paste" | "tab_switch" | "tab_return" | "right_click" | "copy" | "focus_lost";
  timestamp: number;
  data?: string;
}

export interface KeystrokeMetrics {
  totalKeystrokes: number;
  totalPastedChars: number;
  avgKeystrokeInterval: number; // ms between keystrokes
  burstInputs: number; // chunks of 50+ chars appearing in <500ms
  deleteRatio: number; // backspace/delete as % of total keystrokes
  totalInputTime: number; // ms from first to last keystroke per prompt
}

export interface IntegrityReport {
  // Raw signals
  pasteCount: number;
  tabSwitchCount: number;
  copyCount: number;
  rightClickCount: number;
  focusLostCount: number;
  
  // Calculated metrics
  pasteRatio: number; // 0-1, % of input that was pasted
  typingNaturalness: number; // 0-100, how human-like the typing pattern is
  selfPlagiarismScore: number; // 0-100, how much user copied from AI responses
  aiLikenessScore: number; // 0-100, how AI-generated the prompts appear
  inputVelocityFlags: number; // count of suspiciously fast inputs
  
  // Final scores
  integrityScore: number; // 0-100, overall trust score (100 = fully trusted)
  dependencyScore: number; // 0-100, how dependent on external AI (0 = independent)
  
  // Flags
  flags: string[];
}

/**
 * Calculate similarity between two strings using trigram overlap
 */
function trigramSimilarity(a: string, b: string): number {
  if (!a || !b || a.length < 3 || b.length < 3) return 0;
  const aNorm = a.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const bNorm = b.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  
  const getTrigrams = (s: string) => {
    const trigrams = new Set<string>();
    for (let i = 0; i <= s.length - 3; i++) {
      trigrams.add(s.substring(i, i + 3));
    }
    return trigrams;
  };
  
  const aSet = getTrigrams(aNorm);
  const bSet = getTrigrams(bNorm);
  
  let overlap = 0;
  for (const t of aSet) {
    if (bSet.has(t)) overlap++;
  }
  
  return (2 * overlap) / (aSet.size + bSet.size);
}

/**
 * Detect AI-like writing patterns in a prompt
 * AI-generated prompts tend to have:
 * - Very uniform sentence length
 * - Higher vocabulary density
 * - More hedging language
 * - Formulaic structure
 */
function detectAILikeness(text: string): number {
  if (!text || text.length < 20) return 0;
  
  let score = 0;
  const lower = text.toLowerCase();
  
  // AI hedging phrases (common in AI-generated text)
  const hedgePhrases = [
    "it's important to", "it is important to", "make sure to", "be sure to",
    "please ensure", "you should consider", "it would be beneficial",
    "in order to", "with that being said", "having said that",
    "furthermore", "moreover", "additionally", "consequently",
    "in conclusion", "to summarize", "in summary",
    "i'd be happy to", "i'd like to", "let me help",
    "here's a comprehensive", "here is a detailed",
    "first and foremost", "last but not least",
  ];
  
  let hedgeCount = 0;
  for (const phrase of hedgePhrases) {
    if (lower.includes(phrase)) hedgeCount++;
  }
  if (hedgeCount >= 3) score += 25;
  else if (hedgeCount >= 2) score += 15;
  else if (hedgeCount >= 1) score += 5;
  
  // Bullet point / numbered list density (AI loves lists)
  const lines = text.split("\n");
  const listLines = lines.filter(l => /^\s*[-•*]\s|^\s*\d+[.)]\s/.test(l));
  if (lines.length > 3 && listLines.length / lines.length > 0.6) score += 15;
  
  // Sentence length uniformity (AI = uniform, humans = variable)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  if (sentences.length >= 3) {
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / lengths.length;
    const cv = Math.sqrt(variance) / avg; // coefficient of variation
    if (cv < 0.2) score += 20; // Very uniform = likely AI
    else if (cv < 0.3) score += 10;
  }
  
  // Overly long prompt for a simple task (humans are concise, AI over-explains)
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 150) score += 15;
  else if (wordCount > 100) score += 8;
  
  // Perfect grammar + no contractions (AI tends to be formal)
  const contractions = (lower.match(/\b(don't|won't|can't|isn't|aren't|wasn't|weren't|shouldn't|wouldn't|couldn't|i'm|i've|i'll|i'd|we're|they're|you're|it's|that's|there's|here's|what's|who's|how's)\b/g) || []).length;
  if (wordCount > 30 && contractions === 0) score += 10;
  
  return Math.min(100, score);
}

/**
 * Calculate the full integrity report
 */
export function calculateIntegrity(
  events: IntegrityEvent[],
  keystrokes: KeystrokeMetrics,
  userPrompts: string[],
  aiResponses: string[],
): IntegrityReport {
  const flags: string[] = [];
  
  // Count events
  const pasteCount = events.filter(e => e.type === "paste").length;
  const tabSwitchCount = events.filter(e => e.type === "tab_switch").length;
  const copyCount = events.filter(e => e.type === "copy").length;
  const rightClickCount = events.filter(e => e.type === "right_click").length;
  const focusLostCount = events.filter(e => e.type === "focus_lost").length;
  
  // Paste ratio
  const totalChars = keystrokes.totalKeystrokes + keystrokes.totalPastedChars;
  const pasteRatio = totalChars > 0 ? keystrokes.totalPastedChars / totalChars : 0;
  
  if (pasteRatio > 0.7) flags.push("HIGH_PASTE_RATIO");
  if (pasteRatio > 0.4) flags.push("MODERATE_PASTE_RATIO");
  
  // Typing naturalness (0-100)
  let typingNaturalness = 100;
  
  // Penalize for paste-heavy input
  typingNaturalness -= pasteRatio * 40;
  
  // Penalize for burst inputs (instant large text blocks)
  if (keystrokes.burstInputs > 0) {
    typingNaturalness -= keystrokes.burstInputs * 15;
    flags.push("BURST_INPUT_DETECTED");
  }
  
  // Low delete ratio is suspicious (humans make mistakes, AI-copy doesn't)
  if (keystrokes.totalKeystrokes > 50 && keystrokes.deleteRatio < 0.02) {
    typingNaturalness -= 15;
    flags.push("LOW_EDIT_RATE");
  }
  
  // Very consistent keystroke intervals are suspicious (bots/macros)
  if (keystrokes.avgKeystrokeInterval > 0 && keystrokes.avgKeystrokeInterval < 30) {
    typingNaturalness -= 20;
    flags.push("INHUMAN_TYPING_SPEED");
  }
  
  typingNaturalness = Math.max(0, Math.min(100, typingNaturalness));
  
  // Self-plagiarism: check if user prompts contain chunks from AI responses
  let maxSelfPlagiarism = 0;
  for (const prompt of userPrompts) {
    for (const response of aiResponses) {
      const sim = trigramSimilarity(prompt, response);
      maxSelfPlagiarism = Math.max(maxSelfPlagiarism, sim);
    }
  }
  const selfPlagiarismScore = Math.round(maxSelfPlagiarism * 100);
  if (selfPlagiarismScore > 50) flags.push("SELF_PLAGIARISM");
  
  // AI-likeness of prompts
  let totalAILikeness = 0;
  for (const prompt of userPrompts) {
    totalAILikeness += detectAILikeness(prompt);
  }
  const aiLikenessScore = userPrompts.length > 0 ? Math.round(totalAILikeness / userPrompts.length) : 0;
  if (aiLikenessScore > 50) flags.push("AI_GENERATED_PROMPTS");
  
  // Input velocity flags
  let inputVelocityFlags = keystrokes.burstInputs;
  
  // Tab switch patterns
  if (tabSwitchCount >= 5) flags.push("EXCESSIVE_TAB_SWITCHING");
  else if (tabSwitchCount >= 3) flags.push("FREQUENT_TAB_SWITCHING");
  
  // Tab switch + paste combo (classic pattern: switch to ChatGPT, copy, switch back, paste)
  const tabPasteCorrelation = events.filter((e, i) => {
    if (e.type !== "paste") return false;
    // Check if there was a tab_return within 5 seconds before this paste
    const pasteTime = e.timestamp;
    return events.some(
      (prev, j) => j < i && prev.type === "tab_return" && pasteTime - prev.timestamp < 5000
    );
  }).length;
  if (tabPasteCorrelation > 0) {
    flags.push("TAB_SWITCH_PASTE_PATTERN");
  }
  
  // Calculate Integrity Score (0-100, higher = more trusted)
  let integrityScore = 100;
  integrityScore -= pasteRatio * 25;
  integrityScore -= (1 - typingNaturalness / 100) * 20;
  integrityScore -= (selfPlagiarismScore / 100) * 20;
  integrityScore -= Math.min(tabSwitchCount * 3, 15);
  integrityScore -= tabPasteCorrelation * 10;
  integrityScore -= (aiLikenessScore / 100) * 10;
  integrityScore = Math.max(0, Math.min(100, Math.round(integrityScore)));
  
  // Calculate Dependency Score (0-100, higher = more dependent on external AI)
  let dependencyScore = 0;
  dependencyScore += pasteRatio * 30; // Heavy paste = likely copying from AI
  dependencyScore += (aiLikenessScore / 100) * 25; // AI-like prompts
  dependencyScore += Math.min(tabSwitchCount * 4, 20); // Tab switching
  dependencyScore += tabPasteCorrelation * 15; // Tab+paste combo
  dependencyScore += (selfPlagiarismScore / 100) * 10; // Copying AI responses
  dependencyScore = Math.max(0, Math.min(100, Math.round(dependencyScore)));
  
  if (dependencyScore > 60) flags.push("HIGH_AI_DEPENDENCY");
  
  return {
    pasteCount,
    tabSwitchCount,
    copyCount,
    rightClickCount,
    focusLostCount,
    pasteRatio: Math.round(pasteRatio * 100) / 100,
    typingNaturalness: Math.round(typingNaturalness),
    selfPlagiarismScore,
    aiLikenessScore,
    inputVelocityFlags,
    integrityScore,
    dependencyScore,
    flags,
  };
}
