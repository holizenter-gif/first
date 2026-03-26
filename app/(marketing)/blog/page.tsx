import type { Metadata }     from "next";
import Link                  from "next/link";
import { getAllPosts,
         CATEGORIA_LABELS,
         CATEGORIA_COLORS }  from "@/lib/blog";
import BlogBuscador          from "@/components/blog/BlogBuscador";
import { Calendar, Clock, Tag } from "lucide-react";

export const dynamic    = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog de Bienestar Laboral | Holizenter",
  description: "Artículos, guías y reflexiones sobre burnout, NOM-035, mindfulness corporativo y bienestar organizacional en México.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-brand-beige">

      <section className="bg-brand-dark pt-8 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/10 text-brand-teal text-xs font-display px-4 py-1.5 rounded-full mb-6 tracking-wider">
            Blog · Holizenter
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Bienestar con base real
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto font-light mb-8">
            Artículos, guías y reflexiones escritas por nuestros especialistas.
          </p>
          {/* Buscador */}
          <BlogBuscador />
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Filtros por categoría */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["todos", ...Object.keys(CATEGORIA_LABELS)].map((cat) => (
              <Link
                key={cat}
                href={cat === "todos" ? "/blog" : `/blog?categoria=${cat}`}
                className="text-xs font-display font-medium px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-brand-teal hover:text-brand-teal transition-colors capitalize"
              >
                {cat === "todos" ? "Todos" : CATEGORIA_LABELS[cat]}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No hay artículos publicados aún.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                >
                  <div className="relative h-44 bg-brand-teal-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <span className="text-5xl opacity-20">📝</span>
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-display font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${CATEGORIA_COLORS[post.categoria] ?? "bg-gray-100 text-gray-600"}`}>
                        <Tag className="w-3 h-3" />
                        {CATEGORIA_LABELS[post.categoria] ?? post.categoria}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="font-display font-bold text-brand-dark text-base leading-snug mb-2 group-hover:text-brand-teal transition-colors line-clamp-2">
                      {post.titulo}
                    </h2>
                    {post.descripcion && (
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                        {post.descripcion}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {post.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.published_at).toLocaleDateString("es-MX", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.tiempo_lectura}
                        </span>
                      </div>
                      <span className="text-brand-teal text-xs font-display font-semibold">
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
