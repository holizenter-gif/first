import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { createAdminClient }         from "@/lib/supabase/admin";
import { scoringOnboarding, generarPlan7Dias } from "@/lib/tareas/logic";
import type { Letra } from "@/lib/tareas/preguntas";

export async function POST(req: NextRequest) {
  let paso = "P0:init";
  try {
    // P1 — Auth
    paso = "P1:getUser";
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error(`[${paso}] authError:`, JSON.stringify(authError));
      return NextResponse.json({ error: "Auth error", detail: authError.message }, { status: 401 });
    }
    if (!user) {
      console.error(`[${paso}] no user`);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.log(`[${paso}] user_id=${user.id}`);

    // P2 — Parse body
    paso = "P2:parseBody";
    const body: Record<string, Letra> = await req.json();
    const { ob_q1, ob_q2, ob_q3, ob_q4, ob_q5, ob_q6 } = body;
    console.log(`[${paso}]`, JSON.stringify({ ob_q1, ob_q2, ob_q3, ob_q4, ob_q5, ob_q6 }));

    if (!ob_q1 || !ob_q2 || !ob_q3 || !ob_q4 || !ob_q5 || !ob_q6) {
      return NextResponse.json({ error: "Faltan respuestas del quiz" }, { status: 400 });
    }

    // P3 — Scoring
    paso = "P3:scoring";
    const perfil = scoringOnboarding({ ob_q1, ob_q2, ob_q3, ob_q4, ob_q5, ob_q6 });
    console.log(`[${paso}]`, JSON.stringify(perfil));

    // P4 — Upsert user_quiz_preferences
    paso = "P4:upsert_preferences";
    const admin = createAdminClient();
    const upsertPayload = {
      user_id:             user.id,
      perfil_motivacional: perfil.motivacional,
      emocion_actual:      perfil.emocion,
      tiempo_disponible:   perfil.tiempo,
      tono_intencional:    perfil.tono,
      preguntas_usadas:    [],
      updated_at:          new Date().toISOString(),
    };
    console.log(`[${paso}] payload:`, JSON.stringify(upsertPayload));

    const { error: upsertError } = await admin
      .from("user_quiz_preferences")
      .upsert(upsertPayload, { onConflict: "user_id" });

    if (upsertError) {
      console.error(`[${paso}] error:`, JSON.stringify(upsertError));
      return NextResponse.json({
        error:  "Error guardando perfil",
        step:   paso,
        detail: upsertError.message,
        code:   upsertError.code,
        hint:   (upsertError as Record<string, unknown>).hint ?? null,
      }, { status: 500 });
    }
    console.log(`[${paso}] OK`);

    // P5 — Init gamificación
    paso = "P5:upsert_gamification";
    const { error: gamifError } = await admin
      .from("user_gamification")
      .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });

    if (gamifError) {
      console.error(`[${paso}] error:`, JSON.stringify(gamifError));
      return NextResponse.json({
        error:  "Error inicializando gamificación",
        step:   paso,
        detail: gamifError.message,
        code:   gamifError.code,
      }, { status: 500 });
    }
    console.log(`[${paso}] OK`);

    // P6 — Generar plan 7 días
    paso = "P6:generarPlan";
    const plan7dias = await generarPlan7Dias(admin, perfil);
    console.log(`[${paso}] plan length=${plan7dias.length}`, plan7dias.map((t) => t.tarea_id).join(","));

    if (plan7dias.length === 0) {
      console.error(`[${paso}] plan vacío para perfil:`, JSON.stringify(perfil));
      return NextResponse.json({
        error:  "No se encontraron tareas para el perfil",
        step:   paso,
        perfil,
      }, { status: 500 });
    }

    // P7 — Asignar tareas 7 días
    paso = "P7:upsert_asignaciones";
    const hoy = new Date();
    const asignaciones = plan7dias.map((t, i) => {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      return {
        user_id:        user.id,
        tarea_id:       t.tarea_id,
        fecha_asignada: fecha.toISOString().split("T")[0],
      };
    });
    console.log(`[${paso}] asignaciones:`, asignaciones.map((a) => a.fecha_asignada).join(","));

    const { error: asigError } = await admin
      .from("user_tareas_asignadas")
      .upsert(asignaciones, { onConflict: "user_id,fecha_asignada", ignoreDuplicates: true });

    if (asigError) {
      console.error(`[${paso}] error:`, JSON.stringify(asigError));
      return NextResponse.json({
        error:  "Error asignando tareas",
        step:   paso,
        detail: asigError.message,
        code:   asigError.code,
      }, { status: 500 });
    }
    console.log(`[${paso}] OK`);

    return NextResponse.json({
      perfil_motivacional: perfil.motivacional,
      emocion_actual:      perfil.emocion,
      tiempo_disponible:   perfil.tiempo,
      tono_intencional:    perfil.tono,
      plan_7dias:          plan7dias,
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error(`[${paso}] CAUGHT EXCEPTION:`, msg, stack);
    return NextResponse.json({
      error:  "Error interno",
      step:   paso,
      detail: msg,
    }, { status: 500 });
  }
}
