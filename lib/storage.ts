import type { Answer, AntiCheatSignals, FullResult } from "@/lib/scoring";

const KEY = "iq_mvp_state_v1";

export type StoredState = {
  startedAt: number;
  endTime: number;
  answers: Answer[];
  anti: AntiCheatSignals;
  submittedAt?: number;
  result?: FullResult;
};

export function loadState(): StoredState | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredState;
  } catch {
    return null;
  }
}

export function saveState(s: StoredState) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify(s));
}

export function clearState() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY);
}

export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("iq_unlocked_v1") === "1";
}

export function setUnlocked(v: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("iq_unlocked_v1", v ? "1" : "0");
}
