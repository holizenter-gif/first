import type { Metadata }           from "next";
import { notFound }                from "next/navigation";
import Link                        from "next/link";
import { MDXRemote }               from "next-mdx-remote/rsc";
import { getPostBySlug,
         getRelatedPosts,
         CATEGORIA_LABELS,
         CATEGORIA_COLORS }        from "@/lib/blog";
import QuizCTA                     from "@/components/quiz/QuizCTA";
import { Calendar, Clock,
         ArrowLeft, ArrowRight,
         Tag, Eye }                from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artículo no encontrado | Holizenter" };
  return {
    title:       `${post.titulo} | Holizenter`,
    description: post.descripcion ?? post.titulo,
    keywords:    post.tags,
    authors:     [{ name: post.autor }],
    openGraph: {
      title:       post.titulo,
      description: post.descripcion ?? "",
      type:        "article",
      publishedTime: post.published_at ?? post.created_at,
      authors:     [post.autor],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post    = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, 2);

  const schema = {
    "@context":    "https://schema.org",
    "@type":       "Article",
    headline:      post.titulo,
    description:   post.descripcion,
    author: { "@type": "Person", name: post.autor },
    publisher: { "@type": "Organization", name: "Holizenter", url: process.env.NEXT_PUBLIC_APP_URL ?? "https://holizenter.com" },
    datePublished: post.published_at ?? post.created_at,
    keywords:      post.tags.join(", "),
  };

  return (
    <div className="min-h-screen bg-white">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="bg-brand-dark pt-8 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs font-display transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al blog
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-xs font-display font-medium px-3 py-1 rounded-full flex items-center gap-1 ${CATEGORIA_COLORS[post.categoria] ?? ""}`}>
              <Tag className="w-3 h-3" /> {CATEGORIA_LABELS[post.categoria] ?? post.categoria}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {post.titulo}
          </h1>
          {post.descripcion && (
            <p className="text-white/60 text-lg mb-6 leading-relaxed">{post.descripcion}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-white/40 text-xs font-display">
            <span className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-brand-teal flex items-center justify-center text-white text-xs font-bold">
                {post.autor.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              {post.autor}
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.published_at).toLocaleDateString("es-MX", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.tiempo_lectura}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> {post.vistas} lecturas
            </span>
          </div>
        </div>
      </section>

      <article className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {post.contenido ? (
            <div className="prose prose-lg prose-headings:font-display prose-headings:text-brand-dark prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-brand-dark prose-a:text-brand-teal prose-li:text-gray-600 max-w-none">
              <MDXRemote source={post.contenido} />
            </div>
          ) : (
            <p className="text-gray-400 italic text-center py-8">
              El contenido de este artículo está siendo editado.
            </p>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-100">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-brand-teal-50 text-brand-teal text-xs px-3 py-1 rounded-full font-display">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Quiz contextual dentro del artículo */}
      <section className="py-8 px-4 bg-brand-beige">
        <div className="max-w-3xl mx-auto">
          <QuizCTA
            quiz_id_override={post.quiz_id ?? undefined}
            source_section={`blog_article_${post.slug}`}
            variant="banner"
          />
        </div>
      </section>

      {/* CTA diagnóstico */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-brand-dark rounded-2xl p-8 text-center">
            <p className="text-white/60 text-sm font-display mb-2">¿Te identifica lo que leíste?</p>
            <h3 className="font-display font-bold text-white text-2xl mb-3">
              Diagnostica el bienestar de tu equipo gratis
            </h3>
            <p className="text-white/60 mb-6 text-sm">
              60 minutos con un especialista. Sin compromiso. Con resultados reales.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/agendar" className="bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold px-6 py-3 rounded-full transition-colors shadow-md shadow-brand-teal/20 text-sm">
                Agenda diagnóstico gratis →
              </Link>
              <Link href="/quiz/burnout" className="border border-white/20 text-white hover:bg-white/10 font-display font-medium px-6 py-3 rounded-full transition-colors text-sm">
                Test de burnout rápido
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Artículos relacionados */}
      {related.length > 0 && (
        <section className="py-12 px-4 bg-brand-beige">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-bold text-brand-dark text-xl mb-6">
              También te puede interesar
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-brand-teal text-xs font-display font-medium">
                      {CATEGORIA_LABELS[r.categoria] ?? r.categoria}
                    </span>
                    <h3 className="font-display font-semibold text-brand-dark text-sm leading-snug mt-1 group-hover:text-brand-teal transition-colors line-clamp-2">
                      {r.titulo}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">{r.tiempo_lectura}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-teal flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
