"use client";
import { useState, useEffect, useCallback } from "react";
import { PREGUNTAS_ESTRES }        from "@/lib/data/preguntas-estres";
import { getScoreResultEstres }    from "@/lib/quiz-scoring-estres";
import QuizWelcome     from "./QuizWelcome";
import QuizQuestion    from "./QuizQuestion";
import QuizProgress    from "./QuizProgress";
import LeadCaptureForm from "./LeadCaptureForm";
import QuizAnalyzing   from "./QuizAnalyzing";
import QuizResult      from "./QuizResult";
import AbandonPopup    from "./AbandonPopup";
import { registerLead }  from "@/lib/quiz-cookie";
import { analytics }     from "@/lib/analytics";

type QuizState = "welcome" | "question" | "capture" | "analyzing" | "result";

interface LeadFormData {
  nombre:            string;
  empresa:           string;
  email:             string;
  whatsapp:          string;
  acepta_privacidad: boolean;
}

export default function QuizEngineEstres() {
  const [estado,         setEstado]     = useState<QuizState>("welcome");
  const [indicePregunta, setIndice]     = useState(0);
  const [respuestas,     setRespuestas] = useState<Record<string, number>>({});
  const [leadData,       setLeadData]   = useState<LeadFormData | null>(null);
  const [showAbandon,    setShowAbandon]= useState(false);
  const [isSubmitting,   setSubmitting] = useState(false);
  const [resultadoFinal, setResultado]  = useState<ReturnType<typeof getScoreResultEstres> | null>(null);

  const preguntas      = PREGUNTAS_ESTRES;
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

  const handleStart = () => {
    analytics.quizStart("estres");
    setEstado("question");
  };
  const handleBack  = () => { if (indicePregunta > 0) setIndice((i) => i - 1); };

  const handleAnswer = useCallback((value: number) => {
    const nr = { ...respuestas, [preguntaActual.id]: value };
    setRespuestas(nr);

    if (indicePregunta < totalPregs - 1) {
      setIndice((i) => i + 1);
    } else {
      const resultado = getScoreResultEstres(nr);
      setResultado(resultado);
      analytics.quizComplete("estres", resultado.puntaje, resultado.nivel);
      setEstado("capture");
    }
  }, [respuestas, preguntaActual, indicePregunta, totalPregs]);

  const handleLeadSubmit = async (data: LeadFormData) => {
    setLeadData(data);
    const isNewLead = registerLead(data.email);
    analytics.leadSubmit("estres", isNewLead);
    setEstado("analyzing");
    setSubmitting(true);

    try {
      const res = await fetch("/api/quiz/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...data,
          quiz_type:  "estres",
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
        quizType="estres"
      />

      {/* WELCOME */}
      {estado === "welcome" && (
        <QuizWelcome
          onStart={handleStart}
          badge="Holizenter · Diagnóstico de Estrés Laboral"
          titulo={
            <>
              ¿Cuánto{" "}
              <em className="not-italic" style={{ color: "#5CB996" }}>estrés laboral</em>{" "}
              estás sosteniendo sin saberlo?
            </>
          }
          subtitulo="10 preguntas basadas en el modelo JD-R (Job Demands-Resources). Descubre si tus demandas superan tus recursos."
          stats={[
            { value: "4 min",  label: "para completar"  },
            { value: "100%",   label: "gratuito"         },
            { value: "JD-R",   label: "modelo validado"  },
          ]}
          bullets={[
            "Score de estrés con 3 ejes: carga, control y soporte",
            "Termómetro visual de riesgo por dimensión",
            "Perfil: Estrés manejable / Acumulado / Crítico",
            "Recomendación específica de intervención",
          ]}
          ctaLabel="Evaluar mi nivel de estrés →"
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
              empresa="Tu empresa"
              ejes={resultadoFinal.ejes}
            />
          </div>
          <div className="absolute inset-0 flex items-start justify-center pt-8 px-4">
            <div className="w-full max-w-lg">
              <LeadCaptureForm
                quizType="estres"
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
