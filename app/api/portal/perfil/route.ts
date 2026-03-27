import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { user_id: _uid, ...fields } = body;

  const { data, error } = await supabase
    .from("profesionales")
    .update(fields)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
