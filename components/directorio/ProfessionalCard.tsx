import Image  from "next/image";
import Link   from "next/link";
import { MapPin, Clock } from "lucide-react";
import type { Profesional } from "@/lib/supabase/types";
import { getModalidadLabel } from "@/lib/data/profesionales-utils";

interface ProfessionalCardProps {
  profesional: Profesional;
}

export default function ProfessionalCard({ profesional: p }: ProfessionalCardProps) {
  const initials = p.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <Link
      href={`/directorio/${p.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
    >
      {/* Foto */}
      <div className="relative h-52 bg-teal-50 overflow-hidden flex-shrink-0">
        {p.foto_url ? (
          <Image
            src={p.foto_url}
            alt={p.nombre}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              style={{ background: "#5CB996" }}
            >
              {initials}
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ color: "#0D1A0F" }}>
            <MapPin className="w-3 h-3" style={{ color: "#5CB996" }} />
            {getModalidadLabel(p.modalidad)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-sans font-bold text-lg mb-0.5 transition-colors"
          style={{ color: "#0D1A0F" }}
        >
          {p.nombre}
        </h3>
        <p className="font-sans text-xs font-semibold mb-3" style={{ color: "#5CB996" }}>
          {p.especialidad}
        </p>

        {p.bio_corta && (
          <p className="font-sans text-sm leading-relaxed mb-4 flex-1 line-clamp-3" style={{ color: "#6B7280" }}>
            {p.bio_corta}
          </p>
        )}

        {p.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {p.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full font-sans capitalize"
                style={{ background: "#EBF8F2", color: "#5CB996" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-1 text-xs" style={{ color: "#9CA3AF" }}>
            <Clock className="w-3 h-3" />
            {p.experiencia_anos} años de exp.
          </div>
          <span className="text-xs font-semibold" style={{ color: "#5CB996" }}>
            Ver perfil →
          </span>
        </div>
      </div>
    </Link>
  );
}
