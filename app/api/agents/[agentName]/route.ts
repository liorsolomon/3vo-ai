import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { AGENTS, AgentName } from "@/app/lib/prompts";

function logRun(agentName: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return;
  // Fire-and-forget — never block or throw on the stream
  createClient(url, key)
    .from("agent_runs")
    .insert({ agent_name: agentName })
    .then(({ error }) => {
      if (error) console.error("[agent_runs] insert error:", error.message);
    });
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 1200;
// Abort step 1+2 if they take longer than 30s each; 45s for the streaming step
const STEP_TIMEOUT_MS = 30_000;

async function runStep(systemPrompt: string, userMessage: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), STEP_TIMEOUT_MS);

  try {
    const message = await client.messages.create(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      },
      { signal: controller.signal }
    );
    const block = message.content[0];
    if (block.type !== "text") throw new Error("Unexpected content block type");
    return block.text;
  } finally {
    clearTimeout(timeout);
  }
}

function classifyError(err: unknown): { message: string; status: number } {
  if (err instanceof Anthropic.APIError) {
    if (err.status === 429) {
      return { message: "Rate limit reached. Please wait a moment and try again.", status: 429 };
    }
    if (err.status === 401) {
      return { message: "API key not configured correctly. Contact support.", status: 500 };
    }
    if (err.status === 529 || err.status === 503) {
      return { message: "Claude is temporarily overloaded. Please try again in a minute.", status: 503 };
    }
    return { message: `AI service error (${err.status}). Please try again.`, status: 502 };
  }
  if (err instanceof Error) {
    if (err.name === "AbortError" || err.message.includes("aborted")) {
      return { message: "Request timed out. Try shorter inputs or try again.", status: 504 };
    }
    return { message: err.message, status: 500 };
  }
  return { message: "Unknown error. Please try again.", status: 500 };
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
    return NextResponse.json(
      { error: "API key not configured. Set ANTHROPIC_API_KEY in env." },
      { status: 503 }
    );
  }

  let inputs: Record<string, string>;
  try {
    inputs = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
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
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          // stream may have been closed
        }
      };

      try {
        // Step 1: Expand
        send("step", { step: 1, label: "Analyzing your situation…" });
        const expansion = await runStep(
          "You are a strategic analyst. Be specific and incisive. No fluff.",
          agent.expandPrompt(inputs)
        );

        // Step 2: Generate
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
          system:
            "You are a ruthless editor. Cut everything that doesn't earn its place. Output only the final result.",
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
        logRun(agentName);
      } catch (err) {
        const { message } = classifyError(err);
        send("error", { error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
