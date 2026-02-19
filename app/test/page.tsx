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

  // anti-cheat (minimal)
  const [focusChanges, setFocusChanges] = useState(0);
  const [reloadedFlag, setReloadedFlag] = useState(false);

  // ✅ Prevent double-advance when user clicks fast
  const advancingRef = useRef(false);
  const advanceTimeoutRef = useRef<number | null>(null);

  // Restore from sessionStorage if present
  useEffect(() => {
    const s = loadState();
    if (s && s.endTime > Date.now() && !s.submittedAt) {
      setAnswers(s.answers);
      setStartedAt(s.startedAt);
      setEndTime(s.endTime);
      setFocusChanges(s.anti.focusChanges);
      setReloadedFlag(true); // restore mid-session => effectively a reload
      const firstUnanswered = s.answers.findIndex((a) => a.selectedIndex === null);
      setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : TOTAL_QUESTIONS - 1);
    } else {
      const now = Date.now();
      setStartedAt(now);
      setEndTime(now + DURATION_MS);
      saveState({
        startedAt: now,
        endTime: now + DURATION_MS,
        answers: initAnswers(),
        anti: { focusChanges: 0, reloadedDuringSession: false },
      });
    }
  }, []);

  // Minimal focus monitoring (aura + session comparability)
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setFocusChanges((c) => c + 1);
    };
    const onBlur = () => setFocusChanges((c) => c + 1);

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

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
    router.replace("/results");
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
    }, 250); // slightly quicker; also reduces “double tap” window
  };

  return (
    <main className="min-h-screen">
      <TestTopBar
        currentIndex={currentIndex}
        total={TOTAL_QUESTIONS}
        answeredCount={answeredCount}
        msLeft={Math.max(0, endTime - Date.now())}
      />

      <div className="mx-auto max-w-test px-4 md:px-6 py-6">
        <Card className="p-5 md:p-7">
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

          <div className="mt-6 flex justify-between items-center text-xs text-zinc-500">
            <div>30-minute session. Auto-submit at 0:00.</div>
            <button
              type="button"
              className="underline hover:text-zinc-700"
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
