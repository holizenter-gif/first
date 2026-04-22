import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { createAdminClient }         from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const {
      emocion_dominante,
      intensidad,
      trigger,
      accion_tomada,
      resultado,
    } = await req.json();

    if (!emocion_dominante || intensidad == null) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const hoy  = new Date().toISOString().split("T")[0];
    const hora = new Date().toTimeString().slice(0, 8);

    const delta_resiliencia = resultado != null && intensidad != null
      ? resultado - intensidad
      : null;

    const admin = createAdminClient();

    const { error } = await admin
      .from("user_emotion_tracking")
      .insert({
        user_id:          user.id,
        fecha:            hoy,
        hora,
        emocion_dominante,
        intensidad,
        trigger:          trigger ?? null,
        accion_tomada:    accion_tomada ?? null,
        resultado:        resultado ?? null,
        delta_resiliencia,
      });

    if (error) throw error;

    // Actualizar patrón de resiliencia si hay delta positivo
    if (delta_resiliencia != null && delta_resiliencia > 0 && accion_tomada) {
      const { data: patron } = await admin
        .from("user_resiliencia_patrones")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (patron) {
        await admin
          .from("user_resiliencia_patrones")
          .update({
            patron_dominante:               emocion_dominante,
            trigger_promedio:               trigger ?? patron.trigger_promedio,
            accion_mas_efectiva:            accion_tomada,
            velocidad_recuperacion_promedio: delta_resiliencia,
            updated_at:                     new Date().toISOString(),
          })
          .eq("user_id", user.id);
      } else {
        await admin
          .from("user_resiliencia_patrones")
          .insert({
            user_id:                         user.id,
            patron_dominante:                emocion_dominante,
            trigger_promedio:                trigger ?? null,
            accion_mas_efectiva:             accion_tomada,
            velocidad_recuperacion_promedio: delta_resiliencia,
          });
      }
    }

    return NextResponse.json({ success: true, delta_resiliencia });
  } catch (err) {
    console.error("Error en POST /api/tareas/registrar-emocion:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
