"use client";

import { useEffect, useMemo, useState } from "react";
import type { Question } from "@/lib/questions";
import Option from "@/components/Option";
import MatrixFigure from "@/components/MatrixFigure";
import { PrimaryButton } from "@/components/ui";
import PatternFigure from "@/components/PatternFigure";

const LABELS = ["A", "B", "C", "D"];

type VisualPatternFigure = {
  shape: "circle" | "triangle" | "diamond" | "ring";
  tone?: "cyan" | "violet" | "gold" | "neutral";
};

const looksLikeSymbols = (s: string) => {
  const t = s.replace(/\s+/g, "");
  if (!t) return false;
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
  const isMemory = question.type === "memory";
  const isMatrix = question.type === "matrix";
  const isMc = question.type === "mc";
  const [phase, setPhase] = useState<"ready" | "showing" | "answer">("ready");

  useEffect(() => {
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
    if (question.type === "matrix") return question.prompt;
    return question.questionText;
  }, [question]);

  const hasVisualSequence =
    isMc &&
    Array.isArray(question.sequence) &&
    question.sequence.length > 0;

  const hasFigureOptions =
    isMc &&
    Array.isArray(question.figureOptions) &&
    question.figureOptions.length > 0;

  const isSymbolPrompt = !isMatrix && !hasVisualSequence && looksLikeSymbols(prompt);

  const renderPatternSequenceItem = (
    item: VisualPatternFigure | null,
    idx: number
  ) => {
    if (item === null) {
      return (
        <div
          key={idx}
          className="flex items-center justify-center shrink-0"
          style={{ width: 28, height: 28 }}
        >
          <span className="text-zinc-900/70 text-[22px] md:text-[24px] font-semibold leading-none">
            ?
          </span>
        </div>
      );
    }

    return <PatternFigure key={idx} {...item} size="md" />;
  };

  return (
    <div className="w-full">
      {/* Question prompt */}
      <div className="mt-4 md:mt-0">
        {hasVisualSequence ? (
          <div className="max-w-[720px] text-zinc-900">
            <div className="whitespace-pre-line text-[20px] md:text-[22px] leading-snug font-medium">
              {prompt}
            </div>

            <div className="flex flex-nowrap items-center gap-2.5 md:gap-3 overflow-x-auto whitespace-nowrap py-2 pb-2">
              {question.sequence.map((item, i) =>
                renderPatternSequenceItem(item as VisualPatternFigure | null, i)
              )}
            </div>
          </div>
        ) : isSymbolPrompt ? (
          <div className="max-w-[720px] text-zinc-900">
            <div className="flex flex-nowrap items-center gap-3 md:gap-4 overflow-x-auto whitespace-nowrap py-1 pb-2 text-[26.5px] md:text-[32px] leading-[1.12] font-semibold">
              {prompt}
            </div>
          </div>
        ) : (
          <div className="max-w-[720px] text-zinc-900 whitespace-pre-line text-[20px] md:text-[22px] leading-snug font-medium">
            {prompt}
          </div>
        )}
      </div>

      {/* Matrix block */}
      {isMatrix && (
        <div className="mt-4 md:mt-2 max-w-[720px]">
          <div className="grid grid-cols-3 gap-2 md:gap-3 w-fit mx-auto">
            {question.grid.map((cell, i) =>
              cell ? (
                <MatrixFigure key={i} {...cell} size="lg" />
              ) : (
                <MatrixFigure key={i} missing size="lg" />
              )
            )}
          </div>
        </div>
      )}

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

              {(question.sequence?.length ?? 0) >= 7 ? (
                <div className="grid grid-flow-col auto-cols-fr items-center gap-2 md:gap-3 whitespace-nowrap pb-1 text-[clamp(18px,5.2vw,30px)] md:text-[30px] font-semibold text-zinc-900">
                  {question.sequence.map((x, i) => (
                    <span key={i} className="min-w-0 text-center font-mono tabular-nums">
                      {x}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex flex-nowrap items-center gap-3 md:gap-4 overflow-x-auto whitespace-nowrap pb-1 text-[26px] md:text-[30px] font-semibold text-zinc-900 after:content-[''] after:block after:w-4 after:flex-none">
                  {question.sequence.map((x, i) => (
                    <span key={i} className="shrink-0 min-w-[32px] md:min-w-[36px] text-center">
                      {x}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {phase === "answer" && (
            <div className="text-xs text-zinc-500">Which option shows the same order?</div>
          )}
        </div>
      )}

      {/* Options */}
      <div
        className={[
          "mt-4 md:mt-3 grid gap-3",
          isMatrix ? "grid-cols-2" : "grid-cols-1",
        ].join(" ")}
      >
        {isMatrix
          ? question.options.map((opt, i) => (
              <Option
                key={i}
                label={LABELS[i]}
                visual={<MatrixFigure {...opt} size="sm" />}
                selected={selectedIndex === i}
                onSelect={() => canAnswer && onSelect(i)}
                disabled={!canAnswer}
              />
            ))
          : question.options.map((opt, i) => (
              <Option
                key={i}
                label={LABELS[i]}
                visual={
                  hasFigureOptions && question.figureOptions[i] ? (
                    <PatternFigure
                      {...(question.figureOptions[i] as VisualPatternFigure)}
                      size="sm"
                    />
                  ) : undefined
                }
                text={hasFigureOptions ? undefined : opt}
                selected={selectedIndex === i}
                onSelect={() => canAnswer && onSelect(i)}
                disabled={!canAnswer}
              />
            ))}
      </div>

      <div className="mt-4 text-xs text-zinc-500 md:hidden">
        You cannot return to previous questions.
      </div>
    </div>
  );
}