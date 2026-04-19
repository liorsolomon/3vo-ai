declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(eventName: string, params?: Record<string, string>) {
  if (typeof window === "undefined") return;
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }
  if (window.fbq) {
    window.fbq("track", eventName === "email_signup" ? "Lead" : "SubmitApplication", params);
  }
}
