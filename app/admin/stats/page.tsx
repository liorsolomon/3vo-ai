import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Stats — 3vo Admin", robots: "noindex" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ key?: string }>;
}

async function getData() {
  const url = process.env.SUPABASE_URL;
  // Service role key bypasses RLS — required for reading subscribers table.
  // Falls back to anon key but subscriber counts will show 0 without it.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const db = createClient(url, key);

  const [runsResult, subsResult, gateResult] = await Promise.all([
    // Total runs per agent
    db.from("agent_runs").select("agent_name"),
    // Active subscribers
    db.from("subscribers").select("email, status, subscribed_at").order("subscribed_at", { ascending: false }),
    // Gate email captures (contacts added to Resend audience — approximate via subscribers with no stripe_customer_id)
    db.from("subscribers").select("email").is("stripe_customer_id", null),
  ]);

  const runs: { agent_name: string }[] = runsResult.data ?? [];
  const subscribers: { email: string; status: string; subscribed_at: string }[] = subsResult.data ?? [];
  const active = subscribers.filter((s) => s.status === "active");

  const runsByAgent: Record<string, number> = {};
  for (const run of runs) {
    runsByAgent[run.agent_name] = (runsByAgent[run.agent_name] ?? 0) + 1;
  }

  return {
    totalRuns: runs.length,
    runsByAgent,
    activeSubscribers: active.length,
    totalSubscribers: subscribers.length,
    recentSubscribers: active.slice(0, 10),
    gateCaptures: (gateResult.data ?? []).length,
  };
}

export default async function StatsPage({ searchParams }: Props) {
  const { key } = await searchParams;
  const adminKey = process.env.ADMIN_STATS_KEY;

  if (!adminKey || key !== adminKey) {
    notFound();
  }

  const data = await getData();

  if (!data) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8] p-8 font-mono">
        <p className="text-[#FF4444]">Supabase not configured.</p>
      </main>
    );
  }

  const AGENT_NAMES = ["cold-pitch", "pricing-reframe", "linkedin-content", "proposal", "client-checkin"];

  return (
    <main
      className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8] p-6 sm:p-8 max-w-2xl mx-auto"
      style={{ fontFamily: "var(--font-space-mono)" }}
    >
      <p className="text-[#00FF85] text-xs tracking-[0.2em] mb-2" style={{ fontFamily: "var(--font-share-tech-mono)" }}>
        PROMPTS.3VO.AI — ADMIN STATS
      </p>
      <p className="text-[#E8E8E8]/30 text-xs mb-10" style={{ fontFamily: "var(--font-share-tech-mono)" }}>
        {new Date().toISOString().slice(0, 16).replace("T", " ")} UTC
      </p>

      {/* Revenue gate status */}
      <section className="mb-10">
        <h2 className="text-xs tracking-widest text-[#E8E8E8]/40 mb-4" style={{ fontFamily: "var(--font-share-tech-mono)" }}>
          REVENUE GATE (DAY 12 TARGET: ≥1 PAYING USER)
        </h2>
        <div className="text-5xl font-black mb-2" style={{ fontFamily: "var(--font-syne)" }}>
          <span className={data.activeSubscribers >= 1 ? "text-[#00FF85]" : "text-[#FF4444]"}>
            {data.activeSubscribers}
          </span>
        </div>
        <p className="text-[#E8E8E8]/50 text-sm">
          active paying subscriber{data.activeSubscribers !== 1 ? "s" : ""}
          {data.activeSubscribers >= 1
            ? " — GATE CLEARED ✓"
            : " — GATE NOT YET CLEARED"}
        </p>
      </section>

      {/* Funnel */}
      <section className="mb-10">
        <h2 className="text-xs tracking-widest text-[#E8E8E8]/40 mb-4" style={{ fontFamily: "var(--font-share-tech-mono)" }}>
          FUNNEL
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Runs", value: data.totalRuns },
            { label: "Gate Captures", value: data.gateCaptures, note: "email only, no payment" },
            { label: "Paid", value: data.activeSubscribers },
          ].map(({ label, value, note }) => (
            <div key={label} className="border border-[#222] p-4">
              <div className="text-2xl font-black mb-1" style={{ fontFamily: "var(--font-syne)" }}>
                {value}
              </div>
              <div className="text-[#E8E8E8]/40 text-xs">{label}</div>
              {note && <div className="text-[#E8E8E8]/20 text-xs mt-1">{note}</div>}
            </div>
          ))}
        </div>
        {data.totalRuns > 0 && data.activeSubscribers > 0 && (
          <p className="text-[#E8E8E8]/30 text-xs mt-3">
            Conversion: {((data.activeSubscribers / data.totalRuns) * 100).toFixed(1)}% run → paid
          </p>
        )}
      </section>

      {/* Runs by agent */}
      <section className="mb-10">
        <h2 className="text-xs tracking-widest text-[#E8E8E8]/40 mb-4" style={{ fontFamily: "var(--font-share-tech-mono)" }}>
          RUNS BY AGENT
        </h2>
        <div className="space-y-2">
          {AGENT_NAMES.map((name) => {
            const count = data.runsByAgent[name] ?? 0;
            const pct = data.totalRuns > 0 ? (count / data.totalRuns) * 100 : 0;
            return (
              <div key={name} className="flex items-center gap-4">
                <div className="w-36 text-xs text-[#E8E8E8]/50 shrink-0">{name}</div>
                <div className="flex-1 bg-[#111] h-2 relative">
                  <div className="h-2 bg-[#00FF85]/50" style={{ width: `${pct}%` }} />
                </div>
                <div className="w-8 text-xs text-right">{count}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent subscribers */}
      {data.recentSubscribers.length > 0 && (
        <section>
          <h2 className="text-xs tracking-widest text-[#E8E8E8]/40 mb-4" style={{ fontFamily: "var(--font-share-tech-mono)" }}>
            RECENT PAID SUBSCRIBERS
          </h2>
          <div className="space-y-2">
            {data.recentSubscribers.map((s) => (
              <div key={s.email} className="flex justify-between text-xs text-[#E8E8E8]/60">
                <span>{s.email}</span>
                <span className="text-[#E8E8E8]/30">{s.subscribed_at.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
