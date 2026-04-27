"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUpgraded } from "@/app/lib/gate";
import { track } from "@/app/lib/track";

export default function UpgradeSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    setUpgraded();
    track("upgrade_success", { source: "stripe_redirect" });

    const interval = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(interval);
          router.push("/agents");
        }
        return n - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p
          className="text-[#00FF85] text-xs tracking-[0.25em] mb-6"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          PAYMENT CONFIRMED
        </p>
        <h1
          className="text-3xl md:text-4xl font-black mb-6"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          You&apos;re in.
        </h1>
        <p
          className="text-[#E8E8E8]/60 text-sm leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Unlimited runs on all 5 agents. Redirecting to your workspace in {countdown}…
        </p>

        <div className="w-full bg-[#111111] h-1 mb-8 overflow-hidden">
          <div
            className="h-1 bg-[#00FF85] transition-all duration-1000"
            style={{ width: `${((4 - countdown) / 4) * 100}%` }}
          />
        </div>

        <button
          onClick={() => router.push("/agents")}
          className="text-xs tracking-widest text-[#E8E8E8]/40 hover:text-[#00FF85] transition-colors"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          GO NOW →
        </button>
      </div>
    </main>
  );
}
