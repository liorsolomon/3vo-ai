"use client";

import { useState } from "react";

const catalog = [
  { number: "001", name: "Notion Template OS",           category: "Productivity", status: "LIVE", href: "https://templates.3vo.ai" },
  { number: "002", name: "AI Prompt Packs",               category: "AI Tools",     status: "LIVE", href: "https://prompts.3vo.ai" },
  { number: "003", name: "Automation Workflow Templates", category: "Automation",   status: "LIVE", href: "https://tools.3vo.ai" },
  { number: "004", name: "Niche Reports",                 category: "Research",     status: "LIVE", href: "https://validate.3vo.ai" },
  { number: "005", name: "VC Match Kit",                  category: "Fundraising",  status: "LIVE", href: "https://vc.3vo.ai" },
  { number: "006", name: "Agent Starter Kits",            category: "AI Tools",     status: "SOON", href: "#" },
];

const STATUS_STYLES: Record<string, string> = {
  LIVE:     "text-[#00FF85]",
  BUILDING: "text-[#FFD700]",
  SOON:     "text-[rgba(232,232,232,0.3)]",
};

export default function ProductCatalog() {
  const [query, setQuery] = useState("");

  const filtered = catalog.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="px-6 py-20 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div
          className="text-[11px] tracking-[3px] mb-6 flex items-center gap-3"
          style={{ fontFamily: "var(--font-share-tech-mono)", color: "rgba(232,232,232,0.4)" }}
        >
          FULL CATALOG
          <span className="text-[rgba(232,232,232,0.15)]">[searchable]</span>
        </div>

        {/* Build count */}
        <p
          className="text-[12px] mb-4 italic"
          style={{ fontFamily: "var(--font-space-mono)", color: "rgba(232,232,232,0.25)" }}
        >
          {`// building at machine speed — ${catalog.length} products and counting`}
        </p>

        {/* Search input */}
        <div className="mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="> search products_"
            className="w-full md:max-w-[360px] bg-[#111111] border border-[rgba(255,255,255,0.08)] text-[#E8E8E8] text-sm px-4 py-3 outline-none transition-colors placeholder:text-[rgba(232,232,232,0.25)] focus:border-[rgba(0,255,133,0.3)]"
            style={{ fontFamily: "var(--font-space-mono)", borderRadius: 0 }}
          />
        </div>

        {/* Product rows */}
        <div className="border border-[#1e1e1e]">
          {filtered.length === 0 ? (
            <div
              className="px-6 py-6 text-sm"
              style={{ fontFamily: "var(--font-space-mono)", color: "rgba(232,232,232,0.3)" }}
            >
              &gt; no results found_
            </div>
          ) : (
            filtered.map((p) => {
              const isLink = p.status === "LIVE";
              const RowEl = isLink ? "a" : "div";
              const linkProps = isLink
                ? { href: p.href, target: "_blank", rel: "noopener noreferrer" }
                : {};

              return (
                <RowEl
                  key={p.number}
                  {...(linkProps as Record<string, string>)}
                  className={`flex items-center gap-4 px-6 py-4 border-b border-[rgba(255,255,255,0.04)] last:border-b-0 transition-colors hover:bg-[rgba(255,255,255,0.02)] no-underline ${
                    !isLink ? "cursor-default" : ""
                  }`}
                >
                  {/* Number */}
                  <span
                    className="text-[#00FF85] text-[13px] shrink-0 w-8"
                    style={{ fontFamily: "var(--font-share-tech-mono)" }}
                  >
                    {p.number}
                  </span>

                  {/* Name */}
                  <span
                    className="text-[#E8E8E8] text-[14px] font-semibold flex-1 min-w-0"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {p.name}
                  </span>

                  {/* Category pill */}
                  <span
                    className="hidden sm:inline-block shrink-0 px-2 py-0.5 text-[11px]"
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.3)",
                      borderRadius: 0,
                    }}
                  >
                    {p.category}
                  </span>

                  {/* Status badge */}
                  <span
                    className={`text-[11px] tracking-widest shrink-0 w-16 text-right ${STATUS_STYLES[p.status]}`}
                    style={{ fontFamily: "var(--font-share-tech-mono)" }}
                  >
                    {p.status}
                  </span>

                  {/* Arrow link */}
                  <span
                    className={`text-sm shrink-0 w-4 text-right ${isLink ? "text-[#00D4FF]" : "text-transparent"}`}
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    →
                  </span>
                </RowEl>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
