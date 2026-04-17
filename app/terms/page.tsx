export default function TermsPage() {
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
          Terms of Use
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
            By purchasing or using any 3vo.ai product, you agree to these terms.
          </p>

          <h2 className="text-base font-bold text-[#E8E8E8] pt-2" style={{ fontFamily: "var(--font-syne)" }}>
            License
          </h2>
          <p>
            All digital products sold by 3vo.ai are licensed for personal or business use by the
            purchaser. You may not resell, redistribute, or sublicense the products without written
            permission.
          </p>

          <h2 className="text-base font-bold text-[#E8E8E8] pt-2" style={{ fontFamily: "var(--font-syne)" }}>
            Refund policy
          </h2>
          <p>
            We offer a 30-day money-back guarantee on all products. If you&apos;re not satisfied,
            email us at hello@3vo.ai with your order details and we&apos;ll refund you in full —
            no forms, no drama.
          </p>

          <h2 className="text-base font-bold text-[#E8E8E8] pt-2" style={{ fontFamily: "var(--font-syne)" }}>
            Intellectual property
          </h2>
          <p>
            All content on this website — including copy, design, and code — is the intellectual
            property of 3vo.ai. Unauthorized reproduction is prohibited.
          </p>

          <h2 className="text-base font-bold text-[#E8E8E8] pt-2" style={{ fontFamily: "var(--font-syne)" }}>
            Limitation of liability
          </h2>
          <p>
            3vo.ai products are provided as-is. We are not liable for any indirect or consequential
            damages arising from use of our products.
          </p>

          <h2 className="text-base font-bold text-[#E8E8E8] pt-2" style={{ fontFamily: "var(--font-syne)" }}>
            Contact
          </h2>
          <p>
            Questions? Email{" "}
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
          <a href="/privacy" className="hover:text-[#E8E8E8]/60 transition-colors">PRIVACY</a>
          <a href="/contact" className="hover:text-[#E8E8E8]/60 transition-colors">CONTACT</a>
        </div>
      </div>
    </main>
  );
}
