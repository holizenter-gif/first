export default function CategoriaPage({ params }: { params: { categoria: string } }) {
  return <div className="min-h-screen p-8"><h1>Categoría: {params.categoria}</h1></div>;
}
