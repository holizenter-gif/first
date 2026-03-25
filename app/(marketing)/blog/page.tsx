import type { Metadata } from "next";
import Link             from "next/link";
import { getAllPosts }  from "@/lib/blog";
import { Calendar, Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog de Bienestar Laboral | Holizenter",
  description:
    "Artículos sobre burnout, NOM-035, mindfulness corporativo y bienestar organizacional en México. Escritos por especialistas certificados.",
  keywords: ["blog bienestar laboral", "burnout empresas México", "NOM-035", "mindfulness corporativo"],
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen" style={{ background: "#F5F2EC" }}>

      {/* Hero */}
      <section className="px-4 pt-8 pb-16" style={{ background: "#0D1A0F" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-block text-xs font-sans font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider"
            style={{ background: "rgba(255,255,255,0.1)", color: "#5CB996" }}
          >
            Blog · Holizenter
          </div>
          <h1 className="font-sans font-bold mb-4" style={{ fontSize: "clamp(32px,5vw,48px)", color: "#fff" }}>
            Bienestar con base real
          </h1>
          <p className="font-sans" style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>
            Artículos sobre burnout, NOM-035, mindfulness y cultura organizacional.
            Escritos por nuestros especialistas.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-sans text-sm" style={{ color: "#9CA3AF" }}>
                Los artículos estarán disponibles pronto.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                >
                  {/* Imagen placeholder */}
                  <div
                    className="relative h-44 flex-shrink-0 flex items-center justify-center"
                    style={{ background: "#EBF8F2" }}
                  >
                    <span style={{ fontSize: "48px", opacity: 0.25 }}>✍</span>
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-white text-xs font-sans font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                        style={{ background: "#5CB996" }}
                      >
                        <Tag className="w-3 h-3" />
                        {post.categoria}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2
                      className="font-sans font-bold text-base leading-snug mb-2 line-clamp-2 transition-colors"
                      style={{ color: "#0D1A0F" }}
                    >
                      {post.titulo}
                    </h2>
                    <p className="font-sans text-sm leading-relaxed mb-4 flex-1 line-clamp-3" style={{ color: "#6B7280" }}>
                      {post.descripcion}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-3 text-xs" style={{ color: "#9CA3AF" }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.fecha + "T12:00:00").toLocaleDateString("es-MX", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.tiempo_lectura}
                        </span>
                      </div>
                      <span className="text-xs font-sans font-semibold" style={{ color: "#5CB996" }}>
                        Leer →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
