interface ProfessionalCardProps {
  profesional: {
    nombre: string;
    especialidad: string;
    foto_url: string;
    modalidad: string;
    precio_base: number;
    tags: string[];
    experiencia_anos: number;
    slug: string;
  };
  variant?: "list" | "grid";
}

export default function ProfessionalCard({ profesional, variant = "grid" }: ProfessionalCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-brand-teal transition-colors">
      <div className="w-16 h-16 bg-brand-dark/10 rounded-full mb-4 flex items-center justify-center text-2xl">👤</div>
      <h3 className="font-semibold text-brand-dark">{profesional.nombre}</h3>
      <p className="text-sm text-gray-600">{profesional.especialidad}</p>
      <p className="text-xs text-gray-500 mt-1">{profesional.experiencia_anos} años · {profesional.modalidad}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        {profesional.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-brand-beige text-brand-dark text-xs rounded-full">{tag}</span>
        ))}
      </div>
      <a href={`/directorio/${profesional.slug}`} className="mt-4 block text-center py-2 bg-brand-teal text-white text-sm font-semibold rounded-lg hover:bg-brand-teal-dark transition-colors">
        Ver perfil
      </a>
    </div>
  );
}
