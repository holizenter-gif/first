import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("orden", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  // Ensure slug is unique
  if (body.slug) {
    const { data: existing } = await supabase
      .from("productos")
      .select("id")
      .eq("slug", body.slug)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: "El slug ya está en uso" }, { status: 409 });
    }
  }

  const { data, error } = await supabase
    .from("productos")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
