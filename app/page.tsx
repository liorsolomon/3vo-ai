"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Nav */}
      <nav
        className={`sticky top-0 z-50 px-6 py-4 transition-all ${
          scrolled
            ? "border-b border-gray-800/60 backdrop-blur-md bg-[#0a0a0a]/80"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <a
              href="https://templates.3vo.ai"
              className="hidden text-sm text-gray-400 hover:text-white transition sm:block"
            >
              Templates
            </a>
            <a
              href="https://prompts.3vo.ai"
              className="hidden text-sm text-gray-400 hover:text-white transition sm:block"
            >
              Prompts
            </a>
            <a
              href="https://tools.3vo.ai"
              className="hidden text-sm text-gray-400 hover:text-white transition sm:block"
            >
              Tools
            </a>
            <a
              href="mailto:hello@3vo.ai"
              className="rounded-lg border border-gray-700 px-4 py-1.5 text-sm font-medium text-white hover:border-gray-500 transition"
            >
              Work with us
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-32 pb-28 text-center">
        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-5xl">
          <h1 className="text-4xl font-black tracking-tight leading-tight sm:text-6xl lg:text-8xl">
            The AI studio<br />
            <span className="text-indigo-500">that ships.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-400 sm:text-xl max-w-2xl mx-auto leading-relaxed">
            3vo is an AI-native product studio. We use teams of specialized AI agents to design,
            build, and launch digital products — at a speed and cost no traditional agency can match.
          </p>
          <div className="mt-10 flex flex-col w-full items-center gap-4 sm:flex-row sm:w-auto sm:justify-center">
            <a
              href="https://templates.3vo.ai"
              className="w-full sm:w-auto rounded-lg bg-indigo-500 px-8 py-3.5 font-semibold text-white transition hover:bg-indigo-400"
            >
              See what we&apos;ve built
            </a>
            <a
              href="mailto:hello@3vo.ai"
              className="w-full sm:w-auto rounded-lg border border-gray-700 px-8 py-3.5 font-semibold text-white transition hover:border-gray-500"
            >
              Work with us
            </a>
          </div>
        </div>
      </section>

      {/* Brand paragraph */}
      <section className="border-y border-gray-800 bg-gray-900 px-6 py-12 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="text-lg text-gray-400 leading-relaxed">
            3vo is an AI-native product studio. We build real digital products — templates, tools, and automations —
            using teams of specialized AI agents. No agency overhead. No bloated timelines.
            Products that ship in days and generate revenue from day one.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Our products</h2>
          <p className="mt-4 text-center text-gray-400">
            Real products. Live and generating traction.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                domain: "templates.3vo.ai",
                href: "https://templates.3vo.ai",
                tag: "Notion Template OS",
                oneliner: "Your entire workflow, pre-built in Notion.",
                descriptor:
                  "Plug-and-play Notion templates for founders, freelancers, and operators. Every system you need to run a business — without building it from scratch.",
              },
              {
                domain: "prompts.3vo.ai",
                href: "https://prompts.3vo.ai",
                tag: "AI Prompt Packs",
                oneliner: "Prompts that actually work.",
                descriptor:
                  "Battle-tested prompt packs for writers, marketers, and builders. Skip the trial and error — get the output you need on the first try.",
              },
              {
                domain: "tools.3vo.ai",
                href: "https://tools.3vo.ai",
                tag: "Automation Workflows",
                oneliner: "Automate the work you hate.",
                descriptor:
                  "Pre-built automation workflows for the tools you already use. Connect your stack, eliminate manual work, and reclaim your time.",
              },
            ].map((product) => (
              <a
                key={product.domain}
                href={product.href}
                className="group rounded-xl border border-gray-800 bg-gray-900 p-6 transition hover:border-gray-600"
              >
                <div className="mb-4 inline-block rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400">
                  {product.tag}
                </div>
                <h3 className="text-lg font-bold">{product.oneliner}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{product.descriptor}</p>
                <div className="mt-4 text-sm font-medium text-indigo-400 transition group-hover:text-indigo-300">
                  {product.domain} →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-900 px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3 text-left">
            {[
              {
                step: "01",
                title: "You bring the idea.",
                desc: "Share what you want to build. No deck required, no brief needed. A conversation is enough.",
              },
              {
                step: "02",
                title: "Our agents ship it.",
                desc: "Specialized AI agents handle design, development, and copy in parallel — at machine speed.",
              },
              {
                step: "03",
                title: "You start generating revenue.",
                desc: "Real products, live and generating traction. Not prototypes. Not mockups. The real thing.",
              },
            ].map((s) => (
              <div key={s.step} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="text-4xl font-extrabold text-indigo-500">{s.step}</div>
                <h3 className="mt-3 font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-3 text-sm text-gray-500 items-center">
            <span>Idea</span>
            <span className="text-indigo-500">→</span>
            <span>Agents ship</span>
            <span className="text-indigo-500">→</span>
            <span>Revenue</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold sm:text-5xl leading-tight">
            Built by agents.<br />
            <span className="text-indigo-500">Shipped for founders.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-400 leading-relaxed">
            Explore what 3vo has built — or tell us what you need built next.
          </p>
          <div className="mt-8 flex flex-col w-full items-center gap-4 sm:flex-row sm:w-auto sm:justify-center">
            <a
              href="https://templates.3vo.ai"
              className="w-full sm:w-auto rounded-lg bg-indigo-500 px-8 py-3.5 font-semibold text-white transition hover:bg-indigo-400"
            >
              See what we&apos;ve built
            </a>
            <a
              href="mailto:hello@3vo.ai"
              className="w-full sm:w-auto rounded-lg border border-gray-700 px-8 py-3.5 font-semibold text-white transition hover:border-gray-500"
            >
              Work with us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-sm text-gray-500">
        <p>Built by agents. Shipped for founders.</p>
        <p className="mt-1">© 2026 3vo.ai. All rights reserved.</p>
      </footer>
    </main>
  );
}
