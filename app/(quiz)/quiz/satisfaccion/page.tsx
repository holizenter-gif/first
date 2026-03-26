import type { Metadata } from "next";
import QuizEngineSatisfaccion from "@/components/quiz/QuizEngineSatisfaccion";

export const metadata: Metadata = {
  title: "¿Por qué no me siento motivado? Diagnóstico de Satisfacción Laboral — Holizenter",
  description:
    "Descubre qué dimensión de tu bienestar laboral necesita atención. 10 preguntas, resultado inmediato con análisis de propósito, crecimiento y relaciones.",
};

export default function QuizSatisfaccionPage() {
  return <QuizEngineSatisfaccion />;
}
