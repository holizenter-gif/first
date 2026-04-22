import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { createAdminClient }         from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { sleepcast_id, calidad_sueno, tiempo_dormido, notas } = await req.json();

    if (calidad_sueno == null) {
      return NextResponse.json({ error: "calidad_sueno es requerido" }, { status: 400 });
    }

    const hoy   = new Date().toISOString().split("T")[0];
    const admin = createAdminClient();

    const { error } = await admin
      .from("user_sueno_tracking")
      .upsert({
        user_id:       user.id,
        fecha:         hoy,
        sleepcast_id:  sleepcast_id ?? null,
        completado:    true,
        calidad_sueno,
        tiempo_dormido: tiempo_dormido ?? null,
        notas:         notas ?? null,
      }, { onConflict: "user_id,fecha" });

    if (error) throw error;

    // Actualizar streak_sueno
    const { data: gamif } = await admin
      .from("user_gamification")
      .select("streak_sueno, ultima_sueno_fecha")
      .eq("user_id", user.id)
      .single();

    const ayer    = new Date(); ayer.setDate(ayer.getDate() - 1);
    const ayerStr = ayer.toISOString().split("T")[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g: any  = gamif;
    const ultima  = g?.ultima_sueno_fecha as string | undefined;
    const streakAnterior: number = g?.streak_sueno ?? 0;

    const nuevoStreak = ultima === ayerStr ? streakAnterior + 1
                      : ultima === hoy     ? streakAnterior
                      : 1;

    await admin
      .from("user_gamification")
      .upsert({
        user_id:            user.id,
        streak_sueno:       nuevoStreak,
        ultima_sueno_fecha: hoy,
        updated_at:         new Date().toISOString(),
      }, { onConflict: "user_id" });

    return NextResponse.json({ success: true, streak_sueno: nuevoStreak });
  } catch (err) {
    console.error("Error en POST /api/tareas/registrar-sueno:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const hoy = new Date().toISOString().split("T")[0];

    const { data: registro } = await supabase
      .from("user_sueno_tracking")
      .select("completado, calidad_sueno, tiempo_dormido, notas, sleepcast_id")
      .eq("user_id", user.id)
      .eq("fecha",   hoy)
      .single();

    const { data: sleepcasts } = await supabase
      .from("sleepcasts")
      .select("id, nombre, duracion_min, protocolo, complejidad, emocion_ideal")
      .eq("activa", true)
      .order("nombre");

    const { data: gamif } = await supabase
      .from("user_gamification")
      .select("streak_sueno")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({
      registro_hoy: registro ?? null,
      sleepcasts:   sleepcasts ?? [],
      streak_sueno: gamif?.streak_sueno ?? 0,
    });
  } catch (err) {
    console.error("Error en GET /api/tareas/registrar-sueno:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
