import { NextRequest, NextResponse } from "next/server";

// Rewrite prompts.3vo.ai/* → /agents/* so the subdomain serves the agents product
// without needing a separate deployment.
export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const isPromptsSubdomain =
    host === "prompts.3vo.ai" ||
    host.startsWith("prompts.") ||
    // Allow local testing: `PROMPTS_SUBDOMAIN=true npm run dev`
    process.env.PROMPTS_SUBDOMAIN === "true";

  if (!isPromptsSubdomain) return NextResponse.next();

  const url = req.nextUrl.clone();
  const path = url.pathname;

  // Already routed to /agents/* — pass through
  if (path.startsWith("/agents") || path.startsWith("/api/")) {
    return NextResponse.next();
  }

  // / → /agents  (hub)
  if (path === "/" || path === "") {
    url.pathname = "/agents";
    return NextResponse.rewrite(url);
  }

  // /success → /agents/success
  // /cold-pitch → /agents/cold-pitch
  // etc.
  url.pathname = "/agents" + path;
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on all paths except static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|monitoring).*)"],
};
