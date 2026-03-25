const STATS = [
  { value: "75%", label: "de trabajadores en México sufre estrés laboral" },
  { value: "+500", label: "empresas atendidas en CDMX" },
  { value: "NOM-035", label: "cumplimiento garantizado" },
  { value: "4 min", label: "para conocer tu diagnóstico" },
  { value: "100%", label: "gratuito sin compromisos" },
];

export default function StatsBar() {
  return (
    <section className="bg-white py-12 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center group">
              <p className="font-serif text-3xl font-bold text-brand-teal group-hover:text-[#D4A017] transition-colors">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs text-gray-500 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
