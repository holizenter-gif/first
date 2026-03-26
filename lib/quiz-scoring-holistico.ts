import { PREGUNTAS_HOLISTICO } from "@/lib/data/preguntas-holistico";
import type { EjeScore } from "@/lib/quiz-scoring";

export type NivelHolistico = "bajo" | "riesgo" | "critico";

export interface ScoreResultHolistico {
  puntaje:              number;
  nivel:                NivelHolistico;
  servicio_recomendado: string;
  descripcion:          string;
  color:                string;
  emoji:                string;
  ejes:                 EjeScore[];
}

// ── Scoring Bienestar Holístico (3 ejes ponderados) ───────────────────────
export function calcularScoreHolistico(respuestas: Record<string, number>): {
  pctEje1: number; pctEje2: number; pctEje3: number; scoreGlobal: number;
  sumaEje1: number; sumaEje2: number; sumaEje3: number;
} {
  const porEje = (eje: 1 | 2 | 3) =>
    PREGUNTAS_HOLISTICO.filter((p) => p.eje === eje)
      .reduce((s, p) => s + (respuestas[p.id] ?? 0), 0);

  const sumaEje1 = porEje(1); // máx 15 (3 preguntas × 5)
  const sumaEje2 = porEje(2); // máx 15 (3 preguntas × 5)
  const sumaEje3 = porEje(3); // máx 20 (4 preguntas × 5)

  const pctEje1 = (sumaEje1 / 15) * 100;
  const pctEje2 = (sumaEje2 / 15) * 100;
  const pctEje3 = (sumaEje3 / 20) * 100;

  const scoreGlobal = Math.round(
    pctEje1 * 0.33 + pctEje2 * 0.33 + pctEje3 * 0.34
  );

  return { pctEje1, pctEje2, pctEje3, scoreGlobal, sumaEje1, sumaEje2, sumaEje3 };
}

export function getNivelHolistico(score: number): NivelHolistico {
  if (score <= 40) return "bajo";
  if (score <= 70) return "riesgo";
  return "critico";
}

export function getScoreResultHolistico(respuestas: Record<string, number>): ScoreResultHolistico {
  const { pctEje1, pctEje2, pctEje3, scoreGlobal, sumaEje1, sumaEje2, sumaEje3 } =
    calcularScoreHolistico(respuestas);

  const nivel = getNivelHolistico(scoreGlobal);

  const ejes: EjeScore[] = [
    { label: "Cuerpo",   pct: Math.round(pctEje1), maximo: 15, suma: sumaEje1 },
    { label: "Mente",    pct: Math.round(pctEje2), maximo: 15, suma: sumaEje2 },
    { label: "Espíritu", pct: Math.round(pctEje3), maximo: 20, suma: sumaEje3 },
  ];

  const perfiles: Record<NivelHolistico, Omit<ScoreResultHolistico, "puntaje" | "nivel" | "ejes">> = {
    bajo: {
      servicio_recomendado: "Taller de bienestar holístico o sesión de exploración individual",
      descripcion:
        "Lo que describes muestra una persona que tiene recursos reales: energía, claridad, conexión con lo que hace. El bienestar no es la ausencia de dificultad — es la capacidad de sostenerla sin perderse.",
      color: "#5CB996",
      emoji: "🌱",
    },
    riesgo: {
      servicio_recomendado: "Diagnóstico integral de bienestar + acompañamiento personalizado",
      descripcion:
        "Lo que describes es el patrón más común y el más silencioso. No es una crisis, pero sí es una señal. Y la señal más importante es que ya la estás escuchando.",
      color: "#F59E0B",
      emoji: "🟡",
    },
    critico: {
      servicio_recomendado: "Sesión individual urgente con especialista en bienestar integral",
      descripcion:
        "Lo que describes no es debilidad ni falta de voluntad. Es el resultado de sostener demasiado durante demasiado tiempo. No necesitas resolverlo todo hoy — pero sí necesitas acompañamiento.",
      color: "#EF4444",
      emoji: "🔴",
    },
  };

  return { puntaje: scoreGlobal, nivel, ejes, ...perfiles[nivel] };
}
