import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "3vo.ai — New way to internet.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Green accent bar */}
        <div
          style={{
            width: "48px",
            height: "4px",
            background: "#00FF85",
            marginBottom: "32px",
          }}
        />

        {/* Logo / wordmark */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "800",
            color: "#E8E8E8",
            letterSpacing: "-2px",
            lineHeight: 1,
            marginBottom: "24px",
          }}
        >
          3vo.ai
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(232, 232, 232, 0.5)",
            fontWeight: "400",
            letterSpacing: "0px",
          }}
        >
          New way to internet.
        </div>

        {/* Bottom descriptor */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "rgba(232, 232, 232, 0.25)",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            AI-native product studio
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#00FF85",
              letterSpacing: "2px",
            }}
          >
            3vo.ai
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
