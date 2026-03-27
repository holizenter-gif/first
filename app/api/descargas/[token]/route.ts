import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "productos-digitales";

interface Ctx {
  params: Promise<{ token: string }>;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { token } = await params;
  const supabase  = await createClient();

  // Fetch descarga record
  const { data: descarga, error } = await supabase
    .from("descargas")
    .select("*, productos(archivo_url, archivo_nombre)")
    .eq("token", token)
    .maybeSingle();

  if (error || !descarga) {
    return NextResponse.json({ error: "Token no válido" }, { status: 404 });
  }

  // Check expiry
  if (descarga.expira_en && new Date(descarga.expira_en) < new Date()) {
    return NextResponse.json({ error: "El enlace ha expirado" }, { status: 410 });
  }

  // Check download count
  if (descarga.max_descargas > 0 && descarga.descargas_realizadas >= descarga.max_descargas) {
    return NextResponse.json({ error: "Límite de descargas alcanzado" }, { status: 410 });
  }

  const archivoPath: string | null = descarga.productos?.archivo_url ?? null;
  if (!archivoPath) {
    return NextResponse.json({ error: "Archivo no disponible" }, { status: 404 });
  }

  // Generate signed URL (60 seconds)
  const { data: signed, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(archivoPath, 60);

  if (signErr || !signed?.signedUrl) {
    return NextResponse.json({ error: "No se pudo generar el enlace" }, { status: 500 });
  }

  // Increment download counter
  await supabase
    .from("descargas")
    .update({ descargas_realizadas: descarga.descargas_realizadas + 1 })
    .eq("id", descarga.id);

  return NextResponse.redirect(signed.signedUrl);
}
