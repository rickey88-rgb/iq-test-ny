"use client";

import { useEffect, useMemo, useState } from "react";
import type { Question, MatrixCell } from "@/lib/questions";
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

  const prompt = useMemo(() => {
    if (question.type === "mc") return question.prompt;
    if (question.type === "matrix") return question.prompt;
    return question.questionText;
  }, [question]);

  const mcSequence: (VisualPatternFigure | null)[] =
    isMc && Array.isArray(question.sequence)
      ? (question.sequence as (VisualPatternFigure | null)[])
      : [];

  const mcFigureOptions: VisualPatternFigure[] =
    isMc && Array.isArray(question.figureOptions)
      ? (question.figureOptions as VisualPatternFigure[])
      : [];

  const textOptions: string[] =
    !isMatrix && Array.isArray(question.options)
      ? (question.options as string[])
      : [];

  const matrixGrid: (MatrixCell | null)[] =
    isMatrix ? (question.grid as (MatrixCell | null)[]) : [];

  const matrixOptions: MatrixCell[] =
    isMatrix ? (question.options as MatrixCell[]) : [];

  const memorySequence: (string | number)[] =
    isMemory && Array.isArray(question.sequence)
      ? (question.sequence as (string | number)[])
      : [];

  const memoryShowMs: number = isMemory ? question.showMs : 0;

  const hasVisualSequence = mcSequence.length > 0;
  const hasFigureOptions = mcFigureOptions.length > 0;

  const isSymbolPrompt =
    !isMatrix && !hasVisualSequence && looksLikeSymbols(prompt);

  const showSequence = async () => {
    if (!isMemory || locked) return;
    setPhase("showing");
    await new Promise((resolve) => setTimeout(resolve, memoryShowMs));
    setPhase("answer");
  };

  const renderPatternSequenceItem = (
    item: VisualPatternFigure | null,
    idx: number
  ) => {
    if (item === null) {
      return (
        <div
          key={idx}
          className="flex items-center justify-center shrink-0"
          style={{ width: 30, height: 30 }}
        >
          <span className="text-zinc-900/70 text-[24px] md:text-[26px] font-semibold leading-none">
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
              {mcSequence.map((item: VisualPatternFigure | null, i: number) =>
                renderPatternSequenceItem(item, i)
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
            {matrixGrid.map((cell: MatrixCell | null, i: number) =>
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
              <div className="text-xs text-zinc-500 mb-2">
                Memorize the sequence
              </div>

              {memorySequence.length >= 7 ? (
                <div className="grid grid-flow-col auto-cols-fr items-center gap-2 md:gap-3 whitespace-nowrap pb-1 text-[clamp(18px,5.2vw,30px)] md:text-[30px] font-semibold text-zinc-900">
                  {memorySequence.map((x: string | number, i: number) => (
                    <span
                      key={i}
                      className="min-w-0 text-center font-mono tabular-nums"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex flex-nowrap items-center gap-3 md:gap-4 overflow-x-auto whitespace-nowrap pb-1 text-[26px] md:text-[30px] font-semibold text-zinc-900 after:content-[''] after:block after:w-4 after:flex-none">
                  {memorySequence.map((x: string | number, i: number) => (
                    <span
                      key={i}
                      className="shrink-0 min-w-[32px] md:min-w-[36px] text-center"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {phase === "answer" && (
            <div className="text-xs text-zinc-500">
              Which option shows the same order?
            </div>
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
          ? matrixOptions.map((opt: MatrixCell, i: number) => (
              <Option
                key={i}
                label={LABELS[i]}
                visual={<MatrixFigure {...opt} size="sm" />}
                selected={selectedIndex === i}
                onSelect={() => canAnswer && onSelect(i)}
                disabled={!canAnswer}
              />
            ))
          : textOptions.map((opt: string, i: number) => (
              <Option
                key={i}
                label={LABELS[i]}
                visual={
                  isMc && hasFigureOptions && mcFigureOptions[i] ? (
                    <PatternFigure {...mcFigureOptions[i]} size="lg" />
                  ) : undefined
                }
                text={isMc && hasFigureOptions ? undefined : opt}
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