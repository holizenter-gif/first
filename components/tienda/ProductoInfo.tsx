import type { Producto } from "@/lib/supabase/types";

interface ProductoInfoProps {
  producto: Producto;
}

export default function ProductoInfo({ producto }: ProductoInfoProps) {
  return (
    <div>
      <span className="text-xs text-brand-teal font-semibold uppercase tracking-wider">{producto.tipo.replace("_", " ")}</span>
      <h1 className="font-serif text-3xl font-bold text-brand-dark mt-2">{producto.nombre}</h1>
      <div className="flex items-center gap-3 mt-4">
        <span className="text-4xl font-bold text-brand-dark">${producto.precio.toLocaleString()}</span>
        {producto.precio_original && (
          <span className="text-xl text-gray-400 line-through">${producto.precio_original.toLocaleString()}</span>
        )}
        <span className="text-gray-500">MXN</span>
      </div>
      <p className="mt-4 text-gray-600">{producto.descripcion_larga}</p>
      <ul className="mt-6 space-y-2">
        {producto.incluye.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-brand-teal">✓</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
