import type { Metadata } from "next";
import Link              from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";
import QuizCTA           from "@/components/quiz/QuizCTA";

export const metadata: Metadata = {
  title: "¿Qué es la NOM-035 STPS? Guía completa para empresas 2026 | Holizenter",
  description:
    "La NOM-035 STPS obliga a todas las empresas en México a identificar y prevenir factores de riesgo psicosocial. Multas de hasta $540,000 MXN por incumplimiento.",
  keywords: [
    "qué es NOM-035",
    "NOM-035 STPS obligatoria",
    "NOM-035 empresas México 2026",
    "factores riesgo psicosocial",
    "multa NOM-035",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es la NOM-035 STPS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La NOM-035 es la Norma Oficial Mexicana 035 de la STPS, vigente desde octubre de 2019. Obliga a todas las empresas en México a identificar, analizar y prevenir los factores de riesgo psicosocial en el trabajo.",
      },
    },
    {
      "@type": "Question",
      name: "¿La NOM-035 aplica a mi empresa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. La NOM-035 aplica a todos los centros de trabajo en México sin excepción de giro, tamaño o sector. Las obligaciones varían según el número de trabajadores: hasta 15, de 16 a 50, y más de 50 colaboradores.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto es la multa por no cumplir con la NOM-035?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las multas van de 250 a 5,000 veces el valor de la UMA, lo que en 2026 representa entre $27,000 y $540,000 MXN aproximadamente.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué son los factores de riesgo psicosocial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Son condiciones de trabajo que pueden causar trastornos de ansiedad, estrés grave o burnout. Incluyen: sobrecarga de trabajo, falta de control, jornadas excesivas, violencia laboral e interferencia trabajo-familia.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo cumplir con la NOM-035?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El proceso tiene 4 pasos: 1) Diagnóstico inicial con el cuestionario oficial, 2) Análisis de resultados por área, 3) Programa de intervención para los factores identificados, 4) Seguimiento documentado con evidencia continua.",
      },
    },
  ],
};

export default function QueEsNom035Page() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section style={{ background: "#0D1A0F" }} className="pt-8 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-xs font-display">Obligatoria para todas las empresas en México</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            ¿Qué es la NOM-035?
          </h1>
          <p className="text-xl font-light" style={{ color: "rgba(255,255,255,0.6)" }}>
            La norma que obliga a todas las empresas mexicanas a prevenir el riesgo psicosocial — con multas de hasta $540,000 MXN.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5 mb-10">
          <p className="font-display font-bold text-amber-800 text-sm mb-1">Vigente desde octubre 2019</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            La NOM-035 STPS aplica a <strong>todos los centros de trabajo en México</strong>, sin excepción de tamaño, giro o sector.
          </p>
        </div>

        <h2 className="font-display font-bold text-2xl mb-6" style={{ color: "#0D1A0F" }}>
          Preguntas frecuentes sobre NOM-035
        </h2>
        <div className="space-y-3 mb-10">
          {faqSchema.mainEntity.map((faq) => (
            <details key={faq.name} className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <summary className="p-4 cursor-pointer font-display font-semibold text-sm list-none transition-colors" style={{ color: "#0D1A0F" }}>
                {faq.name}
              </summary>
              <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                {faq.acceptedAnswer.text}
              </div>
            </details>
          ))}
        </div>

        <div className="my-10">
          <QuizCTA quiz_id_override="clima" source_section="que_es_nom035_page" variant="banner" />
        </div>

        <div className="rounded-2xl p-8 text-center" style={{ background: "#0D1A0F" }}>
          <h3 className="font-display font-bold text-white text-xl mb-3">
            ¿Tu empresa cumple con la NOM-035?
          </h3>
          <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Diagnóstico gratuito de 60 minutos. Te decimos exactamente qué necesitas hacer y cómo documentarlo.
          </p>
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 text-white font-display font-semibold px-8 py-4 rounded-full transition-colors"
            style={{ background: "#5CB996" }}
          >
            Agendar diagnóstico NOM-035 gratis <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
