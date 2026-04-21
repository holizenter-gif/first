import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const [{ data: profile }, { data: direcciones }] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_directions").select("*").eq("user_id", user.id).order("is_default", { ascending: false }).order("created_at", { ascending: false }),
  ]);

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("user_profiles")
      .insert({ id: user.id, email: user.email })
      .select()
      .single();
    return NextResponse.json({ profile: newProfile, direcciones: direcciones ?? [] });
  }

  return NextResponse.json({ profile, direcciones: direcciones ?? [] });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { nombre, apellido, telefono, ocupacion, ciudad, empresa, bio } = body;

  if (telefono && !/^\d{10}$/.test(telefono.replace(/\s/g, ""))) {
    return NextResponse.json({ error: "El teléfono debe tener 10 dígitos" }, { status: 400 });
  }
  if (bio && bio.length > 500) {
    return NextResponse.json({ error: "La bio no puede superar 500 caracteres" }, { status: 400 });
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .update({
      nombre:    nombre    ?? null,
      apellido:  apellido  ?? null,
      telefono:  telefono  ?? null,
      ocupacion: ocupacion ?? null,
      ciudad:    ciudad    ?? null,
      empresa:   empresa   ?? null,
      bio:       bio       ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error actualizando perfil:", error);
    return NextResponse.json({ error: "Error al guardar perfil" }, { status: 500 });
  }

  return NextResponse.json({ success: true, profile });
}
