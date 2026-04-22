import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { data: gamif } = await supabase
      .from("user_gamification")
      .select("xp_total, streak_actual, streak_maximo, badges_collected, rewards_redeemed")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({ gamificacion: gamif ?? null });
  } catch (err) {
    console.error("Error en GET /api/mi-perfil/gamificacion:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
