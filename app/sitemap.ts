import { MetadataRoute } from "next";
import { createClient }  from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://holizenter.mx";
  const now  = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                                    lastModified: now, changeFrequency: "weekly",  priority: 1   },
    { url: `${base}/servicios`,                     lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/servicios/talleres`,            lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/servicios/sensibilizacion`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/servicios/integracion`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/servicios/diagnostico`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/directorio`,                    lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/blog`,                          lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/nosotros`,                      lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/nom-035`,                       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contacto`,                      lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/formacion`,                     lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacidad`,                    lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terminos`,                      lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/quiz/burnout`,                  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/quiz/estres`,                   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/quiz/satisfaccion`,             lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/quiz/clima`,                    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/quiz/holistico`,                lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/cotizador`,                     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tienda`,                        lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${base}/tienda/categoria/cursos-digitales`,  lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/tienda/categoria/materiales`,        lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/tienda/categoria/merchandising`,     lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/tienda/categoria/talleres-grabados`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/membresia`,                     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  try {
    const supabase = await createClient();

    // Blog posts
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("publicado", true);

    const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
      url:             `${base}/blog/${p.slug}`,
      lastModified:    new Date(p.updated_at ?? now),
      changeFrequency: "monthly" as const,
      priority:        0.6,
    }));

    // Productos
    const { data: productos } = await supabase
      .from("productos")
      .select("slug, updated_at")
      .eq("activo", true);

    const productoRoutes: MetadataRoute.Sitemap = (productos ?? []).map((p) => ({
      url:             `${base}/tienda/${p.slug}`,
      lastModified:    new Date(p.updated_at ?? now),
      changeFrequency: "weekly" as const,
      priority:        0.7,
    }));

    // Profesionales
    const { data: profesionales } = await supabase
      .from("profesionales")
      .select("slug, updated_at")
      .eq("activo", true);

    const profesionalRoutes: MetadataRoute.Sitemap = (profesionales ?? []).map((p) => ({
      url:             `${base}/directorio/${p.slug}`,
      lastModified:    new Date(p.updated_at ?? now),
      changeFrequency: "monthly" as const,
      priority:        0.6,
    }));

    return [...staticRoutes, ...blogRoutes, ...productoRoutes, ...profesionalRoutes];
  } catch {
    return staticRoutes;
  }
}
