import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CP_REGEX    = /^\d{5}$/;
const LABEL_MAX   = 50;

function validarDireccion(body: Record<string, string>) {
  const { label, calle, numero, ciudad, estado, codigo_postal } = body;
  if (!label?.trim())          return "El label es requerido";
  if (label.length > LABEL_MAX) return `El label no puede superar ${LABEL_MAX} caracteres`;
  if (!calle?.trim())          return "La calle es requerida";
  if (!numero?.trim())         return "El número es requerido";
  if (!ciudad?.trim())         return "La ciudad es requerida";
  if (!estado?.trim())         return "El estado es requerido";
  if (!codigo_postal?.trim())  return "El código postal es requerido";
  if (!CP_REGEX.test(codigo_postal.trim())) return "El código postal debe tener exactamente 5 dígitos";
  return null;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data: direcciones, error } = await supabase
    .from("user_directions")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at",  { ascending: false });

  if (error) return NextResponse.json({ error: "Error al obtener direcciones" }, { status: 500 });
  return NextResponse.json({ direcciones: direcciones ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const validError = validarDireccion(body);
  if (validError) return NextResponse.json({ error: validError }, { status: 400 });

  const { label, calle, numero, apartamento, ciudad, estado, codigo_postal } = body;

  // Verificar duplicados
  const { data: existente } = await supabase
    .from("user_directions")
    .select("id")
    .eq("user_id", user.id)
    .eq("calle",          calle.trim())
    .eq("numero",         numero.trim())
    .eq("codigo_postal",  codigo_postal.trim())
    .maybeSingle();

  if (existente) return NextResponse.json({ error: "Esta dirección ya existe" }, { status: 409 });

  // Si es la primera dirección, marcar como default
  const { count } = await supabase
    .from("user_directions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: direction, error } = await supabase
    .from("user_directions")
    .insert({
      user_id:        user.id,
      label:          label.trim(),
      calle:          calle.trim(),
      numero:         numero.trim(),
      apartamento:    apartamento?.trim() || null,
      ciudad:         ciudad.trim(),
      estado:         estado.trim(),
      codigo_postal:  codigo_postal.trim(),
      is_default:     (count ?? 0) === 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error insertando dirección:", error);
    return NextResponse.json({ error: "Error al guardar dirección" }, { status: 500 });
  }

  return NextResponse.json({ success: true, direction }, { status: 201 });
}
