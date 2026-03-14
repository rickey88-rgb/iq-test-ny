"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadState } from "@/lib/storage";

export default function AnalyzingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showTeaser, setShowTeaser] = useState(false);

  useEffect(() => {
    // Om ingen testdata finns, skicka tillbaka användaren till testet.
    const savedState = loadState();

if (!savedState || !savedState.result) {
  router.replace("/test");
  return;
}

    const step1Timer = setTimeout(() => setStep(1), 600);
    const step2Timer = setTimeout(() => setStep(2), 1400);
    const step3Timer = setTimeout(() => setStep(3), 2200);
    const teaserTimer = setTimeout(() => setShowTeaser(true), 2600);

    // ÄNDRA DENNA ROUTE om din pre-paywall ligger på en annan URL
    const redirectTimer = setTimeout(() => {
      router.replace("/test/result");
    }, 3000);

    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      clearTimeout(teaserTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-black">
          Analyzing your answers...
        </h1>

        <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
          We’re processing your response patterns, difficulty progression, and
          performance across multiple problem types.
        </p>

        <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full bg-black transition-all duration-[3000ms] ease-linear"
            style={{ width: "100%" }}
          />
        </div>

        <div className="mt-8 space-y-4 text-left">
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-500 ${
              step >= 1
                ? "border-black bg-neutral-50 text-black opacity-100"
                : "border-neutral-200 bg-white text-neutral-400 opacity-60"
            }`}
          >
            <span className="text-sm font-medium">
              {step >= 1 ? "✓" : "•"}
            </span>
            <span className="text-sm sm:text-base">
              Processing response patterns
            </span>
          </div>

          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-500 ${
              step >= 2
                ? "border-black bg-neutral-50 text-black opacity-100"
                : "border-neutral-200 bg-white text-neutral-400 opacity-60"
            }`}
          >
            <span className="text-sm font-medium">
              {step >= 2 ? "✓" : "•"}
            </span>
            <span className="text-sm sm:text-base">
              Comparing performance across difficulty levels
            </span>
          </div>

          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-500 ${
              step >= 3
                ? "border-black bg-neutral-50 text-black opacity-100"
                : "border-neutral-200 bg-white text-neutral-400 opacity-60"
            }`}
          >
            <span className="text-sm font-medium">
              {step >= 3 ? "✓" : "•"}
            </span>
            <span className="text-sm sm:text-base">
              Finalizing your result profile
            </span>
          </div>
        </div>

        <div
          className={`mt-8 transition-all duration-500 ${
            showTeaser ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <p className="text-sm sm:text-base text-neutral-700">
            Your answers already show a distinct performance pattern.
          </p>
        </div>
      </div>
    </main>
  );
}