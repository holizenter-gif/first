const PILARES = [
  {
    emoji: "💪",
    title: "Cuerpo",
    color: "bg-[#2D6A4F]",
    description:
      "Activación física, nutrición consciente y ergonomía laboral. Cuando el cuerpo se siente bien, la productividad se eleva de forma natural.",
    items: ["Yoga y movimiento", "Pausas activas", "Ergonomía en oficina"],
  },
  {
    emoji: "🧠",
    title: "Mente",
    color: "bg-[#1B4332]",
    description:
      "Gestión del estrés, mindfulness y resiliencia emocional. Herramientas prácticas para equipos que enfrentan alta presión.",
    items: ["Meditación guiada", "Gestión del estrés", "Inteligencia emocional"],
  },
  {
    emoji: "✨",
    title: "Espíritu",
    color: "bg-[#0D2B20]",
    description:
      "Propósito, valores y cultura organizacional. Conectar a las personas con el 'por qué' de su trabajo transforma equipos enteros.",
    items: ["Propósito de vida", "Valores organizacionales", "Cultura de bienestar"],
  },
];

export default function TresPilares() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-[#1B4332]/10 text-[#1B4332] text-xs font-semibold rounded-full tracking-wider uppercase mb-4">
            Nuestra Metodología
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1B4332]">
            Los 3 Pilares del Bienestar
          </h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto text-lg">
            Un enfoque integral que atiende al ser humano completo dentro del entorno laboral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILARES.map((p) => (
            <div key={p.title} className={`${p.color} rounded-2xl p-8 text-white relative overflow-hidden group`}>
              {/* Decorative circle */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <span className="text-5xl block mb-5">{p.emoji}</span>
                <h3 className="font-serif text-3xl font-bold mb-3">{p.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">{p.description}</p>
                <ul className="space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-white/85">
                      <span className="w-5 h-5 rounded-full bg-[#D4A017] flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
