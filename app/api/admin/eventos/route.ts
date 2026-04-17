import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { createAdminClient }         from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body  = await req.json();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("eventos")
    .insert({
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
      cupo_actual:        0,
      imagen_url:         body.imagen_url          ?? null,
      activo:             body.activo              ?? true,
      destacado:          body.destacado           ?? false,
      pasado:             body.pasado              ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ evento: data }, { status: 201 });
}
