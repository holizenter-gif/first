import { createClient } from "@/lib/supabase/server";

export interface BlogPost {
  id:             string;
  slug:           string;
  titulo:         string;
  descripcion:    string | null;
  contenido:      string;
  imagen_url:     string | null;
  categoria:      string;
  tags:           string[];
  autor:          string;
  quiz_id:        string | null;
  publicado:      boolean;
  destacado:      boolean;
  vistas:         number;
  tiempo_lectura: string;
  created_at:     string;
  updated_at:     string;
  published_at:   string | null;
}

export const CATEGORIA_LABELS: Record<string, string> = {
  articulo:    "Artículo",
  noticia:     "Noticia",
  reflexion:   "Reflexión",
  guia:        "Guía",
  caso_exito:  "Caso de éxito",
};

export const CATEGORIA_COLORS: Record<string, string> = {
  articulo:    "bg-brand-teal text-white",
  noticia:     "bg-brand-dark text-white",
  reflexion:   "bg-brand-olive-50 text-brand-olive",
  guia:        "bg-brand-teal-50 text-brand-teal",
  caso_exito:  "bg-amber-50 text-amber-700",
};

export async function getAllPosts(opts?: {
  categoria?: string;
  busqueda?:  string;
  limite?:    number;
}): Promise<BlogPost[]> {
  const supabase = await createClient();
  let query = supabase
    .from("articulos")
    .select("*")
    .eq("publicado", true)
    .order("published_at", { ascending: false });

  if (opts?.categoria && opts.categoria !== "todos") {
    query = query.eq("categoria", opts.categoria);
  }
  if (opts?.busqueda) {
    query = query.or(
      `titulo.ilike.%${opts.busqueda}%,descripcion.ilike.%${opts.busqueda}%`
    );
  }
  if (opts?.limite) {
    query = query.limit(opts.limite);
  }

  const { data, error } = await query;
  if (error) { console.error("Error cargando artículos:", error); return []; }
  return (data ?? []) as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articulos")
    .select("*")
    .eq("slug", slug)
    .eq("publicado", true)
    .single();

  if (error) return null;

  // Incrementar vistas
  await supabase
    .from("articulos")
    .update({ vistas: (data.vistas ?? 0) + 1 })
    .eq("id", data.id);

  return data as BlogPost;
}

export async function getRelatedPosts(slug: string, limit = 2): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articulos")
    .select("*")
    .eq("publicado", true)
    .neq("slug", slug)
    .limit(limit);
  return (data ?? []) as BlogPost[];
}

// Solo para el admin — sin filtro de publicado
export async function getAllPostsAdmin(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articulos")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as BlogPost[];
}
