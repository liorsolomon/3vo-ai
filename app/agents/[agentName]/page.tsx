import { notFound } from "next/navigation";
import { AGENTS, AgentName } from "@/app/lib/prompts";
import AgentRunner from "./AgentRunner";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ agentName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { agentName } = await params;
  const agent = AGENTS[agentName as AgentName];
  if (!agent) return {};
  return {
    title: `${agent.title} — prompts.3vo.ai`,
    description: agent.description,
  };
}

export default async function AgentPage({ params }: Props) {
  const { agentName } = await params;
  const agent = AGENTS[agentName as AgentName];
  if (!agent) notFound();

  return <AgentRunner agent={agent} />;
}
