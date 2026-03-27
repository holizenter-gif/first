import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "productos-digitales";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
  }

  const ext      = file.name.split(".").pop() ?? "bin";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path     = `archivos/${fileName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    path,
    nombre: file.name,
    tamano: file.size,
  });
}
