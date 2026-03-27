"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { PREGUNTAS_BURNOUT } from "@/lib/data/preguntas-burnout";
import { getScoreResult }    from "@/lib/quiz-scoring";
import QuizWelcome     from "./QuizWelcome";
import QuizQuestion    from "./QuizQuestion";
import QuizProgress    from "./QuizProgress";
import LeadCaptureForm from "./LeadCaptureForm";
import QuizAnalyzing   from "./QuizAnalyzing";
import QuizResult      from "./QuizResult";
import AbandonPopup    from "./AbandonPopup";
import { registerLead }  from "@/lib/quiz-cookie";
import { analytics }     from "@/lib/analytics";

export type QuizState = "welcome" | "question" | "capture" | "analyzing" | "result";

interface LeadFormData {
  nombre:            string;
  empresa:           string;
  email:             string;
  whatsapp:          string;
  acepta_privacidad: boolean;
}

export default function QuizEngine() {
  const [estado,         setEstado]     = useState<QuizState>("welcome");
  const [indicePregunta, setIndice]     = useState(0);
  const [respuestas,     setRespuestas] = useState<Record<string, number>>({});
  const [leadData,       setLeadData]   = useState<LeadFormData | null>(null);
  const [showAbandon,    setShowAbandon]= useState(false);
  const [isSubmitting,   setSubmitting] = useState(false);

  const preguntas      = PREGUNTAS_BURNOUT;
  const totalPregs     = preguntas.length;
  const preguntaActual = preguntas[indicePregunta];

  // Calcular score en tiempo real con la fórmula de 3 ejes
  const scoreData = useMemo(
    () => (Object.keys(respuestas).length > 0 ? getScoreResult(respuestas) : null),
    [respuestas]
  );

  // Resultado final (se fija al terminar todas las preguntas)
  const [resultadoFinal, setResultadoFinal] = useState<ReturnType<typeof getScoreResult> | null>(null);

  // beforeunload
  useEffect(() => {
    if (estado === "welcome" || estado === "result") return;
    const fn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [estado]);

  // Abandon popup al mover el cursor fuera de la pantalla
  useEffect(() => {
    if (estado !== "question" || indicePregunta < 4) return;
    let timer: ReturnType<typeof setTimeout>;
    const fn = (e: MouseEvent) => {
      if (e.clientY <= 0) timer = setTimeout(() => setShowAbandon(true), 500);
    };
    document.addEventListener("mouseleave", fn);
    return () => { document.removeEventListener("mouseleave", fn); clearTimeout(timer); };
  }, [estado, indicePregunta]);

  const handleStart = () => {
    analytics.quizStart("burnout");
    setEstado("question");
  };
  const handleBack  = () => { if (indicePregunta > 0) setIndice((i) => i - 1); };

  const handleAnswer = useCallback((value: number) => {
    const nr = { ...respuestas, [preguntaActual.id]: value };
    setRespuestas(nr);

    if (indicePregunta < totalPregs - 1) {
      setIndice((i) => i + 1);
    } else {
      // Última pregunta — calcular resultado y mostrar capture con preview borrosa
      const resultado = getScoreResult(nr);
      setResultadoFinal(resultado);
      analytics.quizComplete("burnout", resultado.puntaje, resultado.nivel);
      setEstado("capture");
    }
  }, [respuestas, preguntaActual, indicePregunta, totalPregs]);

  const handleLeadSubmit = async (data: LeadFormData) => {
    setLeadData(data);
    const isNewLead = registerLead(data.email);
    analytics.leadSubmit("burnout", isNewLead);
    setEstado("analyzing");
    setSubmitting(true);

    try {
      const res = await fetch("/api/quiz/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...data,
          quiz_type:  "burnout",
          respuestas,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      // Pequeña pausa para el efecto de análisis
      await new Promise((r) => setTimeout(r, 2200));

      // Actualizar con lo que devuelve el servidor (incluye lead_id real)
      if (json.ejes) setResultadoFinal({ ...resultadoFinal!, ...json });
      setEstado("result");
    } catch {
      // Fallback: mostrar el resultado calculado localmente
      await new Promise((r) => setTimeout(r, 1500));
      setEstado("result");
    } finally {
      setSubmitting(false);
    }
  };

  const porcentaje = Math.round((Object.keys(respuestas).length / totalPregs) * 100);

  return (
    <div className="min-h-screen" style={{ background: "#F5F2EC" }}>
      <AbandonPopup
        isOpen={showAbandon}
        onClose={() => setShowAbandon(false)}
        currentStep={indicePregunta + 1}
        quizType="burnout"
      />

      {/* WELCOME */}
      {estado === "welcome" && (
        <QuizWelcome
          onStart={handleStart}
          badge="Holizenter · Diagnóstico de Burnout Laboral"
          titulo={<>¿Cuál es el nivel real de <em className="not-italic" style={{ color: "#5CB996" }}>burnout</em> en tu equipo?</>}
          subtitulo="Responde 10 preguntas basadas en el modelo Maslach y recibe un diagnóstico con 3 dimensiones y recomendaciones específicas para tu empresa."
          bullets={[
            "Score global de burnout con 3 ejes desglosados",
            "Termómetro visual de riesgo con barras por dimensión",
            "Perfil: Equilibrio activo / Riesgo moderado / Burnout activo",
            "Recomendación específica de intervención para tu empresa",
          ]}
        />
      )}

      {/* PREGUNTAS */}
      {estado === "question" && preguntaActual && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <QuizProgress current={indicePregunta + 1} total={totalPregs} percentage={porcentaje} />
          <QuizQuestion
            question={preguntaActual}
            currentIndex={indicePregunta}
            totalQuestions={totalPregs}
            onAnswer={handleAnswer}
            onBack={handleBack}
            canGoBack={indicePregunta > 0}
          />
        </div>
      )}

      {/* CAPTURE — Preview borrosa + formulario */}
      {estado === "capture" && resultadoFinal && (
        <div className="relative">
          {/* Preview borrosa del resultado */}
          <div className="pointer-events-none select-none" style={{ filter: "blur(6px)", opacity: 0.45 }}>
            <QuizResult
              score={resultadoFinal.puntaje}
              nivel={resultadoFinal.nivel}
              descripcion={resultadoFinal.descripcion}
              servicio_recomendado={resultadoFinal.servicio_recomendado}
              nombre="Tu nombre"
              empresa="Tu empresa"
              ejes={resultadoFinal.ejes}
            />
          </div>

          {/* Formulario superpuesto */}
          <div className="absolute inset-0 flex items-start justify-center pt-8 px-4">
            <div className="w-full max-w-lg">
              <LeadCaptureForm
                quizType="burnout"
                partialScore={resultadoFinal.puntaje}
                onSubmit={handleLeadSubmit}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* ANALYZING */}
      {estado === "analyzing" && (
        <QuizAnalyzing nombre={leadData?.nombre ?? ""} />
      )}

      {/* RESULT */}
      {estado === "result" && resultadoFinal && leadData && (
        <QuizResult
          score={resultadoFinal.puntaje}
          nivel={resultadoFinal.nivel}
          descripcion={resultadoFinal.descripcion}
          servicio_recomendado={resultadoFinal.servicio_recomendado}
          nombre={leadData.nombre}
          empresa={leadData.empresa}
          ejes={resultadoFinal.ejes}
        />
      )}
    </div>
  );
}
