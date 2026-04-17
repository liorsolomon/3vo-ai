import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type Segment = "templates" | "prompts" | "tools" | "general";

interface WelcomeEmailProps {
  segment: Segment;
}

const subjects: Record<Segment, string> = {
  templates: "Your AI template toolkit starts here",
  prompts: "Your AI prompt library is being built",
  tools: "Your AI tools shortlist is coming together",
  general: "You're on the list — here's what's coming",
};

const segmentCta: Record<Segment, string> = {
  templates:
    "Download our top 5 AI document templates used by 200+ early testers",
  prompts:
    "Copy our highest-converting prompt framework for writing faster",
  tools:
    "See the 3 AI tools we actually use daily (and why we dropped the rest)",
  general: "See what we're building",
};

export function WelcomeEmail({ segment }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>One free resource inside. No fluff, just value.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={h1}>Hey there,</Text>
          <Text style={p}>Welcome to 3vo.ai. Glad you're here.</Text>
          <Text style={p}>
            We're building a smarter way to work with AI — not by chasing every
            new model, but by giving you the <strong>templates, prompts, and
            tools</strong> that actually save you time and produce consistent
            results.
          </Text>
          <Text style={p}>
            <strong>Here's one thing you can use right now:</strong>
          </Text>
          <Section style={callout}>
            <Text style={calloutText}>→ {segmentCta[segment]}</Text>
          </Section>
          <Text style={p}>
            Over the next few weeks we'll share what we're building, how others
            are using AI to 10x their output, and when you can get early access.
          </Text>
          <Text style={p}>Stay close — this is going somewhere good.</Text>
          <Text style={signature}>— The 3vo.ai team</Text>
          <Button href="https://3vo.ai" style={button}>
            Check out what we're building →
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

export function getSubject(segment: Segment): string {
  return subjects[segment];
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const body = {
  backgroundColor: "#f9f9f9",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  margin: "40px auto",
  maxWidth: "560px",
  padding: "40px",
};

const h1 = {
  color: "#111",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 24px",
};

const p = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const callout = {
  backgroundColor: "#f4f4f4",
  borderLeft: "4px solid #00FF85",
  margin: "0 0 16px",
  padding: "12px 16px",
};

const calloutText = {
  color: "#333",
  fontSize: "15px",
  margin: "0",
};

const signature = {
  color: "#666",
  fontSize: "15px",
  margin: "16px 0 24px",
};

const button = {
  backgroundColor: "#111",
  borderRadius: "6px",
  color: "#fff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
};
