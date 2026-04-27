import Link from "next/link";

export default function AgentNotFound() {
  return (
    <main className="min-h-[70vh] bg-[#0A0A0A] text-[#E8E8E8] flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <p
          className="text-[#E8E8E8]/20 text-xs tracking-[0.3em] mb-4"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          404
        </p>
        <h1
          className="text-2xl font-black mb-4"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          That agent doesn&apos;t exist.
        </h1>
        <p
          className="text-[#E8E8E8]/40 text-sm mb-8 leading-relaxed"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Pick one of the 5 available agents below.
        </p>
        <Link
          href="/agents"
          className="inline-block bg-[#00FF85] text-[#0A0A0A] text-xs font-bold tracking-widest px-6 py-3 hover:bg-[#00FF85]/80 transition-colors"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          SEE ALL AGENTS →
        </Link>
      </div>
    </main>
  );
}
