import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const idea = typeof body?.idea === "string" ? body.idea.trim() : "";

  if (!name || !email || !idea || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("[submit-idea] RESEND_API_KEY not configured");
    return NextResponse.json({ ok: true, skipped: true });
  }

  const resend = new Resend(resendKey);
  const to = process.env.IDEA_INBOX_EMAIL ?? "liorsolomon@gmail.com";

  try {
    await resend.emails.send({
      from: "3vo.ai <noreply@3vo.ai>",
      to: [to],
      replyTo: email,
      subject: `New idea from ${name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Idea:</strong></p>
        <p>${escapeHtml(idea)}</p>
      `,
    });
  } catch (err) {
    console.error("[submit-idea] send error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
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
