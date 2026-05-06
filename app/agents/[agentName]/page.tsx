import { notFound } from "next/navigation";
import { AGENTS, AgentName, SerializableAgentConfig } from "@/app/lib/prompts";
import AgentRunner from "./AgentRunner";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ agentName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { agentName } = await params;
  const agent = AGENTS[agentName as AgentName];
  if (!agent) return {};

  const title = `${agent.title} — prompts.3vo.ai`;
  const description = agent.description;
  const url = `https://prompts.3vo.ai/agents/${agentName}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "prompts.3vo.ai",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: { canonical: url },
  };
}

export default async function AgentPage({ params }: Props) {
  const { agentName } = await params;
  const agent = AGENTS[agentName as AgentName];
  if (!agent) notFound();

  const { name, title, tagline, description, fields } = agent;
  const serializableAgent: SerializableAgentConfig = { name, title, tagline, description, fields };

  return <AgentRunner agent={serializableAgent} />;
}
