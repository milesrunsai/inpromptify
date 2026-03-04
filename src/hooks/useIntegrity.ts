"use client";

import { useRef, useCallback, useEffect } from "react";
import type { IntegrityEvent, KeystrokeMetrics, IntegrityReport } from "@/lib/integrity";
import { calculateIntegrity } from "@/lib/integrity";

export function useIntegrity() {
  const events = useRef<IntegrityEvent[]>([]);
  const keystrokeTimestamps = useRef<number[]>([]);
  const totalKeystrokes = useRef(0);
  const totalPastedChars = useRef(0);
  const burstInputs = useRef(0);
  const deleteCount = useRef(0);
  const lastInputLength = useRef(0);
  const lastInputTime = useRef(0);

  // Track paste events
  const onPaste = useCallback((e: ClipboardEvent) => {
    const pastedText = e.clipboardData?.getData("text") || "";
    totalPastedChars.current += pastedText.length;
    events.current.push({
      type: "paste",
      timestamp: Date.now(),
      data: `${pastedText.length} chars`,
    });
  }, []);

  // Track copy events (user copying AI responses)
  const onCopy = useCallback(() => {
    events.current.push({ type: "copy", timestamp: Date.now() });
  }, []);

  // Track right-click
  const onContextMenu = useCallback(() => {
    events.current.push({ type: "right_click", timestamp: Date.now() });
  }, []);

  // Track tab visibility
  const onVisibilityChange = useCallback(() => {
    if (document.hidden) {
      events.current.push({ type: "tab_switch", timestamp: Date.now() });
    } else {
      events.current.push({ type: "tab_return", timestamp: Date.now() });
    }
  }, []);

  // Track window blur
  const onBlur = useCallback(() => {
    events.current.push({ type: "focus_lost", timestamp: Date.now() });
  }, []);

  // Track keystrokes on input
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const now = Date.now();
    totalKeystrokes.current++;
    keystrokeTimestamps.current.push(now);

    if (e.key === "Backspace" || e.key === "Delete") {
      deleteCount.current++;
    }
  }, []);

  // Track input changes for burst detection
  const onInputChange = useCallback((newValue: string) => {
    const now = Date.now();
    const lengthDiff = Math.abs(newValue.length - lastInputLength.current);
    const timeDiff = now - lastInputTime.current;

    // Burst detection: >50 chars appearing in <500ms = likely paste or AI
    if (lengthDiff > 50 && timeDiff < 500) {
      burstInputs.current++;
    }

    lastInputLength.current = newValue.length;
    lastInputTime.current = now;
  }, []);

  // Attach global listeners
  useEffect(() => {
    document.addEventListener("paste", onPaste);
    document.addEventListener("copy", onCopy);
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, [onPaste, onCopy, onContextMenu, onVisibilityChange, onBlur]);

  // Generate report
  const getReport = useCallback((userPrompts: string[], aiResponses: string[]): IntegrityReport => {
    const timestamps = keystrokeTimestamps.current;
    let avgInterval = 0;
    if (timestamps.length > 1) {
      let totalInterval = 0;
      for (let i = 1; i < timestamps.length; i++) {
        totalInterval += timestamps[i] - timestamps[i - 1];
      }
      avgInterval = totalInterval / (timestamps.length - 1);
    }

    const metrics: KeystrokeMetrics = {
      totalKeystrokes: totalKeystrokes.current,
      totalPastedChars: totalPastedChars.current,
      avgKeystrokeInterval: Math.round(avgInterval),
      burstInputs: burstInputs.current,
      deleteRatio: totalKeystrokes.current > 0 ? deleteCount.current / totalKeystrokes.current : 0,
      totalInputTime: timestamps.length > 1 ? timestamps[timestamps.length - 1] - timestamps[0] : 0,
    };

    return calculateIntegrity(events.current, metrics, userPrompts, aiResponses);
  }, []);

  // Reset for new stage
  const reset = useCallback(() => {
    events.current = [];
    keystrokeTimestamps.current = [];
    totalKeystrokes.current = 0;
    totalPastedChars.current = 0;
    burstInputs.current = 0;
    deleteCount.current = 0;
    lastInputLength.current = 0;
    lastInputTime.current = 0;
  }, []);

  return { onKeyDown, onInputChange, getReport, reset };
}
