import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Simple in-memory rate limiter (resets on cold start — acceptable for edge use)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;     // max requests
const RATE_WINDOW = 60_000; // per 60 s

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  const email = req.nextUrl.searchParams.get("email");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ordenes")
    .select("id, created_at, estado, items, total")
    .eq("email_comprador", email.toLowerCase().trim())
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching ordenes:", error);
    return NextResponse.json({ ordenes: [] });
  }

  return NextResponse.json({ ordenes: data ?? [] });
}
