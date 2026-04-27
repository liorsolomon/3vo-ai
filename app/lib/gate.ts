"use client";

const RUNS_KEY = "3vo_runs";
const UPGRADED_KEY = "3vo_upgraded";
export const FREE_RUNS = 3;

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore quota/security errors
  }
}

export function isUpgraded(): boolean {
  return safeGet(UPGRADED_KEY) === "true";
}

export function setUpgraded(): void {
  safeSet(UPGRADED_KEY, "true");
}

export function getRuns(): number {
  return parseInt(safeGet(RUNS_KEY) ?? "0", 10);
}

export function incrementRuns(): number {
  if (isUpgraded()) return 0;
  const next = getRuns() + 1;
  safeSet(RUNS_KEY, String(next));
  return next;
}

export function isGated(): boolean {
  if (isUpgraded()) return false;
  return getRuns() >= FREE_RUNS;
}

export function runsRemaining(): number {
  if (isUpgraded()) return Infinity;
  return Math.max(0, FREE_RUNS - getRuns());
}
