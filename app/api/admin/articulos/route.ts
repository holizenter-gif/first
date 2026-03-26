import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

// GET — listar todos (para admin)
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data } = await supabase
    .from("articulos")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ articulos: data ?? [] });
}

// POST — crear artículo
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();

  // Validar slug único
  const { data: existe } = await supabase
    .from("articulos")
    .select("id")
    .eq("slug", body.slug)
    .single();

  if (existe) {
    return NextResponse.json({ error: "Ya existe un artículo con ese slug" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("articulos")
    .insert({
      ...body,
      published_at: body.publicado ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ articulo: data });
}
