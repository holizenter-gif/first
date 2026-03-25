import Link from "next/link";

export default function Nom035Banner() {
  return (
    <section className="py-14 px-6 bg-amber-50 border-y border-amber-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Icon */}
        <div className="shrink-0 w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-3xl">
          📜
        </div>

        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-serif text-2xl font-bold text-amber-900">
            NOM-035-STPS-2018 — ¿Tu empresa cumple?
          </h3>
          <p className="mt-2 text-amber-800/80 text-sm leading-relaxed max-w-2xl">
            La NOM-035 es obligatoria para todas las empresas en México con más de 15 trabajadores. Establece los lineamientos para identificar, prevenir y atender los factores de riesgo psicosocial. ¿Ya tienes tu diagnóstico?
          </p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
            {["Identificación de factores de riesgo", "Medidas de prevención", "Evaluación del entorno laboral"].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full border border-amber-200">
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="shrink-0 flex flex-col gap-3 text-center">
          <Link
            href="/nom-035"
            className="px-7 py-3.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors text-sm shadow-md"
          >
            Saber más sobre NOM-035
          </Link>
          <Link
            href="/quiz/burnout"
            className="px-7 py-3 border border-amber-400 text-amber-800 font-medium rounded-xl hover:bg-amber-100 transition-colors text-sm"
          >
            Diagnóstico gratuito →
          </Link>
        </div>
      </div>
    </section>
  );
}
