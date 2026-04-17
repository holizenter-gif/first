import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { evento_id, nombre, email, whatsapp, empresa, status_inicial } = await req.json();

  if (!evento_id || !nombre || !email) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  // "confirmado" para eventos gratuitos, "pendiente" para eventos de pago
  const statusRegistro = status_inicial === "pendiente" ? "pendiente" : "confirmado";

  const supabase = await createClient();

  // Verificar que el evento existe y tiene cupo
  const { data: ev, error: evError } = await supabase
    .from("eventos")
    .select("id, cupo_maximo, cupo_actual, activo, pasado")
    .eq("id", evento_id)
    .single();

  if (evError || !ev) {
    return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  }

  if (!ev.activo || ev.pasado) {
    return NextResponse.json({ error: "Este evento ya no acepta registros" }, { status: 400 });
  }

  // Solo validar cupo para registros confirmados (los pendientes no ocupan lugar hasta pagar)
  if (statusRegistro === "confirmado" && ev.cupo_maximo !== null) {
    const cupoActual = ev.cupo_actual ?? 0;
    if (cupoActual >= ev.cupo_maximo) {
      return NextResponse.json({ error: "El cupo del evento está agotado" }, { status: 400 });
    }
  }

  // Verificar que no hay registro duplicado (confirmado o pendiente)
  const { data: existente } = await supabase
    .from("registros_eventos")
    .select("id")
    .eq("evento_id", evento_id)
    .eq("email", email)
    .single();

  if (existente) {
    return NextResponse.json({ error: "Ya tienes un registro para este evento con ese email" }, { status: 409 });
  }

  // Insertar registro
  const { data: registro, error: insertError } = await supabase
    .from("registros_eventos")
    .insert({
      evento_id,
      nombre,
      email,
      whatsapp:  whatsapp  || null,
      empresa:   empresa   || null,
      status:    statusRegistro,
    })
    .select("id")
    .single();

  if (insertError || !registro) {
    return NextResponse.json({ error: "Error al guardar registro" }, { status: 500 });
  }

  // Solo incrementar cupo para registros confirmados (gratuitos)
  if (statusRegistro === "confirmado") {
    try {
      await supabase.rpc("incrementar_cupo_evento", { p_evento_id: evento_id });
    } catch {
      await supabase
        .from("eventos")
        .update({ cupo_actual: (ev.cupo_actual ?? 0) + 1 })
        .eq("id", evento_id);
    }
  }

  return NextResponse.json({ success: true, registro_id: registro.id });
}
