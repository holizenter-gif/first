"use client";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle } from "lucide-react";

const PUNTOS = [
  "Diagnóstico gratuito de 60 minutos",
  "Resultados medibles desde el primer taller",
  "Cumplimiento NOM-035 garantizado",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] bg-brand-dark flex items-center overflow-hidden">
      {/* Decoración inspirada en el logomark circular */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-teal opacity-5" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-brand-olive opacity-5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-brand-teal opacity-[0.03]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Columna izquierda */}
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-brand-teal/30 bg-brand-teal/10 text-brand-teal text-xs font-display font-medium px-4 py-2 rounded-full mb-8 tracking-wide">
              <span className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-pulse" />
              Bienestar Holístico para Empresas · Ciudad de México
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Transforma el bienestar{" "}
              <span className="text-gradient-brand">de tu empresa</span>{" "}
              desde adentro
            </h1>

            {/* Subheadline */}
            <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-8 max-w-xl font-light">
              Reducimos el burnout, mejoramos el rendimiento y
              fortalecemos la cultura. Cuerpo · Mente · Espíritu
              en equilibrio organizacional.
            </p>

            {/* Checklist */}
            <ul className="space-y-3 mb-10">
              {PUNTOS.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-brand-teal flex-shrink-0" />
                  <span className="text-white/70 text-sm font-display">{p}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/agendar"
                className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold text-base px-8 py-4 rounded-full shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/30 transition-all duration-300 hover:scale-105"
              >
                Agenda diagnóstico gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/quiz/burnout"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white hover:bg-white/5 hover:border-white/40 font-display font-medium text-base px-8 py-4 rounded-full transition-all duration-200"
              >
                <Play className="w-4 h-4" />
                Test de burnout gratis
              </Link>
            </div>
          </div>

          {/* Columna derecha — card stats */}
          <div className="hidden lg:block animate-slide-up">
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl p-8">
              <p className="text-white/40 text-xs font-display tracking-widest uppercase mb-6">
                ¿Cómo está el bienestar de tu equipo?
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { valor: "75%",     label: "de trabajadores MX sufre estrés",     fuente: "IMSS"       },
                  { valor: "30-70%",  label: "del salario cuesta reemplazar a uno",  fuente: "SHRM"       },
                  { valor: "NOM-035", label: "obliga a prevenir riesgo psicosocial", fuente: "STPS"       },
                  { valor: "+500",    label: "colaboradores atendidos",              fuente: "Holizenter" },
                ].map((s) => (
                  <div key={s.valor} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="font-display font-bold text-brand-teal text-xl mb-1">{s.valor}</div>
                    <p className="text-white/50 text-xs leading-snug">{s.label}</p>
                    <p className="text-white/25 text-xs mt-1">— {s.fuente}</p>
                  </div>
                ))}
              </div>

              {/* Mini quiz CTA */}
              <Link
                href="/quiz/burnout"
                className="flex items-center justify-between bg-brand-teal/10 hover:bg-brand-teal/20 border border-brand-teal/30 rounded-2xl p-4 transition-all duration-200 group"
              >
                <div>
                  <p className="text-white font-display font-semibold text-sm">Test de burnout gratuito</p>
                  <p className="text-white/40 text-xs">10 preguntas · 4 minutos · Resultado inmediato</p>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-teal group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-14">
          <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 15C480 30 240 0 0 30L0 60Z" fill="#F5F2EC" />
        </svg>
      </div>
    </section>
  );
}
