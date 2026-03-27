import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file     = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No se recibió imagen" }, { status: 400 });

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 });
  }

  const ext      = file.name.split(".").pop();
  const filename = `productos/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const buffer   = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("imagenes-productos")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: publicUrl } = supabase.storage
    .from("imagenes-productos")
    .getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl.publicUrl });
}
