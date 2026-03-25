import Link from "next/link";

export default function QuizCTABanner() {
  return (
    <section className="py-24 px-6 bg-brand-dark relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-teal blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center text-white">
        <span className="inline-block px-4 py-1.5 bg-brand-teal/20 text-brand-teal text-xs font-semibold rounded-full tracking-wider uppercase mb-6">
          Diagnóstico Gratuito
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
          ¿Tu equipo está en riesgo de burnout?
        </h2>
        <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Descúbrelo en 4 minutos con nuestro diagnóstico basado en NOM-035. Recibe un reporte personalizado con recomendaciones específicas para tu empresa.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/quiz/burnout"
            className="px-10 py-4 bg-brand-teal text-white font-bold rounded-xl hover:bg-[#A67C0F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
          >
            Hacer el Diagnóstico Gratis →
          </Link>
          <Link
            href="/servicios"
            className="px-10 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-white hover:bg-white/10 transition-all text-base"
          >
            Ver todos los servicios
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-8 text-white/50 text-sm">
          <span>✓ 100% Gratuito</span>
          <span>✓ Sin registros previos</span>
          <span>✓ Resultados inmediatos</span>
        </div>
      </div>
    </section>
  );
}
