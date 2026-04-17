import { NextRequest, NextResponse } from "next/server";
import { revalidatePath }            from "next/cache";
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

  const { data: updated, error } = await supabase
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
    .select("slug");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Invalidar caché del directorio completo y del perfil específico
  revalidatePath("/directorio", "layout");
  const slug = updated?.[0]?.slug ?? body.slug;
  if (slug) {
    revalidatePath(`/directorio/${slug}`);
  }

  return NextResponse.json({ ok: true });
}
