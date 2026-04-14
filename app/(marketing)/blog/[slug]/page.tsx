import type { Metadata }           from "next";
import { notFound }                from "next/navigation";
import Image                       from "next/image";
import Link                        from "next/link";
import ReactMarkdown               from "react-markdown";
import remarkGfm                   from "remark-gfm";
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
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a InsightLab
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

      {post.imagen_url && (
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "3/2" }}>
            <Image
              src={post.imagen_url}
              alt={post.imagen_alt ?? post.titulo}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      )}

      <article className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {post.contenido ? (
            <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-dark prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-brand-dark prose-strong:font-semibold prose-a:text-brand-teal prose-a:underline prose-ul:text-gray-600 prose-ul:my-4 prose-li:my-1 prose-ol:text-gray-600 prose-blockquote:border-l-4 prose-blockquote:border-brand-teal prose-blockquote:bg-brand-teal-50 prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-table:w-full prose-table:border-collapse prose-table:my-6 prose-th:bg-brand-dark prose-th:text-white prose-th:font-display prose-th:text-sm prose-th:px-4 prose-th:py-3 prose-th:text-left prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-2 prose-td:text-sm prose-td:text-gray-600 prose-code:bg-gray-100 prose-code:text-brand-dark prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-brand-dark prose-pre:text-white prose-pre:rounded-xl prose-pre:p-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.contenido}
              </ReactMarkdown>
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
