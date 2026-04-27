import Link from "next/link";
import { AGENT_LIST } from "@/app/lib/prompts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflow Agents — prompts.3vo.ai",
  description:
    "AI agents that write cold pitches, pricing scripts, LinkedIn posts, proposals, and client check-ins — in 30 seconds. Try 3 runs free.",
};

const AGENT_META: Record<string, { icon: string; time: string; output: string }> = {
  "cold-pitch": {
    icon: "→",
    time: "~30s",
    output: "Ready-to-send cold email or DM",
  },
  "pricing-reframe": {
    icon: "$",
    time: "~30s",
    output: "Word-for-word conversation script",
  },
  "linkedin-content": {
    icon: "↑",
    time: "~25s",
    output: "Full LinkedIn post, scroll-optimized",
  },
  proposal: {
    icon: "✦",
    time: "~40s",
    output: "Structured proposal in markdown",
  },
  "client-checkin": {
    icon: "◎",
    time: "~20s",
    output: "Professional check-in message",
  },
};

export default function AgentsHubPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8]">
      {/* Hero */}
      <div className="px-4 sm:px-6 pt-16 pb-12 max-w-4xl mx-auto">
        <p
          className="text-[#00FF85] text-xs tracking-[0.25em] mb-5"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          PROMPTS.3VO.AI
        </p>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] mb-6"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          The work you
          <br />
          keep putting off.
          <br />
          <span className="text-[#00FF85]">Done in 30 seconds.</span>
        </h1>
        <p
          className="text-[#E8E8E8]/60 text-base leading-relaxed max-w-lg mb-8"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          5 AI agents that handle the client work you hate writing. Not templates —
          agents that analyze your situation, draft, and polish end-to-end.
        </p>

        {/* CTA strip */}
        <div className="flex flex-wrap items-center gap-6">
          <div
            className="text-[#00FF85] text-xs tracking-widest"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            3 FREE RUNS
          </div>
          <div
            className="text-[#E8E8E8]/30 text-xs tracking-widest"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            THEN $19/MO · NO LOGIN · CANCEL ANYTIME
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="px-4 sm:px-6 pb-14 max-w-4xl mx-auto">
        <div className="border-t border-[#222222] pt-10">
          <p
            className="text-[#E8E8E8]/30 text-xs tracking-[0.2em] mb-8"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            HOW IT WORKS
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", label: "Fill in your situation", detail: "3–5 fields. Takes 60 seconds." },
              { step: "02", label: "Agent runs 3-step chain", detail: "Analyze → Draft → Polish. No generic output." },
              { step: "03", label: "Copy or download", detail: "Markdown-ready. Send it as-is." },
            ].map(({ step, label, detail }) => (
              <div key={step} className="flex gap-4">
                <span
                  className="text-[#00FF85]/40 text-xs tracking-widest mt-0.5 w-6 flex-shrink-0"
                  style={{ fontFamily: "var(--font-share-tech-mono)" }}
                >
                  {step}
                </span>
                <div>
                  <p
                    className="text-sm font-bold mb-1"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-[#E8E8E8]/40 text-xs leading-relaxed"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent grid */}
      <div className="px-4 sm:px-6 pb-16 max-w-4xl mx-auto">
        <p
          className="text-[#E8E8E8]/30 text-xs tracking-[0.2em] mb-6"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          PICK AN AGENT
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AGENT_LIST.map((agent) => {
            const meta = AGENT_META[agent.name];
            return (
              <Link
                key={agent.name}
                href={`/agents/${agent.name}`}
                className="group border border-[#1E1E1E] hover:border-[#00FF85]/30 bg-[#0D0D0D] hover:bg-[#0F0F0F] p-5 sm:p-6 transition-all duration-150 block"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="text-[#00FF85] text-lg w-7 flex-shrink-0 mt-0.5"
                    style={{ fontFamily: "var(--font-share-tech-mono)" }}
                  >
                    {meta?.icon ?? "·"}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h2
                        className="text-base font-bold group-hover:text-[#00FF85] transition-colors"
                        style={{ fontFamily: "var(--font-syne)" }}
                      >
                        {agent.title}
                      </h2>
                      {meta?.time && (
                        <span
                          className="text-[#E8E8E8]/25 text-xs"
                          style={{ fontFamily: "var(--font-share-tech-mono)" }}
                        >
                          {meta.time}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[#E8E8E8]/45 text-xs tracking-wide mb-2"
                      style={{ fontFamily: "var(--font-share-tech-mono)" }}
                    >
                      {agent.tagline}
                    </p>
                    {meta?.output && (
                      <p
                        className="text-[#00FF85]/50 text-xs"
                        style={{ fontFamily: "var(--font-share-tech-mono)" }}
                      >
                        OUTPUT: {meta.output}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pricing callout */}
      <div className="px-4 sm:px-6 pb-16 max-w-4xl mx-auto">
        <div className="border border-[#1E1E1E] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p
                className="text-2xl font-black mb-2"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                $19/mo
              </p>
              <p
                className="text-[#E8E8E8]/50 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Unlimited runs on all 5 agents. No contracts. Cancel anytime.
                <br className="hidden sm:block" />
                First 3 runs free — no card required.
              </p>
            </div>
            <div
              className="text-[#E8E8E8]/30 text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              <div>✓ ALL 5 AGENTS</div>
              <div>✓ UNLIMITED RUNS</div>
              <div>✓ DOWNLOAD .TXT</div>
              <div>✓ NO LOGIN</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-6 pb-10 max-w-4xl mx-auto">
        <div
          className="border-t border-[#1A1A1A] pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#E8E8E8]/25 tracking-widest"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          <Link href="https://3vo.ai" className="hover:text-[#E8E8E8]/50 transition-colors">
            ← 3VO.AI
          </Link>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#E8E8E8]/50 transition-colors">
              PRIVACY
            </Link>
            <Link href="/terms" className="hover:text-[#E8E8E8]/50 transition-colors">
              TERMS
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
