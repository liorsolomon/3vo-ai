import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { AGENTS, AgentName } from "@/app/lib/prompts";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 1024;

async function runStep(systemPrompt: string, userMessage: string): Promise<string> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });
  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected content block type");
  return block.text;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ agentName: string }> }
) {
  const { agentName } = await params;
  const agent = AGENTS[agentName as AgentName];

  if (!agent) {
    return NextResponse.json({ error: "Unknown agent" }, { status: 404 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  let inputs: Record<string, string>;
  try {
    inputs = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Validate required fields
  for (const field of agent.fields) {
    if (field.required && !inputs[field.name]?.trim()) {
      return NextResponse.json(
        { error: `Missing required field: ${field.label}` },
        { status: 400 }
      );
    }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        // Step 1: Expand — analyze the situation
        send("step", { step: 1, label: "Analyzing your situation…" });
        const expansion = await runStep(
          "You are a strategic analyst. Be specific and incisive. No fluff.",
          agent.expandPrompt(inputs)
        );

        // Step 2: Generate — draft the content
        send("step", { step: 2, label: "Drafting your content…" });
        const draft = await runStep(
          "You are an expert copywriter and strategist. Write for impact, not length.",
          agent.generatePrompt(inputs, expansion)
        );

        // Step 3: Polish — stream the final output
        send("step", { step: 3, label: "Polishing the final output…" });

        const polishStream = await client.messages.create({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: "You are a ruthless editor. Cut everything that doesn't earn its place. Output only the final result.",
          messages: [
            {
              role: "user",
              content: agent.polishPrompt(inputs, draft),
            },
          ],
          stream: true,
        });

        for await (const chunk of polishStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            send("token", { text: chunk.delta.text });
          }
        }

        send("done", { success: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        send("error", { error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
