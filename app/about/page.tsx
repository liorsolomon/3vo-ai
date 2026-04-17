export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8] px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <a
          href="/"
          className="text-[10px] tracking-widest text-[#00FF85] hover:opacity-70 transition-opacity"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          ← BACK TO HOME
        </a>
        <h1
          className="mt-8 text-[clamp(28px,4vw,48px)] font-bold leading-tight"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          About 3vo.ai
        </h1>
        <div
          className="mt-8 space-y-6 text-[#E8E8E8]/60 leading-relaxed"
          style={{ fontFamily: "var(--font-space-mono)", fontSize: "13px" }}
        >
          <p>
            3vo is an AI-native product studio. We design, build, and launch digital products using
            teams of specialized AI agents — at a speed and cost no traditional agency can match.
          </p>
          <p>
            We started with a simple thesis: the gap between idea and revenue has never been smaller.
            AI agents can now handle design, development, copy, and distribution in parallel.
            We built 3vo to prove it.
          </p>
          <p>
            Every product in the 3vo family is live, generating traction, and built end-to-end by our
            agent teams. No prototypes. No mockups. Real products, real users, real revenue.
          </p>

          <h2
            className="text-xl font-bold text-[#E8E8E8] pt-4"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            What we&apos;ve built
          </h2>
          <ul className="space-y-3 text-[#E8E8E8]/50">
            <li>
              <a href="https://templates.3vo.ai" className="text-[#00FF85] hover:opacity-70 underline">
                Notion Template OS
              </a>
              {" "}— Your entire business workflow, pre-built in Notion.
            </li>
            <li>
              <a href="https://prompts.3vo.ai" className="text-[#00FF85] hover:opacity-70 underline">
                AI Prompt Packs
              </a>
              {" "}— Battle-tested prompt packs for writers, marketers, and builders.
            </li>
            <li>
              <a href="https://tools.3vo.ai" className="text-[#00FF85] hover:opacity-70 underline">
                Automation Workflows
              </a>
              {" "}— Pre-built automation workflows for the tools you already use.
            </li>
          </ul>

          <h2
            className="text-xl font-bold text-[#E8E8E8] pt-4"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Work with us
          </h2>
          <p>
            Have an idea worth shipping?{" "}
            <a href="/contact" className="text-[#00FF85] hover:opacity-70 underline">
              Tell us what you&apos;re building.
            </a>
          </p>
        </div>
        <div
          className="mt-12 border-t border-[#1a1a1a] pt-8 text-[10px] tracking-widest text-[#E8E8E8]/30 flex gap-6"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          <a href="/privacy" className="hover:text-[#E8E8E8]/60 transition-colors">PRIVACY</a>
          <a href="/terms" className="hover:text-[#E8E8E8]/60 transition-colors">TERMS</a>
          <a href="/contact" className="hover:text-[#E8E8E8]/60 transition-colors">CONTACT</a>
        </div>
      </div>
    </main>
  );
}
