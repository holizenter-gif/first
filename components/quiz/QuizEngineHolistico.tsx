"use client";
import { useState, useEffect, useCallback } from "react";
import { PREGUNTAS_HOLISTICO }                from "@/lib/data/preguntas-holistico";
import { getScoreResultHolistico }            from "@/lib/quiz-scoring-holistico";
import QuizWelcome     from "./QuizWelcome";
import QuizQuestion    from "./QuizQuestion";
import QuizProgress    from "./QuizProgress";
import LeadCaptureForm from "./LeadCaptureForm";
import QuizAnalyzing   from "./QuizAnalyzing";
import QuizResult      from "./QuizResult";
import AbandonPopup    from "./AbandonPopup";
import type { PreguntaQuiz } from "@/lib/data/preguntas-burnout";

type QuizState = "welcome" | "question" | "capture" | "analyzing" | "result";

interface LeadFormData {
  nombre:            string;
  empresa:           string;
  email:             string;
  whatsapp:          string;
  acepta_privacidad: boolean;
}

export default function QuizEngineHolistico() {
  const [estado,         setEstado]     = useState<QuizState>("welcome");
  const [indicePregunta, setIndice]     = useState(0);
  const [respuestas,     setRespuestas] = useState<Record<string, number>>({});
  const [leadData,       setLeadData]   = useState<LeadFormData | null>(null);
  const [showAbandon,    setShowAbandon]= useState(false);
  const [isSubmitting,   setSubmitting] = useState(false);
  const [resultadoFinal, setResultado]  = useState<ReturnType<typeof getScoreResultHolistico> | null>(null);

  const preguntas      = PREGUNTAS_HOLISTICO as unknown as PreguntaQuiz[];
  const totalPregs     = preguntas.length;
  const preguntaActual = preguntas[indicePregunta];

  useEffect(() => {
    if (estado === "welcome" || estado === "result") return;
    const fn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [estado]);

  useEffect(() => {
    if (estado !== "question" || indicePregunta < 5) return;
    let timer: ReturnType<typeof setTimeout>;
    const fn = (e: MouseEvent) => {
      if (e.clientY <= 0) timer = setTimeout(() => setShowAbandon(true), 500);
    };
    document.addEventListener("mouseleave", fn);
    return () => { document.removeEventListener("mouseleave", fn); clearTimeout(timer); };
  }, [estado, indicePregunta]);

  const handleStart = () => setEstado("question");
  const handleBack  = () => { if (indicePregunta > 0) setIndice((i) => i - 1); };

  const handleAnswer = useCallback((value: number) => {
    const nr = { ...respuestas, [preguntaActual.id]: value };
    setRespuestas(nr);

    if (indicePregunta < totalPregs - 1) {
      setIndice((i) => i + 1);
    } else {
      const resultado = getScoreResultHolistico(nr);
      setResultado(resultado);
      setEstado("capture");
    }
  }, [respuestas, preguntaActual, indicePregunta, totalPregs]);

  const handleLeadSubmit = async (data: LeadFormData) => {
    setLeadData(data);
    setEstado("analyzing");
    setSubmitting(true);

    try {
      const res = await fetch("/api/quiz/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...data,
          quiz_type:  "holistico",
          respuestas,
        }),
      });
      await res.json();
      await new Promise((r) => setTimeout(r, 2200));
      setEstado("result");
    } catch {
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
        quizType="holistico"
      />

      {/* WELCOME */}
      {estado === "welcome" && (
        <QuizWelcome
          onStart={handleStart}
          badge="Holizenter · Diagnóstico de Bienestar Integral"
          titulo={
            <>
              ¿Cómo estás realmente —{" "}
              <em className="not-italic" style={{ color: "#5CB996" }}>Cuerpo, Mente y Espíritu</em>?
            </>
          }
          subtitulo="10 preguntas íntimas basadas en el modelo biopsicosocial y psicología transpersonal. Un diagnóstico honesto de los tres pilares de tu bienestar."
          stats={[
            { value: "4 min",     label: "para completar"  },
            { value: "100%",      label: "gratuito"         },
            { value: "Holístico", label: "3 dimensiones"   },
          ]}
          bullets={[
            "Diagnóstico en 3 dimensiones: Cuerpo, Mente y Espíritu",
            "Termómetro de bienestar integral animado",
            "Perfil: Bienestar integrado / Fragmentado / Crítico",
            "Recomendación empática y personalizada",
          ]}
          ctaLabel="Iniciar mi diagnóstico holístico →"
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

      {/* CAPTURE — preview borrosa + formulario superpuesto */}
      {estado === "capture" && resultadoFinal && (
        <div className="relative">
          <div className="pointer-events-none select-none" style={{ filter: "blur(6px)", opacity: 0.45 }}>
            <QuizResult
              score={resultadoFinal.puntaje}
              nivel={resultadoFinal.nivel}
              descripcion={resultadoFinal.descripcion}
              servicio_recomendado={resultadoFinal.servicio_recomendado}
              nombre="Tu nombre"
              empresa=""
              ejes={resultadoFinal.ejes}
            />
          </div>
          <div className="absolute inset-0 flex items-start justify-center pt-8 px-4">
            <div className="w-full max-w-lg">
              <LeadCaptureForm
                quizType="holistico"
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
