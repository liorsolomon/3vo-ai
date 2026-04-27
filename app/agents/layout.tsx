import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://prompts.3vo.ai"),
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AgentsNav />
      {children}
    </>
  );
}

// Server component — no "use client" needed. The upgrade button links out.
function AgentsNav() {
  return (
    <header className="border-b border-[#151515] bg-[#0A0A0A] sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        <a
          href="/agents"
          className="text-xs tracking-[0.2em] text-[#E8E8E8]/60 hover:text-[#E8E8E8] transition-colors"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          PROMPTS.3VO.AI
        </a>

        <a
          href="/api/checkout"
          className="text-[#0A0A0A] bg-[#00FF85] text-xs font-bold tracking-widest px-3 sm:px-4 py-1.5 hover:bg-[#00FF85]/80 transition-colors"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          <span className="sm:hidden">UPGRADE</span>
          <span className="hidden sm:inline">UPGRADE $19/MO</span>
        </a>
      </div>
    </header>
  );
}
