import { NextResponse }               from "next/server";
import { createClient }               from "@/lib/supabase/server";
import { detectarRequiereRespuesta, generarTareasSemanales } from "@/lib/tareas/logic";
import type { Perfil, Emocion, Motivacion, Tiempo, Tono } from "@/lib/tareas/logic";

function getSemanaKey(): string {
  const now  = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function tiempoAMinutos(tiempo: string): number {
  return ({ "5min": 5, "10min": 10, "15min": 15, "20min+": 25 } as Record<string, number>)[tiempo] ?? 10;
}

function mismaSemanaISO(a: Date, b: Date): boolean {
  const lunes = (d: Date) => {
    const t = new Date(d); const dia = t.getDay();
    t.setDate(t.getDate() - (dia === 0 ? 6 : dia - 1)); t.setHours(0, 0, 0, 0);
    return t.getTime();
  };
  return lunes(a) === lunes(b);
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const hoy = new Date().toISOString().split("T")[0];

    // Tarea diaria asignada hoy
    const { data: asignacion } = await supabase
      .from("user_tareas_asignadas")
      .select("id, tarea_id, completada, fecha_asignada, emocion_antes, emocion_despues, notas, respuesta_usuario")
      .eq("user_id",        user.id)
      .eq("fecha_asignada", hoy)
      .single();

    let tarea_diaria = null;
    if (asignacion) {
      let tareaDetalle = null;
      let requiere_respuesta = false;

      const { data: tb } = await supabase
        .from("tareas_biblioteca")
        .select("nombre, instruccion, por_que, ciencia_breve, tiempo_min, protocolo")
        .eq("id", asignacion.tarea_id)
        .single();

      if (tb) {
        requiere_respuesta = detectarRequiereRespuesta(tb.instruccion);
        tareaDetalle = {
          nombre:        tb.nombre,
          instruccion:   tb.instruccion,
          por_que:       tb.por_que,
          ciencia_breve: tb.ciencia_breve ?? null,
          protocolo:     tb.protocolo ?? null,
          duracion_min:  tiempoAMinutos(tb.tiempo_min),
        };
      } else {
        const { data: tp } = await supabase
          .from("tareas_pool")
          .select("nombre, instruccion, por_que, duracion_min")
          .eq("id", asignacion.tarea_id)
          .single();

        if (tp) {
          requiere_respuesta = detectarRequiereRespuesta(tp.instruccion);
          tareaDetalle = {
            nombre:        tp.nombre,
            instruccion:   tp.instruccion,
            por_que:       tp.por_que ?? "",
            ciencia_breve: null,
            protocolo:     null,
            duracion_min:  tp.duracion_min ?? 5,
          };
        }
      }

      tarea_diaria = { ...asignacion, tarea: tareaDetalle, requiere_respuesta };
    }

    // Gamificación + perfil del usuario
    const [gamifRes, prefsRes] = await Promise.all([
      supabase.from("user_gamification")
        .select("xp_total, streak_actual, streak_sueno, semanales_semana, nivel_actual")
        .eq("user_id", user.id)
        .single(),
      supabase.from("user_quiz_preferences")
        .select("emocion_actual, perfil_motivacional, tiempo_disponible, tono_intencional, updated_at")
        .eq("user_id", user.id)
        .single(),
    ]);

    const gamif = gamifRes.data;
    const prefs = prefsRes.data;

    // Usuario nuevo: no tiene perfil → onboarding obligatorio
    const requiere_onboarding = !prefs;

    // Check-in pendiente esta semana ISO
    const checkin_semanal_pendiente = (() => {
      if (!prefs?.updated_at) return false;
      return !mismaSemanaISO(new Date(prefs.updated_at), new Date());
    })();

    // Tareas semanales personalizadas (3 desde tareas_biblioteca, fallback a genéricas)
    const semanaKey      = getSemanaKey();
    const completadasIds = ((gamif?.semanales_semana as Record<string, string[]>) ?? {})[semanaKey] ?? [];

    let tareas_semanales: Array<object> = [];
    if (prefs) {
      const perfil: Perfil = {
        emocion:      (prefs.emocion_actual      ?? "mantenimiento") as Emocion,
        motivacional: (prefs.perfil_motivacional ?? "pragmatico")    as Motivacion,
        tiempo:       (prefs.tiempo_disponible   ?? "10min")         as Tiempo,
        tono:         (prefs.tono_intencional    ?? "accion")        as Tono,
      };
      const nivel = gamif?.nivel_actual ?? 1;
      const semanales = await generarTareasSemanales(supabase, perfil, nivel, user.id);
      tareas_semanales = semanales.map((t) => ({
        ...t,
        completada:         completadasIds.includes(t.tarea_id),
        requiere_respuesta: detectarRequiereRespuesta(t.instruccion),
      }));
    }

    return NextResponse.json({
      tarea_diaria,
      tareas_semanales,
      tareas_semanales_completadas: completadasIds.length,
      requiere_onboarding,
      checkin_semanal_pendiente,
      nivel_actual: gamif?.nivel_actual ?? 1,
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
