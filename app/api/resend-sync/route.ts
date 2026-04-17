import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { WelcomeEmail, getSubject as getWelcomeSubject } from "../../../emails/WelcomeEmail";
import { Email2, getSubject as getEmail2Subject } from "../../../emails/Email2";
import { Email3, getSubjectOptions } from "../../../emails/Email3";
import * as React from "react";

type Segment = "templates" | "prompts" | "tools" | "general";

// campaign_id → Resend audience ID env var mapping
const AUDIENCE_ENV_MAP: Record<Segment, string> = {
  templates: "RESEND_AUDIENCE_TEMPLATES",
  prompts: "RESEND_AUDIENCE_PROMPTS",
  tools: "RESEND_AUDIENCE_TOOLS",
  general: "RESEND_AUDIENCE_GENERAL",
};

// campaign_id values accepted from product repos → canonical segment
const CAMPAIGN_TO_SEGMENT: Record<string, Segment> = {
  templates: "templates",
  "notion-template-os": "templates",
  prompts: "prompts",
  "ai-prompt-packs": "prompts",
  tools: "tools",
  "automation-workflow-templates": "tools",
};

function toSegment(campaignId: string): Segment {
  return CAMPAIGN_TO_SEGMENT[campaignId] ?? "general";
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export async function POST(req: NextRequest) {
  // Verify shared secret so only product repos can call this endpoint
  const secret = req.headers.get("x-resend-sync-secret");
  if (process.env.RESEND_SYNC_SECRET && secret !== process.env.RESEND_SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.email || typeof body.email !== "string" || !body.email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email, campaign_id = "" } = body as { email: string; campaign_id?: string };
  const segment = toSegment(campaign_id);
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.warn("[resend-sync] RESEND_API_KEY not configured");
    return NextResponse.json({ ok: true, skipped: true });
  }

  const resend = new Resend(resendKey);
  const audienceId = process.env[AUDIENCE_ENV_MAP[segment]];

  // 1. Add contact to the correct Resend audience
  if (audienceId) {
    try {
      await resend.contacts.create({
        audienceId,
        email,
        unsubscribed: false,
      });
    } catch (err) {
      console.error("[resend-sync] audience add error:", err);
    }
  }

  const from = "3vo.ai <noreply@3vo.ai>";

  // 2. Send Email 1 immediately
  try {
    const html = await render(React.createElement(WelcomeEmail, { segment }));
    await resend.emails.send({
      from,
      to: [email],
      subject: getWelcomeSubject(segment),
      html,
    });
  } catch (err) {
    console.error("[resend-sync] Email 1 send error:", err);
  }

  // 3. Schedule Email 2 (+3 days)
  try {
    const html = await render(React.createElement(Email2, { segment }));
    await resend.emails.send({
      from,
      to: [email],
      subject: getEmail2Subject(segment),
      html,
      scheduledAt: daysFromNow(3).toISOString(),
    });
  } catch (err) {
    console.error("[resend-sync] Email 2 schedule error:", err);
  }

  // 4. Schedule Email 3 (+7 days)
  try {
    const html = await render(React.createElement(Email3, { segment }));
    await resend.emails.send({
      from,
      to: [email],
      subject: getSubjectOptions()[0],
      html,
      scheduledAt: daysFromNow(7).toISOString(),
    });
  } catch (err) {
    console.error("[resend-sync] Email 3 schedule error:", err);
  }

  return NextResponse.json({ ok: true });
}
