export interface Question {
  id: string;
  text: string;
  type?: "mcq" | "text"; // Multiple choice or text input
  options?: { id: string; text: string; isCorrect: boolean }[]; // Optional for text questions
  correctOptionId?: string; // Optional for text questions
  correctAnswer?: string; // For text questions
  placeholder?: string; // For text input
  minLength?: number; // Minimum text length
  difficulty: number;
  dimensions: string[];
  tags: string[];
  maxTimeSeconds: number;
}

export interface AssessmentState {
  currentTheta: number;
  attemptedIds: string[];
  dimensionScores: Record<string, number>;
  dimensionCoverage: Record<string, number>;
  thetaHistory: number[];
  questionCount: number;
}

const ALL_DIMENSIONS = [
  "promptQuality",
  "efficiency",
  "speed",
  "responseQuality",
  "iterationIntelligence",
] as const;

const DIMENSION_WEIGHTS: Record<string, number> = {
  promptQuality: 0.25,
  efficiency: 0.2,
  speed: 0.15,
  responseQuality: 0.25,
  iterationIntelligence: 0.15,
};

const MIN_QUESTIONS = 8;
const MAX_QUESTIONS = 12;
const THETA_STABILITY_THRESHOLD = 3;
const STABILITY_WINDOW = 3;

export function createInitialState(): AssessmentState {
  const dimensionScores: Record<string, number> = {};
  const dimensionCoverage: Record<string, number> = {};
  for (const dim of ALL_DIMENSIONS) {
    dimensionScores[dim] = 50;
    dimensionCoverage[dim] = 0;
  }
  return {
    currentTheta: 50.0,
    attemptedIds: [],
    dimensionScores,
    dimensionCoverage,
    thetaHistory: [],
    questionCount: 0,
  };
}

export function calculateNextTheta(
  currentTheta: number,
  wasCorrect: boolean,
  timeTakenMs: number,
  maxTimeMs: number
): number {
  let correctBonus: number;
  let wrongPenalty: number;

  if (currentTheta >= 95) {
    correctBonus = 5;
    wrongPenalty = -45;
  } else if (currentTheta >= 85) {
    correctBonus = 8;
    wrongPenalty = -35;
  } else if (currentTheta >= 70) {
    correctBonus = 12;
    wrongPenalty = -25;
  } else {
    correctBonus = 12;
    wrongPenalty = -18;
  }

  const accuracyAdjustment = wasCorrect ? correctBonus : wrongPenalty;
  const speedBonus = ((maxTimeMs - timeTakenMs) / maxTimeMs) * 8;
  return Math.max(
    0,
    Math.min(100, currentTheta + accuracyAdjustment + speedBonus)
  );
}

export function selectNextQuestion(
  currentTheta: number,
  attemptedIds: string[],
  dimensionCoverage: Record<string, number>,
  pool: Question[]
): Question | null {
  const available = pool.filter((q) => !attemptedIds.includes(q.id));
  if (available.length === 0) return null;

  const targetDim = Object.entries(dimensionCoverage).sort(
    (a, b) => a[1] - b[1]
  )[0][0];

  const candidates = available
    .filter((q) => q.dimensions.includes(targetDim))
    .sort(
      (a, b) =>
        Math.abs(a.difficulty - currentTheta) -
        Math.abs(b.difficulty - currentTheta)
    );

  return (
    candidates[0] ||
    available.sort(
      (a, b) =>
        Math.abs(a.difficulty - currentTheta) -
        Math.abs(b.difficulty - currentTheta)
    )[0] ||
    null
  );
}

export function computeDimensionUpdate(
  question: Question,
  wasCorrect: boolean,
  timeTakenMs: number
): Record<string, number> {
  const update: Record<string, number> = {};
  question.dimensions.forEach((dim) => {
    const base = wasCorrect ? 18 : -22;
    const speedFactor = Math.max(
      -8,
      ((question.maxTimeSeconds * 1000 - timeTakenMs) /
        (question.maxTimeSeconds * 1000)) *
        12
    );
    update[dim] = base + speedFactor;
  });
  return update;
}

export function calculateOverallPromptScore(
  dimensionScores: Record<string, number>
): number {
  let total = 0;
  Object.keys(DIMENSION_WEIGHTS).forEach((dim) => {
    total += (dimensionScores[dim] || 50) * DIMENSION_WEIGHTS[dim];
  });
  return Math.round(Math.max(0, Math.min(100, total)));
}

export function shouldTerminate(state: AssessmentState): boolean {
  if (state.questionCount >= MAX_QUESTIONS) return true;
  if (state.questionCount < MIN_QUESTIONS) return false;

  // Check theta stability over last 3 questions
  const history = state.thetaHistory;
  if (history.length >= STABILITY_WINDOW) {
    const recent = history.slice(-STABILITY_WINDOW);
    const min = Math.min(...recent);
    const max = Math.max(...recent);
    if (max - min <= THETA_STABILITY_THRESHOLD) return true;
  }

  return false;
}

export function processAnswer(
  state: AssessmentState,
  question: Question,
  selectedOptionId: string,
  timeTakenMs: number
): AssessmentState {
  let wasCorrect: boolean;
  
  if (question.type === "text") {
    // For text questions, assume correct for now (will be evaluated server-side)
    // Score should be between 0-1, treat >0.7 as correct
    wasCorrect = selectedOptionId.length > (question.minLength || 50);
  } else {
    wasCorrect = selectedOptionId === question.correctOptionId;
  }
  const maxTimeMs = question.maxTimeSeconds * 1000;

  const newTheta = calculateNextTheta(
    state.currentTheta,
    wasCorrect,
    timeTakenMs,
    maxTimeMs
  );

  const dimensionUpdate = computeDimensionUpdate(
    question,
    wasCorrect,
    timeTakenMs
  );

  const newDimensionScores = { ...state.dimensionScores };
  const newDimensionCoverage = { ...state.dimensionCoverage };

  Object.entries(dimensionUpdate).forEach(([dim, delta]) => {
    newDimensionScores[dim] = Math.max(
      0,
      Math.min(100, (newDimensionScores[dim] || 50) + delta)
    );
    newDimensionCoverage[dim] = (newDimensionCoverage[dim] || 0) + 1;
  });

  return {
    currentTheta: newTheta,
    attemptedIds: [...state.attemptedIds, question.id],
    dimensionScores: newDimensionScores,
    dimensionCoverage: newDimensionCoverage,
    thetaHistory: [...state.thetaHistory, newTheta],
    questionCount: state.questionCount + 1,
  };
}
