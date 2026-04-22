import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { createAdminClient }         from "@/lib/supabase/admin";
import { REWARDS, BADGES, XP_COMPLETAR_BASE, XP_DELTA_POSITIVO, generarValidacion } from "@/lib/tareas/constants";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { tarea_id, emocion_antes, emocion_despues, notas } = await req.json();

    if (!tarea_id || emocion_antes == null || emocion_despues == null) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }
    if (emocion_antes < 1 || emocion_antes > 10 || emocion_despues < 1 || emocion_despues > 10) {
      return NextResponse.json({ error: "Emoción debe estar entre 1 y 10" }, { status: 400 });
    }

    const hoy = new Date().toISOString().split("T")[0];

    // Verificar que existe la asignación y no está completada
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

    const admin = createAdminClient();

    // Marcar completada
    await admin
      .from("user_tareas_asignadas")
      .update({
        completada:      true,
        emocion_antes,
        emocion_despues,
        notas:           notas ?? null,
      })
      .eq("id", asignacion.id);

    // Obtener gamificación actual
    const { data: gamif } = await admin
      .from("user_gamification")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const ultimaFecha   = gamif?.ultima_tarea_fecha;
    const ayer          = new Date(); ayer.setDate(ayer.getDate() - 1);
    const ayerStr       = ayer.toISOString().split("T")[0];
    const streakAnterior = gamif?.streak_actual ?? 0;
    const nuevoStreak   = ultimaFecha === ayerStr ? streakAnterior + 1
                          : ultimaFecha === hoy    ? streakAnterior
                          : 1;

    const delta   = emocion_despues - emocion_antes;
    const xpBase  = XP_COMPLETAR_BASE;
    const xpBonus = delta > 0 ? XP_DELTA_POSITIVO : 0;
    const xpTotal = (gamif?.xp_total ?? 0) + xpBase + xpBonus;

    // Badges desbloqueados
    const badgesActuales = gamif?.badges_collected ?? [];
    const badgesNuevos: string[] = [];
    for (const badge of BADGES) {
      if (!badgesActuales.includes(badge.id) && nuevoStreak >= badge.dias) {
        badgesNuevos.push(badge.id);
      }
    }
    const badgesTotal = [...badgesActuales, ...badgesNuevos];

    await admin
      .from("user_gamification")
      .upsert({
        user_id:           user.id,
        xp_total:          xpTotal,
        streak_actual:     nuevoStreak,
        streak_maximo:     Math.max(nuevoStreak, gamif?.streak_maximo ?? 0),
        ultima_tarea_fecha: hoy,
        badges_collected:  badgesTotal,
        updated_at:        new Date().toISOString(),
      }, { onConflict: "user_id" });

    // Rewards disponibles
    const rewardsDisponibles = REWARDS
      .filter((r) => nuevoStreak >= r.dias && !(gamif?.rewards_redeemed ?? []).includes(r.codigo))
      .map((r) => ({ nombre: r.desc, codigo: r.codigo, dias_para_siguiente: 0 }));

    // Siguiente reward
    const siguienteReward = REWARDS.find((r) => nuevoStreak < r.dias);

    // Mensaje de validación emocional
    const { data: prefs } = await supabase
      .from("user_quiz_preferences")
      .select("perfil_motivacional")
      .eq("user_id", user.id)
      .single();

    const validacion = generarValidacion(delta, prefs?.perfil_motivacional ?? 'pragmático', nuevoStreak);

    return NextResponse.json({
      success:              true,
      xp_earned:            xpBase + xpBonus,
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
