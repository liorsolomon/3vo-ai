import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

type Segment = "templates" | "prompts" | "tools" | "general";

interface Email2Props {
  segment: Segment;
}

const subjects: Record<Segment, string> = {
  templates: "The copy-paste problem with AI templates",
  prompts: "Why your AI outputs are inconsistent (and the fix)",
  tools: "Too many AI tools, not enough results",
  general: "The problem we're solving (and why it matters to you)",
};

export function Email2({ segment: _segment }: Email2Props) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Most people use AI wrong. Here's the pattern that actually works.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={p}>Hey,</Text>
          <Text style={p}>Here's a pattern we see constantly:</Text>
          <Text style={p}>
            Someone spends 30 minutes crafting a prompt, gets a great result,
            then loses it — buried in a chat window, never repeated again.
          </Text>
          <Text style={p}>
            The same person opens a new tab tomorrow and starts from scratch.
          </Text>
          <Text style={p}>
            <strong>That's the problem 3vo.ai solves.</strong>
          </Text>
          <Text style={p}>
            We're building a system where your best AI workflows don't
            disappear. Where your prompts, templates, and tools are organized,
            reusable, and actually get better over time.
          </Text>
          <Text style={p}>
            Think of it like a second brain for AI — except instead of just
            storing notes, it helps you <em>do things</em> faster and more
            consistently.
          </Text>
          <Text style={p}>
            Here's one concrete example: a freelance designer in our beta uses
            3vo templates to cut client brief processing from 45 minutes to 8.
            Same quality. Less time. Every single time.
          </Text>
          <Text style={p}>That's what systematized AI looks like.</Text>
          <Text style={p}>
            We're not there for everyone yet — but you're on the list.
          </Text>
          <Text style={signature}>— The 3vo.ai team</Text>
          <Button href="https://3vo.ai" style={button}>
            See how it works →
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

export function getSubject(segment: Segment): string {
  return subjects[segment];
}

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

const p = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
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
