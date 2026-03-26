interface BlogCardProps {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    publishedAt: string;
    readTime: number;
    category: string;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-brand-teal transition-colors">
      <div className="h-48 bg-brand-dark/10 flex items-center justify-center text-4xl">📝</div>
      <div className="p-6">
        <span className="text-xs font-semibold text-brand-teal uppercase tracking-wider">{post.category}</span>
        <h3 className="mt-2 font-serif font-bold text-brand-dark text-lg leading-snug">{post.title}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>{post.publishedAt}</span>
          <span>{post.readTime} min lectura</span>
        </div>
        <a href={`/blog/${post.slug}`} className="mt-4 block text-center py-2 border border-brand-dark text-brand-dark text-sm font-semibold rounded-lg hover:bg-brand-dark hover:text-white transition-colors">
          Leer artículo
        </a>
      </div>
    </article>
  );
}
