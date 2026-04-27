import Link from "next/link";
import { AGENT_LIST } from "@/app/lib/prompts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflow Agents — prompts.3vo.ai",
  description:
    "5 AI agents that run the work end-to-end: cold pitches, pricing conversations, LinkedIn content, proposals, and client check-ins.",
};

const ICONS: Record<string, string> = {
  "cold-pitch": "→",
  "pricing-reframe": "$",
  "linkedin-content": "↑",
  proposal: "✦",
  "client-checkin": "◎",
};

export default function AgentsHubPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8] px-6 py-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-16">
        <p
          className="text-[#00FF85] text-xs tracking-[0.25em] mb-4"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          PROMPTS.3VO.AI
        </p>
        <h1
          className="text-4xl md:text-5xl font-black leading-tight mb-6"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Stop writing.
          <br />
          Start sending.
        </h1>
        <p
          className="text-[#E8E8E8]/60 text-base leading-relaxed max-w-xl"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          5 agents that run your most expensive freelance tasks end-to-end. Input your situation.
          Get something you can actually use.
        </p>
      </div>

      {/* Free gate notice */}
      <div
        className="border border-[#222222] p-4 mb-12 text-xs tracking-widest text-[#E8E8E8]/40"
        style={{ fontFamily: "var(--font-share-tech-mono)" }}
      >
        3 FREE RUNS. THEN $19/MO FOR UNLIMITED.
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {AGENT_LIST.map((agent) => (
          <Link
            key={agent.name}
            href={`/agents/${agent.name}`}
            className="group border border-[#222222] p-6 hover:border-[#00FF85]/40 transition-all duration-200 block"
          >
            <div className="flex items-start gap-4">
              <span
                className="text-[#00FF85] text-xl w-8 flex-shrink-0 mt-0.5"
                style={{ fontFamily: "var(--font-share-tech-mono)" }}
              >
                {ICONS[agent.name] ?? "·"}
              </span>
              <div>
                <h2
                  className="text-base font-bold mb-1 group-hover:text-[#00FF85] transition-colors"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {agent.title}
                </h2>
                <p
                  className="text-[#E8E8E8]/50 text-xs mb-3 tracking-wide"
                  style={{ fontFamily: "var(--font-share-tech-mono)" }}
                >
                  {agent.tagline}
                </p>
                <p
                  className="text-[#E8E8E8]/60 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {agent.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div
        className="border-t border-[#222222] pt-8 text-xs text-[#E8E8E8]/30 tracking-widest"
        style={{ fontFamily: "var(--font-share-tech-mono)" }}
      >
        <Link href="/" className="hover:text-[#E8E8E8]/60 transition-colors">
          ← 3VO.AI
        </Link>
      </div>
    </main>
  );
}
