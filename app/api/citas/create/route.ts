import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendCitaConfirmacion } from "@/lib/brevo";
import { sendWhatsAppNotification } from "@/lib/whatsapp";
import { triggerQuizWebhook } from "@/lib/make";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo, nombre, empresa, email, whatsapp, fecha, modalidad, cal_event_id } = body;

    const supabase = await createClient();

    const { data: cita, error } = await supabase
      .from("citas")
      .insert({
        tipo:             tipo      ?? "diagnostico_gratis",
        fecha:            fecha     ?? new Date().toISOString(),
        modalidad:        modalidad ?? "online",
        status:           "confirmada",
        cal_event_id:     cal_event_id ?? null,
        nombre_cliente:   nombre   ?? null,
        empresa_nombre:   empresa  ?? null,
        email_cliente:    email    ?? null,
        whatsapp_cliente: whatsapp ?? null,
      })
      .select()
      .single();

    if (error || !cita) {
      console.error("Error guardando cita:", error);
      return NextResponse.json({ error: "Error guardando cita" }, { status: 500 });
    }

    Promise.allSettled([
      email && nombre ? sendCitaConfirmacion({
        email, nombre,
        empresa:   empresa   ?? "",
        fecha:     fecha     ?? new Date().toISOString(),
        tipo:      tipo      ?? "diagnostico_gratis",
        modalidad: modalidad ?? "online",
      }) : Promise.resolve(),
      sendWhatsAppNotification({
        to:      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
        message: `📅 Nueva cita: ${nombre ?? "Sin nombre"} de ${empresa ?? "Sin empresa"} — ${tipo ?? "diagnostico_gratis"} — ${fecha ?? "Sin fecha"}`,
      }),
      triggerQuizWebhook({
        event:    "cita_agendada",
        cita_id:  cita.id,
        nombre, empresa, email, whatsapp, tipo, fecha, modalidad,
      }),
    ]).catch(console.error);

    return NextResponse.json({ success: true, cita_id: cita.id });

  } catch (error) {
    console.error("Error en citas/create:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
