import type { Producto } from "@/lib/supabase/types";
import ProductoCard from "./ProductoCard";

interface ProductosRelacionadosProps {
  categoriaSlug: string;
  productoActualId: string;
  productos: Producto[];
}

export default function ProductosRelacionados({ productos, productoActualId }: ProductosRelacionadosProps) {
  const relacionados = productos.filter((p) => p.id !== productoActualId).slice(0, 4);
  if (relacionados.length === 0) return null;

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-brand-green mb-6">También te puede interesar</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {relacionados.map((p) => <ProductoCard key={p.id} producto={p} />)}
      </div>
    </div>
  );
}
