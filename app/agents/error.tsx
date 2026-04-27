"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AgentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry/console — Sentry is already wired in the root layout
    console.error("[agents] error boundary:", error);
  }, [error]);

  return (
    <main className="min-h-[60vh] bg-[#0A0A0A] text-[#E8E8E8] flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <p
          className="text-[#FF4444] text-xs tracking-widest mb-4"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          SOMETHING WENT WRONG
        </p>
        <p
          className="text-[#E8E8E8]/50 text-sm leading-relaxed mb-8"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {error.message ?? "An unexpected error occurred."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#00FF85] text-[#0A0A0A] text-xs font-bold tracking-widest px-6 py-3 hover:bg-[#00FF85]/80 transition-colors"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            TRY AGAIN
          </button>
          <Link
            href="/agents"
            className="border border-[#333] text-[#E8E8E8]/60 text-xs tracking-widest px-6 py-3 hover:text-[#E8E8E8] transition-colors text-center"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            ← ALL AGENTS
          </Link>
        </div>
      </div>
    </main>
  );
}
