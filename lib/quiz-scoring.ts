export type NivelBurnout = "bajo" | "riesgo" | "critico";

export interface ScoreResult {
  puntaje: number;
  nivel: NivelBurnout;
  servicio_recomendado: string;
  descripcion: string;
  color: string;
  emoji: string;
}

export function calcularScore(respuestas: Record<string, number>): number {
  const valores = Object.values(respuestas);
  if (valores.length === 0) return 0;
  const total = valores.reduce((sum, val) => sum + val, 0);
  const maxPosible = valores.length * 10;
  return Math.round((total / maxPosible) * 100);
}

export function getNivel(score: number): NivelBurnout {
  if (score > 70) return "bajo";
  if (score >= 40) return "riesgo";
  return "critico";
}

export function getServicioRecomendado(nivel: NivelBurnout): string {
  const map: Record<NivelBurnout, string> = {
    critico: "Diagnóstico de Bienestar Laboral Gratuito",
    riesgo:  "Taller Grupal de Manejo del Estrés",
    bajo:    "Membresía Club Holizenter",
  };
  return map[nivel];
}

export function getScoreResult(respuestas: Record<string, number>): ScoreResult {
  const puntaje = calcularScore(respuestas);
  const nivel   = getNivel(puntaje);

  const data: Record<NivelBurnout, Omit<ScoreResult, "puntaje" | "nivel">> = {
    critico: {
      servicio_recomendado: "Diagnóstico de Bienestar Laboral Gratuito",
      descripcion: "Tu equipo está en zona de alerta. El burnout activo afecta la productividad, aumenta la rotación y genera ausentismo. Es momento de actuar.",
      color: "#DC2626",
      emoji: "🚨",
    },
    riesgo: {
      servicio_recomendado: "Taller Grupal de Manejo del Estrés",
      descripcion: "Tu equipo muestra señales de estrés sostenido. Sin intervención, esto puede derivar en burnout severo en los próximos meses.",
      color: "#D97706",
      emoji: "⚠️",
    },
    bajo: {
      servicio_recomendado: "Membresía Club Holizenter",
      descripcion: "Tu equipo tiene un nivel de bienestar saludable. Mantenerlo y fortalecerlo con programas preventivos es la mejor inversión.",
      color: "#1B4332",
      emoji: "✅",
    },
  };

  return { puntaje, nivel, ...data[nivel] };
}
