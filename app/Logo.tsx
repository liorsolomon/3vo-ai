/**
 * 3vo.ai wordmark logo component.
 *
 * Mark: three horizontal bars forming an abstract geometric "3", in indigo.
 * Text: "3vo" in white (or dark) + ".ai" in indigo, using the site's Geist font.
 *
 * Usage on dark backgrounds:  <Logo />
 * Usage on light backgrounds: <Logo dark />
 */

interface LogoProps {
  /** Render the wordmark text in dark color for light backgrounds. Default: white. */
  dark?: boolean;
  className?: string;
}

export default function Logo({ dark = false, className = "" }: LogoProps) {
  const textColor = dark ? "text-[#0a0a0a]" : "text-white";

  return (
    <span
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      aria-label="3vo.ai"
    >
      {/* ── Icon mark ── */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 24"
        width="16"
        height="20"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* Top bar — full width */}
        <rect x="0" y="0.5" width="20" height="4" rx="2" fill="#6366f1" />
        {/* Middle bar — offset right to form the "3" belly */}
        <rect x="5" y="10" width="15" height="4" rx="2" fill="#6366f1" />
        {/* Bottom bar — full width */}
        <rect x="0" y="19.5" width="20" height="4" rx="2" fill="#6366f1" />
      </svg>

      {/* ── Wordmark ── */}
      <span className={`text-[1.125rem] font-bold tracking-tight leading-none ${textColor}`}>
        3vo
        <span className="text-indigo-500">.ai</span>
      </span>
    </span>
  );
}
