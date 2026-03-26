import { PREGUNTAS_CLIMA, EJE_CLIMA_LABEL, type EjeClima } from "@/lib/data/preguntas-clima";
import type { EjeScore } from "@/lib/quiz-scoring";

export type NivelClima = "saludable" | "tension" | "critico";

export interface ScoreResultClima {
  puntaje:              number;
  nivel:                NivelClima;
  servicio_recomendado: string;
  descripcion:          string;
  color:                string;
  emoji:                string;
  ejes:                 EjeScore[];
}

// ── Scoring NOM-035 (5 ejes ponderados) ──────────────────────────────
export function calcularScoreClima(respuestas: Record<string, number>): {
  pcts:        Record<EjeClima, number>;
  sumas:       Record<EjeClima, number>;
  scoreGlobal: number;
} {
  const ejes: EjeClima[] = [1, 2, 3, 4, 5];
  const sumas = {} as Record<EjeClima, number>;
  const pcts  = {} as Record<EjeClima, number>;

  for (const eje of ejes) {
    sumas[eje] = PREGUNTAS_CLIMA.filter((p) => p.eje === eje)
      .reduce((s, p) => s + (respuestas[p.id] ?? 0), 0);
    pcts[eje] = (sumas[eje] / 15) * 100; // todos los ejes: 3 preguntas × máx 5 = 15
  }

  // Pesos: Liderazgo 25%, Carga 25%, Ambiente 20%, Relaciones 20%, Equilibrio 10%
  const scoreGlobal = Math.round(
    pcts[1] * 0.25 +
    pcts[2] * 0.25 +
    pcts[3] * 0.20 +
    pcts[4] * 0.20 +
    pcts[5] * 0.10
  );

  return { pcts, sumas, scoreGlobal };
}

export function getNivelClima(score: number): NivelClima {
  if (score <= 40) return "saludable";
  if (score <= 70) return "tension";
  return "critico";
}

// Mapeo al tipo que espera Supabase (leads.resultado)
export function nivelClimaToDb(nivel: NivelClima): "bajo" | "riesgo" | "critico" {
  return nivel === "saludable" ? "bajo" : nivel === "tension" ? "riesgo" : "critico";
}

export function getScoreResultClima(respuestas: Record<string, number>): ScoreResultClima {
  const { pcts, sumas, scoreGlobal } = calcularScoreClima(respuestas);
  const nivel = getNivelClima(scoreGlobal);

  const ejes: EjeScore[] = ([1, 2, 3, 4, 5] as EjeClima[]).map((e) => ({
    label:  EJE_CLIMA_LABEL[e],
    pct:    Math.round(pcts[e]),
    maximo: 15,
    suma:   sumas[e],
  }));

  const perfiles: Record<NivelClima, Omit<ScoreResultClima, "puntaje" | "nivel" | "ejes">> = {
    saludable: {
      servicio_recomendado: "Diagnóstico NOM-035 formal + monitoreo trimestral de clima",
      descripcion:
        "Los indicadores muestran una cultura que cuida a su gente. El reto ahora es sostenerlo y medirlo con regularidad.",
      color: "#5CB996",
      emoji: "🌱",
    },
    tension: {
      servicio_recomendado: "Diagnóstico completo por área + plan de intervención priorizado",
      descripcion:
        "Los factores de riesgo identificados son exactamente los que, sin intervención, se convierten en rotación, conflictos y costos ocultos.",
      color: "#F59E0B",
      emoji: "⚠️",
    },
    critico: {
      servicio_recomendado: "Diagnóstico urgente NOM-035 + programa de intervención estructurado",
      descripcion:
        "Este nivel de riesgo tiene un costo real: en salud de las personas, en productividad y en exposición legal para la organización.",
      color: "#EF4444",
      emoji: "🚨",
    },
  };

  return { puntaje: scoreGlobal, nivel, ejes, ...perfiles[nivel] };
}
