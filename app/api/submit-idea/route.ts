import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const CEO_AGENT_ID = "c88aa159-fe00-4ee4-bd72-3d77d0a53136";
// "Validate first passive income hypothesis with real P&L data"
const IDEA_GOAL_ID = "098009cc-311e-4061-8488-563e5013d676";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const idea = typeof body?.idea === "string" ? body.idea.trim() : "";
  const turnstileToken = typeof body?.turnstileToken === "string" ? body.turnstileToken : "";

  if (!name || !email || !idea || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  // Verify Turnstile token when secret is configured
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    if (!turnstileToken) {
      return NextResponse.json({ error: "Verification required" }, { status: 400 });
    }
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken }),
      }
    );
    const verifyData = await verifyRes.json() as { success: boolean };
    if (!verifyData.success) {
      return NextResponse.json({ error: "Verification failed" }, { status: 403 });
    }
  } else {
    console.warn("[submit-idea] TURNSTILE_SECRET_KEY not configured — skipping CAPTCHA check");
  }

  const paperclipApiKey = process.env.PAPERCLIP_API_KEY;
  const paperclipApiUrl = process.env.PAPERCLIP_API_URL;
  const paperclipCompanyId = process.env.PAPERCLIP_COMPANY_ID;

  if (paperclipApiKey && paperclipApiUrl && paperclipCompanyId) {
    try {
      await fetch(`${paperclipApiUrl}/api/companies/${paperclipCompanyId}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${paperclipApiKey}`,
        },
        body: JSON.stringify({
          title: `Idea from ${name}: ${idea.slice(0, 80)}${idea.length > 80 ? "…" : ""}`,
          description: `## Submitted via 3vo.ai\n\n**From:** ${name} (${email})\n\n**Idea:**\n\n${idea}`,
          assigneeAgentId: CEO_AGENT_ID,
          goalId: IDEA_GOAL_ID,
          status: "todo",
          priority: "medium",
        }),
      });
    } catch (err) {
      console.error("[submit-idea] paperclip issue create error:", err);
    }
  } else {
    console.warn("[submit-idea] Paperclip env vars not configured — skipping issue creation");
  }

  // CC the board via email
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);
    const boardEmail = process.env.IDEA_CC_EMAIL ?? "liorsolomon@gmail.com";
    try {
      await resend.emails.send({
        from: "3vo.ai <noreply@3vo.ai>",
        to: [boardEmail],
        replyTo: email,
        subject: `[CC] New idea from ${name}`,
        html: `
          <p><em>This is a CC. The CEO agent has been assigned to review this idea.</em></p>
          <hr/>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Idea:</strong></p>
          <p>${escapeHtml(idea)}</p>
        `,
      });
    } catch (err) {
      console.error("[submit-idea] board CC email error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
