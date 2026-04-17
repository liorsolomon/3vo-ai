export default function ContactPage() {
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
          Contact
        </h1>
        <div
          className="mt-8 space-y-6 text-[#E8E8E8]/60 leading-relaxed"
          style={{ fontFamily: "var(--font-space-mono)", fontSize: "13px" }}
        >
          <p>
            Have an idea worth building? A question about our products? Just want to say hi?
            Reach us at{" "}
            <a
              href="mailto:hello@3vo.ai"
              className="text-[#00FF85] hover:opacity-70 underline"
            >
              hello@3vo.ai
            </a>
          </p>
          <p>
            If you&apos;re looking for support for a specific product, include the product name and
            your order details and we&apos;ll get back to you quickly.
          </p>
          <p>
            Follow us on{" "}
            <a
              href="https://x.com/3voai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00FF85] hover:opacity-70 underline"
            >
              X @3voai
            </a>{" "}
            for product updates and launch announcements.
          </p>
        </div>
        <div
          className="mt-12 border-t border-[#1a1a1a] pt-8 text-[10px] tracking-widest text-[#E8E8E8]/30 flex gap-6"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          <a href="/about" className="hover:text-[#E8E8E8]/60 transition-colors">ABOUT</a>
          <a href="/privacy" className="hover:text-[#E8E8E8]/60 transition-colors">PRIVACY</a>
          <a href="/terms" className="hover:text-[#E8E8E8]/60 transition-colors">TERMS</a>
        </div>
      </div>
    </main>
  );
}
