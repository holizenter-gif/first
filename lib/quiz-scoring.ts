import { PREGUNTAS_BURNOUT } from "@/lib/data/preguntas-burnout";

export type NivelBurnout = "bajo" | "riesgo" | "critico";

export interface EjeScore {
  label:   string;
  pct:     number;
  maximo:  number;
  suma:    number;
}

export interface ScoreResult {
  puntaje:              number;
  nivel:                NivelBurnout;
  servicio_recomendado: string;
  descripcion:          string;
  color:                string;
  emoji:                string;
  ejes:                 EjeScore[];
}

// ── Scoring burnout MBI (3 ejes ponderados) ───────────────────────────
export function calcularScoreBurnout(respuestas: Record<string, number>): {
  pctEje1: number; pctEje2: number; pctEje3: number; scoreGlobal: number;
  sumaEje1: number; sumaEje2: number; sumaEje3: number;
} {
  const porEje = (eje: 1 | 2 | 3) =>
    PREGUNTAS_BURNOUT.filter((p) => p.eje === eje)
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

export function getNivel(score: number): NivelBurnout {
  if (score <= 40) return "bajo";
  if (score <= 70) return "riesgo";
  return "critico";
}

export function getScoreResult(respuestas: Record<string, number>): ScoreResult {
  const { pctEje1, pctEje2, pctEje3, scoreGlobal, sumaEje1, sumaEje2, sumaEje3 } =
    calcularScoreBurnout(respuestas);

  const nivel = getNivel(scoreGlobal);

  const ejes: EjeScore[] = [
    { label: "Agotamiento",        pct: Math.round(pctEje1), maximo: 20, suma: sumaEje1 },
    { label: "Desconexión",        pct: Math.round(pctEje2), maximo: 15, suma: sumaEje2 },
    { label: "Recursos y soporte", pct: Math.round(pctEje3), maximo: 15, suma: sumaEje3 },
  ];

  const perfiles: Record<NivelBurnout, Omit<ScoreResult, "puntaje" | "nivel" | "ejes">> = {
    bajo: {
      servicio_recomendado: "Taller de mindfulness preventivo o diagnóstico trimestral",
      descripcion:
        "Tu equipo tiene recursos sólidos. Hay señales que vale la pena monitorear, pero la base es fuerte. Este es el momento ideal para construir prevención — no esperar a que algo se rompa.",
      color: "#5CB996",
      emoji: "🌱",
    },
    riesgo: {
      servicio_recomendado: "Diagnóstico completo + programa de intervención a medida",
      descripcion:
        "Las señales están ahí. No son una crisis todavía, pero si no se atienden, en 3-6 meses el escenario se complica. La intervención ahora es más barata y más efectiva que esperar.",
      color: "#F59E0B",
      emoji: "⚠️",
    },
    critico: {
      servicio_recomendado: "Diagnóstico urgente + derivación a especialista",
      descripcion:
        "Lo que describes requiere atención profesional, no un taller de empresa. Este nivel de agotamiento afecta la toma de decisiones, las relaciones y la salud física. El primer paso es un diagnóstico real.",
      color: "#EF4444",
      emoji: "🚨",
    },
  };

  return { puntaje: scoreGlobal, nivel, ejes, ...perfiles[nivel] };
}

// Compatibilidad con el API route existente
export function calcularScore(respuestas: Record<string, number>): number {
  return calcularScoreBurnout(respuestas).scoreGlobal;
}
