import { NextResponse }    from "next/server";
import { createClient }    from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const hoy = new Date().toISOString().split("T")[0];

    // Tarea diaria
    const { data: asignacion } = await supabase
      .from("user_tareas_asignadas")
      .select("id, tarea_id, completada, fecha_asignada, emocion_antes, emocion_despues, notas")
      .eq("user_id",        user.id)
      .eq("fecha_asignada", hoy)
      .single();

    let tarea = null;
    if (asignacion) {
      const { data: t } = await supabase
        .from("tareas_pool")
        .select("nombre, instruccion, por_que, duracion_min")
        .eq("id", asignacion.tarea_id)
        .single();
      tarea = { ...asignacion, tarea: t };
    }

    // Gamificación
    const { data: gamif } = await supabase
      .from("user_gamification")
      .select("xp_total, streak_actual, streak_sueno")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({
      tarea,
      streaks: {
        tareas: gamif?.streak_actual ?? 0,
        sueno:  gamif?.streak_sueno  ?? 0,
      },
      xp_total: gamif?.xp_total ?? 0,
    });
  } catch (err) {
    console.error("Error en GET /api/tareas/hoy:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
