import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";

  if (!firstName || !description) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);
    const to = process.env.CONTACT_EMAIL ?? "liorsolomon@gmail.com";
    try {
      await resend.emails.send({
        from: "3vo.ai <noreply@3vo.ai>",
        to: [to],
        subject: `[Contact] Message from ${firstName} ${lastName}`.trim(),
        html: `
          <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(description)}</p>
        `,
      });
    } catch (err) {
      console.error("[contact] send error:", err);
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
