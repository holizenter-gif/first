import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

interface Props { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();

  const { data, error } = await supabase
    .from("profesionales")
    .update({
      nombre:           body.nombre           || null,
      slug:             body.slug             || null,
      especialidad:     body.especialidad     || null,
      bio:              body.bio              || null,
      bio_corta:        body.bio_corta        || null,
      filosofia:        body.filosofia        || null,
      foto_url:         body.foto_url         || null,
      modalidad:        body.modalidad        || "hibrido",
      precio_base:      Number(body.precio_base)       ?? 0,
      experiencia_anos: Number(body.experiencia_anos)  ?? 0,
      tags:             Array.isArray(body.tags)            ? body.tags            : [],
      certificaciones:  Array.isArray(body.certificaciones) ? body.certificaciones : [],
      activo:           typeof body.activo === "boolean" ? body.activo : true,
      orden:            Number(body.orden) || 99,
      cal_username:     body.cal_username || null,
    })
    .eq("id", id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profesional: data });
}
