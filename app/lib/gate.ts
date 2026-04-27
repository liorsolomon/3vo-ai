"use client";

const STORAGE_KEY = "3vo_runs";
const FREE_RUNS = 3;

export function getRuns(): number {
  if (typeof window === "undefined") return 0;
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10);
  } catch {
    return 0;
  }
}

export function incrementRuns(): number {
  if (typeof window === "undefined") return 0;
  try {
    const next = getRuns() + 1;
    localStorage.setItem(STORAGE_KEY, String(next));
    return next;
  } catch {
    return 0;
  }
}

export function isGated(): boolean {
  return getRuns() >= FREE_RUNS;
}

export function runsRemaining(): number {
  return Math.max(0, FREE_RUNS - getRuns());
}

export { FREE_RUNS };
