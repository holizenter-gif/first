import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { REWARDS, BADGES, XP_COMPLETAR_BASE, XP_DELTA_POSITIVO, generarValidacion } from "@/lib/tareas/constants";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { tarea_id, emocion_antes, emocion_despues, notas, tipo } = await req.json();

    // ── Tipo semanal ────────────────────────────────────────────────────────
    if (tipo === "semanal") {
      const semana = getSemanaKey();
      const { data: gamifActual } = await supabase
        .from("user_gamification")
        .select("semanales_semana")
        .eq("user_id", user.id)
        .single();

      const semanalesActuales: Record<string, string[]> = (gamifActual?.semanales_semana as Record<string, string[]>) ?? {};
      const completadasEstaSemana = semanalesActuales[semana] ?? [];

      if (!completadasEstaSemana.includes(tarea_id)) {
        completadasEstaSemana.push(tarea_id);
      }

      await supabase
        .from("user_gamification")
        .update({ semanales_semana: { ...semanalesActuales, [semana]: completadasEstaSemana } })
        .eq("user_id", user.id);

      return NextResponse.json({ success: true, tipo: "semanal", completadas: completadasEstaSemana.length });
    }

    // ── Tipo diaria (default) ────────────────────────────────────────────────
    if (!tarea_id || emocion_antes == null || emocion_despues == null) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }
    if (emocion_antes < 1 || emocion_antes > 10 || emocion_despues < 1 || emocion_despues > 10) {
      return NextResponse.json({ error: "Emoción debe estar entre 1 y 10" }, { status: 400 });
    }

    const hoy = new Date().toISOString().split("T")[0];

    const { data: asignacion } = await supabase
      .from("user_tareas_asignadas")
      .select("id, completada, fecha_asignada")
      .eq("user_id",        user.id)
      .eq("tarea_id",       tarea_id)
      .eq("fecha_asignada", hoy)
      .single();

    if (!asignacion) {
      return NextResponse.json({ error: "No hay tarea asignada para hoy con ese id" }, { status: 404 });
    }
    if (asignacion.completada) {
      return NextResponse.json({ error: "La tarea ya fue completada hoy" }, { status: 409 });
    }

    // Marcar completada
    await supabase
      .from("user_tareas_asignadas")
      .update({ completada: true, emocion_antes, emocion_despues, notas: notas ?? null })
      .eq("id", asignacion.id);

    // Leer gamificación actual
    const { data: gamif } = await supabase
      .from("user_gamification")
      .select("xp_total, streak_actual, streak_maximo, ultima_tarea_fecha, badges_collected, rewards_redeemed")
      .eq("user_id", user.id)
      .single();

    const ayer      = new Date(); ayer.setDate(ayer.getDate() - 1);
    const ayerStr   = ayer.toISOString().split("T")[0];
    const streakAnt = gamif?.streak_actual ?? 0;
    const nuevoStreak = gamif?.ultima_tarea_fecha === ayerStr ? streakAnt + 1
                      : gamif?.ultima_tarea_fecha === hoy      ? streakAnt
                      : 1;

    const delta    = emocion_despues - emocion_antes;
    const xpEarned = XP_COMPLETAR_BASE + (delta > 0 ? XP_DELTA_POSITIVO : 0);
    const xpTotal  = (gamif?.xp_total ?? 0) + xpEarned;

    const badgesActuales = (gamif?.badges_collected as string[]) ?? [];
    const badgesNuevos: string[] = [];
    for (const badge of BADGES) {
      if (!badgesActuales.includes(badge.id) && nuevoStreak >= badge.dias) {
        badgesNuevos.push(badge.id);
      }
    }

    await supabase
      .from("user_gamification")
      .upsert({
        user_id:            user.id,
        xp_total:           xpTotal,
        streak_actual:      nuevoStreak,
        streak_maximo:      Math.max(nuevoStreak, gamif?.streak_maximo ?? 0),
        ultima_tarea_fecha: hoy,
        badges_collected:   [...badgesActuales, ...badgesNuevos],
        updated_at:         new Date().toISOString(),
      }, { onConflict: "user_id" });

    const rewardsDisponibles = REWARDS
      .filter((r) => nuevoStreak >= r.dias && !((gamif?.rewards_redeemed as string[]) ?? []).includes(r.codigo))
      .map((r) => ({ nombre: r.desc, codigo: r.codigo }));

    const siguienteReward = REWARDS.find((r) => nuevoStreak < r.dias);

    const { data: prefs } = await supabase
      .from("user_quiz_preferences")
      .select("perfil_motivacional")
      .eq("user_id", user.id)
      .single();

    const validacion = generarValidacion(delta, prefs?.perfil_motivacional ?? 'pragmatico', nuevoStreak);

    return NextResponse.json({
      success:              true,
      xp_earned:            xpEarned,
      xp_total:             xpTotal,
      delta_emocional:      delta,
      badges_unlocked:      badgesNuevos,
      streak_actual:        nuevoStreak,
      validacion_emocional: validacion,
      rewards_disponibles:  rewardsDisponibles,
      siguiente_reward:     siguienteReward
        ? { nombre: siguienteReward.desc, dias_faltantes: siguienteReward.dias - nuevoStreak }
        : null,
    });
  } catch (err) {
    console.error("Error en tareas/completar:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

function getSemanaKey(): string {
  const now  = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
}
