import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TAREAS_SEMANALES = [
  {
    id:          "semanal_behavioral",
    nombre:      "Activación Conductual",
    instruccion: "Sal a caminar o haz cualquier movimiento durante 30 minutos. No tiene que ser intenso. El cuerpo en movimiento cambia el estado mental.",
    por_que:     "La activación conductual es la intervención con más evidencia científica para mantener el estado de ánimo estable. El movimiento es la mejor medicina.",
    protocolo:   "Behavioral Activation — Martell, Addis",
    duracion_min: 30,
    dia_nombre:  "Lunes",
  },
  {
    id:          "semanal_journaling",
    nombre:      "Journaling de la Semana",
    instruccion: "Escribe libremente durante 20 minutos sobre tu semana: qué pasó, cómo te sentiste, qué aprendiste. Sin editar, solo fluir.",
    por_que:     "La escritura expresiva reduce el estrés y mejora la claridad mental. Pennebaker demostró que 20 minutos semanales tiene efectos medibles en bienestar.",
    protocolo:   "Expressive Writing — Pennebaker",
    duracion_min: 20,
    dia_nombre:  "Miércoles",
  },
  {
    id:          "semanal_movimiento",
    nombre:      "Movimiento Estructurado",
    instruccion: "25 minutos de yoga, pilates, o ejercicio de tu elección. Busca un video guiado si necesitas estructura. Lo importante es moverte con intención.",
    por_que:     "El ejercicio estructurado semanal refuerza los beneficios del movimiento diario y construye capacidad de recuperación ante el estrés.",
    protocolo:   "Exercise as Medicine — Ratey",
    duracion_min: 25,
    dia_nombre:  "Viernes",
  },
  {
    id:          "semanal_reflexion",
    nombre:      "Reflexión Semanal",
    instruccion: "Siéntate en un lugar tranquilo y responde por escrito: ¿Qué aprendí esta semana? ¿Qué quiero llevar a la próxima? ¿Qué suelto?",
    por_que:     "La reflexión intencional al cierre de semana consolida el aprendizaje y genera sentido. Es el puente entre la experiencia y el crecimiento real.",
    protocolo:   "Reflective Practice — Schön",
    duracion_min: 15,
    dia_nombre:  "Domingo",
  },
];

function getSemanaKey(): string {
  const now  = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

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

    let tarea_diaria = null;
    if (asignacion) {
      const { data: t } = await supabase
        .from("tareas_pool")
        .select("nombre, instruccion, por_que, duracion_min")
        .eq("id", asignacion.tarea_id)
        .single();
      tarea_diaria = { ...asignacion, tarea: t };
    }

    // Gamificación + semanales completadas
    const { data: gamif } = await supabase
      .from("user_gamification")
      .select("xp_total, streak_actual, streak_sueno, semanales_semana")
      .eq("user_id", user.id)
      .single();

    const semanaKey = getSemanaKey();
    const completadasIds: string[] = (gamif?.semanales_semana as Record<string, string[]>)?.[semanaKey] ?? [];

    const tareas_semanales = TAREAS_SEMANALES.map((t) => ({
      ...t,
      completada: completadasIds.includes(t.id),
    }));

    return NextResponse.json({
      tarea_diaria,
      tareas_semanales,
      tareas_semanales_completadas: completadasIds.length,
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
