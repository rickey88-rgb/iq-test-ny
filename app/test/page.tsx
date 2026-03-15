"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TestTopBar from "@/components/TestTopBar";
import QuestionView from "@/components/QuestionView";
import { Card } from "@/components/ui";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/questions";
import { buildFullResult } from "@/lib/scoring";
import type { Answer } from "@/lib/scoring";
import { loadState, saveState, StoredState } from "@/lib/storage";

const DURATION_MS = 30 * 60_000;

// Anti-cheat tuning (basal + stable)
const ANTI_GRACE_MS = 1500; // ignore focus/vis events right after load
const ANTI_COOLDOWN_MS = 1200; // prevent rapid double-counting
const ACTIVE_SESSION_KEY = "iqtest_active_session_v1";

function initAnswers(): Answer[] {
  return QUESTIONS.map((q) => ({ questionId: q.id, selectedIndex: null }));
}

export default function TestPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(initAnswers());
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number>(Date.now() + DURATION_MS);
  const [locked, setLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // anti-cheat (minimal + robust)
  const [focusChanges, setFocusChanges] = useState(0);
  const [reloadedFlag, setReloadedFlag] = useState(false);

  const mountedAtRef = useRef<number>(Date.now());
  const lastAntiEventAtRef = useRef<number>(0);

  // ✅ Prevent double-advance when user clicks fast
  const advancingRef = useRef(false);
  const advanceTimeoutRef = useRef<number | null>(null);

  // Helper: should we count anti-cheat events?
  const shouldCountAntiEvent = () => {
    if (locked || submitting) return false;
    const now = Date.now();

    // ignore noisy events right after load
    if (now - mountedAtRef.current < ANTI_GRACE_MS) return false;

    // cooldown to avoid rapid double counting
    if (now - lastAntiEventAtRef.current < ANTI_COOLDOWN_MS) return false;

    lastAntiEventAtRef.current = now;
    return true;
  };

  // Restore from sessionStorage if present
  useEffect(() => {
    mountedAtRef.current = Date.now();

    const s = loadState();
    const now = Date.now();

    // Reload detection (real): if we already had an "active session" marker, this load is a reload/revisit mid-session
    const hadActiveMarker = sessionStorage.getItem(ACTIVE_SESSION_KEY) === "1";
    sessionStorage.setItem(ACTIVE_SESSION_KEY, "1");

    if (s && s.endTime > now && !s.submittedAt) {
      setAnswers(s.answers);
      setStartedAt(s.startedAt);
      setEndTime(s.endTime);

      // keep previous anti state
      setFocusChanges(s.anti.focusChanges);

      // Only mark reload if it truly looks like a reload mid-session
      // (active marker existed OR stored anti already says it happened)
      setReloadedFlag(Boolean(hadActiveMarker || s.anti.reloadedDuringSession));

      const firstUnanswered = s.answers.findIndex((a) => a.selectedIndex === null);
      setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : TOTAL_QUESTIONS - 1);
    } else {
      const freshStart = now;
      setStartedAt(freshStart);
      setEndTime(freshStart + DURATION_MS);
      setAnswers(initAnswers());
      setFocusChanges(0);
      setReloadedFlag(false);

      saveState({
        startedAt: freshStart,
        endTime: freshStart + DURATION_MS,
        answers: initAnswers(),
        anti: { focusChanges: 0, reloadedDuringSession: false },
      });
    }
  }, []);

  // Minimal focus monitoring (basal + stable)
  useEffect(() => {
    const onVis = () => {
      if (!document.hidden) return;
      if (!shouldCountAntiEvent()) return;
      setFocusChanges((c) => c + 1);
    };

    const onBlur = () => {
      if (!shouldCountAntiEvent()) return;
      setFocusChanges((c) => c + 1);
    };

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked, submitting]);

  // Persist state
  useEffect(() => {
    saveState({
      startedAt,
      endTime,
      answers,
      anti: { focusChanges, reloadedDuringSession: reloadedFlag },
    });
  }, [startedAt, endTime, answers, focusChanges, reloadedFlag]);

  // tick
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((x) => x + 1), 250);
    return () => window.clearInterval(id);
  }, []);

  // ✅ submitNow can accept the latest answers (to avoid stale state issues)
  const submitNow = (answersOverride?: Answer[]) => {
    if (submitting) return;

    // lock everything immediately
    setLocked(true);
    setSubmitting(true);
    advancingRef.current = true;

    if (advanceTimeoutRef.current) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

    const finalAnswers = answersOverride ?? answers;

    const result = buildFullResult(finalAnswers, {
      focusChanges,
      reloadedDuringSession: reloadedFlag,
    });

    const stored: StoredState = {
      startedAt,
      endTime,
      answers: finalAnswers,
      anti: { focusChanges, reloadedDuringSession: reloadedFlag },
      submittedAt: Date.now(),
      result,
    };

    saveState(stored);

    // session completed -> remove active marker so next visit doesn't look like a "reload mid-session"
    sessionStorage.removeItem(ACTIVE_SESSION_KEY);

   router.replace("/test/analyzing");
  };

  // auto-submit when time is up
  useEffect(() => {
    if (locked || submitting) return;
    if (endTime <= Date.now()) {
      submitNow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, endTime, locked, submitting]);

  const answeredCount = useMemo(
    () => answers.filter((a) => a.selectedIndex !== null).length,
    [answers]
  );

  const question = QUESTIONS[currentIndex];

  // ✅ Unlock clicks when question changes (next question has rendered)
  useEffect(() => {
    advancingRef.current = false;
    if (advanceTimeoutRef.current) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, [currentIndex]);

  // ✅ Auto-advance; if last question, auto-submit.
  const selectAnswer = (idx: number) => {
    if (locked || submitting) return;

    // ✅ prevent double-click / double-tap from scheduling two advances
    if (advancingRef.current) return;
    advancingRef.current = true;

    const updated = answers.map((a) =>
      a.questionId === question.id ? { ...a, selectedIndex: idx } : a
    );

    setAnswers(updated);

    // clear any previous pending advance (safety)
    if (advanceTimeoutRef.current) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

    advanceTimeoutRef.current = window.setTimeout(() => {
      if (currentIndex >= TOTAL_QUESTIONS - 1) {
        submitNow(updated); // ✅ last question => submit
      } else {
        setCurrentIndex((i) => Math.min(TOTAL_QUESTIONS - 1, i + 1));
      }
    }, 250);
  };

  return (
    <main className="min-h-screen">
      <TestTopBar
        currentIndex={currentIndex}
        total={TOTAL_QUESTIONS}
        answeredCount={answeredCount}
        msLeft={Math.max(0, endTime - Date.now())}
      />

      <div className="mx-auto max-w-test px-4 md:px-6 py-6 md:py-3">
        <Card className="p-5 md:p-5">
          {submitting && (
            <div className="mb-4 text-sm text-zinc-600">Submitting your responses…</div>
          )}

          <QuestionView
            question={question}
            index={currentIndex}
            total={TOTAL_QUESTIONS}
            selectedIndex={
              answers.find((a) => a.questionId === question.id)?.selectedIndex ?? null
            }
            onSelect={selectAnswer}
            locked={locked || submitting}
          />

         <div className="mt-3 md:mt-2 flex items-center justify-between gap-3 border-t border-black/5 pt-3 text-[11px] md:text-xs text-zinc-500">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
  <span>30-minute session • Auto-submit at 0:00</span>
  <span className="hidden md:inline">• You cannot return to previous questions.</span>
</div>
            <button
              type="button"
              className="shrink-0 underline hover:text-zinc-700"
              onClick={() => submitNow()}
              disabled={submitting}
            >
              Submit now
            </button>
          </div>
        </Card>
      </div>
    </main>
  );
}