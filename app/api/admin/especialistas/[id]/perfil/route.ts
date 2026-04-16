import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

export async function PUT(
  req:     NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();

  const { error } = await supabase
    .from("profesionales")
    .update({
      nombre:          body.nombre,
      especialidad:    body.especialidad    || null,
      bio:             body.bio             || null,
      bio_corta:       body.bio_corta       || null,
      whatsapp:        body.whatsapp        || null,
      linkedin:        body.linkedin        || null,
      sitio_web:       body.sitio_web       || null,
      imagen_url:      body.imagen_url      || null,
      certificaciones: body.certificaciones ?? [],
      cal_username:    body.cal_username    || null,
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
