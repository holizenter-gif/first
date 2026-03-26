import Link from "next/link";

const QUIZ_MAP: Record<string, { titulo: string; href: string; descripcion: string }> = {
  burnout:     { titulo: "Test de Burnout",              href: "/quiz/burnout",     descripcion: "Descubre tu nivel de agotamiento laboral en 5 minutos." },
  estres:      { titulo: "Test de Estrés Laboral",       href: "/quiz/estres",      descripcion: "Evalúa la carga, el control y el soporte en tu trabajo." },
  satisfaccion:{ titulo: "Test de Satisfacción Laboral", href: "/quiz/satisfaccion",descripcion: "Mide propósito, crecimiento y conexión en tu carrera." },
  clima:       { titulo: "Diagnóstico NOM-035",          href: "/quiz/clima",       descripcion: "Evalúa el clima organizacional según la norma mexicana." },
  holistico:   { titulo: "Diagnóstico Holístico",        href: "/quiz/holistico",   descripcion: "Un diagnóstico de Cuerpo, Mente y Espíritu." },
};

const DEFAULT_QUIZ = QUIZ_MAP["burnout"];

interface QuizCTAProps {
  quiz_id_override?: string;
  source_section?:   string;
  variant?:          "banner" | "inline";
}

export default function QuizCTA({ quiz_id_override, variant = "inline" }: QuizCTAProps) {
  const quiz = quiz_id_override ? (QUIZ_MAP[quiz_id_override] ?? DEFAULT_QUIZ) : DEFAULT_QUIZ;

  if (variant === "banner") {
    return (
      <div
        className="rounded-2xl p-6 border flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: "var(--hl-green-pale)", borderColor: "rgba(45,90,61,0.15)" }}
      >
        <div className="flex-1">
          <p className="font-display font-bold text-brand-dark text-base mb-1">{quiz.titulo}</p>
          <p className="text-gray-500 text-sm">{quiz.descripcion}</p>
        </div>
        <Link
          href={quiz.href}
          className="flex-shrink-0 bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold px-5 py-2.5 rounded-full transition-colors text-sm shadow-sm"
        >
          Hacer el test →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 my-6 shadow-sm">
      <div className="flex-1">
        <p className="font-display font-semibold text-brand-dark text-sm">{quiz.titulo}</p>
        <p className="text-gray-400 text-xs mt-0.5">{quiz.descripcion}</p>
      </div>
      <Link
        href={quiz.href}
        className="flex-shrink-0 bg-brand-teal text-white text-xs font-display font-semibold px-4 py-2 rounded-full hover:bg-brand-teal-dark transition-colors"
      >
        Hacer test →
      </Link>
    </div>
  );
}
