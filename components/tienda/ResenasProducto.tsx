import type { Resena } from "@/lib/supabase/types";

interface ResenasProductoProps {
  productoId: string;
  resenas: Resena[];
  promedioRating: number;
}

export default function ResenasProducto({ resenas, promedioRating }: ResenasProductoProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl font-bold text-brand-dark">{promedioRating.toFixed(1)}</span>
        <div>
          <div className="flex gap-1 text-brand-teal">{"★".repeat(Math.round(promedioRating))}{"☆".repeat(5 - Math.round(promedioRating))}</div>
          <p className="text-sm text-gray-500">{resenas.length} reseñas</p>
        </div>
      </div>
      <div className="space-y-4">
        {resenas.map((r) => (
          <div key={r.id} className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{r.nombre}</span>
              {r.verificado && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Compra verificada</span>}
            </div>
            <div className="text-brand-teal text-sm">{"★".repeat(r.rating)}</div>
            <p className="text-sm text-gray-600 mt-1">{r.comentario}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
