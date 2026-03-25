import { createClient } from "@/lib/supabase/server";
import type { Profesional } from "@/lib/supabase/types";
export { getModalidadLabel, formatPrecioSesion } from "./profesionales-utils";

export async function getProfesionales(): Promise<Profesional[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profesionales")
    .select("*")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) {
    console.error("Error cargando profesionales:", error);
    return [];
  }
  return data ?? [];
}

export async function getProfesionalBySlug(slug: string): Promise<Profesional | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profesionales")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (error) return null;
  return data;
}
