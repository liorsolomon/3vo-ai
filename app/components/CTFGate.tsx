"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "../lib/track";

const BOOT_LINES = [
  "3VO SYSTEMS v2.4.1 — INITIALIZING...",
  "SCANNING NETWORK NODES............. OK",
  "ENCRYPTED TRANSMISSION DETECTED",
  "DECRYPTION KEY REQUIRED TO PROCEED",
];

export default function CTFGate() {
  const [bootStep, setBootStep] = useState(0);
  const [email, setEmail] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [source, setSource] = useState("direct");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const puzzle = process.env.NEXT_PUBLIC_CTF_PUZZLE ?? "";
  const hint = process.env.NEXT_PUBLIC_CTF_HINT ?? "decode the transmission";

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const ref = params.get("ref") ?? (typeof document !== "undefined" ? document.referrer || "direct" : "direct");
    setSource(ref);
  }, []);

  useEffect(() => {
    if (bootStep >= BOOT_LINES.length) return;
    const t = setTimeout(() => setBootStep((s) => s + 1), 600 + bootStep * 200);
    return () => clearTimeout(t);
  }, [bootStep]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !passphrase) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passphrase, source }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.wrong) {
          track("ctf_wrong_passphrase", { source });
          setErrorMsg("ACCESS DENIED — incorrect passphrase. Try again.");
          setStatus("idle");
        } else {
          setErrorMsg("SYSTEM ERROR — please retry.");
          setStatus("idle");
        }
        return;
      }
      track("ctf_solved", { source });
      setStatus("success");
    } catch {
      setErrorMsg("CONNECTION FAILED — please retry.");
      setStatus("idle");
    }
  }

  async function handleSkip() {
    track("ctf_skipped", { source });
    if (email) {
      try {
        await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source }),
        });
      } catch {
        // best-effort
      }
    }
    window.location.href = "/?joined=1";
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0A0A0A" }}>
        <div className="w-full max-w-lg font-mono text-sm" style={{ color: "#00FF85" }}>
          <div className="border border-current p-6 space-y-3">
            <p className="text-base font-bold">ACCESS GRANTED</p>
            <p>You cracked it. Early access confirmed.</p>
            <p className="text-xs opacity-60">Check your inbox — onboarding sequence initiated.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0A0A0A" }}>
      <div className="w-full max-w-lg font-mono text-sm" style={{ color: "#00FF85" }}>
        {/* Window chrome */}
        <div
          className="flex items-center gap-2 px-4 py-2 border border-b-0 border-current"
          style={{ borderColor: "#00FF85" }}
        >
          <span className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-70" />
          <span className="w-3 h-3 rounded-full opacity-70" style={{ background: "#00FF85" }} />
          <span className="ml-3 text-xs opacity-50 uppercase tracking-widest">
            3VO SYSTEMS — ACCESS TERMINAL
          </span>
        </div>

        {/* Terminal body */}
        <div
          className="border border-current p-6 space-y-4"
          style={{ borderColor: "#00FF85" }}
        >
          {/* Boot sequence */}
          <div className="space-y-1 text-xs opacity-70">
            {BOOT_LINES.slice(0, bootStep).map((line, i) => (
              <p key={i}>&gt; {line}</p>
            ))}
          </div>

          {bootStep >= BOOT_LINES.length && (
            <>
              {/* Puzzle */}
              <div className="border border-current p-3 space-y-2" style={{ borderColor: "#00FF85" }}>
                <p className="text-xs opacity-50 uppercase tracking-widest">ENCRYPTED TRANSMISSION</p>
                <p className="break-all opacity-90">{puzzle}</p>
                <p className="text-xs opacity-50">HINT: {hint}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs opacity-50 mb-1 uppercase tracking-widest">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-transparent border border-current px-3 py-2 text-sm outline-none placeholder:opacity-30 focus:opacity-100"
                    style={{ borderColor: "#00FF85", color: "#00FF85" }}
                  />
                </div>
                <div>
                  <label className="block text-xs opacity-50 mb-1 uppercase tracking-widest">
                    PASSPHRASE
                  </label>
                  <input
                    type="text"
                    required
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="enter decoded passphrase"
                    className="w-full bg-transparent border border-current px-3 py-2 text-sm outline-none placeholder:opacity-30"
                    style={{ borderColor: "#00FF85", color: "#00FF85" }}
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs" style={{ color: "#FF4444" }}>
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-2 text-sm font-bold uppercase tracking-widest border border-current transition-opacity disabled:opacity-40"
                  style={{ borderColor: "#00FF85", color: "#00FF85" }}
                >
                  {status === "loading" ? "VERIFYING..." : "CRACK ACCESS →"}
                </button>
              </form>

              <p className="text-center text-xs opacity-40">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="underline hover:opacity-70 transition-opacity"
                >
                  skip puzzle — join regular waitlist
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
