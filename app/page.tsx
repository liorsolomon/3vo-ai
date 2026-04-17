"use client";

import { useEffect, useRef, useState } from "react";

// ─── Contact Modal ────────────────────────────────────────────────────────────

function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setFirstName("");
    setLastName("");
    setDescription("");
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={handleClose}
    >
      <div
        className="bg-[#0A0A0A] border border-[#222222] p-8 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#E8E8E8]/40 hover:text-[#E8E8E8]/80 transition-colors text-xs tracking-widest"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <p
              className="text-[#00FF85] text-sm tracking-widest"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              MESSAGE RECEIVED
            </p>
            <p
              className="text-[#E8E8E8]/50 text-xs tracking-widest mt-3"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              WE&apos;LL BE IN TOUCH.
            </p>
          </div>
        ) : (
          <>
            <h2
              className="text-[#00FF85] text-sm tracking-[0.2em] mb-8"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              CONTACT US
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[#E8E8E8]/40 text-[10px] tracking-widest"
                    style={{ fontFamily: "var(--font-share-tech-mono)" }}
                  >
                    FIRST NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-[#111111] border border-[#222222] text-[#E8E8E8] text-sm px-3 py-2 outline-none focus:border-[#00FF85] transition-colors"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[#E8E8E8]/40 text-[10px] tracking-widest"
                    style={{ fontFamily: "var(--font-share-tech-mono)" }}
                  >
                    LAST NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-[#111111] border border-[#222222] text-[#E8E8E8] text-sm px-3 py-2 outline-none focus:border-[#00FF85] transition-colors"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[#E8E8E8]/40 text-[10px] tracking-widest"
                  style={{ fontFamily: "var(--font-share-tech-mono)" }}
                >
                  DESCRIPTION
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-[#111111] border border-[#222222] text-[#E8E8E8] text-sm px-3 py-2 outline-none focus:border-[#00FF85] transition-colors resize-none"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                />
              </div>

              <button
                type="submit"
                className="mt-2 bg-[#00FF85] text-[#0A0A0A] px-6 py-3 text-sm tracking-widest transition-opacity hover:opacity-80"
                style={{ fontFamily: "var(--font-share-tech-mono)" }}
              >
                SUBMIT
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ onContactOpen }: { onContactOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 px-6 py-5 transition-all duration-300 ${
        scrolled ? "bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-[#1a1a1a]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <span
          className="text-[#00FF85] text-lg tracking-tight"
          style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
        >
          3vo.ai
        </span>

        <div className="flex items-center gap-6">
          <a
            href="#products"
            className="text-[#E8E8E8]/50 text-sm tracking-widest hover:text-[#E8E8E8]/80 transition-colors hidden sm:block"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            TOOLS
          </a>
          <button
            onClick={onContactOpen}
            className="text-[#00FF85] text-sm tracking-widest hover:opacity-70 transition-opacity"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            CONTACT US ↗
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative px-6 py-28 lg:py-36">
      <div className="mx-auto max-w-6xl w-full">
        <div
          className="text-[#00FF85] text-xs tracking-[0.2em] mb-6 flex items-center gap-3"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          AI TOOLS FOR INDEPENDENT BUILDERS
          <span className="h-px bg-[#00FF85]/30 w-12" />
        </div>

        <h1
          className="text-[clamp(40px,7vw,88px)] leading-[1.05] tracking-tight text-[#E8E8E8] mb-8 max-w-4xl"
          style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
        >
          AI-powered tools for people who build on their own terms.
        </h1>

        <p
          className="text-[#E8E8E8]/60 text-[18px] leading-relaxed mb-10 max-w-2xl"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Templates, prompt packs, automation workflows, and market reports —
          made for solopreneurs, freelancers, and lean teams who want results
          without the overhead.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#products"
            className="inline-block bg-[#00FF85] text-[#0A0A0A] px-8 py-4 text-sm tracking-widest transition-opacity hover:opacity-80"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            BROWSE THE TOOLKIT ↓
          </a>
          <a
            href="#products"
            className="inline-block border border-[#E8E8E8]/20 text-[#E8E8E8]/60 px-8 py-4 text-sm tracking-widest transition-colors hover:border-[#E8E8E8]/40 hover:text-[#E8E8E8]/80"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            SEE WHAT&apos;S LIVE ↗
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof Bar ─────────────────────────────────────────────────────────

function SocialProofBar() {
  const stats = [
    { value: "3,000+", label: "solopreneurs using our tools" },
    { value: "5", label: "products live today" },
    { value: "4.8★", label: "average product rating" },
    { value: "30-day", label: "money-back guarantee" },
  ];

  return (
    <div className="bg-[#111111] border-y border-[#1e1e1e] px-6 py-8">
      <div className="mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div
              className="text-[#00FF85] text-2xl mb-1"
              style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
            >
              {s.value}
            </div>
            <div
              className="text-[#E8E8E8]/40 text-[11px] tracking-widest"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              {s.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────

interface Product {
  name: string;
  tagline: string;
  description: string;
  cta: string;
  href: string;
  category: string;
}

const PRODUCTS: Product[] = [
  {
    name: "Notion Template OS",
    tagline: "Your complete operating system in Notion.",
    description:
      "Pre-built dashboards, project trackers, and habit systems — ready to use on day one. No blank-page anxiety.",
    cta: "GET INSTANT ACCESS",
    href: "https://templates.3vo.ai",
    category: "PRODUCTIVITY",
  },
  {
    name: "AI Prompt Packs",
    tagline: "Prompts that actually work — built for your role.",
    description:
      "Role-specific prompt libraries for founders, marketers, and freelancers. Skip the trial-and-error, get outputs that ship.",
    cta: "EXPLORE PACKS",
    href: "https://prompts.3vo.ai",
    category: "AI TOOLS",
  },
  {
    name: "Automation Workflow Templates",
    tagline: "Automate the boring stuff in minutes, not days.",
    description:
      "Drag-and-drop workflows for n8n, Zapier, and Make. Start with working templates, not blank screens.",
    cta: "BROWSE WORKFLOWS",
    href: "https://tools.3vo.ai",
    category: "AUTOMATION",
  },
  {
    name: "Niche Market Reports",
    tagline: "AI-powered market research before you build.",
    description:
      "Full niche validation reports — demand analysis, competitor landscape, pricing benchmarks — delivered in 48 hours.",
    cta: "ORDER YOUR REPORT",
    href: "https://validate.3vo.ai",
    category: "RESEARCH",
  },
  {
    name: "VC Match & Outreach Kit",
    tagline: "Find your investor. Write the email. Close the round.",
    description:
      "Curated investor matches filtered by stage, sector, and check size. Includes outreach templates and follow-up sequences.",
    cta: "FIND INVESTORS",
    href: "https://vc.3vo.ai",
    category: "FUNDING",
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-[#0A0A0A] border border-[#1e1e1e] p-7 flex flex-col transition-all duration-200 hover:border-[#00FF85]/50 no-underline"
    >
      {/* Category */}
      <div
        className="text-[#00FF85]/60 text-[10px] tracking-widest mb-5"
        style={{ fontFamily: "var(--font-share-tech-mono)" }}
      >
        {product.category}
      </div>

      {/* Name */}
      <h3
        className="text-[#E8E8E8] text-[22px] leading-tight mb-2"
        style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
      >
        {product.name}
      </h3>

      {/* Tagline */}
      <p
        className="text-[#00D4FF] text-[13px] leading-snug mb-4"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {product.tagline}
      </p>

      {/* Description */}
      <p
        className="text-[#E8E8E8]/50 text-[13px] leading-[1.75] flex-1 mb-6"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {product.description}
      </p>

      {/* CTA */}
      <div className="border-t border-[#1a1a1a] pt-5">
        <span
          className="text-[#00FF85] text-xs tracking-widest group-hover:opacity-70 transition-opacity"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          {product.cta} ↗
        </span>
      </div>
    </a>
  );
}

function Products() {
  return (
    <section id="products" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div
          className="text-[#00FF85] text-xs tracking-[0.2em] mb-4 flex items-center gap-3"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          THE TOOLKIT
          <span className="flex-1 h-px bg-[#00FF85]/30 max-w-[80px]" />
        </div>

        <h2
          className="text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-tight text-[#E8E8E8] mb-3"
          style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
        >
          Tools that ship. Products that pay.
        </h2>

        <p
          className="text-[#E8E8E8]/40 text-[14px] leading-relaxed mb-14 max-w-xl"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Five live products. All independently useful. All built for the way
          independent operators actually work.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why 3vo.ai ───────────────────────────────────────────────────────────────

function useRevealOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}

const WHY_POINTS = [
  {
    title: "Built lean.",
    body: "No bloat, no filler. Every product does one thing well and ships fast. If it doesn't save you time or make you money, it doesn't make the cut.",
  },
  {
    title: "Priced honestly.",
    body: "Flat one-time prices. No subscriptions, no paywalled features, no upsell traps. You pay once and it's yours.",
  },
  {
    title: "Made to work.",
    body: "Every template, prompt, and workflow is tested by real operators before it ships. We don't sell demos — we sell tools we use ourselves.",
  },
];

function Why() {
  const { ref, revealed } = useRevealOnScroll();

  return (
    <section ref={ref} className="bg-[#111111] px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div
          className="text-[#00FF85] text-xs tracking-[0.2em] mb-4 flex items-center gap-3"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          WHY 3VO.AI
          <span className="flex-1 h-px bg-[#00FF85]/30 max-w-[80px]" />
        </div>

        <h2
          className="text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-tight text-[#E8E8E8] mb-14"
          style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
        >
          Built lean. Priced honestly.
          <br />
          Made to work.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WHY_POINTS.map((point, i) => (
            <div
              key={point.title}
              className={`transition-all duration-700 ${
                revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="border-l-2 border-[#00FF85] pl-5">
                <h3
                  className="text-[#E8E8E8] text-[18px] mb-3"
                  style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
                >
                  {point.title}
                </h3>
                <p
                  className="text-[#E8E8E8]/50 text-[13px] leading-[1.8]"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {point.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA({ onContactOpen }: { onContactOpen: () => void }) {
  return (
    <section className="px-6 py-[120px]">
      <div className="mx-auto max-w-5xl">
        <h2
          className="text-[clamp(32px,5vw,60px)] leading-[1.1] tracking-tight text-[#E8E8E8] mb-6"
          style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
        >
          Ready to build smarter?
          <br />
          Start with any tool.
        </h2>

        <p
          className="text-[#E8E8E8]/40 text-[14px] leading-relaxed mb-10 max-w-lg"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Every product ships with a 30-day money-back guarantee. No questions asked.
          Pick the tool that fits your next step and get moving.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#products"
            className="inline-block bg-[#00FF85] text-[#0A0A0A] px-8 py-4 text-sm tracking-widest transition-opacity hover:opacity-80"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            BROWSE THE TOOLKIT ↓
          </a>
          <button
            onClick={onContactOpen}
            className="inline-block border border-[#E8E8E8]/20 text-[#E8E8E8]/60 px-8 py-4 text-sm tracking-widest transition-colors hover:border-[#E8E8E8]/40 hover:text-[#E8E8E8]/80"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            GET IN TOUCH ↗
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span
            className="text-[#E8E8E8]/40 text-xs tracking-widest"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            3vo.ai
          </span>
          <p
            className="text-[#E8E8E8]/40 text-xs tracking-widest mt-1"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            © 2026 3vo.ai — The 3vo.ai team
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://templates.3vo.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E8E8E8]/30 hover:text-[#E8E8E8]/60 text-[10px] tracking-widest transition-colors"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            TEMPLATES
          </a>
          <a
            href="https://prompts.3vo.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E8E8E8]/30 hover:text-[#E8E8E8]/60 text-[10px] tracking-widest transition-colors"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            PROMPTS
          </a>
          <a
            href="https://tools.3vo.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E8E8E8]/30 hover:text-[#E8E8E8]/60 text-[10px] tracking-widest transition-colors"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            TOOLS
          </a>
          <a
            href="https://x.com/3voai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E8E8E8]/40 hover:text-[#E8E8E8]/70 text-xs tracking-widest transition-colors"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            X
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <Nav onContactOpen={() => setContactOpen(true)} />
      <Hero />
      <SocialProofBar />
      <Products />
      <Why />
      <FinalCTA onContactOpen={() => setContactOpen(true)} />
      <Footer />
    </main>
  );
}
