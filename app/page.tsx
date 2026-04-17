"use client";

import { useEffect, useRef, useState } from "react";
import ProductCatalog from "./ProductCatalog";

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
            PRODUCTS ↓
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
        <h1
          className="text-[clamp(40px,7vw,88px)] leading-[1.05] tracking-tight text-[#E8E8E8] mb-8 max-w-4xl"
          style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
        >
          Three tools. One ecosystem. Built to earn passively.
        </h1>

        <p
          className="text-[#E8E8E8]/60 text-[18px] leading-relaxed mb-10 max-w-2xl"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Digital products for freelancers and creators who want to generate income
          &mdash; without adding more hours to their week.
        </p>

        <a
          href="#products"
          className="inline-block bg-[#00FF85] text-[#0A0A0A] px-8 py-4 text-sm tracking-widest transition-opacity hover:opacity-80"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          EXPLORE THE PRODUCTS ↓
        </a>
      </div>
    </section>
  );
}

// ─── Social Proof Bar ─────────────────────────────────────────────────────────

function SocialProofBar() {
  const stats = [
    { value: "3,000+", label: "solopreneurs using our tools" },
    { value: "4", label: "products live today" },
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
  label: string;
  headline: string;
  body: string;
  price: string;
  cta: string;
  href: string;
}

const PRODUCTS: Product[] = [
  {
    name: "Notion Template OS",
    label: "ORGANIZATION",
    headline: "Your freelance business, finally in one place.",
    body: "Six interconnected systems in a single Notion workspace. Client hub, project tracker, invoices, goals, and weekly reviews — set up in minutes, not days.",
    price: "$39 · One-time payment · Lifetime updates",
    cta: "Get Notion Template OS",
    href: "https://templates.3vo.ai",
  },
  {
    name: "AI Prompt Packs",
    label: "PRODUCTIVITY",
    headline: "Stop fighting AI for useful output.",
    body: "25–50 battle-tested prompts built for your exact role. Marketing, sales, real estate, content creation — get results in minutes, not hours.",
    price: "From $19 · No subscription",
    cta: "Get AI Prompt Packs",
    href: "https://prompts.3vo.ai",
  },
  {
    name: "Automation Workflow Templates",
    label: "AUTOMATION",
    headline: "Automate your business without writing a line of code.",
    body: "Ready-to-deploy n8n and Make templates that connect your tools and eliminate repetitive tasks. Import, connect, run.",
    price: "From $49 · Lifetime access",
    cta: "Get Automation Templates",
    href: "https://tools.3vo.ai",
  },
  {
    name: "VC Match Kit",
    label: "FUNDRAISING",
    headline: "Find the right investors before you pitch.",
    body: "A curated toolkit for founders navigating early-stage fundraising — VC targeting frameworks, outreach templates, and pitch checklists built for speed.",
    price: "Free to start · Pro tier available",
    cta: "Get VC Match Kit",
    href: "https://vckit.3vo.ai",
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
      {/* Label */}
      <div
        className="text-[#00FF85]/60 text-[10px] tracking-widest mb-5"
        style={{ fontFamily: "var(--font-share-tech-mono)" }}
      >
        {product.label}
      </div>

      {/* Name */}
      <h3
        className="text-[#E8E8E8] text-[22px] leading-tight mb-2"
        style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
      >
        {product.name}
      </h3>

      {/* Headline */}
      <p
        className="text-[#00D4FF] text-[13px] leading-snug mb-4"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {product.headline}
      </p>

      {/* Body */}
      <p
        className="text-[#E8E8E8]/50 text-[13px] leading-[1.75] flex-1 mb-6"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {product.body}
      </p>

      {/* Price */}
      <div
        className="text-[#E8E8E8]/40 text-[11px] tracking-wide mb-5"
        style={{ fontFamily: "var(--font-share-tech-mono)" }}
      >
        {product.price}
      </div>

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
          Pick the tool that fits where you are right now.
        </h2>

        <p
          className="text-[#E8E8E8]/40 text-[14px] leading-relaxed mb-14 max-w-xl"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Four live products. All independently useful. All built for the way
          independent operators actually work.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1a1a1a]">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Quick Match ──────────────────────────────────────────────────────────────

const QUICK_MATCH = [
  {
    want: "Get your freelance operations organized",
    start: "Notion Template OS",
    href: "https://templates.3vo.ai",
  },
  {
    want: "Make AI work better for your workflow",
    start: "AI Prompt Packs",
    href: "https://prompts.3vo.ai",
  },
  {
    want: "Stop doing the same tasks manually",
    start: "Automation Templates",
    href: "https://tools.3vo.ai",
  },
  {
    want: "Find and pitch the right VCs faster",
    start: "VC Match Kit",
    href: "https://vckit.3vo.ai",
  },
];

function QuickMatch() {
  return (
    <section className="bg-[#111111] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div
          className="text-[#00FF85] text-xs tracking-[0.2em] mb-4 flex items-center gap-3"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          QUICK MATCH
          <span className="flex-1 h-px bg-[#00FF85]/30 max-w-[80px]" />
        </div>

        <h2
          className="text-[clamp(24px,3.5vw,40px)] leading-[1.15] tracking-tight text-[#E8E8E8] mb-10"
          style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
        >
          Not sure where to start?
        </h2>

        <div className="border border-[#1e1e1e] divide-y divide-[#1e1e1e]">
          <div className="grid grid-cols-2 bg-[#0A0A0A] px-6 py-3">
            <span
              className="text-[#E8E8E8]/30 text-[10px] tracking-widest"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              IF YOU WANT TO…
            </span>
            <span
              className="text-[#E8E8E8]/30 text-[10px] tracking-widest"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              START HERE
            </span>
          </div>
          {QUICK_MATCH.map((row) => (
            <div
              key={row.want}
              className="grid grid-cols-2 px-6 py-5 hover:bg-[#0A0A0A]/60 transition-colors"
            >
              <span
                className="text-[#E8E8E8]/60 text-[13px] leading-relaxed pr-4"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {row.want}
              </span>
              <a
                href={row.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00FF85] text-[13px] tracking-wide hover:opacity-70 transition-opacity no-underline"
                style={{ fontFamily: "var(--font-share-tech-mono)" }}
              >
                → {row.start}
              </a>
            </div>
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
    <section ref={ref} className="px-6 py-28">
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

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "What does 3vo actually build?",
    a: "Digital products — SaaS tools, templates, automation workflows, and content libraries. Everything ships live and generating real traction. We build things people pay for.",
  },
  {
    q: "How fast can you go from idea to live product?",
    a: "Days to weeks, not months. Our agent teams handle design, development, and copy in parallel. A traditional agency might take 3–6 months for what we ship in a sprint.",
  },
  {
    q: "Can I buy or use your existing products now?",
    a: "Yes — all three products are live. Notion Template OS at templates.3vo.ai, AI Prompt Packs at prompts.3vo.ai, and Automation Workflows at tools.3vo.ai.",
  },
  {
    q: "Do you work with external founders or clients?",
    a: "Selectively. We focus on founders who need speed and don't want to manage a dev team. If your idea is worth shipping, reach out via the contact form.",
  },
  {
    q: "Are these products actually built by AI agents?",
    a: "Yes. Every product in the 3vo family — including this website — was designed, coded, and launched by our AI agent teams. We use the stack we sell.",
  },
];

function FAQ() {
  return (
    <section className="px-6 py-20 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-3xl">
        <h2
          className="text-center text-[clamp(22px,3vw,34px)] font-bold mb-10 text-[#E8E8E8]"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group border border-[#1a1a1a] bg-[#111111]"
            >
              <summary
                className="flex cursor-pointer items-center justify-between px-6 py-4 list-none text-[#E8E8E8]/80 hover:text-[#E8E8E8] transition-colors"
                style={{ fontFamily: "var(--font-space-mono)", fontSize: "13px" }}
              >
                <span>{faq.q}</span>
                <span className="ml-4 text-[#00FF85] group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div
                className="px-6 pb-5 text-[#E8E8E8]/50 leading-relaxed"
                style={{ fontFamily: "var(--font-space-mono)", fontSize: "12px" }}
              >
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust Bar / Footer CTA ───────────────────────────────────────────────────

function TrustBar() {
  return (
    <section className="bg-[#111111] border-t border-[#1a1a1a] px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p
          className="text-[#E8E8E8] text-[clamp(20px,3vw,32px)] leading-[1.3] tracking-tight mb-4"
          style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
        >
          All three products. One-time payments. No subscriptions. No fluff.
        </p>

        <p
          className="text-[#E8E8E8]/50 text-[14px] leading-relaxed mb-8 max-w-lg mx-auto"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Built for independents who want leverage, not more software to manage.
        </p>

        <a
          href="#products"
          className="inline-block bg-[#00FF85] text-[#0A0A0A] px-8 py-4 text-sm tracking-widest transition-opacity hover:opacity-80"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          EXPLORE THE PRODUCTS ↑
        </a>

        <p
          className="text-[#E8E8E8]/30 text-xs tracking-widest mt-10"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          &mdash; The 3vo.ai team
        </p>
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
            href="/about"
            className="text-[#E8E8E8]/30 hover:text-[#E8E8E8]/60 text-[10px] tracking-widest transition-colors"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            ABOUT
          </a>
          <a
            href="/contact"
            className="text-[#E8E8E8]/30 hover:text-[#E8E8E8]/60 text-[10px] tracking-widest transition-colors"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            CONTACT
          </a>
          <a
            href="/privacy"
            className="text-[#E8E8E8]/30 hover:text-[#E8E8E8]/60 text-[10px] tracking-widest transition-colors"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            PRIVACY
          </a>
          <a
            href="/terms"
            className="text-[#E8E8E8]/30 hover:text-[#E8E8E8]/60 text-[10px] tracking-widest transition-colors"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            TERMS
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
      <ProductCatalog />
      <QuickMatch />
      <Why />
      <FAQ />
      <TrustBar />
      <Footer />
    </main>
  );
}
