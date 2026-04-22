import { NextRequest, NextResponse }    from "next/server";
import { createClient }                 from "@/lib/supabase/server";
import { createAdminClient }            from "@/lib/supabase/admin";
import { generarPlan7Dias }             from "@/lib/tareas/logic";

// A-D → valor final para cada variable
const MAP_MOTIVACION: Record<string, string> = {
  A: "pragmatico",
  B: "introspectivo",
  C: "comunitario",
  D: "competitivo",
};
const MAP_EMOCION: Record<string, string> = {
  A: "mantenimiento",
  B: "ansiedad",
  C: "estres",
  D: "burnout",
};
const MAP_TIEMPO: Record<string, string> = {
  A: "5min",
  B: "10min",
  C: "15min",
  D: "20min+",
};
const MAP_TONO: Record<string, string> = {
  A: "accion",
  B: "exploratorio",
  C: "restaurativo",
  D: "profundo",
};

function votar(valores: string[]): string {
  const conteo: Record<string, number> = {};
  for (const v of valores) conteo[v] = (conteo[v] ?? 0) + 1;
  return Object.entries(conteo).sort(([, a], [, b]) => b - a)[0][0];
}

export async function POST(req: NextRequest) {
  let paso = "P0:init";
  try {
    // P1 — Auth
    paso = "P1:getUser";
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado", step: paso }, { status: 401 });
    }
    const user_id = user.id;
    console.log(`[${paso}] user_id=${user_id}`);

    // P2 — Parse body (acepta respuesta_p1..p6)
    paso = "P2:parseBody";
    const body = await req.json();
    const { respuesta_p1, respuesta_p2, respuesta_p3, respuesta_p4, respuesta_p5, respuesta_p6 } = body;
    console.log(`[${paso}]`, JSON.stringify({ respuesta_p1, respuesta_p2, respuesta_p3, respuesta_p4, respuesta_p5, respuesta_p6 }));

    if (!respuesta_p1 || !respuesta_p2 || !respuesta_p3 || !respuesta_p4 || !respuesta_p5 || !respuesta_p6) {
      return NextResponse.json({ error: "Respuestas incompletas (p1-p6 requeridas)", step: paso }, { status: 400 });
    }

    // P3 — Mapeo
    paso = "P3:mapeo";
    const perfil_motivacional = votar([
      MAP_MOTIVACION[respuesta_p1] ?? respuesta_p1,
      MAP_MOTIVACION[respuesta_p2] ?? respuesta_p2,
    ]);
    const emocion_actual = votar([
      MAP_EMOCION[respuesta_p3] ?? respuesta_p3,
      MAP_EMOCION[respuesta_p4] ?? respuesta_p4,
    ]);
    const tiempo_disponible = MAP_TIEMPO[respuesta_p5] ?? respuesta_p5;
    const tono_intencional  = MAP_TONO[respuesta_p6]  ?? respuesta_p6;
    console.log(`[${paso}]`, JSON.stringify({ perfil_motivacional, emocion_actual, tiempo_disponible, tono_intencional }));

    // P4 — Upsert user_quiz_preferences (sin preguntas_usadas)
    paso = "P4:upsert_preferences";
    const { error: upsertError } = await supabase
      .from("user_quiz_preferences")
      .upsert({
        user_id,
        perfil_motivacional,
        emocion_actual,
        tiempo_disponible,
        tono_intencional,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (upsertError) {
      console.error(`[${paso}]`, JSON.stringify(upsertError));
      return NextResponse.json({ error: "Error guardando perfil", step: paso, detail: upsertError.message, code: upsertError.code }, { status: 500 });
    }
    console.log(`[${paso}] OK`);

    // P5 — Historial de preguntas (admin para saltarse RLS)
    paso = "P5:historial";
    const admin = createAdminClient();
    const hoy = new Date().toISOString().split("T")[0];
    const historial = [
      { user_id, pregunta_id: "onboarding_p1", respuesta: respuesta_p1, tipo_quiz: "onboarding", fecha: hoy },
      { user_id, pregunta_id: "onboarding_p2", respuesta: respuesta_p2, tipo_quiz: "onboarding", fecha: hoy },
      { user_id, pregunta_id: "onboarding_p3", respuesta: respuesta_p3, tipo_quiz: "onboarding", fecha: hoy },
      { user_id, pregunta_id: "onboarding_p4", respuesta: respuesta_p4, tipo_quiz: "onboarding", fecha: hoy },
      { user_id, pregunta_id: "onboarding_p5", respuesta: respuesta_p5, tipo_quiz: "onboarding", fecha: hoy },
      { user_id, pregunta_id: "onboarding_p6", respuesta: respuesta_p6, tipo_quiz: "onboarding", fecha: hoy },
    ];
    const { error: histError } = await admin.from("user_preguntas_historial").insert(historial);
    if (histError) {
      // No bloqueante — el perfil ya se guardó
      console.error(`[${paso}] (non-blocking)`, JSON.stringify(histError));
    } else {
      console.log(`[${paso}] OK`);
    }

    // P6 — Init gamificación
    paso = "P6:gamificacion";
    const { error: gamifError } = await admin
      .from("user_gamification")
      .upsert({ user_id }, { onConflict: "user_id", ignoreDuplicates: true });
    if (gamifError) console.error(`[${paso}]`, JSON.stringify(gamifError));
    else console.log(`[${paso}] OK`);

    // P7 — Generar plan 7 días
    paso = "P7:generarPlan";
    const perfil = { motivacional: perfil_motivacional, emocion: emocion_actual, tiempo: tiempo_disponible, tono: tono_intencional };
    const plan7dias = await generarPlan7Dias(admin, perfil);
    console.log(`[${paso}] length=${plan7dias.length}`, plan7dias.map((t) => t.tarea_id).join(","));

    if (plan7dias.length === 0) {
      return NextResponse.json({ error: "Sin tareas para el perfil", step: paso, perfil }, { status: 500 });
    }

    // P8 — Asignar tareas
    paso = "P8:asignar";
    const base = new Date();
    const asignaciones = plan7dias.map((t, i) => {
      const f = new Date(base);
      f.setDate(base.getDate() + i);
      return { user_id, tarea_id: t.tarea_id, fecha_asignada: f.toISOString().split("T")[0] };
    });
    const { error: asigError } = await admin
      .from("user_tareas_asignadas")
      .upsert(asignaciones, { onConflict: "user_id,fecha_asignada", ignoreDuplicates: true });
    if (asigError) {
      console.error(`[${paso}]`, JSON.stringify(asigError));
      return NextResponse.json({ error: "Error asignando tareas", step: paso, detail: asigError.message, code: asigError.code }, { status: 500 });
    }
    console.log(`[${paso}] OK`);

    return NextResponse.json({
      success:            true,
      perfil_motivacional,
      emocion_actual,
      tiempo_disponible,
      tono_intencional,
      plan_7dias:         plan7dias,
    });

  } catch (error) {
    console.error("QUIZ_ERROR:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error", step: paso, detail: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
