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

interface Email3Props {
  segment: Segment;
  signupCount?: number;
}

export function Email3({ segment: _segment, signupCount }: Email3Props) {
  const count = signupCount ?? "thousands of";

  return (
    <Html lang="en">
      <Head />
      <Preview>Early access, real results, and a launch date is getting closer.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={p}>Hey,</Text>
          <Text style={p}>Quick update from the 3vo.ai team.</Text>
          <Text style={p}>
            Since we started collecting signups, we've had{" "}
            <strong>{count} people</strong> join the list across templates,
            prompts, and tools.
          </Text>
          <Text style={p}>What early testers are telling us:</Text>
          <Section style={quote}>
            <Text style={quoteText}>
              "I replaced my entire content workflow with 3 templates. I don't
              think twice anymore."
            </Text>
            <Text style={attribution}>— Beta user, content creator</Text>
          </Section>
          <Section style={quote}>
            <Text style={quoteText}>
              "The prompts library alone saved me hours last week."
            </Text>
            <Text style={attribution}>— Beta user, marketing consultant</Text>
          </Section>
          <Text style={p}>Here's what being on this list gets you:</Text>
          <Text style={p}>
            • <strong>Early access</strong> when we launch — before the public
            <br />
            • <strong>Founding member pricing</strong> — locked in at launch
            rates forever
            <br />• <strong>Direct input</strong> into what we build next
          </Text>
          <Text style={p}>
            The launch timeline is tightening. If you know someone who should
            be on this list, now's the time to share it.
          </Text>
          <Text style={signature}>— The 3vo.ai team</Text>
          <Button href="https://3vo.ai" style={button}>
            Stay close — launch is coming →
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

export function getSubjectOptions(): string[] {
  return [
    "Here's what early users are already doing",
    "People are on the list. Here's what's happening.",
  ];
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

const quote = {
  borderLeft: "4px solid #e0e0e0",
  margin: "0 0 16px",
  paddingLeft: "16px",
};

const quoteText = {
  color: "#555",
  fontSize: "15px",
  fontStyle: "italic",
  margin: "0 0 4px",
};

const attribution = {
  color: "#888",
  fontSize: "13px",
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
