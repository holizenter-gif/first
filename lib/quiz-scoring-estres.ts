import { PREGUNTAS_ESTRES } from "@/lib/data/preguntas-estres";
import type { EjeScore } from "@/lib/quiz-scoring";

export type NivelEstres = "bajo" | "riesgo" | "critico";

export interface ScoreResultEstres {
  puntaje:              number;
  nivel:                NivelEstres;
  servicio_recomendado: string;
  descripcion:          string;
  color:                string;
  emoji:                string;
  ejes:                 EjeScore[];
}

// ── Scoring JD-R (3 ejes ponderados) ─────────────────────────────────
export function calcularScoreEstres(respuestas: Record<string, number>): {
  pctEje1: number; pctEje2: number; pctEje3: number; scoreGlobal: number;
  sumaEje1: number; sumaEje2: number; sumaEje3: number;
} {
  const porEje = (eje: 1 | 2 | 3) =>
    PREGUNTAS_ESTRES.filter((p) => p.eje === eje)
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

export function getNivelEstres(score: number): NivelEstres {
  if (score <= 40) return "bajo";
  if (score <= 70) return "riesgo";
  return "critico";
}

export function getScoreResultEstres(respuestas: Record<string, number>): ScoreResultEstres {
  const { pctEje1, pctEje2, pctEje3, scoreGlobal, sumaEje1, sumaEje2, sumaEje3 } =
    calcularScoreEstres(respuestas);

  const nivel = getNivelEstres(scoreGlobal);

  const ejes: EjeScore[] = [
    { label: "Carga y demandas",       pct: Math.round(pctEje1), maximo: 20, suma: sumaEje1 },
    { label: "Control y autonomía",    pct: Math.round(pctEje2), maximo: 15, suma: sumaEje2 },
    { label: "Soporte organizacional", pct: Math.round(pctEje3), maximo: 15, suma: sumaEje3 },
  ];

  const perfiles: Record<NivelEstres, Omit<ScoreResultEstres, "puntaje" | "nivel" | "ejes">> = {
    bajo: {
      servicio_recomendado: "Taller de gestión del estrés o diagnóstico de clima preventivo",
      descripcion:
        "Hay demandas reales, pero también recursos para sostenerlas. Este es el momento de blindar lo que funciona — antes de que el contexto cambie.",
      color: "#5CB996",
      emoji: "🌱",
    },
    riesgo: {
      servicio_recomendado: "Diagnóstico JD-R completo + intervención focalizada en el eje más crítico",
      descripcion:
        "Las demandas están ganando la partida. No es una emergencia, pero el margen se está achicando. En este punto, pequeñas intervenciones tienen alto impacto.",
      color: "#F59E0B",
      emoji: "⚠️",
    },
    critico: {
      servicio_recomendado: "Diagnóstico urgente + programa de intervención organizacional",
      descripcion:
        "Lo que describes apunta a un sistema bajo presión sostenida sin recursos para compensarlo. Esto afecta decisiones, relaciones y salud.",
      color: "#EF4444",
      emoji: "🔴",
    },
  };

  return { puntaje: scoreGlobal, nivel, ejes, ...perfiles[nivel] };
}
