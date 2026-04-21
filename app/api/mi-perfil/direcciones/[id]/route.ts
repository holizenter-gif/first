import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CP_REGEX  = /^\d{5}$/;
const LABEL_MAX = 50;

function validarDireccion(body: Record<string, string>) {
  const { label, calle, numero, ciudad, estado, codigo_postal } = body;
  if (label !== undefined) {
    if (!label.trim())           return "El label no puede estar vacío";
    if (label.length > LABEL_MAX) return `El label no puede superar ${LABEL_MAX} caracteres`;
  }
  if (calle    !== undefined && !calle.trim())   return "La calle no puede estar vacía";
  if (numero   !== undefined && !numero.trim())  return "El número no puede estar vacío";
  if (ciudad   !== undefined && !ciudad.trim())  return "La ciudad no puede estar vacía";
  if (estado   !== undefined && !estado.trim())  return "El estado no puede estar vacío";
  if (codigo_postal !== undefined) {
    if (!codigo_postal.trim())              return "El código postal es requerido";
    if (!CP_REGEX.test(codigo_postal.trim())) return "El código postal debe tener exactamente 5 dígitos";
  }
  return null;
}

interface Props { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const validError = validarDireccion(body);
  if (validError) return NextResponse.json({ error: validError }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (body.label         !== undefined) updates.label         = body.label.trim();
  if (body.calle         !== undefined) updates.calle         = body.calle.trim();
  if (body.numero        !== undefined) updates.numero        = body.numero.trim();
  if (body.apartamento   !== undefined) updates.apartamento   = body.apartamento?.trim() || null;
  if (body.ciudad        !== undefined) updates.ciudad        = body.ciudad.trim();
  if (body.estado        !== undefined) updates.estado        = body.estado.trim();
  if (body.codigo_postal !== undefined) updates.codigo_postal = body.codigo_postal.trim();
  if (body.is_default    !== undefined) updates.is_default    = body.is_default;

  const { data: direction, error } = await supabase
    .from("user_directions")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error) return NextResponse.json({ error: "Error al actualizar dirección" }, { status: 500 });
  if (!direction || direction.length === 0) return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 });

  return NextResponse.json({ success: true, direction: direction[0] });
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  // No permitir borrar si es la única dirección
  const { count } = await supabase
    .from("user_directions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) <= 1) {
    return NextResponse.json({ error: "Debes mantener al menos una dirección" }, { status: 400 });
  }

  // Verificar si era default antes de borrar
  const { data: target } = await supabase
    .from("user_directions")
    .select("is_default")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const { error } = await supabase
    .from("user_directions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "Error al eliminar dirección" }, { status: 500 });

  // Si era default, asignar la primera restante como default
  if (target?.is_default) {
    const { data: primera } = await supabase
      .from("user_directions")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (primera) {
      await supabase
        .from("user_directions")
        .update({ is_default: true })
        .eq("id", primera.id);
    }
  }

  return NextResponse.json({ success: true });
}
