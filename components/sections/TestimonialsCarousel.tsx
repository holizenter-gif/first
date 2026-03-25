"use client";
import { useState } from "react";

const TESTIMONIALS = [
  {
    name: "Ana Rodríguez",
    role: "Directora de RR.HH.",
    company: "Grupo Salinas",
    text: "Holizenter transformó completamente nuestra cultura organizacional. El taller de mindfulness redujo el ausentismo en un 30% en solo 3 meses. Totalmente recomendado.",
    rating: 5,
    initials: "AR",
  },
  {
    name: "Jorge Martínez",
    role: "CEO",
    company: "TechMX Solutions",
    text: "El diagnóstico NOM-035 fue impecable. Nos dieron un reporte claro, un plan de acción concreto y acompañamiento en todo el proceso. Cumplimos con la norma sin estrés.",
    rating: 5,
    initials: "JM",
  },
  {
    name: "Carmen López",
    role: "Gerente General",
    company: "Farmacias del Sol",
    text: "Los talleres de integración que hicieron con nuestro equipo de ventas fueron increíbles. La energía del equipo cambió radicalmente. Vale cada peso invertido.",
    rating: 5,
    initials: "CL",
  },
  {
    name: "Roberto Fuentes",
    role: "Director Operaciones",
    company: "Constructora Peñoles",
    text: "Teníamos alta rotación y conflictos internos. Después del programa de Holizenter, la comunicación mejoró y retuvimos a nuestros mejores talentos. Resultados reales.",
    rating: 5,
    initials: "RF",
  },
  {
    name: "Sofía Herrera",
    role: "VP Talento Humano",
    company: "Bancomer Regional",
    text: "La sensibilización a nuestra alta dirección fue el punto de quiebre. Cuando los líderes entienden el bienestar, toda la empresa cambia. Gracias Ulises y equipo.",
    rating: 5,
    initials: "SH",
  },
];

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const visible = 3;
  const max = TESTIMONIALS.length - visible;

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(max, c + 1));

  const shown = TESTIMONIALS.slice(current, current + visible);

  return (
    <section className="py-24 px-6 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#1B4332]/10 text-[#1B4332] text-xs font-semibold rounded-full tracking-wider uppercase mb-4">
              Testimonios
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1B4332]">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-11 h-11 rounded-full border-2 border-[#1B4332] flex items-center justify-center text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              onClick={next}
              disabled={current >= max}
              className="w-11 h-11 rounded-full border-2 border-[#1B4332] flex items-center justify-center text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shown.map((t, i) => (
            <div key={t.name} className={`bg-white rounded-2xl p-7 shadow-sm border border-gray-100 transition-all duration-300 ${i === 1 ? "md:-translate-y-2 shadow-lg border-[#D4A017]/30" : ""}`}>
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-[#D4A017] text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed italic mb-6">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-[#1B4332] text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-[#1B4332]" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
