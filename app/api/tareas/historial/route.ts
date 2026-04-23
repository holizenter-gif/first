import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const semanas = Math.min(12, Math.max(1, Number(searchParams.get("semanas") ?? "4")));
    const desde   = new Date();
    desde.setDate(desde.getDate() - semanas * 7);
    const desdeStr = desde.toISOString().split("T")[0];

    const { data: registros, error } = await supabase
      .from("user_tareas_asignadas")
      .select("id, tarea_id, fecha_asignada, completada, emocion_antes, emocion_despues, notas")
      .eq("user_id",  user.id)
      .gte("fecha_asignada", desdeStr)
      .order("fecha_asignada", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Obtener nombres de tareas en batch
    const ids = [...new Set((registros ?? []).map((r) => r.tarea_id))];
    let nombresPorId: Record<string, string> = {};
    if (ids.length > 0) {
      const { data: tareas } = await supabase
        .from("tareas_pool")
        .select("id, nombre")
        .in("id", ids);
      nombresPorId = Object.fromEntries((tareas ?? []).map((t) => [t.id, t.nombre]));
    }

    const completadas = (registros ?? []).filter((r) => r.completada);
    const deltaPromedio = completadas.length > 0
      ? Math.round(
          completadas.reduce((acc, r) => acc + ((r.emocion_despues ?? 0) - (r.emocion_antes ?? 0)), 0) /
          completadas.length * 10
        ) / 10
      : null;

    const tareasFormateadas = (registros ?? []).map((r) => {
      const nombre = nombresPorId[r.tarea_id] ?? null;
      const fecha  = new Date(r.fecha_asignada + "T12:00:00");
      return {
        id:              r.id,
        tarea_id:        r.tarea_id,
        tarea_nombre:    nombre,
        fecha:           r.fecha_asignada,
        dia_semana:      fecha.toLocaleDateString("es-MX", { weekday: "long" }),
        fecha_display:   fecha.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" }),
        completada:      r.completada,
        emocion_antes:   r.emocion_antes,
        emocion_despues: r.emocion_despues,
        delta:           r.emocion_antes != null && r.emocion_despues != null
                           ? r.emocion_despues - r.emocion_antes : null,
        notas:           r.notas,
      };
    });

    return NextResponse.json({
      tareas:          tareasFormateadas,
      resumen: {
        completadas:     completadas.length,
        asignadas:       (registros ?? []).length,
        delta_promedio:  deltaPromedio,
      },
    });
  } catch (err) {
    console.error("Error en GET /api/tareas/historial:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
