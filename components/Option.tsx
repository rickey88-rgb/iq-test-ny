"use client";

import React from "react";

function looksLikeSymbols(s: string) {
  const t = s.replace(/\s+/g, "");
  if (!t) return false;
  // True om det inte finns bokstäver/siffror (dvs mest symboler)
  return !/[A-Za-z0-9ÅÄÖåäö]/.test(t);
}

export default function Option({
  label,
  text,
  selected,
  onSelect,
  disabled,
}: {
  label: string;
  text: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  const isSymbolText = looksLikeSymbols(text);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={[
        "w-full text-left rounded-xl px-4 py-4 md:py-3",
        "border border-black/10 bg-white/70",
        "transition-colors duration-150",
        "hover:bg-black/5 hover:border-black/20",
        "focus:outline-none focus:ring-2 focus:ring-black/20",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        selected ? "bg-black/5 border-black/25" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "mt-[2px] w-8 h-8 md:w-8 md:h-8 flex items-center justify-center rounded-md text-sm font-semibold",
            selected ? "bg-zinc-900 text-zinc-50" : "bg-black/5 text-zinc-700",
          ].join(" ")}
          aria-hidden
        >
          {label}
        </div>

        <div
          className={[
            "text-zinc-900 whitespace-pre-line",
            isSymbolText
              ? "text-[22px] md:text-[24px] leading-[1.05] font-semibold"
              : "text-[15px] md:text-[15px] leading-snug",
          ].join(" ")}
        >
          {text}
        </div>
      </div>
    </button>
  );
}