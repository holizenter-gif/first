import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getScoreResult } from "@/lib/quiz-scoring";
import { sendQuizReport } from "@/lib/brevo";
import { sendWhatsAppNotification } from "@/lib/whatsapp";
import { triggerQuizWebhook } from "@/lib/make";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, empresa, email, whatsapp, quiz_type, respuestas } = body;

    if (!nombre || !empresa || !email || !whatsapp || !respuestas) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const supabase = await createClient();
    const result   = getScoreResult(respuestas);

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        nombre, empresa, email, whatsapp,
        quiz_id: quiz_type,
        puntaje: result.puntaje,
        resultado: result.nivel,
        servicio_recomendado: result.servicio_recomendado,
        estado_crm: "nuevo",
      })
      .select()
      .single();

    if (leadError || !lead) {
      console.error("Error guardando lead:", leadError);
      return NextResponse.json({ error: "Error guardando datos" }, { status: 500 });
    }

    await supabase.from("quiz_responses").insert({
      lead_id: lead.id, quiz_type, respuestas, puntaje_total: result.puntaje,
    });

    Promise.allSettled([
      sendQuizReport({ email, nombre, score: result.puntaje, nivel: result.nivel, servicio_recomendado: result.servicio_recomendado, quiz_type }),
      result.nivel === "critico"
        ? sendWhatsAppNotification({ to: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "", message: `🚨 Lead CRÍTICO: ${nombre} de ${empresa} (${email}) — Score: ${result.puntaje}%` })
        : Promise.resolve(),
      triggerQuizWebhook({ lead_id: lead.id, nombre, empresa, email, whatsapp, quiz_type, puntaje: result.puntaje, nivel: result.nivel, servicio_recomendado: result.servicio_recomendado, created_at: lead.created_at }),
    ]).catch(console.error);

    return NextResponse.json({
      success: true, lead_id: lead.id, puntaje: result.puntaje, nivel: result.nivel,
      servicio_recomendado: result.servicio_recomendado, descripcion: result.descripcion,
      color: result.color, emoji: result.emoji,
    });
  } catch (error) {
    console.error("Error en quiz submit:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
