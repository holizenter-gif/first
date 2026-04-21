import { NextResponse }  from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error en signOut:", error);
      // Aún retornamos éxito; el cliente limpia su estado
    }

    return NextResponse.json({ success: true, message: "Sesión cerrada" });

  } catch (error) {
    console.error("Error en logout:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
