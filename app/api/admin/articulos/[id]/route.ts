import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

interface Props { params: Promise<{ id: string }> }

// PUT — actualizar
export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();

  const { data: actual } = await supabase
    .from("articulos")
    .select("publicado, published_at")
    .eq("id", id)
    .single();

  // Si cambia de borrador a publicado → setear published_at
  const published_at =
    body.publicado && !actual?.publicado
      ? new Date().toISOString()
      : actual?.published_at ?? null;

  const { data, error } = await supabase
    .from("articulos")
    .update({ ...body, published_at })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ articulo: data });
}

// DELETE — despublicar (soft delete)
export async function DELETE(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { error } = await supabase
    .from("articulos")
    .update({ publicado: false })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
