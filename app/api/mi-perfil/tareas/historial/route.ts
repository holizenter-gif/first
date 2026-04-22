import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const mes = req.nextUrl.searchParams.get("mes") ?? new Date().toISOString().slice(0, 7);
    const desde = `${mes}-01`;
    const hasta  = new Date(mes + "-01");
    hasta.setMonth(hasta.getMonth() + 1);
    const hastaStr = hasta.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("user_tareas_asignadas")
      .select("id, tarea_id, fecha_asignada, completada, emocion_antes, emocion_despues, notas")
      .eq("user_id", user.id)
      .gte("fecha_asignada", desde)
      .lt("fecha_asignada",  hastaStr)
      .order("fecha_asignada", { ascending: false });

    if (error) return NextResponse.json({ error: "Error obteniendo historial" }, { status: 500 });

    // Enriquecer con nombre de tarea
    const tareasIds = [...new Set((data ?? []).map((r) => r.tarea_id))];
    const { data: tareas } = await supabase
      .from("tareas_pool")
      .select("id, nombre")
      .in("id", tareasIds);

    const tareaMap = Object.fromEntries((tareas ?? []).map((t) => [t.id, t]));
    const registros = (data ?? []).map((r) => ({
      ...r,
      tarea: tareaMap[r.tarea_id] ?? null,
    }));

    return NextResponse.json({ registros });
  } catch (err) {
    console.error("Error en historial tareas:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
