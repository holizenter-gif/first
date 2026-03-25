export default function ProductoPage({ params }: { params: { slug: string } }) {
  return <div className="min-h-screen p-8"><h1>Producto: {params.slug}</h1></div>;
}
