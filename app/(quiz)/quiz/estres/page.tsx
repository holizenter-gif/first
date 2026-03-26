import type { Metadata } from "next";
import QuizEngineEstres from "@/components/quiz/QuizEngineEstres";

export const metadata: Metadata = {
  title: "Diagnóstico de Estrés Laboral Gratuito — Holizenter",
  description:
    "Evalúa tu nivel de estrés con el modelo Job Demands-Resources. 10 preguntas, resultado inmediato con 3 dimensiones de análisis.",
};

export default function QuizEstresPage() {
  return <QuizEngineEstres />;
}
