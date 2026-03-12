"use client";

import { useEffect, useMemo, useState } from "react";
import type { Question } from "@/lib/questions";
import Option from "@/components/Option";
import { PrimaryButton } from "@/components/ui";

const LABELS = ["A", "B", "C", "D"];

const looksLikeSymbols = (s: string) => {
  const t = s.replace(/\s+/g, "");
  if (!t) return false;
  // True om det inte finns bokstäver/siffror (dvs mest symboler)
  return !/[A-Za-z0-9ÅÄÖåäö]/.test(t);
};

export default function QuestionView({
  question,
  index,
  total,
  selectedIndex,
  onSelect,
  locked,
}: {
  question: Question;
  index: number;
  total: number;
  selectedIndex: number | null;
  onSelect: (idx: number) => void;
  locked: boolean;
}) {
  // memory handling
  const isMemory = question.type === "memory";
  const [phase, setPhase] = useState<"ready" | "showing" | "answer">("ready");

  useEffect(() => {
    // reset phase on question change
    setPhase(isMemory ? "ready" : "answer");
  }, [question.id, isMemory]);

  const canAnswer = !locked && (!isMemory || phase === "answer");

  const showSequence = async () => {
    if (!isMemory || locked) return;
    setPhase("showing");
    await new Promise((r) => setTimeout(r, question.showMs));
    setPhase("answer");
  };

  const prompt = useMemo(() => {
    if (question.type === "mc") return question.prompt;
    return question.questionText;
  }, [question]);

  const isSymbolPrompt = looksLikeSymbols(prompt);

  return (
    <div className="w-full">
      {/* Question prompt */}
<div className="mt-4 md:mt-6">
  {isSymbolPrompt ? (
    <div className="max-w-[720px] text-zinc-900">
      <div className="flex flex-nowrap items-center gap-3 md:gap-4 overflow-x-auto whitespace-nowrap pb-1 text-[28px] md:text-[34px] leading-[1.05] font-semibold">
        {prompt.split("\n").map((line, idx) => (
          <span key={idx} className={idx === 0 ? "" : "ml-0"}>
            {line}
          </span>
        ))}
      </div>
    </div>
  ) : (
    <div className="max-w-[720px] text-zinc-900 whitespace-pre-line text-[20px] md:text-[22px] leading-snug font-medium">
      {prompt}
    </div>
  )}
</div>

      {/* Memory sequence block */}
      {isMemory && (
        <div className="mt-5">
          {phase === "ready" && (
            <PrimaryButton onClick={showSequence} disabled={locked}>
              Show sequence
            </PrimaryButton>
          )}

          {phase === "showing" && (
            <div className="rounded-2xl border border-black/10 bg-white/70 px-5 py-4 max-w-[720px]">
              <div className="text-xs text-zinc-500 mb-2">Memorize the sequence</div>

              {/* No-wrap + horizontal scroll to prevent line breaks */}
              <div className="flex flex-nowrap items-center gap-3 md:gap-4 overflow-x-auto whitespace-nowrap pb-1 text-[26px] md:text-[30px] font-semibold text-zinc-900">
                {question.sequence.map((x, i) => (
                  <span key={i} className="min-w-[32px] md:min-w-[36px] text-center">
                    {x}
                  </span>
                ))}
              </div>
            </div>
          )}

          {phase === "answer" && (
            <div className="text-xs text-zinc-500">Which option shows the same order?</div>
          )}
        </div>
      )}

      {/* Options */}
      <div className="mt-5 grid gap-3">
        {(question.type === "mc" ? question.options : question.options).map((opt, i) => (
          <Option
            key={i}
            label={LABELS[i]}
            text={opt}
            selected={selectedIndex === i}
            onSelect={() => canAnswer && onSelect(i)}
            disabled={!canAnswer}
          />
        ))}
      </div>

      {/* Small note (desktop) */}
      <div className="mt-4 text-xs text-zinc-500">You cannot return to previous questions.</div>
    </div>
  );
}