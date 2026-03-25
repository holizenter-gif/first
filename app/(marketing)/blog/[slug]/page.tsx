import type { Metadata }        from "next";
import { notFound }             from "next/navigation";
import Link                     from "next/link";
import { MDXRemote }            from "next-mdx-remote/rsc";
import { getPostBySlug,
         getRelatedPosts }      from "@/lib/blog";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artículo no encontrado | Holizenter" };
  return {
    title:       `${post.titulo} | Holizenter`,
    description: post.descripcion,
    keywords:    post.keywords,
    authors:     [{ name: post.autor }],
    openGraph: {
      title:         post.titulo,
      description:   post.descripcion,
      type:          "article",
      publishedTime: post.fecha,
      authors:       [post.autor],
      images:        [{ url: post.imagen, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 2);

  const schema = {
    "@context":    "https://schema.org",
    "@type":       "Article",
    headline:      post.titulo,
    description:   post.descripcion,
    author:        { "@type": "Person", name: post.autor },
    publisher:     { "@type": "Organization", name: "Holizenter", url: "https://holizenter.mx" },
    datePublished: post.fecha,
    image:         post.imagen,
    keywords:      post.keywords.join(", "),
  };

  const initials = post.autor.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="min-h-screen bg-white">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Header */}
      <section className="px-4 pt-8 pb-16" style={{ background: "#0D1A0F" }}>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-sans text-xs transition-colors mb-8"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al blog
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-white text-xs font-sans font-semibold px-3 py-1 rounded-full flex items-center gap-1"
              style={{ background: "#5CB996" }}
            >
              <Tag className="w-3 h-3" /> {post.categoria}
            </span>
          </div>

          <h1
            className="font-sans font-bold text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(24px,4vw,40px)" }}
          >
            {post.titulo}
          </h1>

          <p className="font-sans text-lg mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>
            {post.descripcion}
          </p>

          <div className="flex items-center gap-4 font-sans text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span className="flex items-center gap-1.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "#5CB996" }}
              >
                {initials}
              </div>
              {post.autor}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.fecha + "T12:00:00").toLocaleDateString("es-MX", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.tiempo_lectura} de lectura
            </span>
          </div>
        </div>
      </section>

      {/* Contenido MDX */}
      <article className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-headings:font-sans prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-[#5CB996] prose-li:text-gray-600 max-w-none">
            <MDXRemote source={post.contenido} />
          </div>

          {post.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-100">
              {post.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-3 py-1 rounded-full font-sans"
                  style={{ background: "#EBF8F2", color: "#5CB996" }}
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* CTA */}
      <section className="py-12 px-4" style={{ background: "#F5F2EC" }}>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl p-8 text-center" style={{ background: "#0D1A0F" }}>
            <p className="font-sans text-sm mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
              ¿Te identifica lo que leíste?
            </p>
            <h3 className="font-sans font-bold text-white text-2xl mb-3">
              Diagnostica el bienestar de tu equipo gratis
            </h3>
            <p className="font-sans text-sm mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
              60 minutos con un especialista. Sin compromiso. Con resultados reales.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/agendar"
                className="font-sans font-semibold px-6 py-3 rounded-full transition-colors text-sm text-white"
                style={{ background: "#5CB996" }}
              >
                Agenda diagnóstico gratis →
              </Link>
              <Link
                href="/quiz/burnout"
                className="font-sans font-medium px-6 py-3 rounded-full transition-colors text-sm text-white"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                Test de burnout rápido
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-sans font-bold text-xl mb-6" style={{ color: "#0D1A0F" }}>
              También te puede interesar
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-3"
                >
                  <div className="flex-1">
                    <span className="font-sans text-xs font-semibold" style={{ color: "#5CB996" }}>
                      {r.categoria}
                    </span>
                    <h3
                      className="font-sans font-semibold text-sm leading-snug mt-1 line-clamp-2 transition-colors"
                      style={{ color: "#0D1A0F" }}
                    >
                      {r.titulo}
                    </h3>
                    <p className="font-sans text-xs mt-1" style={{ color: "#9CA3AF" }}>
                      {r.tiempo_lectura}
                    </p>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform"
                    style={{ color: "#5CB996" }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
