import type { Metadata } from "next";
import Link              from "next/link";
import { ArrowRight }    from "lucide-react";
import QuizCTA           from "@/components/quiz/QuizCTA";

export const metadata: Metadata = {
  title: "¿Qué es el burnout laboral? Síntomas, causas y solución | Holizenter",
  description:
    "El burnout laboral es un estado de agotamiento crónico reconocido por la OMS. Conoce sus síntomas, cómo detectarlo en tu equipo y qué hacer al respecto.",
  keywords: [
    "qué es burnout laboral",
    "síntomas burnout trabajo",
    "burnout definición OMS",
    "agotamiento laboral México",
    "cómo detectar burnout equipo",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es el burnout laboral?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El burnout laboral es un síndrome reconocido por la OMS caracterizado por agotamiento emocional extremo, distanciamiento mental del trabajo y reducción del rendimiento profesional, causado por estrés crónico en el trabajo que no ha sido gestionado adecuadamente.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuáles son los síntomas del burnout?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los síntomas principales son: agotamiento físico y emocional persistente, cinismo hacia el trabajo, reducción del rendimiento, dificultad para concentrarse, irritabilidad, problemas de sueño y síntomas físicos como dolores de cabeza o problemas digestivos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se diferencia el burnout del estrés normal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El estrés normal es temporal y cede con el descanso. El burnout es crónico y no mejora con el descanso habitual. La persona con burnout siente que ya no tiene nada que dar, mientras que con estrés todavía tiene recursos emocionales disponibles.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto le cuesta el burnout a una empresa mexicana?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Según datos del IMSS, el 75% de los trabajadores mexicanos experimenta estrés laboral. Reemplazar a un colaborador que renuncia por burnout cuesta entre el 30% y el 70% de su salario anual.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se trata el burnout?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El tratamiento requiere un enfoque integral: reducción de carga de trabajo, acompañamiento terapéutico, cambios organizacionales y prácticas de regulación del sistema nervioso como el programa MBSR. No se resuelve solo con descanso.",
      },
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo detectar burnout en tu equipo",
  description: "Pasos para identificar burnout laboral antes de que afecte la rotación.",
  step: [
    { "@type": "HowToStep", name: "Observa el presentismo", text: "Identifica colaboradores que asisten pero su rendimiento ha caído sin causa aparente." },
    { "@type": "HowToStep", name: "Mide ausentismo y rotación", text: "Un aumento en días de incapacidad o intención de renuncia son señales tempranas." },
    { "@type": "HowToStep", name: "Aplica un diagnóstico formal", text: "Usa el test de burnout de Holizenter para obtener datos concretos por área." },
    { "@type": "HowToStep", name: "Agenda un diagnóstico gratuito", text: "Un especialista analiza los resultados y recomienda la intervención correcta." },
  ],
};

const SINTOMAS = [
  { titulo: "Agotamiento persistente",   desc: "La persona llega cansada y termina el día sin energía, sin importar cuánto duerma." },
  { titulo: "Distanciamiento emocional", desc: "Cinismo o indiferencia hacia el trabajo que antes le importaba." },
  { titulo: "Reducción del rendimiento", desc: "Errores frecuentes, dificultad para concentrarse y sensación de ineficacia." },
  { titulo: "Síntomas físicos",          desc: "Dolores de cabeza, tensión muscular o problemas digestivos sin causa médica." },
  { titulo: "Irritabilidad",             desc: "Reacciones desproporcionadas ante situaciones que antes manejaba con calma." },
  { titulo: "Pérdida de sentido",        desc: "Ya no encuentra propósito en lo que hace, aunque antes le gustaba su trabajo." },
];

export default function QueEsBurnoutPage() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <section style={{ background: "#0D1A0F" }} className="pt-8 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block text-xs font-display px-4 py-1.5 rounded-full mb-6" style={{ background: "rgba(92,185,150,0.15)", color: "#5CB996" }}>
            Guía completa · Holizenter
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            ¿Qué es el burnout laboral?
          </h1>
          <p className="text-xl font-light" style={{ color: "rgba(255,255,255,0.6)" }}>
            Síntomas, causas, costo real para las empresas y qué hacer cuando ya está presente en tu equipo.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="border-l-4 rounded-r-2xl p-6 mb-10" style={{ background: "#EBF8F2", borderColor: "#5CB996" }}>
          <p className="font-display font-bold text-sm mb-2 uppercase tracking-wider" style={{ color: "#0D1A0F" }}>
            Definición (OMS, 2019)
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            El burnout es un síndrome resultante del estrés laboral crónico que no ha sido gestionado con éxito.
            Se caracteriza por agotamiento emocional, distanciamiento mental del trabajo y reducción del rendimiento profesional.
          </p>
        </div>

        <h2 className="font-display font-bold text-2xl mb-6" style={{ color: "#0D1A0F" }}>
          Síntomas del burnout laboral
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {SINTOMAS.map((s) => (
            <div key={s.titulo} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <h3 className="font-display font-semibold text-sm mb-1" style={{ color: "#0D1A0F" }}>{s.titulo}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display font-bold text-2xl mb-4" style={{ color: "#0D1A0F" }}>
          Cómo detectar burnout en tu equipo
        </h2>
        {howToSchema.step.map((step, i) => (
          <div key={step.name} className="flex gap-4 mb-4">
            <div className="w-7 h-7 rounded-full text-white text-xs font-display font-bold flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "#5CB996" }}>
              {i + 1}
            </div>
            <div>
              <p className="font-display font-semibold text-sm mb-1" style={{ color: "#0D1A0F" }}>{step.name}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{step.text}</p>
            </div>
          </div>
        ))}

        <div className="my-10">
          <QuizCTA quiz_id_override="burnout" source_section="que_es_burnout_page" variant="banner" />
        </div>

        <h2 className="font-display font-bold text-2xl mb-6" style={{ color: "#0D1A0F" }}>
          Preguntas frecuentes
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

        <div className="rounded-2xl p-8 text-center" style={{ background: "#0D1A0F" }}>
          <h3 className="font-display font-bold text-white text-xl mb-3">
            ¿Tu equipo tiene señales de burnout?
          </h3>
          <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Diagnóstico gratuito de 60 minutos con un especialista Holizenter.
          </p>
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 text-white font-display font-semibold px-8 py-4 rounded-full transition-colors"
            style={{ background: "#5CB996" }}
          >
            Agendar diagnóstico gratis <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
