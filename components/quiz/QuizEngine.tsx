"use client";
import { useState, useEffect, useCallback } from "react";
import { PREGUNTAS_BURNOUT } from "@/lib/data/preguntas-burnout";
import QuizWelcome     from "./QuizWelcome";
import QuizQuestion    from "./QuizQuestion";
import QuizProgress    from "./QuizProgress";
import LeadCaptureForm from "./LeadCaptureForm";
import QuizAnalyzing   from "./QuizAnalyzing";
import QuizResult      from "./QuizResult";
import AbandonPopup    from "./AbandonPopup";

export type QuizState = "welcome" | "question" | "capture" | "analyzing" | "result";

interface QuizResultData {
  lead_id: string; puntaje: number; nivel: "bajo" | "riesgo" | "critico";
  servicio_recomendado: string; descripcion: string; color: string; emoji: string;
}
interface LeadFormData { nombre: string; empresa: string; email: string; whatsapp: string; acepta_privacidad: boolean; }

export default function QuizEngine() {
  const [estado,         setEstado]      = useState<QuizState>("welcome");
  const [indicePregunta, setIndice]      = useState(0);
  const [respuestas,     setRespuestas]  = useState<Record<string, number>>({});
  const [leadData,       setLeadData]    = useState<LeadFormData | null>(null);
  const [resultado,      setResultado]   = useState<QuizResultData | null>(null);
  const [showAbandon,    setShowAbandon] = useState(false);
  const [isSubmitting,   setIsSubmitting]= useState(false);

  const preguntas      = PREGUNTAS_BURNOUT;
  const totalPregs     = preguntas.length;
  const preguntaActual = preguntas[indicePregunta];

  useEffect(() => {
    if (estado === "welcome" || estado === "result") return;
    const fn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [estado]);

  useEffect(() => {
    if (estado !== "question" || indicePregunta < 4) return;
    let timer: ReturnType<typeof setTimeout>;
    const fn = (e: MouseEvent) => { if (e.clientY <= 0) timer = setTimeout(() => setShowAbandon(true), 500); };
    document.addEventListener("mouseleave", fn);
    return () => { document.removeEventListener("mouseleave", fn); clearTimeout(timer); };
  }, [estado, indicePregunta]);

  const handleStart = () => setEstado("question");
  const handleBack  = () => { if (indicePregunta > 0) setIndice((i) => i - 1); };

  const handleAnswer = useCallback((value: number) => {
    const nr = { ...respuestas, [preguntaActual.id]: value };
    setRespuestas(nr);
    if (indicePregunta < totalPregs - 1) setIndice((i) => i + 1);
    else setEstado("capture");
  }, [respuestas, preguntaActual, indicePregunta, totalPregs]);

  const handleLeadSubmit = async (data: LeadFormData) => {
    setLeadData(data);
    setEstado("analyzing");
    setIsSubmitting(true);
    try {
      const res  = await fetch("/api/quiz/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, quiz_type: "burnout", respuestas }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      await new Promise((r) => setTimeout(r, 2500));
      setResultado(json);
      setEstado("result");
    } catch {
      const p = Math.round((Object.values(respuestas).reduce((a, b) => a + b, 0) / (totalPregs * 10)) * 100);
      setResultado({ lead_id: "local", puntaje: p, nivel: p > 70 ? "bajo" : p >= 40 ? "riesgo" : "critico", servicio_recomendado: "Diagnóstico de Bienestar Laboral Gratuito", descripcion: "Basado en tus respuestas, te recomendamos hablar con nuestro equipo.", color: "#1B4332", emoji: "📊" });
      setEstado("result");
    } finally { setIsSubmitting(false); }
  };

  const porcentaje = Math.round((Object.keys(respuestas).length / totalPregs) * 100);

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <AbandonPopup isOpen={showAbandon} onClose={() => setShowAbandon(false)} currentStep={indicePregunta + 1} quizType="burnout" />
      {estado === "welcome"   && <QuizWelcome onStart={handleStart} />}
      {estado === "question"  && preguntaActual && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <QuizProgress current={indicePregunta + 1} total={totalPregs} percentage={porcentaje} />
          <QuizQuestion question={preguntaActual} currentIndex={indicePregunta} totalQuestions={totalPregs} onAnswer={handleAnswer} onBack={handleBack} canGoBack={indicePregunta > 0} />
        </div>
      )}
      {estado === "capture"   && (
        <LeadCaptureForm quizType="burnout"
          partialScore={Math.round((Object.values(respuestas).reduce((a, b) => a + b, 0) / (totalPregs * 10)) * 100)}
          onSubmit={handleLeadSubmit} isLoading={isSubmitting} />
      )}
      {estado === "analyzing" && <QuizAnalyzing nombre={leadData?.nombre ?? ""} />}
      {estado === "result"    && resultado && leadData && (
        <QuizResult score={resultado.puntaje} nivel={resultado.nivel} descripcion={resultado.descripcion}
          servicio_recomendado={resultado.servicio_recomendado} color={resultado.color} emoji={resultado.emoji}
          nombre={leadData.nombre} empresa={leadData.empresa} />
      )}
    </div>
  );
}
