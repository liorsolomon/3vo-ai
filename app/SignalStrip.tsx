"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);

  return count;
}

export default function SignalStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const count = useCountUp(6, 600, triggered);
  const display = String(count).padStart(3, "0");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  return (
    <div
      ref={sectionRef}
      className="w-full"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        paddingTop: "48px",
        paddingBottom: "48px",
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div
              style={{
                fontFamily: "var(--font-share-tech-mono)",
                fontSize: "11px",
                color: "rgba(232,232,232,0.4)",
                letterSpacing: "3px",
                marginBottom: "8px",
              }}
            >
              THINGS SHIPPED
            </div>
            <div
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: "80px",
                color: "#00FF85",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {display}
            </div>
          </div>

          <div className="relative">
            <a
              href="/thesis"
              className="hover:underline"
              style={{
                fontFamily: "var(--font-share-tech-mono)",
                fontSize: "14px",
                color: "#00D4FF",
              }}
            >
              Read our thesis →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
