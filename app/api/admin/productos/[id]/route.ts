import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await req.json();

  // Check slug uniqueness if changing slug
  if (body.slug) {
    const { data: existing } = await supabase
      .from("productos")
      .select("id")
      .eq("slug", body.slug)
      .neq("id", id)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: "El slug ya está en uso" }, { status: 409 });
    }
  }

  const { data, error } = await supabase
    .from("productos")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const supabase = await createClient();

  // Soft delete
  const { error } = await supabase
    .from("productos")
    .update({ activo: false })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
