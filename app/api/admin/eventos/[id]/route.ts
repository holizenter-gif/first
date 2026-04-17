import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { createAdminClient }         from "@/lib/supabase/admin";

interface Props { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body  = await req.json();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("eventos")
    .update({
      titulo:             body.titulo,
      slug:               body.slug,
      descripcion_corta:  body.descripcion_corta  ?? null,
      descripcion:        body.descripcion         ?? null,
      fecha_inicio:       body.fecha_inicio,
      fecha_fin:          body.fecha_fin           ?? null,
      modalidad:          body.modalidad           ?? "presencial",
      ubicacion:          body.ubicacion           ?? null,
      link_virtual:       body.link_virtual        ?? null,
      precio:             Number(body.precio)      ?? 0,
      precio_descripcion: body.precio_descripcion  ?? null,
      cupo_maximo:        body.cupo_maximo         ?? null,
      imagen_url:         body.imagen_url          ?? null,
      activo:             body.activo              ?? true,
      destacado:          body.destacado           ?? false,
      pasado:             body.pasado              ?? false,
    })
    .eq("id", id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.length === 0) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  return NextResponse.json({ evento: data[0] });
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("eventos")
    .update({ activo: false })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
