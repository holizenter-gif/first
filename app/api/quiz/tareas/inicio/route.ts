import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { createAdminClient }         from "@/lib/supabase/admin";
import { scoringOnboarding, generarPlan7Dias } from "@/lib/tareas/logic";
import type { Letra } from "@/lib/tareas/preguntas";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body: Record<string, Letra> = await req.json();
    const { ob_q1, ob_q2, ob_q3, ob_q4, ob_q5, ob_q6 } = body;

    if (!ob_q1 || !ob_q2 || !ob_q3 || !ob_q4 || !ob_q5 || !ob_q6) {
      return NextResponse.json({ error: "Faltan respuestas del quiz" }, { status: 400 });
    }

    const perfil = scoringOnboarding({ ob_q1, ob_q2, ob_q3, ob_q4, ob_q5, ob_q6 });

    const admin = createAdminClient();

    // Guardar / actualizar preferencias
    const { error: upsertError } = await admin
      .from("user_quiz_preferences")
      .upsert({
        user_id:            user.id,
        perfil_motivacional: perfil.motivacional,
        emocion_actual:     perfil.emocion,
        tiempo_disponible:  perfil.tiempo,
        tono_intencional:   perfil.tono,
        preguntas_usadas:   [],
        updated_at:         new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (upsertError) {
      console.error("Error guardando preferencias:", upsertError);
      return NextResponse.json({ error: "Error guardando perfil" }, { status: 500 });
    }

    // Inicializar gamificación si no existe
    await admin
      .from("user_gamification")
      .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });

    // Generar plan 7 días
    const plan7dias = await generarPlan7Dias(admin, perfil);

    // Asignar tareas a partir de hoy
    const hoy = new Date();
    const asignaciones = plan7dias.map((t, i) => {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      return {
        user_id:         user.id,
        tarea_id:        t.tarea_id,
        fecha_asignada:  fecha.toISOString().split("T")[0],
      };
    });

    await admin
      .from("user_tareas_asignadas")
      .upsert(asignaciones, { onConflict: "user_id,fecha_asignada", ignoreDuplicates: true });

    return NextResponse.json({
      perfil_motivacional: perfil.motivacional,
      emocion_actual:      perfil.emocion,
      tiempo_disponible:   perfil.tiempo,
      tono_intencional:    perfil.tono,
      plan_7dias:          plan7dias,
    });
  } catch (err) {
    console.error("Error en quiz/tareas/inicio:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
