"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, PrimaryButton, GhostButton } from "@/components/ui";
import { buildFullResult, DISCLAIMER } from "@/lib/scoring";
import { loadState, saveState, isUnlocked } from "@/lib/storage";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

/** deterministic tiny hash → 0..1 (stable “jitter” so bars look alive without extra data) */
function hash01(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function percent01to100(n01: number) {
  return Math.round(clamp(n01, 0, 1) * 100);
}

function formatOneDecimal(n: number) {
  return (Math.round(n * 10) / 10).toFixed(1);
}

// Approximate normal CDF for z (Abramowitz & Stegun style approximation)
function normalCdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  const cdf = z >= 0 ? 1 - p : p;
  return clamp(cdf, 0, 1);
}

function iqToPercentile(iq: number) {
  // Classic IQ model: mean 100, sd 15
  const z = (iq - 100) / 15;
  return Math.round(normalCdf(z) * 100);
}

function ProgressRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number; // 0..100
  tone: "good" | "bad" | "neutral";
}) {
  const v = clamp(value, 0, 100);

  const barColor =
    tone === "good"
      ? "bg-emerald-500"
      : tone === "bad"
      ? "bg-red-500"
      : "bg-zinc-500";

  const glow =
    tone === "good"
      ? "shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
      : tone === "bad"
      ? "shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
      : "shadow-[0_0_0_3px_rgba(113,113,122,0.12)]";

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm text-zinc-800">{label}</div>
        <div className="text-xs font-medium text-zinc-500 tabular-nums">{v}%</div>
      </div>

      <div className={`h-2.5 w-full rounded-full bg-zinc-200/70 ${glow}`}>
        <div
          className={`h-2.5 rounded-full ${barColor} transition-[width] duration-500`}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

function RadarChart({
  metrics,
}: {
  metrics: Array<{ label: string; value01: number; color: "good" | "bad" }>;
}) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;

  const N = metrics.length;
  const angleStep = (Math.PI * 2) / N;

  const rings = [0.25, 0.5, 0.75, 1.0];

  function point(i: number, value01: number) {
    const a = -Math.PI / 2 + i * angleStep;
    const rr = r * clamp(value01, 0, 1);
    return { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr };
  }

  const goodPoly = metrics
    .map((m, i) => {
      const p = point(i, m.value01);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");

  const riskPoly = metrics
    .map((m, i) => {
      const v = m.color === "bad" ? m.value01 : 0.18;
      const p = point(i, v);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Cognitive Profile (visual)</div>
          <div className="mt-1 text-xs text-zinc-500">
            Green = strengths-weighted signal · Red = relative risk/drag
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Strength
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Limitation
          </span>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-[320px_1fr] gap-6 items-center">
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {rings.map((k) => (
              <circle
                key={k}
                cx={cx}
                cy={cy}
                r={r * k}
                fill="none"
                stroke="rgba(0,0,0,0.08)"
                strokeWidth="1"
              />
            ))}

            {metrics.map((m, i) => {
              const a = -Math.PI / 2 + i * angleStep;
              const x2 = cx + Math.cos(a) * r;
              const y2 = cy + Math.sin(a) * r;
              return (
                <line
                  key={m.label}
                  x1={cx}
                  y1={cy}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(0,0,0,0.10)"
                  strokeWidth="1"
                />
              );
            })}

            <polygon
              points={goodPoly}
              fill="rgba(16,185,129,0.18)"
              stroke="rgba(16,185,129,0.9)"
              strokeWidth="2"
            />

            <polygon
              points={riskPoly}
              fill="rgba(239,68,68,0.10)"
              stroke="rgba(239,68,68,0.9)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {metrics.map((m, i) => {
              const p = point(i, m.value01);
              const fill = m.color === "bad" ? "rgb(239,68,68)" : "rgb(16,185,129)";
              return <circle key={m.label} cx={p.x} cy={p.y} r="3.5" fill={fill} />;
            })}
          </svg>
        </div>

        <div className="space-y-3">
          {metrics.map((m) => {
            const v = percent01to100(m.value01);
            const tone = m.color === "bad" ? "bad" : "good";
            return <ProgressRow key={m.label} label={m.label} value={v} tone={tone} />;
          })}
        </div>
      </div>
    </div>
  );
}

function IQMeter({
  iqValue,
  locked,
  animateOnMount = true,
}: {
  iqValue: number;
  locked: boolean;
  animateOnMount?: boolean;
}) {
  const MIN = 70;
  const MAX = 145;
  const ticks = [70, 85, 100, 115, 130, 145];

  const iq = clamp(Number.isFinite(iqValue) ? iqValue : 100, MIN, MAX);
  const targetPos = ((iq - MIN) / (MAX - MIN)) * 100;
  const percentile = iqToPercentile(iq);

  const [pos, setPos] = useState(0);

  useEffect(() => {
    // LOCKED: no targeting; sweep via CSS animation
    if (locked) {
      setPos(0);
      return;
    }

    // UNLOCKED: animate to exact once
    const startPos = animateOnMount ? 0 : targetPos;
    setPos(startPos);

    const raf = requestAnimationFrame(() => {
      setPos(targetPos);
    });

    return () => cancelAnimationFrame(raf);
  }, [locked, animateOnMount, targetPos]);

  const averageIndex = Math.round(((100 - MIN) / (MAX - MIN)) * 25);

  return (
    <div className="mt-5 rounded-2xl border border-black/10 bg-white/75 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-zinc-500">IQ meter</div>

          <div className="mt-1 text-sm text-zinc-700">
            {locked ? (
              <>
                Your exact IQ score has already been calculated —{" "}
                <span className="font-medium text-zinc-900">it remains hidden.</span>
              </>
            ) : (
              <>
                Higher than approximately{" "}
                <span className="font-semibold text-zinc-900">{percentile}%</span> of the
                population
              </>
            )}
          </div>
        </div>

        {locked ? (
          <div className="text-xs text-zinc-500">Unlock to reveal the exact number</div>
        ) : (
          <div className="text-xs text-zinc-500 tabular-nums">
            Scale: {MIN}–{MAX}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="relative">
          {/* TRACK: strong zones + fill paint + sheen */}
          <div className="relative h-3 rounded-full overflow-hidden border border-black/12 bg-zinc-100 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]">
            {/* base zone tint */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(56,189,248,0.44) 0%, rgba(56,189,248,0.26) 35%, rgba(251,191,36,0.26) 70%, rgba(251,191,36,0.44) 100%)",
              }}
            />

            {/* sweep fill (paints with the marker) */}
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={
                locked
                  ? {
                      width: "0%",
                      background:
                        "linear-gradient(90deg, rgba(56,189,248,0.75) 0%, rgba(56,189,248,0.42) 40%, rgba(251,191,36,0.48) 75%, rgba(251,191,36,0.80) 100%)",
                      animation:
                        "iqFill 3600ms cubic-bezier(0.16, 1, 0.3, 1) infinite alternate",
                      opacity: 0.95,
                    }
                  : {
                      width: `${targetPos}%`,
                      background:
                        "linear-gradient(90deg, rgba(56,189,248,0.65) 0%, rgba(56,189,248,0.34) 40%, rgba(251,191,36,0.40) 75%, rgba(251,191,36,0.72) 100%)",
                      transition: "width 1200ms cubic-bezier(0.16, 1, 0.3, 1)",
                      opacity: 0.9,
                    }
              }
            />

            {/* sheen */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.98) 45%, rgba(255,255,255,0) 60%)",
                transform: "translateX(-120%)",
                animation: "iqSheen 2.8s ease-in-out infinite",
                opacity: 0.9,
              }}
            />
          </div>

          {/* Dense tick marks */}
          <div className="pointer-events-none absolute inset-0 flex items-center">
            {Array.from({ length: 26 }).map((_, i) => {
              const x = (i / 25) * 100;
              const isMajor = i % 5 === 0;
              const isAverage = i === averageIndex;
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: `${x}%`, transform: "translateX(-50%)" }}
                >
                  <div
                    className={[
                      "w-px",
                      isMajor ? "h-4 bg-black/20" : "h-2 bg-black/14",
                      isAverage ? "h-5 bg-black/30" : "",
                    ].join(" ")}
                  />
                </div>
              );
            })}
          </div>

          {/* MARKER: sweep when locked, land when unlocked */}
          <div
            className="absolute top-1/2 transform-gpu will-change-transform"
            style={
              locked
                ? {
                    left: "0%",
                    transform: "translate(-50%, -50%)",
                    animation:
                      "iqSweep 3600ms cubic-bezier(0.16, 1, 0.3, 1) infinite alternate",
                  }
                : {
                    left: `${pos}%`,
                    transform: "translate(-50%, -50%)",
                    transition: "left 1200ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }
            }
          >
            <div
              className={[
                "relative",
                // ✅ no blur in locked mode
                locked
                  ? "drop-shadow-[0_0px_26px_rgba(56,189,248,0.45)]"
                  : "drop-shadow-[0_0px_20px_rgba(251,191,36,0.35)]",
              ].join(" ")}
            >
              {/* Arrow only */}
              <div
                className="mx-auto h-0 w-0 border-l-[11px] border-r-[11px] border-t-[16px] border-l-transparent border-r-transparent"
                style={{
                  borderTopColor: locked ? "rgb(56,189,248)" : "rgb(251,191,36)",
                }}
              />

              {/* ✅ Number chip ONLY after paywall */}
              {!locked && (
                <div className="mt-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm tabular-nums">
                  {formatOneDecimal(iq)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tick labels */}
        <div className="mt-3 flex items-center justify-between text-xs tabular-nums">
          {ticks.map((t) => (
            <div
              key={t}
              className={t === 100 ? "text-zinc-900 font-semibold" : "text-zinc-500"}
            >
              {t}
            </div>
          ))}
        </div>

        {/* ✅ Segment labels: 5-col grid, no overlap, no glued words */}
        <div className="mt-2 grid grid-cols-[1fr_1fr_1fr_1fr_1.35fr] gap-2 text-[10px] md:text-xs leading-tight tracking-wide text-zinc-500">
          <span className="text-left whitespace-nowrap">Low</span>
          <span className="text-center whitespace-nowrap">Below Avg</span>
          <span className="text-center whitespace-nowrap text-zinc-700 font-medium">
            Average
          </span>
          <span className="text-center whitespace-nowrap">Above Avg</span>
          <span className="text-right whitespace-nowrap">
            Gifted&nbsp;
            <span className="text-zinc-700 font-medium text-[11px] md:text-sm">
              Genius
            </span>
          </span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes iqSheen {
          0% {
            transform: translateX(-120%);
          }
          55% {
            transform: translateX(120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        /* ✅ smooth ping-pong, no teleport */
        @keyframes iqSweep {
          0% {
            left: 0%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes iqFill {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default function ResultsPage() {
  const [hydrated, setHydrated] = useState(false);
  const [unlocked, setUnlockedState] = useState(false);
  const [state, setState] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  // Pricing / trust copy (single source of truth)
  const PRICE_TEXT = "$6.99";
  const STRIPE_VENDOR = "Stripe";

  useEffect(() => {
    const loadedState = loadState();
    const unlockedNow = isUnlocked();

    setUnlockedState(unlockedNow);
    setState(loadedState);

    if (loadedState) {
      const builtResult = loadedState.result
        ? loadedState.result
        : buildFullResult(loadedState.answers, loadedState.anti);

      setResult(builtResult);

      if (!loadedState.result) {
        saveState({ ...loadedState, result: builtResult });
      }
    }

    // Track reach_paywall
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "reach_paywall");
    }

    setHydrated(true);
  }, []);

  // --- Anti-cheat / session integrity (display-only, stable + non-accusatory) ---
  const focusChanges = state?.anti?.focusChanges ?? 0;
  const reloadedDuringSession = state?.anti?.reloadedDuringSession ?? false;
  const interruptionCount = focusChanges + (reloadedDuringSession ? 2 : 0);

  let integrityTitle = "Assessment conditions: Normal";
  let integrityNote =
    "No meaningful interruptions detected. Your result is comparable to a typical uninterrupted session.";

  if (interruptionCount >= 2 && interruptionCount <= 3) {
    integrityTitle = "Assessment conditions: Minor interruptions";
    integrityNote =
      "A few brief interruptions were detected (e.g. tab switch, focus loss). This usually has minimal impact.";
  } else if (interruptionCount >= 4) {
    integrityTitle = "Assessment conditions: Interrupted session";
    integrityNote =
      "Several interruptions were detected. Your result may be slightly less comparable to a fully uninterrupted session.";
  }

  const integrityDetailParts: string[] = [];
  integrityDetailParts.push(`Focus changes: ${focusChanges}`);
  integrityDetailParts.push(`Reload detected: ${reloadedDuringSession ? "Yes" : "No"}`);
  const integrityDetails = integrityDetailParts.join(" · ");

  // Confidence label + teaser (NO position leak)
  let confidenceLabel = "High";
  let confidenceDetail =
    "Your exact IQ score is ready — it’s already calculated and securely locked.";

  if (interruptionCount >= 4) {
    confidenceLabel = "Medium";
    confidenceDetail =
      "Your exact IQ score is ready — it’s already calculated, but the session had several interruptions.";
  } else if (interruptionCount >= 2) {
    confidenceLabel = "High";
    confidenceDetail =
      "Your exact IQ score is ready — it’s already calculated and securely locked.";
  } else {
    confidenceLabel = "Very high";
    confidenceDetail =
      "Your exact IQ score is ready — it’s already calculated and securely locked.";
  }

  const unlock = () => {
    // Track click_reveal
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "click_reveal", {
        transport_type: "beacon",
      });
    }

    // Persist current state before leaving page (important for Stripe redirect)
    const currentState = loadState();
    if (currentState) {
      saveState(currentState);
    }

    // Redirect to Stripe
    window.location.href = "https://buy.stripe.com/dRmcN490Z5AdegT1ws0gw04";
  };

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(result.snippet);
      alert("Copied");
    } catch {
      // ignore
    }
  };

  if (!hydrated) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-test px-4 md:px-6 py-10">
          <Card className="p-6">
            <div className="text-lg font-semibold">Loading results...</div>
            <p className="mt-2 text-sm text-zinc-600">Preparing your assessment report.</p>
          </Card>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-test px-4 md:px-6 py-10">
          <Card className="p-6">
            <div className="text-lg font-semibold">No result found</div>
            <p className="mt-2 text-sm text-zinc-600">Start a new session to see results.</p>
            <div className="mt-5">
              <Link href="/">
                <PrimaryButton>Back to start</PrimaryButton>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  // --- Visual scoring (NO change to your logic) ---
  const accuracy01 = clamp((result.correctCount ?? 0) / 40, 0, 1);
  const weighted01 = result.maxWeightedScore
    ? clamp((result.weightedScore ?? 0) / result.maxWeightedScore, 0, 1)
    : accuracy01;

  const strengthsCount = Array.isArray(result.strengths) ? result.strengths.length : 0;
  const limitationsCount = Array.isArray(result.limitations) ? result.limitations.length : 0;

  const strengthsSignal01 = clamp(0.55 + strengthsCount * 0.1, 0, 1);
  const limitationLoad01 = clamp(0.2 + limitationsCount * 0.12, 0, 1);
  const confidence01 = clamp(
    0.45 + weighted01 * 0.35 + accuracy01 * 0.2 - limitationLoad01 * 0.15,
    0,
    1
  );

  const radarMetrics = [
    { label: "Accuracy", value01: accuracy01, color: "good" as const },
    { label: "Weighted performance", value01: weighted01, color: "good" as const },
    { label: "Strength signal", value01: strengthsSignal01, color: "good" as const },
    { label: "Confidence", value01: confidence01, color: "good" as const },
    { label: "Limitation load", value01: limitationLoad01, color: "bad" as const },
  ];

  function strengthValueForItem(text: string) {
    const jitter = (hash01(text) - 0.5) * 0.1;
    const base = clamp(0.62 + weighted01 * 0.3 + jitter, 0, 1);
    return Math.round(base * 100);
  }

  function limitationValueForItem(text: string) {
    const jitter = (hash01(text) - 0.5) * 0.1;
    const base = clamp(0.25 + (1 - weighted01) * 0.35 + limitationLoad01 * 0.25 + jitter, 0, 1);
    return Math.round(base * 100);
  }

  const exactIq = Number(result.iq);
  const exactPercentile = iqToPercentile(exactIq);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-test px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500">Results</div>
            <div className="text-2xl md:text-3xl font-semibold">Your assessment report</div>
          </div>
          <Link href="/">
            <GhostButton>Home</GhostButton>
          </Link>
        </div>

        {/* Pre-paywall / preview */}
        {!unlocked && (
          <Card className="p-3 md:p-7">
            <div className="text-sm text-zinc-500">Preliminary report</div>
            <div className="mt-1 text-2xl font-semibold">
              Confidence level: {confidenceLabel}
            </div>
            <div className="mt-2 text-sm text-zinc-700 leading-relaxed max-w-[760px]">
              {confidenceDetail}
            </div>

            <IQMeter iqValue={Number(result.iq)} locked={true} animateOnMount={true} />

            {/* ✅ Locked percentile teaser (no extra animation) */}
            <div className="mt-4 text-sm md:text-base font-semibold text-zinc-900 max-w-[760px]">
              You’re smarter than{" "}
              <span aria-hidden="true" className="inline-block blur-sm select-none">
                ██%
              </span>{" "}
              of the world — based on your performance profile.
            </div>

            <div className="mt-4 text-sm text-zinc-700 leading-relaxed max-w-[720px]">
              Most people stop at the label. That’s a mistake.
              <br />
              <br />
              Your result isn’t just a category — it reflects a specific response pattern.
              Some of your decisions were faster than expected. Others reveal something far more interesting.
              <br />
              <br />
              The label is only the surface.
            </div>

            {/* ✅ Variant A (statement block) */}
            <div className="mt-5 rounded-xl border border-black/10 bg-white/70 p-4 max-w-[760px]">
              <div className="text-sm md:text-base font-semibold text-zinc-900">
                Yes, there’s a small one-time payment — because this isn’t a throwaway quiz.
              </div>
              <div className="mt-1 text-sm md:text-base font-semibold text-zinc-900">
                No subscription nonsense — just one payment for full access.
              </div>
            </div>

            <div className="mt-6 border border-black/10 rounded-xl p-5 bg-zinc-50">
              <div className="text-xs uppercase tracking-wider text-zinc-500">Locked insights</div>

              <ul className="mt-4 text-sm text-zinc-700 space-y-3">
                <li>• Your exact IQ estimate</li>
                <li>• Exact percentile</li>
                <li>• The strongest cognitive signal detected</li>
                <li>• The one limitation that influenced your final number</li>
                <li>• Your full visual cognitive profile</li>
              </ul>
            </div>

            {/* Trust + price + Apple/Google Pay */}
            <div className="mt-6 rounded-xl border border-black/10 bg-white/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    Your exact IQ score is ready
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Reveal your exact number + full cognitive profile · Instant access
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Secure checkout
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Instant access
                  </span>
                </div>
              </div>

              {/* ✅ Force-green by NOT using PrimaryButton here */}
              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <button
                  type="button"
                  onClick={unlock}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Unlock your IQ
                </button>

                <div className="text-sm text-zinc-500">
                  <span className="font-semibold text-zinc-800">{PRICE_TEXT}</span> One-time payment.
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1">
                  <span className="text-base leading-none"></span>
                  <span className="font-medium">Apple Pay</span>
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-semibold text-white">
                    G
                  </span>
                  <span className="font-medium">Google Pay</span>
                </span>

                <span className="text-zinc-500">Powered by {STRIPE_VENDOR}</span>
              </div>
            </div>

            <div className="mt-6 text-xs text-zinc-400">{DISCLAIMER}</div>
          </Card>
        )}

        {/* Post-paywall */}
        {unlocked && (
          <div className="grid gap-4">
            <Card className="p-3 md:p-7">
              {/* ✅ Make exact IQ the hero */}
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500">Exact result</div>
                  <div className="mt-1 text-5xl md:text-6xl font-semibold text-zinc-900 tabular-nums">
                    IQ {formatOneDecimal(exactIq)}
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">
                    Higher than approximately{" "}
                    <span className="font-semibold text-zinc-900">{exactPercentile}%</span> of the population
                  </div>
                </div>

                <div className="text-xs text-zinc-500 tabular-nums">Scale: 70–145</div>
              </div>

              <IQMeter iqValue={Number(result.iq)} locked={false} animateOnMount={true} />

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold">Raw score</div>
                  <div className="mt-1 text-sm text-zinc-700">
                    {result.weightedScore} / {result.maxWeightedScore} weighted points
                    <span className="text-zinc-500"> · {result.correctCount} / 40 correct</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold">Assessment Conditions</div>
                  <div className="mt-1 text-sm text-zinc-700">
                    <div className="font-medium">{integrityTitle}</div>
                    <div className="mt-1">{integrityNote}</div>
                    <div className="mt-2 text-xs text-zinc-500">{integrityDetails}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <RadarChart metrics={radarMetrics} />
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-semibold">Key strengths</div>
                  <ul className="mt-2 text-sm text-zinc-700 list-disc pl-5 space-y-1">
                    {result.strengths.map((s: string) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>

                  <div className="mt-4 space-y-4">
                    {result.strengths.map((s: string) => (
                      <ProgressRow
                        key={`bar-strength-${s}`}
                        label={s}
                        value={strengthValueForItem(s)}
                        tone="good"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold">Relative limitations</div>
                  <ul className="mt-2 text-sm text-zinc-700 list-disc pl-5 space-y-1">
                    {result.limitations.map((s: string) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>

                  <div className="mt-4 space-y-4">
                    {result.limitations.map((s: string) => (
                      <ProgressRow
                        key={`bar-lim-${s}`}
                        label={s}
                        value={limitationValueForItem(s)}
                        tone="bad"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-3 md:p-7">
              <div className="text-sm font-semibold">Cognitive Profile Summary</div>
              <div className="mt-3 text-sm text-zinc-700 leading-relaxed whitespace-pre-line max-w-[820px]">
                {result.profileSummary}
              </div>

              <div className="mt-6">
                <div className="text-xs uppercase tracking-wider text-zinc-500">One-line summary</div>
                <div className="mt-2 flex items-start gap-3">
                  <div className="flex-1 text-sm text-zinc-800 whitespace-pre-line">{result.snippet}</div>
                  <button
                    type="button"
                    className="rounded-lg border border-black/10 bg-white/70 px-3 py-2 hover:bg-black/5 transition-colors"
                    onClick={copySnippet}
                    aria-label="Copy snippet"
                    title="Copy"
                  >
                    ⤴︎
                  </button>
                </div>
              </div>

              <div className="mt-6 text-xs text-zinc-400">{DISCLAIMER}</div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}