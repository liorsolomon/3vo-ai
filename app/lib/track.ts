declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// Map our internal events to Meta Pixel standard events
const META_EVENT_MAP: Record<string, string> = {
  email_signup: "Lead",
  agent_run_start: "InitiateCheckout",
  upgrade_click: "AddToCart",
  upgrade_success: "Purchase",
};

export function track(eventName: string, params?: Record<string, string>) {
  if (typeof window === "undefined") return;
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }
  if (window.fbq) {
    const metaEvent = META_EVENT_MAP[eventName] ?? "SubmitApplication";
    window.fbq("track", metaEvent, params);
  }
}

// Funnel event helpers — call these at key conversion points
export function trackAgentView(agentName: string) {
  track("agent_page_view", { agent: agentName });
}

export function trackGateShown(agentName: string, source: "run_limit" | "submit_blocked") {
  track("gate_shown", { agent: agentName, source });
}

