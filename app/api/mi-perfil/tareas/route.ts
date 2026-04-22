import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const fecha = req.nextUrl.searchParams.get("fecha") ?? new Date().toISOString().split("T")[0];

    const { data: asignacion } = await supabase
      .from("user_tareas_asignadas")
      .select("id, tarea_id, completada, fecha_asignada, emocion_antes, emocion_despues, notas")
      .eq("user_id",        user.id)
      .eq("fecha_asignada", fecha)
      .single();

    if (!asignacion) return NextResponse.json({ tarea: null });

    const { data: tarea } = await supabase
      .from("tareas_pool")
      .select("nombre, instruccion, por_que, duracion_min")
      .eq("id", asignacion.tarea_id)
      .single();

    return NextResponse.json({ tarea: { ...asignacion, tarea } });
  } catch (err) {
    console.error("Error en GET /api/mi-perfil/tareas:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
