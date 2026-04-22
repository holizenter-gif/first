"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, CalendarDays, CheckCircle2 } from "lucide-react";
import QuizFlow from "@/components/tareas/QuizFlow";
import { PREGUNTAS_ONBOARDING } from "@/lib/tareas/preguntas";
import type { Letra } from "@/lib/tareas/preguntas";

interface Plan { dia: number; nombre: string; instruccion: string; por_que: string; }
interface Resultado {
  perfil_motivacional: string;
  emocion_actual:      string;
  plan_7dias:          Plan[];
}

export default function QuizTareasInicioPage() {
  const router     = useRouter();
  const [fase,     setFase]      = useState<'intro' | 'quiz' | 'resultado'>('intro');
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error,    setError]     = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async (respuestas: Record<string, Letra>) => {
    setSubmitting(true);
    setError("");
    try {
      // ob_q5,ob_q6 = motivacional → p1,p2
      // ob_q1,ob_q2 = emocion → p3,p4
      // ob_q3 = tiempo → p5
      // ob_q4 = tono → p6
      const payload = {
        respuesta_p1: respuestas.ob_q5,
        respuesta_p2: respuestas.ob_q6,
        respuesta_p3: respuestas.ob_q1,
        respuesta_p4: respuestas.ob_q2,
        respuesta_p5: respuestas.ob_q3,
        respuesta_p6: respuestas.ob_q4,
      };
      const res  = await fetch("/api/quiz/tareas/inicio", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error procesando quiz");
      setResultado(data);
      setFase("resultado");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  const EMOCIONES: Record<string, string> = {
    burnout:       "Agotamiento profundo (Burnout)",
    estres:        "Estrés acumulado",
    ansiedad:      "Ansiedad",
    mantenimiento: "Equilibrio y mantenimiento",
  };

  const PERFILES: Record<string, string> = {
    pragmatico:    "Pragmático — orientado a resultados",
    introspectivo: "Introspectivo — orientado al autoconocimiento",
    comunitario:   "Comunitario — orientado a la conexión",
    competitivo:   "Competitivo — orientado al desafío",
  };

  if (fase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Hero */}
        <div className="lg:w-1/2 flex flex-col justify-center px-8 py-16 lg:px-16" style={{ background: "#0D1A0F" }}>
          <Leaf className="w-10 h-10 mb-6" style={{ color: "#5CB996" }} />
          <h1 className="font-display font-bold text-4xl text-white mb-4 leading-tight">
            Tu plan de bienestar personalizado
          </h1>
          <p className="font-sans text-lg mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
            6 preguntas. 3 minutos. Un plan de 7 días diseñado para tu estado actual.
          </p>
          <div className="space-y-3">
            {["Basado en metodología MBSR", "Adaptado a tu tiempo disponible", "Gamificación para mantener el hábito"].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#5CB996" }} />
                <span className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="lg:w-1/2 flex flex-col justify-center items-center px-8 py-16" style={{ background: "#F5F2EC" }}>
          <div className="w-full max-w-sm text-center">
            <p className="font-display font-semibold text-lg mb-2" style={{ color: "#0D1A0F" }}>
              ¿Listo/a para empezar?
            </p>
            <p className="font-sans text-sm mb-8" style={{ color: "#6B7280" }}>
              Responde con honestidad. No hay respuestas correctas.
            </p>
            <button
              onClick={() => setFase("quiz")}
              className="w-full py-4 rounded-full font-display font-bold text-white text-lg transition-colors"
              style={{ background: "#5CB996" }}
            >
              Comenzar quiz
            </button>
            <p className="font-sans text-xs mt-4" style={{ color: "#9CA3AF" }}>
              Ya tienes un plan? <Link href="/mi-perfil/tareas" className="underline">Ver mis tareas</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (fase === 'quiz') {
    return (
      <div className="min-h-screen" style={{ background: "#F5F2EC" }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm text-red-700" style={{ background: "#FEE2E2" }}>
              {error}
            </div>
          )}
          <QuizFlow
            preguntas={PREGUNTAS_ONBOARDING}
            onComplete={handleComplete}
            submitting={submitting}
          />
        </div>
      </div>
    );
  }

  if (fase === 'resultado' && resultado) {
    return (
      <div className="min-h-screen" style={{ background: "#F5F2EC" }}>
        <div className="max-w-2xl mx-auto px-4 py-12">

          {/* Perfil */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#EBF8F2" }}>
                <Leaf className="w-5 h-5" style={{ color: "#5CB996" }} />
              </div>
              <div>
                <p className="font-display font-bold text-base" style={{ color: "#0D1A0F" }}>Tu perfil esta semana</p>
                <p className="font-sans text-xs" style={{ color: "#6B7280" }}>Basado en tus respuestas</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl" style={{ background: "#F9FAFB" }}>
                <p className="font-sans text-xs mb-0.5" style={{ color: "#9CA3AF" }}>Estado emocional</p>
                <p className="font-display font-semibold text-sm" style={{ color: "#0D1A0F" }}>
                  {EMOCIONES[resultado.emocion_actual] ?? resultado.emocion_actual}
                </p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: "#F9FAFB" }}>
                <p className="font-sans text-xs mb-0.5" style={{ color: "#9CA3AF" }}>Perfil motivacional</p>
                <p className="font-display font-semibold text-sm" style={{ color: "#0D1A0F" }}>
                  {PERFILES[resultado.perfil_motivacional] ?? resultado.perfil_motivacional}
                </p>
              </div>
            </div>
          </div>

          {/* Plan 7 días */}
          <h2 className="font-display font-bold text-xl mb-4" style={{ color: "#0D1A0F" }}>
            Tu plan para los próximos 7 días
          </h2>
          <div className="space-y-3 mb-8">
            {resultado.plan_7dias.map((t) => (
              <div key={t.dia} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm"
                  style={{ background: "#EBF8F2", color: "#2D7A5F" }}>
                  D{t.dia}
                </div>
                <div>
                  <p className="font-display font-semibold text-sm mb-0.5" style={{ color: "#0D1A0F" }}>{t.nombre}</p>
                  <p className="font-sans text-xs leading-relaxed" style={{ color: "#6B7280" }}>{t.por_que}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/mi-perfil/tareas")}
              className="flex-1 py-3.5 rounded-full font-display font-semibold text-white text-center transition-colors"
              style={{ background: "#5CB996" }}
            >
              <CalendarDays className="w-4 h-4 inline mr-2" />
              Ver tarea de hoy
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
