import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { profesional_id, disponibilidad } = await req.json();
  if (!profesional_id) return NextResponse.json({ error: "Falta profesional_id" }, { status: 400 });

  const { error } = await supabase
    .from("profesionales")
    .update({ disponibilidad })
    .eq("id", profesional_id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
