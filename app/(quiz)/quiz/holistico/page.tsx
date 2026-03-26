import type { Metadata } from "next";
import QuizEngineHolistico from "@/components/quiz/QuizEngineHolistico";

export const metadata: Metadata = {
  title: "Diagnóstico de Bienestar Holístico | Holizenter",
  description:
    "10 preguntas basadas en el modelo biopsicosocial y psicología transpersonal. Descubre el estado real de tu Cuerpo, Mente y Espíritu.",
};

export default function QuizHolisticoPage() {
  return <QuizEngineHolistico />;
}
