export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <div className="min-h-screen p-8"><h1>Post: {params.slug}</h1></div>;
}
