import type { Answer, AntiCheatSignals, FullResult } from "@/lib/scoring";

const KEY = "iq_mvp_state_v1";
const KEY_PERSIST = "iq_mvp_state_v1_persist";

export type StoredState = {
  startedAt: number;
  endTime: number;
  answers: Answer[];
  anti: AntiCheatSignals;
  submittedAt?: number;
  result?: FullResult;
};

function safeParse(raw: string | null): StoredState | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredState;
  } catch {
    return null;
  }
}

export function loadState(): StoredState | null {
  if (typeof window === "undefined") return null;

  // 1) Primary: sessionStorage (per tab)
  const fromSession = safeParse(window.sessionStorage.getItem(KEY));
  if (fromSession) return fromSession;

  // 2) Fallback: localStorage (survives Stripe redirects / new tabs)
  const fromLocal = safeParse(window.localStorage.getItem(KEY_PERSIST));
  return fromLocal;
}

export function saveState(s: StoredState) {
  if (typeof window === "undefined") return;

  // Always save to sessionStorage
  window.sessionStorage.setItem(KEY, JSON.stringify(s));

  // Always mirror to localStorage as a fallback
  window.localStorage.setItem(KEY_PERSIST, JSON.stringify(s));
}

export function clearState() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY);
  // NOTE: we intentionally do NOT remove KEY_PERSIST here,
  // so paid users can come back later and still see results.
}

export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("iq_unlocked_v1") === "1";
}

export function setUnlocked(v: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("iq_unlocked_v1", v ? "1" : "0");
}