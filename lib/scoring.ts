import type { QuestionDomain } from "@/lib/questions";
import { QUESTIONS } from "@/lib/questions";

export type Answer = { questionId: string; selectedIndex: number | null };

export type AntiCheatSignals = {
  focusChanges: number; // visibility/blur count
  reloadedDuringSession: boolean;
};

export type ScoreBreakdown = {
  weightedScore: number; // 0..64 (approx)
  maxWeightedScore: number; // 64
  correctCount: number; // 0..40
  domain: Record<QuestionDomain, { correct: number; total: number }>;
};

export type ResultZone =
  | "Below Average"
  | "Average Range"
  | "Above Average"
  | "High Intelligence"
  | "Very High";

export type FullResult = {
  iq: number;
  zone: ResultZone;
  weightedScore: number;
  maxWeightedScore: number;
  correctCount: number;
  strengths: string[];
  limitations: string[];
  profileSummary: string;
  snippet: string;
  assessmentConditions: "normal" | "focus changes detected";
};

export const MAX_WEIGHTED = 64;

function weightForIndex(i: number): number {
  const qNum = i + 1;
  if (qNum <= 10) return 1.0;
  if (qNum <= 20) return 1.2;
  if (qNum <= 30) return 1.6;
  if (qNum <= 35) return 2.2;
  return 3.0;
}

export function computeBreakdown(answers: Answer[]): ScoreBreakdown {
  const domain: ScoreBreakdown["domain"] = {
    abstract: { correct: 0, total: 0 },
    numeric: { correct: 0, total: 0 },
    verbal: { correct: 0, total: 0 },
    relation: { correct: 0, total: 0 },
    workingMemory: { correct: 0, total: 0 },
    ruleId: { correct: 0, total: 0 },
    logic: { correct: 0, total: 0 },
  };

  let weightedScore = 0;
  let correctCount = 0;

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    domain[q.domain].total += 1;

    const a = answers.find((x) => x.questionId === q.id);
    const sel = a?.selectedIndex ?? null;

    if (sel !== null && sel === q.correctIndex) {
      correctCount += 1;
      domain[q.domain].correct += 1;
      weightedScore += weightForIndex(i);
    }
  }

  weightedScore = Math.round(weightedScore * 10) / 10;

  return { weightedScore, maxWeightedScore: MAX_WEIGHTED, correctCount, domain };
}

export function scoreToIQ(weightedScore: number): number {
  // Calibrated mapping v1.1
  // Slightly higher typical outcomes + softer drop
  const mu = 30;      // shifted down from 35
  const sigma = 12;   // wider spread than 10
  const bonus = 4;    // mild positive bias

  const z = (weightedScore - mu) / sigma;
  const iq = Math.round(100 + 15 * z + bonus);

  return Math.max(55, Math.min(150, iq));
}

export function iqToZone(iq: number): ResultZone {
  if (iq < 90) return "Below Average";
  if (iq < 110) return "Average Range";
  if (iq < 125) return "Above Average";
  if (iq < 140) return "High Intelligence";
  return "Very High";
}

const ZONE_PROFILE: Record<ResultZone, { summary: string; snippet: string }> = {
  "Below Average": {
    summary: `You’re stronger than your total score suggests — but only in certain formats.
You handled clean, visual structure better than layered verbal logic, and the gap is noticeable.
When the task demands slow, rule-heavy tracking, your performance slips — not because you can’t think, but because your style prefers clarity over grind.
Put simply: you’re not built for mental paperwork.
You’re built for decisive pattern calls.`,
    snippet: `Your thinking favors clarity over grind.
You disengage when problems turn into mental paperwork — not confusion, but preference.`,
  },

  "Average Range": {
    summary: `You think clearly until the test forces you to hold too much at once.
Your accuracy stayed solid in single-rule tasks, then dipped when interference and memory load increased.
That suggests a practical, linear problem-solver: good at progressing step-by-step, less excited by juggling.
It’s not about intelligence — it’s about bandwidth.
And the late sections were designed to squeeze bandwidth.`,
    snippet: `You think clearly until the task demands too much at once.
When bandwidth gets tight, that’s where the friction appears.`,
  },

  "Above Average": {
    summary: `You’re strongest when the task rewards structure over wording.
Visual and abstract items seemed to “click” faster for you than layered verbal reasoning.
You likely think in shapes and relationships more than in paragraphs — and it shows.
That’s why you stayed efficient as difficulty increased.
You weren’t guessing. You were compressing.`,
    snippet: `You compress complexity instead of fighting it.
Structure clicks faster for you than words.`,
  },

  "High Intelligence": {
    summary: `You don’t win by brilliance alone — you win by not bleeding points.
Your answers show fewer unforced errors than typical at this level, especially when distractors are designed to trap confident guessers.
That suggests disciplined reasoning: you verify before you commit.
Not slow — deliberate.
Which is exactly what high-difficulty items reward.`,
    snippet: `You stay accurate where most profiles lose the thread.
Interference doesn’t rattle you — it slows everyone else.`,
  },

  "Very High": {
    summary: `You don’t just answer questions — you read the test.
Your pattern of responses suggests meta-reasoning: you infer what kind of trap an item is trying to set, then step around it.
That’s why your late-stage performance holds.
This profile tends to dominate in unfamiliar systems, not because it knows more —
but because it adapts faster than the system can change.`,
    snippet: `You don’t just solve problems — you adapt faster than they change.
That’s a rare advantage.`,
  },
};

function labelForDomain(d: QuestionDomain): string {
  switch (d) {
    case "abstract": return "Abstract Pattern Recognition";
    case "numeric": return "Quantitative Reasoning";
    case "verbal": return "Verbal Logic";
    case "relation": return "Associative Reasoning";
    case "workingMemory": return "Working Memory Under Interference";
    case "ruleId": return "Rule Identification";
    case "logic": return "Deductive Consistency";
  }
}

export function buildFullResult(answers: Answer[], anti: AntiCheatSignals): FullResult {
  const breakdown = computeBreakdown(answers);
  const iq = scoreToIQ(breakdown.weightedScore);
  const zone = iqToZone(iq);

  const domainEntries = Object.entries(breakdown.domain).map(([k, v]) => {
    const acc = v.total > 0 ? v.correct / v.total : 0;
    return { domain: k as QuestionDomain, acc, correct: v.correct, total: v.total };
  });

  domainEntries.sort((a, b) => b.acc - a.acc);
  const strengths = domainEntries.slice(0, 2).map((x) => labelForDomain(x.domain));

  domainEntries.sort((a, b) => a.acc - b.acc);
  const limitations = domainEntries.slice(0, 1).map((x) => labelForDomain(x.domain));

  const assessmentConditions =
    anti.focusChanges === 0 && !anti.reloadedDuringSession
      ? "normal"
      : "focus changes detected";

  return {
    iq,
    zone,
    weightedScore: breakdown.weightedScore,
    maxWeightedScore: breakdown.maxWeightedScore,
    correctCount: breakdown.correctCount,
    strengths,
    limitations,
    profileSummary: ZONE_PROFILE[zone].summary,
    snippet: ZONE_PROFILE[zone].snippet,
    assessmentConditions,
  };
}

export const DISCLAIMER =
  "Result is an IQ estimate based on preliminary norming and may be affected by focus, time, and test conditions.";