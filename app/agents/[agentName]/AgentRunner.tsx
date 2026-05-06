"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { SerializableAgentConfig } from "@/app/lib/prompts";
import { isGated, isUpgraded, incrementRuns, runsRemaining, FREE_RUNS } from "@/app/lib/gate";
import { track, trackAgentView, trackGateShown } from "@/app/lib/track";
import GateEmailCapture from "./GateEmailCapture";

const FALLBACK_STRIPE_LINK = process.env.NEXT_PUBLIC_STRIPE_LINK ?? "#upgrade";

type Step = { step: number; label: string };
type RunStatus = "idle" | "running" | "done" | "error";

interface Props {
  agent: SerializableAgentConfig;
}

async function startCheckout(agentName: string): Promise<void> {
  track("upgrade_click", { agent: agentName, source: "checkout_init" });
  try {
    const res = await fetch("/api/checkout", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    }
  } catch {
    // fall through to link
  }
  // Fallback: direct Stripe Payment Link
  window.location.href = FALLBACK_STRIPE_LINK;
}

export default function AgentRunner({ agent }: Props) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<RunStatus>("idle");
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [output, setOutput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [gated, setGated] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const [remaining, setRemaining] = useState(FREE_RUNS);
  const [checkingOut, setCheckingOut] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const up = isUpgraded();
    setUpgraded(up);
    const gatedNow = !up && isGated();
    setGated(gatedNow);
    const rem = runsRemaining();
    setRemaining(rem === Infinity ? FREE_RUNS : rem);
    // Funnel: track page view and gate state on mount
    trackAgentView(agent.name);
    if (gatedNow) trackGateShown(agent.name, "run_limit");
  }, [agent.name]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleChange = (name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpgrade = useCallback(async () => {
    setCheckingOut(true);
    await startCheckout(agent.name);
    setCheckingOut(false);
  }, [agent.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!upgraded && isGated()) {
      setGated(true);
      trackGateShown(agent.name, "submit_blocked");
      return;
    }

    setStatus("running");
    setOutput("");
    setCurrentStep(null);
    setErrorMsg("");
    setFeedback(null);

    track("agent_run_start", { agent: agent.name });

    try {
      const res = await fetch(`/api/agents/${agent.name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? "Request failed");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let eventType = "";
        let dataLine = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            dataLine = line.slice(6).trim();
          } else if (line === "" && eventType && dataLine) {
            try {
              const payload = JSON.parse(dataLine);
              if (eventType === "step") {
                setCurrentStep(payload as Step);
              } else if (eventType === "token") {
                setOutput((prev) => prev + payload.text);
              } else if (eventType === "done") {
                if (!isUpgraded()) {
                  const runs = incrementRuns();
                  const rem = Math.max(0, FREE_RUNS - runs);
                  setRemaining(rem);
                  setGated(runs >= FREE_RUNS);
                }
                setStatus("done");
                setCurrentStep(null);
                track("agent_run_complete", { agent: agent.name });
              } else if (eventType === "error") {
                throw new Error(payload.error ?? "Agent error");
              }
            } catch {
              // malformed SSE line — skip
            }
            eventType = "";
            dataLine = "";
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
      setStatus("error");
      track("agent_run_error", { agent: agent.name, error: msg });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard denied
    }
    track("agent_output_copy", { agent: agent.name });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${agent.name}-output.txt`;
    a.click();
    URL.revokeObjectURL(url);
    track("agent_output_download", { agent: agent.name });
  };

  const handleFeedback = (rating: "up" | "down") => {
    if (feedback) return;
    setFeedback(rating);
    track("agent_output_feedback", { agent: agent.name, rating });
  };

  const isRunning = status === "running";
  const showLastRunNudge = status === "done" && !upgraded && remaining === 0;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8] px-4 sm:px-6 py-12 sm:py-16 max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/agents"
        className="text-[#E8E8E8]/40 text-xs tracking-widest hover:text-[#E8E8E8]/70 transition-colors mb-10 block"
        style={{ fontFamily: "var(--font-share-tech-mono)" }}
      >
        ← ALL AGENTS
      </Link>

      {/* Header */}
      <div className="mb-10">
        <p
          className="text-[#00FF85] text-xs tracking-[0.25em] mb-3"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          {upgraded ? "AGENT — UNLIMITED" : "AGENT"}
        </p>
        <h1
          className="text-3xl sm:text-4xl font-black mb-3"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {agent.title}
        </h1>
        <p
          className="text-[#E8E8E8]/50 text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {agent.description}
        </p>
      </div>

      {/* Gate banner */}
      {gated && (
        <div className="border border-[#FF4444]/40 bg-[#FF4444]/5 p-5 sm:p-6 mb-8">
          <p
            className="text-[#FF4444] text-xs tracking-widest mb-3"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            FREE RUNS USED
          </p>
          <p
            className="text-[#E8E8E8]/70 text-sm mb-5 leading-relaxed"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            You&apos;ve used your {FREE_RUNS} free runs. Upgrade for unlimited access to all 5 agents — $19/mo.
          </p>
          <button
            onClick={handleUpgrade}
            disabled={checkingOut}
            className="w-full sm:w-auto bg-[#00FF85] text-[#0A0A0A] text-xs font-bold tracking-widest px-6 py-3 hover:bg-[#00FF85]/80 transition-colors disabled:opacity-60 disabled:cursor-wait"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            {checkingOut ? "REDIRECTING…" : "UPGRADE FOR $19/MO →"}
          </button>
          <GateEmailCapture agentName={agent.name} />
        </div>
      )}

      {/* Runs remaining */}
      {!gated && !upgraded && status === "idle" && (
        <div
          className="text-[#E8E8E8]/30 text-xs tracking-widest mb-8"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          {remaining} FREE RUN{remaining !== 1 ? "S" : ""} REMAINING
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-y-5 mb-10">
        {agent.fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-xs tracking-widest text-[#E8E8E8]/60 mb-2"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              {field.label.toUpperCase()}
              {!field.required && (
                <span className="ml-2 text-[#E8E8E8]/30">OPTIONAL</span>
              )}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                value={inputs[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                disabled={isRunning || gated}
                rows={3}
                className="w-full bg-[#111111] border border-[#222222] text-[#E8E8E8] text-sm px-4 py-3 placeholder:text-[#E8E8E8]/20 focus:outline-none focus:border-[#00FF85]/50 disabled:opacity-40 resize-none rounded-none"
                style={{ fontFamily: "var(--font-space-mono)" }}
              />
            ) : (
              <input
                id={field.name}
                type="text"
                value={inputs[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                disabled={isRunning || gated}
                className="w-full bg-[#111111] border border-[#222222] text-[#E8E8E8] text-sm px-4 py-3 placeholder:text-[#E8E8E8]/20 focus:outline-none focus:border-[#00FF85]/50 disabled:opacity-40 rounded-none"
                style={{ fontFamily: "var(--font-space-mono)" }}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isRunning || gated}
          className="w-full bg-[#00FF85] text-[#0A0A0A] text-xs font-bold tracking-widest py-4 hover:bg-[#00FF85]/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          {isRunning ? (
            "RUNNING…"
          ) : (
            <>
              <span className="sm:hidden">RUN AGENT →</span>
              <span className="hidden sm:inline">RUN {agent.title.toUpperCase()} AGENT →</span>
            </>
          )}
        </button>
      </form>

      {/* Step indicator */}
      {isRunning && currentStep && (
        <div
          className="text-[#00FF85] text-xs tracking-widest mb-4 animate-pulse"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          STEP {currentStep.step}/3 — {currentStep.label.toUpperCase()}
        </div>
      )}

      {/* Output */}
      {(output || isRunning) && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <p
              className="text-xs tracking-widest text-[#E8E8E8]/40"
              style={{ fontFamily: "var(--font-share-tech-mono)" }}
            >
              OUTPUT
            </p>
            {output && status === "done" && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs tracking-widest text-[#E8E8E8]/40 hover:text-[#00FF85] transition-colors px-2 py-1.5 -mx-2 -my-1.5"
                  style={{ fontFamily: "var(--font-share-tech-mono)" }}
                >
                  {copied ? "COPIED ✓" : "COPY"}
                </button>
                <button
                  onClick={handleDownload}
                  className="text-xs tracking-widest text-[#E8E8E8]/40 hover:text-[#00FF85] transition-colors px-2 py-1.5 -my-1.5"
                  style={{ fontFamily: "var(--font-share-tech-mono)" }}
                >
                  DOWNLOAD .TXT
                </button>
              </div>
            )}
          </div>

          <div
            ref={outputRef}
            className="bg-[#111111] border border-[#222222] p-4 sm:p-6 text-sm leading-relaxed text-[#E8E8E8]/80 max-h-[45vh] sm:max-h-[60vh] overflow-y-auto whitespace-pre-wrap"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {output}
            {isRunning && <span className="animate-pulse text-[#00FF85]">▌</span>}
          </div>

          {/* Post-run quality feedback */}
          {status === "done" && output && (
            <div className="flex items-center gap-4 mt-3">
              <span
                className="text-[#E8E8E8]/20 text-xs tracking-widest"
                style={{ fontFamily: "var(--font-share-tech-mono)" }}
              >
                {feedback ? (feedback === "up" ? "THANKS ✓" : "NOTED.") : "USEFUL?"}
              </span>
              {!feedback && (
                <>
                  <button
                    onClick={() => handleFeedback("up")}
                    className="text-[#E8E8E8]/30 hover:text-[#00FF85] transition-colors px-1 py-1 text-base leading-none"
                    aria-label="Output was useful"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleFeedback("down")}
                    className="text-[#E8E8E8]/30 hover:text-[#FF4444] transition-colors px-1 py-1 text-base leading-none"
                    aria-label="Output was not useful"
                  >
                    ↓
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {status === "error" && errorMsg && (
        <div
          className="mt-4 border border-[#FF4444]/30 bg-[#FF4444]/5 p-4 text-xs text-[#FF4444] tracking-wide leading-relaxed"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          ERROR: {errorMsg}
        </div>
      )}

      {/* Post-run upgrade nudge (last free run) */}
      {showLastRunNudge && (
        <div className="mt-8 border border-[#00FF85]/20 bg-[#00FF85]/3 p-5 sm:p-6">
          <p
            className="text-[#E8E8E8]/70 text-sm mb-4 leading-relaxed"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            That was your last free run. Upgrade to keep using all 5 agents, unlimited.
          </p>
          <button
            onClick={handleUpgrade}
            disabled={checkingOut}
            className="w-full sm:w-auto bg-[#00FF85] text-[#0A0A0A] text-xs font-bold tracking-widest px-6 py-3 hover:bg-[#00FF85]/80 transition-colors disabled:opacity-60 disabled:cursor-wait"
            style={{ fontFamily: "var(--font-share-tech-mono)" }}
          >
            {checkingOut ? "REDIRECTING…" : "UPGRADE FOR $19/MO →"}
          </button>
        </div>
      )}
    </main>
  );
}
