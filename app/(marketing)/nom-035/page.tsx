import type { Metadata } from "next";
import Link             from "next/link";
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import QuizCTA from "@/components/quiz/QuizCTA";

export const metadata: Metadata = {
  title: "NOM-035 STPS — Cumplimiento para empresas en México | Holizenter",
  description:
    "Holizenter ayuda a empresas mexicanas a cumplir con la NOM-035 STPS con programas estructurados, documentados y con impacto real en el bienestar del equipo.",
  keywords: ["NOM-035 STPS empresas", "cumplimiento NOM-035 México", "factores riesgo psicosocial", "NOM-035 programa bienestar"],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name:    "¿Qué es la NOM-035 STPS?",
      acceptedAnswer: {
        "@type": "Answer",
        text:    "La NOM-035 es una norma oficial mexicana que obliga a todas las empresas a identificar, analizar y prevenir los factores de riesgo psicosocial en el trabajo.",
      },
    },
    {
      "@type": "Question",
      name:    "¿Cuánto cuesta el incumplimiento de la NOM-035?",
      acceptedAnswer: {
        "@type": "Answer",
        text:    "Las multas van de 250 a 5,000 veces el valor de la UMA, lo que representa entre $27,000 y $540,000 MXN aproximadamente en 2026.",
      },
    },
    {
      "@type": "Question",
      name:    "¿El programa de Holizenter cuenta como cumplimiento NOM-035?",
      acceptedAnswer: {
        "@type": "Answer",
        text:    "Sí. El diagnóstico completo y los programas de intervención de Holizenter cubren los requisitos de identificación, evaluación e intervención que exige la norma.",
      },
    },
  ],
};

const OBLIGACIONES = [
  {
    size:  "1 – 15 colaboradores",
    items: ["Medidas básicas de prevención", "Difundir información sobre riesgos psicosociales"],
  },
  {
    size:  "16 – 50 colaboradores",
    items: ["Identificar trabajadores expuestos a violencia laboral", "Exámenes médicos a trabajadores en riesgo", "Todo lo del nivel anterior"],
  },
  {
    size:  "Más de 50 colaboradores",
    items: ["Aplicar cuestionario de evaluación oficial", "Evaluar el entorno organizacional", "Plan de acción documentado", "Seguimiento y evidencia continua"],
  },
];

export default function Nom035Page() {
  return (
    <div className="min-h-screen bg-white">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      {/* Hero */}
      <section className="px-4 pt-8 pb-16" style={{ background: "#0D1A0F" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5" style={{ color: "#FBB040" }} />
            <span className="font-sans text-xs font-medium" style={{ color: "#FBB040" }}>
              Obligatorio para todas las empresas en México
            </span>
          </div>
          <h1
            className="font-sans font-bold text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(32px,5vw,52px)" }}
          >
            NOM-035 STPS
          </h1>
          <p className="font-sans max-w-2xl" style={{ fontSize: "20px", color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>
            La norma que obliga a todas las empresas mexicanas a identificar
            y prevenir los factores de riesgo psicosocial. Holizenter te ayuda
            a cumplirla con un programa que también transforma la cultura.
          </p>
        </div>
      </section>

      {/* Obligaciones */}
      <section className="py-16 px-4" style={{ background: "#F5F2EC" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-sans font-bold text-2xl mb-10 text-center" style={{ color: "#0D1A0F" }}>
            ¿Qué te exige la norma según el tamaño de tu empresa?
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {OBLIGACIONES.map((o, i) => (
              <div
                key={o.size}
                className="rounded-2xl p-6 shadow-sm"
                style={{
                  background:   i === 2 ? "#EBF8F2" : "#fff",
                  border:       i === 2 ? "1.5px solid #5CB996" : "1px solid #E5E7EB",
                }}
              >
                <p
                  className="font-sans font-bold text-sm mb-4"
                  style={{ color: i === 2 ? "#5CB996" : "#0D1A0F" }}
                >
                  {o.size}
                </p>
                <ul className="space-y-2">
                  {o.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: i === 2 ? "#5CB996" : "#6D8339" }}
                      />
                      <span className="font-sans text-sm" style={{ color: "#6B7280" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo ayuda Holizenter */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-sans font-bold text-2xl mb-4" style={{ color: "#0D1A0F" }}>
            Cómo Holizenter te ayuda a cumplir
          </h2>
          <p className="font-sans mb-10 max-w-2xl mx-auto" style={{ color: "#6B7280" }}>
            No solo llenamos la casilla de cumplimiento. Diseñamos programas que
            cumplen con la norma y genuinamente mejoran el bienestar de tu equipo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agendar"
              className="inline-flex items-center gap-2 font-sans font-semibold px-8 py-4 rounded-full transition-colors text-white"
              style={{ background: "#5CB996" }}
            >
              Diagnóstico gratuito NOM-035 <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/blog/nom-035-guia-practica-empresas"
              className="inline-flex items-center gap-2 font-sans font-medium px-8 py-4 rounded-full transition-colors"
              style={{ border: "1.5px solid #5CB996", color: "#5CB996" }}
            >
              Leer la guía completa
            </Link>
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <QuizCTA quiz_id_override="clima" variant="banner" source_section="nom035_bottom" />
      </div>

    </div>
  );
}
