import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { ids, activo } = await req.json() as { ids: string[]; activo: boolean };
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "IDs requeridos" }, { status: 400 });
  }

  const { error } = await supabase
    .from("productos")
    .update({ activo })
    .in("id", ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, updated: ids.length });
}
