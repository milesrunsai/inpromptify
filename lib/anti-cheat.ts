export interface IntegritySignals {
  tabSwitches: number;
  totalHiddenMs: number;
  pasteAttempts: number;
  questionsAnsweredTooFast: number; // < 5s
  mouseMovements: number;
  keystrokes: number;
  suspicionScore: number; // 0-100
}

function computeSuspicionScore(signals: Omit<IntegritySignals, "suspicionScore">): number {
  const raw =
    signals.tabSwitches * 15 +
    signals.pasteAttempts * 25 +
    signals.questionsAnsweredTooFast * 10;
  return Math.max(0, Math.min(100, raw));
}

export function createIntegrityTracker() {
  let tabSwitches = 0;
  let totalHiddenMs = 0;
  let pasteAttempts = 0;
  let questionsAnsweredTooFast = 0;
  let mouseMovements = 0;
  let keystrokes = 0;
  let hiddenSince: number | null = null;

  const handlers: { event: string; handler: EventListener; target: EventTarget }[] = [];

  function addListener(target: EventTarget, event: string, handler: EventListener) {
    target.addEventListener(event, handler);
    handlers.push({ event, handler, target });
  }

  function start() {
    addListener(document, "visibilitychange", () => {
      if (document.hidden) {
        tabSwitches++;
        hiddenSince = Date.now();
      } else if (hiddenSince !== null) {
        totalHiddenMs += Date.now() - hiddenSince;
        hiddenSince = null;
      }
    });

    addListener(document, "paste", (e) => {
      pasteAttempts++;
      e.preventDefault();
    });

    addListener(document, "mousemove", () => {
      mouseMovements++;
    });

    addListener(document, "keydown", () => {
      keystrokes++;
    });
  }

  function stop() {
    if (hiddenSince !== null) {
      totalHiddenMs += Date.now() - hiddenSince;
      hiddenSince = null;
    }
    for (const { event, handler, target } of handlers) {
      target.removeEventListener(event, handler);
    }
    handlers.length = 0;
  }

  function recordAnswer(timeTakenMs: number) {
    if (timeTakenMs < 5000) {
      questionsAnsweredTooFast++;
    }
  }

  function getSignals(): IntegritySignals {
    const base = {
      tabSwitches,
      totalHiddenMs,
      pasteAttempts,
      questionsAnsweredTooFast,
      mouseMovements,
      keystrokes,
    };
    return {
      ...base,
      suspicionScore: computeSuspicionScore(base),
    };
  }

  return { start, stop, recordAnswer, getSignals };
}
