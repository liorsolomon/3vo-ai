import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { WelcomeEmail, getSubject as getWelcomeSubject } from "../../../emails/WelcomeEmail";
import * as React from "react";

const FROM = "3vo.ai <noreply@3vo.ai>";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || typeof body.email !== "string" || !body.email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (typeof body.passphrase !== "string") {
    return NextResponse.json({ error: "Missing passphrase" }, { status: 400 });
  }

  const { email, passphrase } = body as {
    email: string;
    passphrase: string;
  };

  const expected = (process.env.CTF_PASSPHRASE ?? "").trim().toLowerCase();
  const provided = passphrase.trim().toLowerCase();
  const earlyAccess = expected.length > 0 && provided === expected;

  if (!earlyAccess) {
    return NextResponse.json({ wrong: true }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("[early-access] RESEND_API_KEY not configured");
    return NextResponse.json({ ok: true, earlyAccess: true, skipped: true });
  }

  const resend = new Resend(resendKey);
  const audienceId = process.env.RESEND_AUDIENCE_EARLY_ACCESS ?? process.env.RESEND_AUDIENCE_GENERAL;

  if (audienceId) {
    try {
      await resend.contacts.create({ audienceId, email, unsubscribed: false });
    } catch (err) {
      console.error("[early-access] audience add error:", err);
    }
  }

  try {
    const html = await render(React.createElement(WelcomeEmail, { segment: "general" }));
    await resend.emails.send({
      from: FROM,
      to: [email],
      subject: "You cracked it — early access confirmed",
      html,
    });
  } catch (err) {
    console.error("[early-access] email send error:", err);
  }

  return NextResponse.json({ ok: true, earlyAccess: true });
}
