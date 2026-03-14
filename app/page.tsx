import Link from "next/link";
import { Card, PrimaryButton } from "@/components/ui";
import StartTestCta from "@/components/StartTestCta";

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{k}</div>
      <div className="mt-1 text-sm md:text-base font-semibold text-zinc-900">
        {v}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F6F3] text-zinc-900">
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-black/5 blur-3xl" />
        <div className="absolute top-[35%] -left-40 h-[420px] w-[420px] rounded-full bg-black/4 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-120px] h-[560px] w-[560px] rounded-full bg-black/4 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-landing px-5 md:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            Precision IQ Assessment
          </div>
          <div className="text-xs text-zinc-500">Controlled Conditions</div>
        </div>

        {/* Hero */}
        <section className="mt-10 md:mt-14">
          <div className="max-w-[900px]">
           <h1 className="mt-4 text-[2.7rem] md:text-6xl font-semibold leading-[1.02]">
  What is your IQ?
  <span className="block text-zinc-500 text-3xl md:text-5xl font-normal">
    Accurate test. Exact results...
  </span>
</h1>

            <p className="mt-4 max-w-[760px] text-zinc-700 text-[15px] md:text-[18px] leading-relaxed">
              Scientifically structured. Timed. Weighted across eight cognitive
              domains for maximum accuracy. 40 questions in a controlled session
            </p>

            {/* CTA (mobile: stacked, desktop: inline) */}
            <div className="mt-7 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="w-full sm:w-auto">
                <StartTestCta />
              </div>

              <div className="text-sm text-zinc-600 sm:text-left">
                Starting the assessment initiates the timed session.
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat k="Questions" v="40 total" />
              <Stat k="Time limit" v="30:00" />
              <Stat k="Backtracking" v="Disabled" />
              <Stat k="Report" v="Exact IQ Score" />
            </div>

            <div className="mt-5 text-xs text-zinc-500">
              Anti-Cheat Systems: time-limited session + basic focus monitoring
              for comparability.
            </div>
          </div>
        </section>

        {/* Value props */}
        <section className="mt-10 md:mt-12 grid md:grid-cols-3 gap-4">
          <Card className="p-6 !bg-black/5 !border-black/10 !shadow-none">
            <div className="text-sm font-semibold text-zinc-900">
              What you receive
            </div>
            <ul className="mt-3 text-sm text-zinc-700 space-y-2">
              <li>Exact IQ Score</li>
              <li>Percentile ranking (how you compare to others)</li>
              <li>Weighted scoring breakdown (easy-to-understand)</li>
              <li>Cognitive profile summary (strengths & weak spots)</li>
            </ul>
          </Card>

          <Card className="p-6 !bg-black/5 !border-black/10 !shadow-none">
            <div className="text-sm font-semibold text-zinc-900">
              Timing is part of the measurement
            </div>
            <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
              The timer isn’t decoration. Processing speed and efficiency under
              pressure are part of cognitive performance — and part of the final
              scoring model.
            </p>
          </Card>

          <Card className="p-6 !bg-black/5 !border-black/10 !shadow-none">
            <div className="text-sm font-semibold text-zinc-900">
              Built for credibility
            </div>
            <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
              No accounts. No gamified nonsense. Just a structured assessment
              experience — and a report designed to avoid generic, copy-paste
              results.
            </p>
          </Card>
        </section>

        {/* What it measures */}
        <section className="mt-10 md:mt-12">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            What this assessment measures
          </div>

          <div className="mt-3 rounded-2xl border border-black/10 bg-black/5 p-6">
            <p className="text-sm text-zinc-700 leading-relaxed">
              This assessment evaluates eight core cognitive domains. Each
              domain contributes to your final weighted IQ score.
            </p>

            <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm text-zinc-700">
              <div>
                •{" "}
                <span className="font-semibold text-zinc-900">
                  Logical reasoning
                </span>{" "}
                — rule-based thinking and valid conclusions
              </div>
              <div>
                •{" "}
                <span className="font-semibold text-zinc-900">
                  Pattern recognition
                </span>{" "}
                — detecting visual and abstract structure
              </div>
              <div>
                •{" "}
                <span className="font-semibold text-zinc-900">
                  Numerical processing
                </span>{" "}
                — quantitative reasoning and number logic
              </div>
              <div>
                •{" "}
                <span className="font-semibold text-zinc-900">
                  Verbal comprehension
                </span>{" "}
                — language-based analysis and interpretation
              </div>
              <div>
                •{" "}
                <span className="font-semibold text-zinc-900">
                  Spatial analysis
                </span>{" "}
                — mental rotation and spatial structure
              </div>
              <div>
                •{" "}
                <span className="font-semibold text-zinc-900">
                  Abstract reasoning
                </span>{" "}
                — non-verbal logic beyond memorized knowledge
              </div>
              <div>
                •{" "}
                <span className="font-semibold text-zinc-900">
                  Working memory
                </span>{" "}
                — holding and manipulating information in real time
              </div>
              <div>
                •{" "}
                <span className="font-semibold text-zinc-900">
                  Processing speed
                </span>{" "}
                — cognitive efficiency under timed constraints
              </div>
            </div>

            <p className="mt-4 text-sm text-zinc-700 leading-relaxed">
              The scoring model is weighted: more complex questions contribute
              proportionally more to the final IQ Result.
            </p>
          </div>
        </section>

        {/* Accuracy by Design (NEW) */}
        <section className="mt-10 md:mt-12">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            Accuracy by design
          </div>

          <div className="mt-3 rounded-2xl border border-black/10 bg-black/5 p-6">
            <p className="text-sm text-zinc-700 leading-relaxed">
              This assessment is structured using established cognitive
              measurement principles.
            </p>

            <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
              Each question is calibrated within a progressive difficulty model.
              As complexity increases, scoring weight increases proportionally.
              This ensures that higher-level reasoning contributes more
              significantly to the final IQ estimate.
            </p>

            <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
              The timed format is not decorative — it is a controlled variable.
              Cognitive efficiency under time constraints forms part of the
              evaluation.
            </p>

            <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
              Rather than generating a simple percentage score, performance is
              converted through a weighted scoring model into a standardized IQ
              estimate.
            </p>

            <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
              The goal is structured measurement — not entertainment.
            </p>

            <div className="mt-5 border-t border-black/10 pt-4">
              <div className="text-sm font-semibold text-zinc-900">
                Built Around Measurable Cognitive Domains
              </div>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                The assessment evaluates multiple domains including abstract
                reasoning, pattern recognition, working memory, numerical logic,
                and processing speed. Each domain contributes to a
                domain-balanced composite score.
              </p>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                This multi-domain structure reduces reliance on a single skill
                set and improves score stability.
              </p>
            </div>
          </div>
        </section>

        {/* Theoretical Foundation (NEW) */}
        <section className="mt-10 md:mt-12">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            Theoretical foundation
          </div>

          <div className="mt-3 rounded-2xl border border-black/10 bg-black/5 p-6">
            <p className="text-sm text-zinc-700 leading-relaxed">
              This assessment draws on established principles from non-verbal
              intelligence measurement and matrix-based reasoning frameworks
              commonly used in cognitive testing.
            </p>

            <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
              A significant portion of the assessment focuses on abstract
              pattern recognition and rule detection — core components of fluid
              intelligence.
            </p>

            <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
              Rather than measuring memorized knowledge, the emphasis is on:
            </p>

            <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm text-zinc-700">
              <div>• Identifying underlying structures</div>
              <div>• Detecting logical progression</div>
              <div>• Solving novel visual problems</div>
              <div>• Reasoning independently of cultural background</div>
            </div>

            <p className="mt-4 text-sm text-zinc-700 leading-relaxed">
              This approach reduces reliance on vocabulary or prior education
              and instead emphasizes adaptive reasoning ability.
            </p>
          </div>
        </section>

        {/* Why Pattern-Based Reasoning Matters (NEW) */}
        <section className="mt-10 md:mt-12">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            Why pattern-based reasoning matters
          </div>

          <div className="mt-3 rounded-2xl border border-black/10 bg-black/5 p-6">
            <p className="text-sm text-zinc-700 leading-relaxed">
              Pattern-based reasoning tasks are widely used in cognitive
              evaluation because they minimize cultural and educational bias
              while emphasizing structural logic recognition.
            </p>

            <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
              Performance on these tasks is strongly associated with fluid
              intelligence — the ability to solve new problems without relying
              on previously learned information.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-10 md:mt-12">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            How it works
          </div>
          <div className="mt-3 grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-black/10 bg-black/5 p-6">
              <div className="text-sm font-semibold">1) Take the assessment</div>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                A focused 30-minute session with consistent format. No
                backtracking — the goal is comparable performance under
                controlled conditions.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-black/5 p-6">
              <div className="text-sm font-semibold">2) View a preview</div>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                You’ll see a high-level classification and a brief teaser
                profile. Enough to confirm direction — not enough to reveal the
                final score.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-black/5 p-6">
              <div className="text-sm font-semibold">3) Unlock the full report</div>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                Your exact IQ score, raw vs weighted scoring, and a domain
                breakdown with strengths and limitations.
              </p>
            </div>
          </div>
        </section>
                {/* Bottom CTA */}
        <section className="mt-12 md:mt-16">
          <div className="rounded-2xl border border-black/10 bg-black/5 p-8 md:p-10 text-center">
            <div className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900">
              Ready to see where you stand?
            </div>

            <p className="mt-3 max-w-[640px] mx-auto text-sm md:text-base text-zinc-700 leading-relaxed">
              Take the test and unlock your exact IQ score, percentile ranking,
              and full performance breakdown.
            </p>

            <div className="mt-6 flex justify-center">
              <StartTestCta />
            </div>
          </div>
        </section>

        {/* Footer (clean + centered) */}
        <footer className="mt-12 md:mt-16 border-t border-black/10 pt-8">
          <div className="mx-auto max-w-[980px] text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-zinc-600">
              <Link
                href="/privacy"
                className="hover:text-zinc-900 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-zinc-400">·</span>
              <Link href="/terms" className="hover:text-zinc-900 transition-colors">
                Terms
              </Link>
              <span className="text-zinc-400">·</span>
              <Link
                href="/refunds"
                className="hover:text-zinc-900 transition-colors"
              >
                Refund Policy
              </Link>
              <span className="text-zinc-400">·</span>
              <Link
                href="/contact"
                className="hover:text-zinc-900 transition-colors"
              >
                Contact
              </Link>
            </div>

            <div className="mt-3 text-xs leading-relaxed text-zinc-500">
              Results are estimates for informational purposes and are not a
              clinical diagnosis.
            </div>

            <div className="mt-3 text-xs text-zinc-500">
              © {new Date().getFullYear()} UnlockYourIQ.com
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}