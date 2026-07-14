import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  org: "3voai",
  project: "javascript-nextjs",
  // Suppress noisy output during local dev; CI still prints
  silent: !process.env.CI,
  // Upload wider source map set for better stack traces
  widenClientFileUpload: true,
  // Route Sentry requests through /monitoring to avoid ad-blocker drops
  tunnelRoute: "/monitoring",
  webpack: {
    // Tree-shake Sentry logger in production (was: disableLogger)
    treeshake: { removeDebugLogging: true },
    // Automatically wire Vercel Cron Monitors (was: automaticVercelMonitors)
    automaticVercelMonitors: true,
  },
});
