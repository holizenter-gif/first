import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { producto_id, calificacion, nombre, comentario } = body;

    if (!producto_id || !calificacion || !nombre || !comentario) {
      return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });
    }
    if (calificacion < 1 || calificacion > 5) {
      return NextResponse.json({ error: "Calificación inválida" }, { status: 400 });
    }
    if (nombre.length > 80 || comentario.length > 600) {
      return NextResponse.json({ error: "Texto demasiado largo" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("resenas").insert({
      producto_id,
      calificacion,
      nombre:      nombre.trim(),
      comentario:  comentario.trim(),
      aprobada:    false,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("POST /api/resenas:", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
