import type { ProductoTipo } from "@/lib/supabase/types";

interface BadgeTipoProps {
  tipo: ProductoTipo;
}

const BADGE_CONFIG: Record<ProductoTipo, { label: string; emoji: string; color: string }> = {
  curso_digital:   { label: "Curso Digital",    emoji: "🎓", color: "bg-blue-50 text-blue-700" },
  material_fisico: { label: "Material",          emoji: "📚", color: "bg-yellow-50 text-yellow-700" },
  merchandising:   { label: "Producto Físico",   emoji: "🌿", color: "bg-green-50 text-green-700" },
  taller_grabado:  { label: "Taller Grabado",    emoji: "🎥", color: "bg-purple-50 text-purple-700" },
  membresia:       { label: "Membresía",          emoji: "⭐", color: "bg-amber-50 text-amber-700" },
};

export default function BadgeTipo({ tipo }: BadgeTipoProps) {
  const config = BADGE_CONFIG[tipo];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${config.color}`}>
      {config.emoji} {config.label}
    </span>
  );
}
