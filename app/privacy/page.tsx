export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p
          className="mt-3 text-[#E8E8E8]/30 text-xs tracking-widest"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          Last updated: April 2026
        </p>
        <div
          className="mt-8 space-y-6 text-[#E8E8E8]/60 leading-relaxed"
          style={{ fontFamily: "var(--font-space-mono)", fontSize: "13px" }}
        >
          <p>
            3vo.ai ("we", "us", "our") operates this website and our related products. This policy
            explains how we collect and use information.
          </p>

          <h2 className="text-base font-bold text-[#E8E8E8] pt-2" style={{ fontFamily: "var(--font-syne)" }}>
            What we collect
          </h2>
          <p>
            When you purchase a product or submit a form, we collect your name, email address, and
            payment information (processed securely via Stripe — we never see your full card number).
            We also collect standard analytics data (page views, referrers, device type) to improve
            our products.
          </p>

          <h2 className="text-base font-bold text-[#E8E8E8] pt-2" style={{ fontFamily: "var(--font-syne)" }}>
            How we use it
          </h2>
          <p>
            We use your email to deliver your purchase, send product updates (you can unsubscribe
            any time), and respond to support requests. We do not sell your data to third parties.
          </p>

          <h2 className="text-base font-bold text-[#E8E8E8] pt-2" style={{ fontFamily: "var(--font-syne)" }}>
            Cookies
          </h2>
          <p>
            We use analytics cookies (Google Analytics) to understand how our site is used. You can
            disable cookies in your browser settings.
          </p>

          <h2 className="text-base font-bold text-[#E8E8E8] pt-2" style={{ fontFamily: "var(--font-syne)" }}>
            Contact
          </h2>
          <p>
            Questions about your data? Email us at{" "}
            <a href="mailto:hello@3vo.ai" className="text-[#00FF85] hover:opacity-70 underline">
              hello@3vo.ai
            </a>
          </p>
        </div>
        <div
          className="mt-12 border-t border-[#1a1a1a] pt-8 text-[10px] tracking-widest text-[#E8E8E8]/30 flex gap-6"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          <a href="/about" className="hover:text-[#E8E8E8]/60 transition-colors">ABOUT</a>
          <a href="/terms" className="hover:text-[#E8E8E8]/60 transition-colors">TERMS</a>
          <a href="/contact" className="hover:text-[#E8E8E8]/60 transition-colors">CONTACT</a>
        </div>
      </div>
    </main>
  );
}
