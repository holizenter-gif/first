import type { Producto } from "@/lib/supabase/types";
import { getPrecioEfectivo, getLabelTipo } from "@/lib/data/productos-helpers";

interface ProductoInfoProps {
  producto: Producto;
}

export default function ProductoInfo({ producto }: ProductoInfoProps) {
  const pEfectivo = getPrecioEfectivo(producto);
  return (
    <div>
      <span className="text-xs text-brand-teal font-semibold uppercase tracking-wider">{getLabelTipo(producto.categoria)}</span>
      <h1 className="font-serif text-3xl font-bold text-brand-dark mt-2">{producto.nombre}</h1>
      <div className="flex items-center gap-3 mt-4">
        <span className="text-4xl font-bold text-brand-dark">${pEfectivo.toLocaleString()}</span>
        {producto.precio_original && (
          <span className="text-xl text-gray-400 line-through">${producto.precio_original.toLocaleString()}</span>
        )}
        <span className="text-gray-500">MXN</span>
      </div>
      {producto.descripcion && (
        <p className="mt-4 text-gray-600">{producto.descripcion}</p>
      )}
    </div>
  );
}
