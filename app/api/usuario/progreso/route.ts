import { NextResponse }    from "next/server";
import { createClient }    from "@/lib/supabase/server";
import { BADGES, REWARDS } from "@/lib/tareas/constants";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { data: gamif } = await supabase
      .from("user_gamification")
      .select("xp_total, streak_actual, streak_maximo, streak_sueno, badges_collected, rewards_redeemed")
      .eq("user_id", user.id)
      .single();

    const { data: patron } = await supabase
      .from("user_resiliencia_patrones")
      .select("patron_dominante, accion_mas_efectiva, velocidad_recuperacion_promedio, updated_at")
      .eq("user_id", user.id)
      .single();

    const badgesActuales   = gamif?.badges_collected  ?? [];
    const rewardsCanjeados = gamif?.rewards_redeemed  ?? [];
    const streakActual     = gamif?.streak_actual     ?? 0;

    const badgesInfo = BADGES.map((b) => ({
      ...b,
      desbloqueado: badgesActuales.includes(b.id),
    }));

    const rewardsInfo = REWARDS.map((r) => ({
      ...r,
      disponible: streakActual >= r.dias && !rewardsCanjeados.includes(r.codigo),
      canjeado:   rewardsCanjeados.includes(r.codigo),
    }));

    const siguienteReward = REWARDS.find((r) => streakActual < r.dias);

    return NextResponse.json({
      xp_total:       gamif?.xp_total      ?? 0,
      streak_actual:  streakActual,
      streak_maximo:  gamif?.streak_maximo  ?? 0,
      streak_sueno:   gamif?.streak_sueno   ?? 0,
      badges:         badgesInfo,
      rewards:        rewardsInfo,
      siguiente_reward: siguienteReward
        ? { nombre: siguienteReward.desc, dias_faltantes: siguienteReward.dias - streakActual }
        : null,
      resiliencia:    patron ?? null,
    });
  } catch (err) {
    console.error("Error en GET /api/usuario/progreso:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
