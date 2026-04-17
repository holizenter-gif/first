import { GraduationCap, FileText, Package, Video, Star } from "lucide-react";
import type { ElementType } from "react";
import type { ProductoTipo } from "@/lib/supabase/types";

interface BadgeTipoProps {
  tipo: ProductoTipo;
}

const BADGE_CONFIG: Record<ProductoTipo, { label: string; Icon: ElementType; color: string }> = {
  curso_digital:   { label: "Curso Digital",   Icon: GraduationCap, color: "bg-blue-50 text-blue-700"     },
  material_fisico: { label: "Material",         Icon: FileText,      color: "bg-yellow-50 text-yellow-700" },
  merchandising:   { label: "Producto Físico",  Icon: Package,       color: "bg-green-50 text-green-700"   },
  taller_grabado:  { label: "Taller Grabado",   Icon: Video,         color: "bg-purple-50 text-purple-700" },
  membresia:       { label: "Membresía",         Icon: Star,          color: "bg-amber-50 text-amber-700"   },
};

export default function BadgeTipo({ tipo }: BadgeTipoProps) {
  const config = BADGE_CONFIG[tipo];
  if (!config) return null;
  const { Icon } = config;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
