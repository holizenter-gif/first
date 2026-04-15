import Estrellas from "./Estrellas";

interface Resena {
  id: string;
  nombre: string;
  calificacion: number;
  comentario: string;
  created_at: string;
}

interface ListaResenasProps {
  resenas: Resena[];
  promedio: number;
  total: number;
}

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });
}

export default function ListaResenas({ resenas, promedio, total }: ListaResenasProps) {
  if (total === 0) {
    return (
      <p className="font-sans text-sm text-gray-400 py-4">
        Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <div className="text-center">
          <p className="font-display font-bold text-4xl" style={{ color: "#0D1A0F" }}>
            {promedio.toFixed(1)}
          </p>
          <Estrellas valor={promedio} size={18} className="mt-1 justify-center" />
          <p className="font-sans text-xs text-gray-400 mt-1">{total} {total === 1 ? "reseña" : "reseñas"}</p>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-5">
        {resenas.map((r) => (
          <div key={r.id} className="pb-5 border-b border-gray-100 last:border-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-display font-semibold text-sm" style={{ color: "#0D1A0F" }}>{r.nombre}</p>
              <p className="font-sans text-xs text-gray-400 shrink-0">{formatFecha(r.created_at)}</p>
            </div>
            <Estrellas valor={r.calificacion} size={14} className="mb-2" />
            <p className="font-sans text-sm text-gray-600 leading-relaxed">{r.comentario}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
