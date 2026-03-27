import Link from "next/link";
import { getLabelTipo, calcularDescuento, getPrecioEfectivo } from "@/lib/data/productos-helpers";
import AgregarCarritoBtn from "./AgregarCarritoBtn";
import type { Producto } from "@/lib/supabase/types";

const CATEGORIA_EMOJI: Record<string, string> = {
  cursos:            "🎓",
  materiales:        "📄",
  merchandising:     "🌿",
  talleres_grabados: "🎥",
  membresia:         "⭐",
};

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const pEfectivo = getPrecioEfectivo(producto);
  const descuento = calcularDescuento(pEfectivo, producto.precio_original ?? producto.precio);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
      {/* Imagen */}
      <Link href={`/tienda/${producto.slug}`}>
        <div
          className="h-48 flex items-center justify-center text-5xl relative"
          style={{ background: "#EBF7F2" }}
        >
          <span>{CATEGORIA_EMOJI[producto.categoria] ?? "🛍️"}</span>
          {descuento && (
            <span
              className="absolute top-3 right-3 text-white text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: "#E53E3E" }}
            >
              -{descuento}%
            </span>
          )}
          {producto.destacado && !descuento && (
            <span
              className="absolute top-3 right-3 text-white text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "#5CB996" }}
            >
              Destacado
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#5CB996" }}>
          {getLabelTipo(producto.categoria)}
        </span>

        <Link href={`/tienda/${producto.slug}`}>
          <h3
            className="mt-1 font-display font-bold text-sm leading-snug line-clamp-2 group-hover:underline"
            style={{ color: "#0D1A0F" }}
          >
            {producto.nombre}
          </h3>
        </Link>

        <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {producto.descripcion}
        </p>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <span className="font-display font-bold text-base" style={{ color: "#0D1A0F" }}>
              ${pEfectivo.toLocaleString("es-MX")}
            </span>
            {descuento && producto.precio_original && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                ${producto.precio_original.toLocaleString("es-MX")}
              </span>
            )}
            <span className="text-xs text-gray-400 ml-1">MXN</span>
          </div>
        </div>

        <AgregarCarritoBtn
          producto={producto}
          variant="secondary"
          className="mt-3 w-full"
          label="Agregar"
        />
      </div>
    </div>
  );
}
