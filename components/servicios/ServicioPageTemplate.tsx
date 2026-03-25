import Link from "next/link";
import { CheckCircle, Clock, MapPin, Users, ArrowRight, ChevronDown } from "lucide-react";
import type { Servicio } from "@/lib/data/servicios";
import { formatPrecio } from "@/lib/data/servicios";

export default function ServicioPageTemplate({ servicio }: { servicio: Servicio }) {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-brand-dark pt-8 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-5xl mb-4">{servicio.emoji}</div>
          <div className="inline-block bg-white/10 text-white/60 text-xs font-display px-4 py-1.5 rounded-full mb-4">
            {servicio.audiencia}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {servicio.titulo}
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            {servicio.subtitulo}
          </p>

          {/* Meta chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="flex items-center gap-1.5 bg-white/10 text-white/70 text-sm px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" /> {servicio.duracion}
            </span>
            {servicio.modalidades.map((m) => (
              <span key={m} className="flex items-center gap-1.5 bg-white/10 text-white/70 text-sm px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4" /> {m}
              </span>
            ))}
            <span className="flex items-center gap-1.5 bg-white/10 text-white/70 text-sm px-4 py-2 rounded-full">
              <Users className="w-4 h-4" /> {servicio.audiencia}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agendar"
              className="flex items-center gap-2 justify-center bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold text-base px-8 py-4 rounded-full shadow-lg shadow-brand-teal/20 transition-all"
            >
              Agenda diagnóstico gratis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/cotizador"
              className="flex items-center justify-center border border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-display font-medium text-base px-8 py-4 rounded-full transition-all"
            >
              Ver precio para mi empresa
            </Link>
          </div>
        </div>
      </section>

      {/* Banda de precio */}
      <section className="bg-brand-beige py-6 px-4 border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-gray-500 text-xs mb-0.5">Inversión desde</p>
            <div className="font-display font-bold text-3xl text-brand-teal">
              {formatPrecio(servicio.precio_base)}
              {servicio.precio_base > 0 && (
                <span className="text-gray-400 font-normal text-lg ml-2">MXN</span>
              )}
            </div>
            {servicio.precio_base > 0 && (
              <p className="text-gray-400 text-xs mt-0.5">
                Hasta {formatPrecio(servicio.precio_max)} MXN según tamaño y modalidad
              </p>
            )}
          </div>
          <Link
            href="/cotizador"
            className="bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold px-6 py-3 rounded-full text-sm transition-colors"
          >
            Calcular precio exacto →
          </Link>
        </div>
      </section>

      {/* Descripción */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">¿En qué consiste?</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{servicio.descripcion}</p>
        </div>
      </section>

      {/* Resultados + Incluye */}
      <section className="bg-brand-beige py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-dark mb-8">Resultados esperados</h2>
            <div className="space-y-4">
              {servicio.resultados.map((r) => (
                <div key={r} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-dark mb-8">¿Qué incluye?</h2>
            <div className="space-y-4">
              {servicio.incluye.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-brand-dark mb-8 text-center">
            ¿Para quién es este servicio?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {servicio.para_quien.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-brand-teal-50 border border-brand-teal/20 rounded-xl p-4">
                <span className="text-brand-teal font-bold flex-shrink-0">→</span>
                <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-brand-beige py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-brand-dark mb-8 text-center">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {servicio.faq.map((item) => (
              <details key={item.pregunta} className="bg-white rounded-xl overflow-hidden group">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-display font-semibold text-gray-800 hover:text-brand-teal transition-colors list-none">
                  {item.pregunta}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {item.respuesta}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-brand-dark py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            ¿Listo para transformar el bienestar de tu equipo?
          </h2>
          <p className="text-white/60 mb-8 font-light">
            Agenda un diagnóstico gratuito de 60 minutos. Sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agendar"
              className="flex items-center justify-center bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold text-base px-8 py-4 rounded-full shadow-lg shadow-brand-teal/20 transition-colors"
            >
              Agenda diagnóstico gratis →
            </Link>
            <Link
              href="/cotizador"
              className="flex items-center justify-center border border-white/20 text-white hover:bg-white/10 font-display font-medium text-base px-8 py-4 rounded-full transition-colors"
            >
              Cotizar programa
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
