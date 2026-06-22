import { NextRequest, NextResponse } from "next/server";

// Called daily by Vercel Cron to prevent Supabase free-tier project from pausing.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ ok: false, reason: "env_missing" }, { status: 200 });
  }

  try {
    // Ping the REST root — always returns 200 + OpenAPI spec regardless of schema state
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      },
    });
    return NextResponse.json({ ok: res.ok, status: res.status, ts: new Date().toISOString() });
  } catch (err) {
    console.error("[keepalive] supabase ping error:", err);
    return NextResponse.json({ ok: false, error: String(err), ts: new Date().toISOString() }, { status: 500 });
  }
}
