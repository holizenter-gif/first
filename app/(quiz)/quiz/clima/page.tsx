import type { Metadata } from "next";
import QuizEngineClima from "@/components/quiz/QuizEngineClima";

export const metadata: Metadata = {
  title: "Diagnóstico de Clima Organizacional NOM-035 — Holizenter",
  description:
    "Evalúa los 5 factores de riesgo psicosocial de tu empresa basado en la NOM-035 STPS. Gratuito, 15 preguntas, resultado inmediato.",
};

export default function QuizClimaPage() {
  return <QuizEngineClima />;
}
