"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, PrimaryButton, GhostButton } from "@/components/ui";
import { buildFullResult, DISCLAIMER } from "@/lib/scoring";
import { loadState, saveState, isUnlocked } from "@/lib/storage";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function preZoneLabel(zone: string) {
  // keep it broad & not back-calculable
  return zone;
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
  // Simple SVG radar chart (no deps)
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;

  const N = metrics.length;
  const angleStep = (Math.PI * 2) / N;

  const rings = [0.25, 0.5, 0.75, 1.0];

  function point(i: number, value01: number) {
    const a = -Math.PI / 2 + i * angleStep; // start at top
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
      const v = m.color === "bad" ? m.value01 : 0.18; // baseline for non-risk axes
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
            {/* rings */}
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

            {/* axes */}
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

            {/* good polygon */}
            <polygon
              points={goodPoly}
              fill="rgba(16,185,129,0.18)"
              stroke="rgba(16,185,129,0.9)"
              strokeWidth="2"
            />

            {/* risk polygon */}
            <polygon
              points={riskPoly}
              fill="rgba(239,68,68,0.10)"
              stroke="rgba(239,68,68,0.9)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* dots */}
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

export default function ResultsPage() {
  const [unlocked, setUnlockedState] = useState(false);

  // Pricing / trust copy (single source of truth)
  const PRICE_TEXT = "$6.99";
  const STRIPE_VENDOR = "Stripe";

  // Track reach_paywall
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "reach_paywall");
    }
  }, []);

  useEffect(() => {
    setUnlockedState(isUnlocked());
  }, []);

  const state = useMemo(() => loadState(), []);

  const result = useMemo(() => {
    if (!state) return null;
    if (state.result) return state.result;
    return buildFullResult(state.answers, state.anti);
  }, [state]);

  useEffect(() => {
    if (!state) return;
    if (!result) return;
    if (state.result) return;
    saveState({ ...state, result });
  }, [state, result]);

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

  // ✅ Send user to Stripe Payment Link instead of unlocking locally
  const unlock = () => {
    // Track click_reveal
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "click_reveal", {
        transport_type: "beacon",
      });
    }

    // 🔒 Force persist current state before leaving page (important for Stripe redirect)
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
    const jitter = (hash01(text) - 0.5) * 0.1; // -0.05..+0.05
    const base = clamp(0.62 + weighted01 * 0.3 + jitter, 0, 1);
    return Math.round(base * 100);
  }

  function limitationValueForItem(text: string) {
    const jitter = (hash01(text) - 0.5) * 0.1;
    const base = clamp(0.25 + (1 - weighted01) * 0.35 + limitationLoad01 * 0.25 + jitter, 0, 1);
    return Math.round(base * 100);
  }

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
  if (reloadedDuringSession) integrityDetailParts.push("Reload detected: Yes");
  else integrityDetailParts.push("Reload detected: No");
  const integrityDetails = integrityDetailParts.join(" · ");

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
          <Card className="p-6 md:p-7">
            <div className="text-sm text-zinc-500">Preliminary result</div>
            <div className="mt-1 text-2xl font-semibold">{preZoneLabel(result.zone)}</div>

            {/* UPDATED: higher-curiosity preview */}
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

            <div className="mt-6 border border-black/10 rounded-xl p-5 bg-zinc-50">
              <div className="text-xs uppercase tracking-wider text-zinc-500">Locked insights</div>

              <ul className="mt-4 text-sm text-zinc-700 space-y-3">
                <li>• Your exact IQ estimate</li>
                <li>• The weighted score that shifted your result</li>
                <li>• The strongest cognitive signal detected</li>
                <li>• The one limitation that influenced your final number</li>
                <li>• Your full visual cognitive profile</li>
              </ul>

              <div className="mt-4 text-xs text-zinc-500">
                The exact estimate remains hidden until unlocked.
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                One-time purchase. No recurring charges.
              </div>
            </div>

            {/* ✅ Trust + price clarity (NEW) */}
            <div className="mt-6 rounded-xl border border-black/10 bg-white/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">Unlock your exact result</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    One-time payment of <span className="font-semibold text-zinc-800">{PRICE_TEXT}</span> · No
                    subscription
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1">
                    🔒 Secure checkout
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1">
                    ⚡ Instant access
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <PrimaryButton
                  onClick={unlock}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Unlock exact result — {PRICE_TEXT}
                </PrimaryButton>

                <div className="text-sm text-zinc-500">Exact estimate stays locked.</div>
              </div>

              <div className="mt-3 text-xs text-zinc-500">
                Powered by {STRIPE_VENDOR}. One-time charge only — no recurring billing, no membership.
              </div>
            </div>

            <div className="mt-6 text-xs text-zinc-400">{DISCLAIMER}</div>
          </Card>
        )}

        {/* Post-paywall */}
        {unlocked && (
          <div className="grid gap-4">
            <Card className="p-6 md:p-7">
              <div className="text-sm text-zinc-500">Estimated IQ</div>
              <div className="mt-1 text-4xl md:text-5xl font-semibold">{result.iq}</div>

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

              {/* Radar + summary bars */}
              <div className="mt-6">
                <RadarChart metrics={radarMetrics} />
              </div>

              {/* Strengths + Limitations with colored bars */}
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

            <Card className="p-6 md:p-7">
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

        {/* ✅ Removed the MVP note at the bottom */}
      </div>
    </main>
  );
}