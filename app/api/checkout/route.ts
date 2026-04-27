import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const PRICE_ID = process.env.STRIPE_PRICE_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://prompts.3vo.ai";

async function createSession(): Promise<{ url: string | null } | { error: string }> {
  if (!stripe || !PRICE_ID) return { error: "Stripe is not configured" };
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${BASE_URL}/agents/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/agents`,
      allow_promotion_codes: true,
      metadata: { product: "prompts_3vo_ai" },
    });
    return { url: session.url };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Checkout error" };
  }
}

// GET: used by nav links and direct browser navigation
export async function GET(_req: NextRequest) {
  const fallback = process.env.NEXT_PUBLIC_STRIPE_LINK;

  if (!stripe || !PRICE_ID) {
    if (fallback) return NextResponse.redirect(fallback);
    return NextResponse.redirect(`${BASE_URL}/agents`);
  }

  const result = await createSession();
  if ("error" in result) {
    if (fallback) return NextResponse.redirect(fallback);
    return NextResponse.redirect(`${BASE_URL}/agents`);
  }
  return NextResponse.redirect(result.url ?? `${BASE_URL}/agents`);
}

// POST: used by AgentRunner client component (returns JSON URL)
export async function POST(_req: NextRequest) {
  const fallback = process.env.NEXT_PUBLIC_STRIPE_LINK;

  if (!stripe || !PRICE_ID) {
    if (fallback) return NextResponse.json({ url: fallback });
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const result = await createSession();
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ url: result.url });
}
