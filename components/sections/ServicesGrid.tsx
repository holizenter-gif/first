import Link from "next/link";

const SERVICES = [
  {
    icon: "🧘",
    title: "Talleres Grupales",
    description: "Experiencias vivenciales de yoga, meditación, respiración y movimiento para equipos de trabajo.",
    href: "/servicios/talleres",
    price: "Desde $8,000 MXN",
    badge: "Más solicitado",
    features: ["Yoga y meditación", "Respiración consciente", "Grupos de 10-50 personas"],
  },
  {
    icon: "🎯",
    title: "Sensibilización Alta Dirección",
    description: "Sesiones ejecutivas para líderes empresariales sobre liderazgo consciente y bienestar organizacional.",
    href: "/servicios/sensibilizacion",
    price: "Desde $15,000 MXN",
    badge: null,
    features: ["Para C-Suite y directores", "Casos de negocio", "Herramientas prácticas"],
  },
  {
    icon: "🤝",
    title: "Integración de Equipos",
    description: "Team building holístico que fortalece vínculos, comunicación y cohesión a través del bienestar.",
    href: "/servicios/integracion",
    price: "Desde $12,000 MXN",
    badge: null,
    features: ["Dinámicas vivenciales", "Comunicación no violenta", "Retiros opcionales"],
  },
  {
    icon: "📋",
    title: "Diagnóstico NOM-035",
    description: "Evaluación profunda del ambiente laboral con reporte detallado y plan de acción NOM-035 STPS.",
    href: "/servicios/diagnostico",
    price: "Desde $5,000 MXN",
    badge: "Cumplimiento legal",
    features: ["Evaluación completa", "Reporte ejecutivo", "Plan de implementación"],
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-24 px-6 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-[#D4A017]/15 text-[#D4A017] text-xs font-semibold rounded-full tracking-wider uppercase mb-4">
            Nuestros Servicios
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1B4332]">
            Soluciones integrales para tu empresa
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Cada servicio está diseñado para transformar el bienestar desde adentro, alineando el cumplimiento normativo con el desarrollo humano.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#D4A017] hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              {s.badge && (
                <span className="absolute -top-3 left-6 px-3 py-1 bg-[#D4A017] text-white text-xs font-bold rounded-full shadow-md">
                  {s.badge}
                </span>
              )}
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="font-serif text-xl font-bold text-[#1B4332] group-hover:text-[#D4A017] transition-colors mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">{s.description}</p>
              <ul className="mt-4 space-y-1.5">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[#D4A017] font-bold text-sm">{s.price}</p>
              <span className="mt-3 text-[#1B4332] text-xs font-semibold group-hover:text-[#D4A017] transition-colors">
                Ver más →
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/servicios"
            className="inline-block px-8 py-3.5 border-2 border-[#1B4332] text-[#1B4332] font-semibold rounded-xl hover:bg-[#1B4332] hover:text-white transition-all text-sm"
          >
            Ver todos los servicios
          </Link>
        </div>
      </div>
    </section>
  );
}
