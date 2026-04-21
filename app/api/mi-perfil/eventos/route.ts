import { NextResponse }   from "next/server";
import { createClient }  from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { data, error } = await supabase
      .from("registros_eventos")
      .select(`
        id,
        status,
        monto_pagado,
        created_at,
        evento:evento_id (
          id,
          titulo,
          slug,
          fecha_inicio,
          fecha_fin,
          modalidad,
          precio,
          imagen_url
        )
      `)
      .eq("email", user.email!)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error obteniendo eventos:", error);
      return NextResponse.json({ error: "Error al obtener eventos" }, { status: 500 });
    }

    return NextResponse.json({ eventos: data ?? [] });
  } catch (err) {
    console.error("Error en GET /api/mi-perfil/eventos:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
