import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email requerido" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ordenes")
    .select("*")
    .eq("email_comprador", email.toLowerCase().trim())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ordenes:", error);
    return NextResponse.json({ ordenes: [] });
  }

  return NextResponse.json({ ordenes: data ?? [] });
}
