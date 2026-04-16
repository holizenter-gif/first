import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { evento_id, nombre, email, whatsapp, empresa } = await req.json();

  if (!evento_id || !nombre || !email) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

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

  if (ev.cupo_maximo !== null) {
    const cupoActual = ev.cupo_actual ?? 0;
    if (cupoActual >= ev.cupo_maximo) {
      return NextResponse.json({ error: "El cupo del evento está agotado" }, { status: 400 });
    }
  }

  // Verificar que no hay registro duplicado
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
  const { error: insertError } = await supabase
    .from("registros_eventos")
    .insert({ evento_id, nombre, email, whatsapp: whatsapp || null, empresa: empresa || null });

  if (insertError) {
    return NextResponse.json({ error: "Error al guardar registro" }, { status: 500 });
  }

  // Incrementar cupo_actual
  try {
    await supabase.rpc("incrementar_cupo_evento", { p_evento_id: evento_id });
  } catch {
    // Fallback: update manual si la RPC no existe
    await supabase
      .from("eventos")
      .update({ cupo_actual: (ev.cupo_actual ?? 0) + 1 })
      .eq("id", evento_id);
  }

  return NextResponse.json({ success: true });
}
