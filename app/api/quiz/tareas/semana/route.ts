import { NextRequest, NextResponse }  from "next/server";
import { createClient }               from "@/lib/supabase/server";
import { createAdminClient }          from "@/lib/supabase/admin";
import {
  determinarPool,
  seleccionarPreguntasSemana,
  scoringSemana,
  generarPlan7Dias,
  todasPreguntasSemana,
} from "@/lib/tareas/logic";
import type { Letra } from "@/lib/tareas/preguntas";

// GET — devuelve las 4 preguntas que corresponden esta semana
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { data: prefs } = await supabase
      .from("user_quiz_preferences")
      .select("emocion_actual, preguntas_usadas, updated_at")
      .eq("user_id", user.id)
      .single();

    if (!prefs) {
      return NextResponse.json({ error: "Completa primero el quiz inicial" }, { status: 400 });
    }

    // Validar que no haya hecho check-in esta semana
    if (prefs.updated_at) {
      const ultima = new Date(prefs.updated_at);
      const ahora  = new Date();
      const diffDias = (ahora.getTime() - ultima.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDias < 7) {
        return NextResponse.json({
          error:        "Ya hiciste tu check-in esta semana",
          proxima_fecha: new Date(ultima.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }, { status: 429 });
      }
    }

    const pool            = determinarPool(prefs.emocion_actual as any);
    const preguntasUsadas = (prefs.preguntas_usadas as string[]) ?? [];
    const preguntas       = seleccionarPreguntasSemana(pool, preguntasUsadas);

    return NextResponse.json({ pool, preguntas });
  } catch (err) {
    console.error("Error en GET quiz/tareas/semana:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST — recibe respuestas, guarda perfil, genera nuevo plan
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body: { respuestas: { pregunta_id: string; letra: Letra }[] } = await req.json();
    if (!body.respuestas || body.respuestas.length !== 4) {
      return NextResponse.json({ error: "Se requieren exactamente 4 respuestas" }, { status: 400 });
    }

    const { data: prefsActuales } = await supabase
      .from("user_quiz_preferences")
      .select("emocion_actual, preguntas_usadas")
      .eq("user_id", user.id)
      .single();

    const preguntasUsadasAntes  = (prefsActuales?.preguntas_usadas as string[]) ?? [];
    const preguntasEstasSemana  = body.respuestas.map((r) => r.pregunta_id);

    // Guardar historial de preguntas usadas (últimas 8 = 2 semanas × 4)
    const nuevasUsadas = [...preguntasEstasSemana, ...preguntasUsadasAntes].slice(0, 8);

    const todasPreguntas = todasPreguntasSemana();
    const perfil = scoringSemana(body.respuestas, todasPreguntas);

    const pool = determinarPool(prefsActuales?.emocion_actual as any ?? 'mantenimiento');

    const admin = createAdminClient();

    await admin
      .from("user_quiz_preferences")
      .update({
        perfil_motivacional: perfil.motivacional,
        emocion_actual:      perfil.emocion,
        tiempo_disponible:   perfil.tiempo,
        tono_intencional:    perfil.tono,
        preguntas_usadas:    nuevasUsadas,
        updated_at:          new Date().toISOString(),
      })
      .eq("user_id", user.id);

    const plan7dias = await generarPlan7Dias(admin, perfil);

    // Asignar tareas a partir de mañana (hoy ya tiene asignada)
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const asignaciones = plan7dias.map((t, i) => {
      const fecha = new Date(manana);
      fecha.setDate(manana.getDate() + i);
      return {
        user_id:        user.id,
        tarea_id:       t.tarea_id,
        fecha_asignada: fecha.toISOString().split("T")[0],
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
      pool_asignado:       pool,
      plan_7dias:          plan7dias,
    });
  } catch (err) {
    console.error("Error en POST quiz/tareas/semana:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
