"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function SuccessPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "purchase", {
        value: 99,
        currency: "SEK",
        transport_type: "beacon",
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Payment successful 🎉</h1>
        <p className="text-gray-600 mb-6">
          Your exact IQ result is now unlocked. You can return to the results page.
        </p>
        <a
          href="/results"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg"
        >
          View my result
        </a>
      </div>
    </div>
  );
}