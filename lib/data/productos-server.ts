import { createClient } from "@/lib/supabase/server";
import type { Producto } from "@/lib/data/productos-helpers";

export async function getProductos(opts?: {
  categoria?:   string;
  soloActivos?: boolean;
}): Promise<Producto[]> {
  const supabase = await createClient();
  let query = supabase
    .from("productos")
    .select("*")
    .order("orden", { ascending: true });

  if (opts?.soloActivos !== false) query = query.eq("activo", true);
  if (opts?.categoria && opts.categoria !== "todos") {
    query = query.eq("categoria", opts.categoria);
  }

  const { data, error } = await query;
  if (error) { console.error("Error cargando productos:", error); return []; }
  return (data ?? []) as Producto[];
}

export async function getProductoBySlug(slug: string): Promise<Producto | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("productos")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .single();
  return (data as Producto | null) ?? null;
}
