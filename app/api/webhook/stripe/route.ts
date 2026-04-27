import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  if (!stripe || !WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Signature verification failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const supabase = getSupabase();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // Log the new subscriber for revenue tracking
      if (supabase && session.customer_email) {
        await supabase.from("subscribers").upsert(
          {
            email: session.customer_email,
            stripe_customer_id: session.customer as string,
            stripe_session_id: session.id,
            subscribed_at: new Date().toISOString(),
            status: "active",
          },
          { onConflict: "email" }
        ).then(({ error }) => {
          if (error) console.error("[webhook] upsert subscriber error:", error.message);
        });
      }
      console.log("[webhook] checkout.session.completed:", session.id, session.customer_email);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      if (supabase) {
        await supabase
          .from("subscribers")
          .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
          .eq("stripe_customer_id", sub.customer as string)
          .then(({ error }) => {
            if (error) console.error("[webhook] update subscriber error:", error.message);
          });
      }
      console.log("[webhook] subscription cancelled:", sub.id);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn("[webhook] payment failed:", invoice.id, invoice.customer_email);
      break;
    }

    default:
      // Ignore unhandled events — return 200 so Stripe doesn't retry
      break;
  }

  return NextResponse.json({ received: true });
}
