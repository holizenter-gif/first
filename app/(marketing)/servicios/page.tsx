import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";
import { SERVICIOS, formatPrecio } from "@/lib/data/servicios";
import QuizCTA from "@/components/quiz/QuizCTA";

export const metadata = {
  title: "Servicios de Bienestar Corporativo | Holizenter",
  description:
    "Talleres, diagnósticos, integraciones y programas anuales de bienestar laboral para empresas en México. Cotiza ahora.",
};

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-brand-dark py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-teal font-display text-sm font-semibold uppercase tracking-widest mb-4">
            Nuestros Servicios
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Bienestar que transforma{" "}
            <span className="text-brand-teal">organizaciones</span>
          </h1>
          <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
            Desde una sesión de diagnóstico gratuita hasta programas anuales. Cada
            servicio está diseñado para resultados medibles.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {SERVICIOS.map((s) => (
            <Link
              key={s.id}
              href={`/servicios/${s.slug}`}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-brand-teal/40 transition-all duration-300"
            >
              {/* Card top */}
              <div className="bg-brand-beige p-6 flex items-center gap-4">
                <span className="text-4xl">{s.emoji}</span>
                <div>
                  <p className="text-xs text-gray-400 font-display uppercase tracking-wider mb-1">
                    {s.audiencia}
                  </p>
                  <h2 className="font-display font-bold text-xl text-brand-dark group-hover:text-brand-teal transition-colors">
                    {s.titulo}
                  </h2>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {s.subtitulo}
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Clock className="w-3.5 h-3.5" /> {s.duracion}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Users className="w-3.5 h-3.5" /> {s.audiencia}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Desde</p>
                    <p className="font-display font-bold text-xl text-brand-teal">
                      {formatPrecio(s.precio_base)}
                      {s.precio_base > 0 && (
                        <span className="text-gray-400 font-normal text-sm ml-1">MXN</span>
                      )}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-brand-teal font-display font-semibold text-sm group-hover:gap-2.5 transition-all">
                    Ver detalles <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-brand-beige py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-brand-dark mb-4">
            ¿No sabes por dónde empezar?
          </h2>
          <p className="text-gray-600 mb-8">
            Agenda un diagnóstico gratuito de 60 minutos. Te ayudamos a identificar
            qué servicio necesita tu equipo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agendar"
              className="bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold px-8 py-4 rounded-full transition-colors"
            >
              Diagnóstico gratis →
            </Link>
            <Link
              href="/cotizador"
              className="border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white font-display font-semibold px-8 py-4 rounded-full transition-colors"
            >
              Cotizar programa
            </Link>
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <QuizCTA quiz_id_override="burnout" variant="banner" source_section="servicios_bottom" />
      </div>
    </div>
  );
}
