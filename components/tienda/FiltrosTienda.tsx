"use client";
interface FiltrosTiendaProps {
  categoriaActiva: string;
  onCategoriaChange: (slug: string) => void;
  precioMax: number;
  onPrecioChange: (max: number) => void;
  tipoActivo: string;
  onTipoChange: (tipo: string) => void;
}

export default function FiltrosTienda({ categoriaActiva, onCategoriaChange, precioMax, onPrecioChange, tipoActivo, onTipoChange }: FiltrosTiendaProps) {
  return (
    <aside className="space-y-6">
      <div>
        <h3 className="font-semibold text-brand-dark mb-3">Categorías</h3>
        <div className="space-y-2">
          {["todos", "cursos-digitales", "materiales", "merchandising", "talleres-grabados", "membresia"].map((cat) => (
            <button key={cat} onClick={() => onCategoriaChange(cat)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoriaActiva === cat ? "bg-brand-teal text-white" : "text-gray-600 hover:bg-brand-beige"}`}>
              {cat === "todos" ? "Todos los productos" : cat.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-brand-dark mb-3">Precio máximo</h3>
        <input type="range" min={0} max={5000} step={100} value={precioMax} onChange={(e) => onPrecioChange(Number(e.target.value))} className="w-full accent-brand-teal" />
        <p className="text-sm text-gray-600 mt-1">Hasta ${precioMax.toLocaleString()} MXN</p>
      </div>
    </aside>
  );
}
