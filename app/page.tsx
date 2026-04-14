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
        {/* Close */}
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
              WE'LL BE IN TOUCH.
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
        {/* Wordmark */}
        <span
          className="text-[#00FF85] text-lg tracking-tight"
          style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
        >
          3vo.ai
        </span>

        {/* Single CTA */}
        <button
          onClick={onContactOpen}
          className="text-[#00FF85] text-sm tracking-widest hover:opacity-70 transition-opacity"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          CONTACT US ↗
        </button>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    // Blink once then stop
    const timeout = setTimeout(() => setCursorVisible(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center px-6 py-24">
      <div className="mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div>
          {/* H1 */}
          <h1
            className="text-[clamp(48px,8vw,96px)] leading-[1.0] tracking-tight text-[#E8E8E8] mb-6"
            style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
          >
            New way to internet.
            <span
              className="inline-block w-[3px] h-[0.85em] bg-[#00FF85] align-middle ml-1 transition-opacity duration-200"
              style={{ opacity: cursorVisible ? 1 : 0 }}
            />
          </h1>

          {/* Subhead */}
          <p
            className="text-[#00D4FF] text-[20px] leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            The internet is being rebuilt by agents.
            <br />
            We are building the agency.
          </p>

          {/* Hero CTA — non-clickable */}
          <span
            className="inline-block border border-[#00FF85] text-[#00FF85] px-8 py-3 text-sm tracking-widest"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            ENTER THE PROTOCOL ↗
          </span>
        </div>

        {/* Right: agent counter widget */}
        <div className="flex justify-center lg:justify-end">
          <div className="border border-[#222222] p-8 inline-block">
            <div
              className="text-[#E8E8E8]/40 text-xs tracking-widest mb-3"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              LIVE AGENT COUNT
            </div>
            <div
              className="text-[#00D4FF] text-5xl tabular-nums leading-none"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              247
            </div>
            <div
              className="text-[#00FF85] text-xs tracking-widest mt-2"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              agents active
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Signal Bar ───────────────────────────────────────────────────────────────

const SIGNAL_ITEMS = [
  "AGENTIC AI",
  "CRYPTO NATIVE",
  "CREATOR ECONOMY",
  "SHIPS FAST",
  "LEAN TEAM",
  "REAL REVENUE",
];

function SignalBar() {
  const items = [...SIGNAL_ITEMS, ...SIGNAL_ITEMS]; // duplicate for seamless loop

  return (
    <div className="bg-[#111111] overflow-hidden py-3 group">
      <div
        className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]"
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="text-[#7B2FBE] text-sm tracking-widest mx-6"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            —— {item}
          </span>
        ))}
        {/* duplicate again for truly seamless loop */}
        {items.map((item, i) => (
          <span
            key={`dup-${i}`}
            className="text-[#7B2FBE] text-sm tracking-widest mx-6"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            —— {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Thesis ───────────────────────────────────────────────────────────────────

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
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}

function Thesis() {
  const { ref, revealed } = useRevealOnScroll();

  return (
    <section ref={ref} className="px-6 py-28">
      <div className="mx-auto max-w-4xl">
        {/* Section label */}
        <div
          className="text-[#00FF85] text-xs tracking-[0.2em] mb-8 flex items-center gap-3"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          WHAT WE BELIEVE
          <span className="flex-1 h-px bg-[#00FF85]/30 max-w-[80px]" />
        </div>

        {/* Statement block 1 */}
        <div
          className={`mb-10 transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "0ms" }}
        >
          <p
            className="text-[clamp(28px,4vw,48px)] leading-[1.15] tracking-tight text-[#E8E8E8]"
            style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
          >
            Most AI companies are building demos.
            <br />
            We build things that make money.
          </p>
        </div>

        {/* Statement block 2 */}
        <div
          className={`mb-12 transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "150ms" }}
        >
          <p
            className="text-[clamp(28px,4vw,48px)] leading-[1.15] tracking-tight text-[#E8E8E8]"
            style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
          >
            The agentic internet is not coming.
            <br />
            It is here. We are already inside it.
          </p>
        </div>

        {/* Supporting paragraph */}
        <div
          className={`transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "300ms" }}
        >
          <p
            className="text-[14px] leading-[1.8] text-[#E8E8E8]/60 max-w-2xl"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            3vo.ai is a lean studio building at the intersection of agents, crypto, and the creator
            economy. We ship products that generate revenue, then iterate. No pitch decks. No
            vaporware. No waiting for the future to arrive.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Pillars ──────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    num: "01",
    title: "AGENTIC INFRASTRUCTURE",
    body: "Tools that let agents coordinate, earn, and operate. The infrastructure layer for the agent-native internet — built for developers who are already shipping.",
    href: "https://tools.3vo.ai",
  },
  {
    num: "02",
    title: "CREATOR MONETIZATION",
    body: "New revenue streams for people who build in public. Monetize your audience, your content, and your tools — without surrendering your stack to a platform.",
    href: "https://templates.3vo.ai",
  },
  {
    num: "03",
    title: "CRYPTO RAILS",
    body: "Money that moves at the speed of agents. Programmable, borderless, composable — the financial layer for everything we build.",
    href: "https://prompts.3vo.ai",
  },
];

function Pillars() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <div
          className="text-[#00FF85] text-xs tracking-[0.2em] mb-12 flex items-center gap-3"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          WHAT WE BUILD
          <span className="flex-1 h-px bg-[#00FF85]/30 max-w-[80px]" />
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
          {PILLARS.map((p) => (
            <a
              key={p.num}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#0A0A0A] border border-[#222222] p-8 transition-all duration-200 hover:border-[#00FF85] block no-underline"
            >
              {/* Number */}
              <div
                className="text-[#00FF85] text-xs tracking-widest mb-6"
                style={{ fontFamily: "var(--font-share-tech-mono)" }}
              >
                {p.num}
              </div>

              {/* Title */}
              <h3
                className="text-[#E8E8E8] text-[22px] leading-tight mb-4"
                style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
              >
                {p.title}
              </h3>

              {/* Body */}
              <p
                className="text-[#E8E8E8]/70 text-[13px] leading-[1.8] mb-8"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {p.body}
              </p>

              {/* Card CTA */}
              <div className="border-t border-[#222222] pt-6">
                <span
                  className="text-[#00D4FF] text-xs tracking-widest transition-opacity group-hover:opacity-70"
                  style={{ fontFamily: "var(--font-share-tech-mono)" }}
                >
                  EXPLORE ↗
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA({ onContactOpen }: { onContactOpen: () => void }) {
  return (
    <section className="px-6 py-[160px]">
      <div className="mx-auto max-w-5xl">
        <h2
          className="text-[clamp(36px,5.5vw,64px)] leading-[1.1] tracking-tight text-[#E8E8E8] mb-12"
          style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
        >
          Ready to build inside
          <br />
          the new internet?
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Primary CTA */}
          <button
            onClick={onContactOpen}
            className="inline-block bg-[#00FF85] text-[#0A0A0A] px-8 py-4 text-sm tracking-widest transition-opacity hover:opacity-80"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            CONTACT US ↗
          </button>

          {/* Secondary CTA */}
          <a
            href="/thesis"
            className="inline-block border border-[#00D4FF] text-[#00D4FF] px-8 py-4 text-sm tracking-widest transition-opacity hover:opacity-70"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            READ THE THESIS ↗
          </a>
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
        {/* Left: wordmark + copyright */}
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
            © 2026 3vo.ai
          </p>
        </div>

        {/* Right: social icons (no links yet) */}
        <div className="flex items-center gap-4">
          {["X", "GH", "TG"].map((label) => (
            <span
              key={label}
              className="text-[#E8E8E8]/40 text-xs tracking-widest"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              {label}
            </span>
          ))}
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
      <SignalBar />
      <Thesis />
      <Pillars />
      <FinalCTA onContactOpen={() => setContactOpen(true)} />
      <Footer />
    </main>
  );
}
