import type { Producto } from "@/lib/supabase/types";

interface ProductoCardProps {
  producto: Producto;
  variant?: "grid" | "list" | "featured";
  onAgregarCarrito?: (producto: Producto) => void;
}

export default function ProductoCard({ producto, variant = "grid", onAgregarCarrito }: ProductoCardProps) {
  const descuento = producto.precio_original
    ? Math.round(((producto.precio_original - producto.precio) / producto.precio_original) * 100)
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-brand-gold transition-colors">
      <div className="h-48 bg-brand-beige flex items-center justify-center text-4xl relative">
        <span>🛍️</span>
        {descuento && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{descuento}%
          </span>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-brand-gold font-semibold uppercase tracking-wider">{producto.tipo.replace("_", " ")}</span>
        <h3 className="mt-1 font-semibold text-brand-green text-sm leading-snug line-clamp-2">{producto.nombre}</h3>
        <p className="mt-2 text-xs text-gray-500 line-clamp-2">{producto.descripcion}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-bold text-brand-green">${producto.precio.toLocaleString()}</span>
          {producto.precio_original && (
            <span className="text-xs text-gray-400 line-through">${producto.precio_original.toLocaleString()}</span>
          )}
          <span className="text-xs text-gray-400">MXN</span>
        </div>
        <div className="mt-3 flex gap-2">
          <a href={`/tienda/${producto.slug}`} className="flex-1 text-center py-2 border border-brand-green text-brand-green text-xs font-semibold rounded-lg hover:bg-brand-green hover:text-white transition-colors">
            Ver detalle
          </a>
          {onAgregarCarrito && (
            <button onClick={() => onAgregarCarrito(producto)} className="flex-1 py-2 bg-brand-gold text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors">
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
