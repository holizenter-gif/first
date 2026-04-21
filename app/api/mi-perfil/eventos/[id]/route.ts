import { NextRequest, NextResponse }  from "next/server";
import { createClient }               from "@/lib/supabase/server";
import { createAdminClient }          from "@/lib/supabase/admin";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // Verificar que el registro pertenece al usuario
    const { data: registro, error: fetchError } = await supabase
      .from("registros_eventos")
      .select("id, email, status, evento_id")
      .eq("id", id)
      .single();

    if (fetchError || !registro) {
      return NextResponse.json({ error: "Registro no encontrado" }, { status: 404 });
    }

    if (registro.email !== user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    if (registro.status === "cancelado") {
      return NextResponse.json({ error: "El registro ya está cancelado" }, { status: 409 });
    }

    const admin = createAdminClient();

    // Cancelar registro
    const { error: updateError } = await admin
      .from("registros_eventos")
      .update({ status: "cancelado" })
      .eq("id", id);

    if (updateError) {
      console.error("Error cancelando registro:", updateError);
      return NextResponse.json({ error: "Error al cancelar registro" }, { status: 500 });
    }

    // Decrementar cupo solo si el registro estaba confirmado
    if (registro.status === "confirmado") {
      const { data: ev } = await admin
        .from("eventos")
        .select("cupo_actual")
        .eq("id", registro.evento_id)
        .single();

      if (ev && (ev.cupo_actual ?? 0) > 0) {
        await admin
          .from("eventos")
          .update({ cupo_actual: ev.cupo_actual - 1 })
          .eq("id", registro.evento_id);
      }
    }

    return NextResponse.json({ success: true, message: "Registro cancelado" });
  } catch (err) {
    console.error("Error en DELETE /api/mi-perfil/eventos/[id]:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
