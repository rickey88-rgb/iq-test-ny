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
            IQ Assessment
          </div>
          <div className="text-xs text-zinc-500">
            Anti-Cheat Systems · Controlled Conditions
          </div>
        </div>

        {/* Hero */}
        <section className="mt-10 md:mt-14">
          <div className="max-w-[900px]">
            <h1 className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.02]">
              Most people think they’re above average.{" "}
              <span className="text-zinc-600">Statistically, you aren’t..</span>
            </h1>

            <p className="mt-4 max-w-[760px] text-zinc-700 text-[15px] md:text-[18px] leading-relaxed">
              40 questions. 30 minutes. No backtracking. Built to feel like an
              exam — clean UI, controlled pressure, and results that feel
              uncomfortably specific.
            </p>

            {/* CTA (mobile: stacked, desktop: inline) */}
            <div className="mt-7 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
             <div className="w-full sm:w-auto">
  <StartTestCta />
</div>

              <div className="text-sm text-zinc-600 sm:text-left">
                Starting the test initiates the timed session.
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat k="Questions" v="40 total" />
              <Stat k="Time limit" v="30:00" />
              <Stat k="Backtracking" v="Disabled" />
              <Stat k="Report" v="Exact IQ (estimate)" />
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
            <div className="text-sm font-semibold text-zinc-900">What you get</div>
            <ul className="mt-3 text-sm text-zinc-700 space-y-2">
              <li>Exact IQ estimate</li>
              <li>Raw score + weighted scoring</li>
              <li>Strengths, limitations, profile summary</li>
              <li>Shareable one-liner snippet</li>
            </ul>
          </Card>

          <Card className="p-6 !bg-black/5 !border-black/10 !shadow-none">
            <div className="text-sm font-semibold text-zinc-900">
              Pressure, by design
            </div>
            <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
              The timer isn’t decoration. It’s part of the measurement — it
              separates clear thinking from comfortable thinking.
            </p>
          </Card>

          <Card className="p-6 !bg-black/5 !border-black/10 !shadow-none">
            <div className="text-sm font-semibold text-zinc-900">Built for trust</div>
            <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
              No accounts. No fluff. Just a controlled assessment experience —
              and a report that doesn’t feel generic.
            </p>
          </Card>
        </section>

        {/* How it works */}
        <section className="mt-10 md:mt-12">
          <div className="text-xs uppercase tracking-wider text-zinc-500">
            How it works
          </div>
          <div className="mt-3 grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-black/10 bg-black/5 p-6">
              <div className="text-sm font-semibold">1) Take the test</div>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                A focused 30-minute run. No going back. The format stays
                consistent — your thinking is what changes.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-black/5 p-6">
              <div className="text-sm font-semibold">2) Get a preview</div>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                You’ll see a broad range + a teaser profile. Enough to feel it…
                not enough to reverse-engineer it.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-black/5 p-6">
              <div className="text-sm font-semibold">3) Unlock the report</div>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                Exact estimate, raw/weighted score, strengths vs limitations,
                and a profile summary that feels personal.
              </p>
            </div>
          </div>
        </section>

        {/* Footer (clean + centered) */}
        <footer className="mt-12 md:mt-16 border-t border-black/10 pt-8">
          <div className="mx-auto max-w-[980px] text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-zinc-600">
              <Link href="/privacy" className="hover:text-zinc-900 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-zinc-400">·</span>
              <Link href="/terms" className="hover:text-zinc-900 transition-colors">
                Terms
              </Link>
              <span className="text-zinc-400">·</span>
              <Link href="/refunds" className="hover:text-zinc-900 transition-colors">
                Refund Policy
              </Link>
              <span className="text-zinc-400">·</span>
              <Link href="/contact" className="hover:text-zinc-900 transition-colors">
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