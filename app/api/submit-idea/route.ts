import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

  // Insert into Supabase ideas table
  // Use SUPABASE_URL (server-only) so URL changes don't require a rebuild
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ name, email, idea }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("[submit-idea] supabase insert error:", res.status, text);
      }
    } catch (err) {
      console.error("[submit-idea] supabase fetch error:", err);
    }
  } else {
    console.warn("[submit-idea] SUPABASE env vars not configured — skipping idea storage");
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
          <p><em>This is a CC. The idea has been stored in Supabase and queued for CEO review.</em></p>
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
