/**
 * Item Response Theory (IRT) utilities for adaptive assessment.
 *
 * Uses the 2-Parameter Logistic (2PL) model:
 *   P(correct | theta, a, b) = 1 / (1 + exp(-a * (theta - b)))
 *
 * Where:
 *   theta = ability level of the test-taker
 *   a     = discrimination parameter (how well the item differentiates)
 *   b     = difficulty parameter (maps to question difficulty 1-100)
 */

/** Convert question difficulty (1-100) to IRT b parameter (-3 to +3 logit scale) */
export function difficultyToLogit(difficulty: number): number {
  return ((difficulty - 50) / 50) * 3;
}

/** Convert logit scale back to 0-100 score */
export function logitToScore(logit: number): number {
  return Math.round(Math.max(0, Math.min(100, (logit / 3) * 50 + 50)));
}

/** 2PL probability of correct response */
export function probability2PL(
  theta: number,
  difficulty: number,
  discrimination: number = 1.0
): number {
  const b = difficultyToLogit(difficulty);
  return 1 / (1 + Math.exp(-discrimination * (theta - b)));
}

/** Fisher information for a 2PL item at given theta */
export function fisherInformation(
  theta: number,
  difficulty: number,
  discrimination: number = 1.0
): number {
  const p = probability2PL(theta, difficulty, discrimination);
  return discrimination * discrimination * p * (1 - p);
}

/**
 * Maximum Likelihood Estimation (MLE) of theta using Newton-Raphson.
 * Takes a list of responses and returns the estimated ability level.
 */
export function estimateTheta(
  responses: { difficulty: number; correct: boolean; discrimination?: number }[],
  maxIterations: number = 20,
  tolerance: number = 0.001
): number {
  if (responses.length === 0) return 0;

  // Check for all-correct or all-wrong (MLE doesn't converge)
  const allCorrect = responses.every((r) => r.correct);
  const allWrong = responses.every((r) => !r.correct);
  if (allCorrect) return 2.5;
  if (allWrong) return -2.5;

  let theta = 0; // initial estimate

  for (let i = 0; i < maxIterations; i++) {
    let numerator = 0;
    let denominator = 0;

    for (const response of responses) {
      const a = response.discrimination ?? 1.0;
      const p = probability2PL(theta, response.difficulty, a);
      const u = response.correct ? 1 : 0;

      numerator += a * (u - p);
      denominator += a * a * p * (1 - p);
    }

    if (denominator === 0) break;

    const delta = numerator / denominator;
    theta += delta;

    // Clamp to reasonable range
    theta = Math.max(-3, Math.min(3, theta));

    if (Math.abs(delta) < tolerance) break;
  }

  return theta;
}

/** Standard error of theta estimate */
export function standardError(
  theta: number,
  responses: { difficulty: number; discrimination?: number }[]
): number {
  let totalInfo = 0;
  for (const r of responses) {
    totalInfo += fisherInformation(theta, r.difficulty, r.discrimination ?? 1.0);
  }
  return totalInfo > 0 ? 1 / Math.sqrt(totalInfo) : Infinity;
}

/**
 * Select the next optimal question based on maximum information at current theta.
 * Returns the question ID from available questions that provides the most
 * information at the test-taker's current ability level.
 */
export function selectOptimalItem(
  theta: number,
  availableItems: { id: string; difficulty: number; discrimination?: number }[]
): string | null {
  if (availableItems.length === 0) return null;

  let bestId = availableItems[0].id;
  let bestInfo = -Infinity;

  for (const item of availableItems) {
    const info = fisherInformation(
      theta,
      item.difficulty,
      item.discrimination ?? 1.0
    );
    if (info > bestInfo) {
      bestInfo = info;
      bestId = item.id;
    }
  }

  return bestId;
}
