"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type TimerVariant = "normal" | "warning" | "critical";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatMMSS(msLeft: number) {
  const totalSec = Math.max(0, Math.floor(msLeft / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

function variantFor(msLeft: number): TimerVariant {
  if (msLeft <= 2 * 60_000) return "critical";
  if (msLeft <= 10 * 60_000) return "warning";
  return "normal";
}

export default function TestTopBar({
  currentIndex,
  total,
  answeredCount,
  msLeft,
}: {
  currentIndex: number;
  total: number;
  answeredCount: number;
  msLeft: number;
}) {
  const v = useMemo(() => variantFor(msLeft), [msLeft]);

  // One-time pop at the exact moment we enter warning (<=10:00)
  const [pop, setPop] = useState(false);
  const didPop = useRef(false);
  useEffect(() => {
    if (v === "warning" && !didPop.current) {
      didPop.current = true;
      setPop(true);
      const t = setTimeout(() => setPop(false), 180);
      return () => clearTimeout(t);
    }
  }, [v]);

  const pct = Math.round((Math.min(answeredCount, total) / total) * 100);

  const timerSize =
    v === "normal"
      ? "text-base md:text-lg font-medium"
      : v === "warning"
      ? "text-lg md:text-xl font-semibold"
      : "text-xl md:text-2xl font-bold animate-breathe";

  const timerColor =
    v === "normal" ? "text-zinc-900" : v === "warning" ? "text-amber-700" : "text-red-700";

  return (
    <div className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-test px-4 md:px-6 py-3">
        {/* Progress bar */}
        <div className="h-[3px] w-full bg-black/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-black/70 rounded-full transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm md:text-base text-zinc-600">Question {currentIndex + 1} / {total}</div>

          <div className="flex items-baseline gap-2">
            <div className="text-xs md:text-sm text-zinc-500">Time remaining</div>
            <div
              className={[
                timerSize,
                timerColor,
                "transform-gpu transition-transform duration-150",
                pop ? "scale-[1.06]" : "scale-100",
              ].join(" ")}
              aria-label="Time remaining"
            >
              {formatMMSS(msLeft)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
