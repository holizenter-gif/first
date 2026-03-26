import { PREGUNTAS_SATISFACCION } from "@/lib/data/preguntas-satisfaccion";
import type { EjeScore } from "@/lib/quiz-scoring";

export type NivelSatisfaccion = "bajo" | "riesgo" | "critico";

export interface ScoreResultSatisfaccion {
  puntaje:              number;
  nivel:                NivelSatisfaccion;
  servicio_recomendado: string;
  descripcion:          string;
  color:                string;
  emoji:                string;
  ejes:                 EjeScore[];
}

// ── Scoring Satisfacción Laboral (3 ejes ponderados) ──────────────────────
export function calcularScoreSatisfaccion(respuestas: Record<string, number>): {
  pctEje1: number; pctEje2: number; pctEje3: number; scoreGlobal: number;
  sumaEje1: number; sumaEje2: number; sumaEje3: number;
} {
  const porEje = (eje: 1 | 2 | 3) =>
    PREGUNTAS_SATISFACCION.filter((p) => p.eje === eje)
      .reduce((s, p) => s + (respuestas[p.id] ?? 0), 0);

  const sumaEje1 = porEje(1); // máx 20 (4 preguntas × 5)
  const sumaEje2 = porEje(2); // máx 15 (3 preguntas × 5)
  const sumaEje3 = porEje(3); // máx 15 (3 preguntas × 5)

  const pctEje1 = (sumaEje1 / 20) * 100;
  const pctEje2 = (sumaEje2 / 15) * 100;
  const pctEje3 = (sumaEje3 / 15) * 100;

  const scoreGlobal = Math.round(
    pctEje1 * 0.40 + pctEje2 * 0.35 + pctEje3 * 0.25
  );

  return { pctEje1, pctEje2, pctEje3, scoreGlobal, sumaEje1, sumaEje2, sumaEje3 };
}

export function getNivelSatisfaccion(score: number): NivelSatisfaccion {
  if (score <= 40) return "bajo";
  if (score <= 70) return "riesgo";
  return "critico";
}

export function getScoreResultSatisfaccion(respuestas: Record<string, number>): ScoreResultSatisfaccion {
  const { pctEje1, pctEje2, pctEje3, scoreGlobal, sumaEje1, sumaEje2, sumaEje3 } =
    calcularScoreSatisfaccion(respuestas);

  const nivel = getNivelSatisfaccion(scoreGlobal);

  const ejes: EjeScore[] = [
    { label: "Propósito y significado",   pct: Math.round(pctEje1), maximo: 20, suma: sumaEje1 },
    { label: "Crecimiento y competencia", pct: Math.round(pctEje2), maximo: 15, suma: sumaEje2 },
    { label: "Conexión y relaciones",     pct: Math.round(pctEje3), maximo: 15, suma: sumaEje3 },
  ];

  const perfiles: Record<NivelSatisfaccion, Omit<ScoreResultSatisfaccion, "puntaje" | "nivel" | "ejes">> = {
    bajo: {
      servicio_recomendado: "Sesión de exploración de bienestar personal o taller de desarrollo individual",
      descripcion:
        "Lo que describes muestra que hay conexión genuina con tu trabajo. No todo tiene que ser perfecto para que valga la pena. Eso es más raro de lo que parece.",
      color: "#5CB996",
      emoji: "🌱",
    },
    riesgo: {
      servicio_recomendado: "Diagnóstico individual de bienestar + acompañamiento personalizado",
      descripcion:
        "Tiene sentido que te hagas esta pregunta. No estás mal — pero tampoco estás donde quisieras estar. El primer paso es entender exactamente qué.",
      color: "#F59E0B",
      emoji: "🟡",
    },
    critico: {
      servicio_recomendado: "Sesión individual con especialista en bienestar laboral",
      descripcion:
        "Lo que describes no es debilidad ni exageración. Es el resultado de estar mucho tiempo en un lugar que no te nutre. No tienes que resolverlo solo/a.",
      color: "#EF4444",
      emoji: "🔴",
    },
  };

  return { puntaje: scoreGlobal, nivel, ejes, ...perfiles[nivel] };
}
