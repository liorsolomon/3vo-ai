import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { WelcomeEmail, getSubject as getWelcomeSubject } from "../../../emails/WelcomeEmail";
import { Email2, getSubject as getEmail2Subject } from "../../../emails/Email2";
import { Email3, getSubjectOptions } from "../../../emails/Email3";
import * as React from "react";

const AUDIENCE_ID = process.env.RESEND_AUDIENCE_GENERAL;
const FROM = "3vo.ai <noreply@3vo.ai>";

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || typeof body.email !== "string" || !body.email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = body as { email: string };
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.warn("[subscribe] RESEND_API_KEY not configured");
    return NextResponse.json({ ok: true, skipped: true });
  }

  const resend = new Resend(resendKey);

  if (AUDIENCE_ID) {
    try {
      await resend.contacts.create({ audienceId: AUDIENCE_ID, email, unsubscribed: false });
    } catch (err) {
      console.error("[subscribe] audience add error:", err);
    }
  }

  try {
    const html = await render(React.createElement(WelcomeEmail, { segment: "general" }));
    await resend.emails.send({ from: FROM, to: [email], subject: getWelcomeSubject("general"), html });
  } catch (err) {
    console.error("[subscribe] Email 1 error:", err);
  }

  try {
    const html = await render(React.createElement(Email2, { segment: "general" }));
    await resend.emails.send({
      from: FROM,
      to: [email],
      subject: getEmail2Subject("general"),
      html,
      scheduledAt: daysFromNow(3).toISOString(),
    });
  } catch (err) {
    console.error("[subscribe] Email 2 error:", err);
  }

  try {
    const html = await render(React.createElement(Email3, { segment: "general" }));
    await resend.emails.send({
      from: FROM,
      to: [email],
      subject: getSubjectOptions()[0],
      html,
      scheduledAt: daysFromNow(7).toISOString(),
    });
  } catch (err) {
    console.error("[subscribe] Email 3 error:", err);
  }

  return NextResponse.json({ ok: true });
}
