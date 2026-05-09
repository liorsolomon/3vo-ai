"use client";

import { useState } from "react";
import { track } from "@/app/lib/track";

interface Props {
  agentName: string;
}

type State = "idle" | "submitting" | "done" | "error";

export default function GateEmailCapture({ agentName }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;

    setState("submitting");
    track("gate_email_capture", { agent: agentName });

    try {
      const res = await fetch("/api/gate-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, agent: agentName }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <p
        className="text-[#00FF85]/70 text-xs tracking-widest mt-5"
        style={{ fontFamily: "var(--font-share-tech-mono)" }}
      >
        ✓ GOT IT. WE'LL REACH OUT.
      </p>
    );
  }

  return (
    <div className="mt-6 pt-5 border-t border-[#FF4444]/20">
      <p
        className="text-[#E8E8E8]/30 text-xs tracking-widest mb-3"
        style={{ fontFamily: "var(--font-share-tech-mono)" }}
      >
        NOT READY? GET NOTIFIED OF DEALS.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={state === "submitting"}
          className="flex-1 min-w-0 bg-[#0D0D0D] border border-[#2A2A2A] text-[#E8E8E8] text-xs px-3 py-2 placeholder:text-[#E8E8E8]/20 focus:outline-none focus:border-[#333] disabled:opacity-40"
          style={{ fontFamily: "var(--font-space-mono)" }}
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full sm:w-auto text-[#E8E8E8]/50 text-xs tracking-widest border border-[#333] px-4 py-2 hover:text-[#E8E8E8] hover:border-[#555] transition-colors disabled:opacity-40 whitespace-nowrap"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          {state === "submitting" ? "…" : "NOTIFY ME"}
        </button>
      </form>
      {state === "error" && (
        <p
          className="text-[#FF4444]/60 text-xs tracking-widest mt-2"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          FAILED. TRY AGAIN.
        </p>
      )}
    </div>
  );
}
