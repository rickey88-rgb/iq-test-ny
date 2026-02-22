"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setUnlocked } from "@/lib/storage";

export default function PaidPage() {
  const router = useRouter();

  useEffect(() => {
    // MVP: Mark as unlocked after returning from Stripe
    // (We’ll harden this later with session verification)
    setUnlocked(true);

    // Replace so /paid isn't stuck in back button history
    router.replace("/results");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-xl font-semibold">Unlocking your results…</div>
        <p className="mt-2 text-sm text-zinc-600">
          Please wait a moment. You’ll be redirected automatically.
        </p>
      </div>
    </main>
  );
}