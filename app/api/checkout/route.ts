import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const PRICE_ID = process.env.STRIPE_PRICE_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://prompts.3vo.ai";

export async function POST(_req: NextRequest) {
  if (!stripe || !PRICE_ID) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

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

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
