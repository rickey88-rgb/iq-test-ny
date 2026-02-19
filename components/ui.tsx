"use client";

import React from "react";

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-lg px-4 py-2",
        "bg-zinc-900 text-zinc-50 hover:bg-zinc-800",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "transition-colors",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-lg px-3 py-2",
        "bg-transparent text-zinc-700 hover:bg-black/5",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "transition-colors",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["rounded-2xl bg-white/70 backdrop-blur border border-black/5 shadow-subtle", className].join(" ")}>
      {children}
    </div>
  );
}
