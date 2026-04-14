import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Thesis — 3vo.ai",
  description:
    "Why we build at the intersection of agents, crypto, and the creator economy.",
};

const sections = [
  {
    number: "01",
    title: "The internet is being rewired.",
    body: "AI agents don't browse the web — they call APIs, parse structured data, and act autonomously. The apps built for human clicks won't survive the shift. The infrastructure layer that agents depend on doesn't fully exist yet.",
  },
  {
    number: "02",
    title: "Crypto settles the trust problem.",
    body: "When agents transact with agents, you can't rely on passwords or OAuth handshakes. Programmable money, verifiable identity, and on-chain state are the primitives that make autonomous agent economies possible without centralized gatekeepers.",
  },
  {
    number: "03",
    title: "The creator economy is the demand signal.",
    body: "Creators are the canary in the coal mine for every new platform shift. They move fast, experiment openly, and immediately monetize whatever works. Building tools that serve creators means building tools at the bleeding edge of what the internet is becoming.",
  },
  {
    number: "04",
    title: "Lean studios win the next cycle.",
    body: "The playbook is simple: ship a product in weeks, not quarters. If it generates revenue, iterate hard. If it doesn't, cut and redirect. No roadmap theater, no fundraising treadmills — just products and revenue. Three people with the right stack can out-execute a 30-person team operating on assumptions.",
  },
  {
    number: "05",
    title: "We build in public, ship in production.",
    body: "Every product we launch is a live experiment. We measure what works, document what fails, and move on. The goal isn't to build a portfolio company — it's to find the one product that breaks out, then pour into it.",
  },
];

export default function ThesisPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8]">
      {/* Nav */}
      <nav className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-[#1A1A1A]">
        <Link
          href="/"
          className="text-[#00FF85] text-sm tracking-widest hover:opacity-70 transition-opacity"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          ← 3VO.AI
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-32">
        {/* Header */}
        <div className="mb-20">
          <p
            className="text-[#00D4FF] text-xs tracking-[0.3em] mb-6 uppercase"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            The Thesis
          </p>
          <h1
            className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight mb-8"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            New way
            <br />
            to internet.
          </h1>
          <p
            className="text-[#E8E8E8]/60 text-base md:text-lg leading-relaxed max-w-xl"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            We are a lean studio building at the intersection of agents, crypto,
            and the creator economy. This is why we think the intersection
            matters — and why now.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {sections.map((s) => (
            <div
              key={s.number}
              className="border-l-2 border-[#00FF85]/20 pl-8 hover:border-[#00FF85]/60 transition-colors"
            >
              <p
                className="text-[#00FF85]/40 text-xs tracking-[0.3em] mb-3"
                style={{ fontFamily: "var(--font-share-tech-mono)" }}
              >
                {s.number}
              </p>
              <h2
                className="text-xl md:text-2xl font-black mb-4 leading-snug"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                {s.title}
              </h2>
              <p
                className="text-[#E8E8E8]/60 text-sm md:text-base leading-relaxed"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 pt-16 border-t border-[#1A1A1A]">
          <p
            className="text-[#E8E8E8]/40 text-xs tracking-[0.2em] mb-8 uppercase"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            If you're building in this space —
          </p>
          <Link
            href="/"
            className="inline-block bg-[#00FF85] text-[#0A0A0A] px-8 py-4 text-sm tracking-widest transition-opacity hover:opacity-80"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            CONTACT US ↗
          </Link>
        </div>
      </div>
    </main>
  );
}
