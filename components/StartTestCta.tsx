"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/ui";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function StartTestCta() {
  const router = useRouter();

  const handleClick = () => {
    // GA4 event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "start_test", {
        transport_type: "beacon",
      });
    }

    // Navigate to the test
    router.push("/test");
  };

  return (
    <PrimaryButton
      onClick={handleClick}
      className="w-full sm:w-auto px-6 py-3 !bg-teal-700/90 !text-white hover:!bg-teal-600 active:bg-teal-700 active:translate-y-[1px] transition-colors"
    >
      Start the test
    </PrimaryButton>
  );
}