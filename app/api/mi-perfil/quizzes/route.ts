import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit  = Math.min(Number(searchParams.get("limit")  ?? 10), 50);
  const offset = Number(searchParams.get("offset") ?? 0);

  const { data: quizzes, error, count } = await supabase
    .from("user_quiz_history")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error obteniendo quizzes:", error);
    return NextResponse.json({ error: "Error al obtener historial" }, { status: 500 });
  }

  return NextResponse.json({ quizzes: quizzes ?? [], total_count: count ?? 0 });
}
