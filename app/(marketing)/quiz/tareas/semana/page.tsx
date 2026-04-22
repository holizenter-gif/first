"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CalendarDays, TrendingUp } from "lucide-react";
import QuizFlow from "@/components/tareas/QuizFlow";
import type { Pregunta, Letra } from "@/lib/tareas/preguntas";

interface Plan { dia: number; nombre: string; instruccion: string; por_que: string; }
interface Resultado {
  perfil_motivacional: string;
  emocion_actual:      string;
  pool_asignado:       string;
  plan_7dias:          Plan[];
}

const POOL_LABEL: Record<string, string> = {
  ligero:   "Ligero — semana de mantenimiento",
  medio:    "Medio — trabajando el estrés o ansiedad",
  profundo: "Profundo — recuperación del burnout",
};

export default function QuizTareasSemanaPage() {
  const router = useRouter();
  const [preguntas,  setPreguntas]  = useState<Pregunta[] | null>(null);
  const [cargando,   setCargando]   = useState(true);
  const [bloqueado,  setBloqueado]  = useState<string | null>(null);
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resultado,  setResultado]  = useState<Resultado | null>(null);
  const [respuestasConId, setRespuestasConId] = useState<{ pregunta_id: string; letra: Letra }[]>([]);

  useEffect(() => {
    fetch("/api/quiz/tareas/semana")
      .then((r) => r.json())
      .then((d) => {
        if (d.error && d.proxima_fecha) {
          setBloqueado(new Date(d.proxima_fecha).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" }));
        } else if (d.error) {
          setError(d.error);
        } else {
          setPreguntas(d.preguntas);
        }
      })
      .catch(() => setError("Error cargando preguntas"))
      .finally(() => setCargando(false));
  }, []);

  const handleComplete = async (respuestas: Record<string, Letra>) => {
    setSubmitting(true);
    setError("");
    const payload = Object.entries(respuestas).map(([pregunta_id, letra]) => ({ pregunta_id, letra }));
    try {
      const res  = await fetch("/api/quiz/tareas/semana", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ respuestas: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error procesando");
      setResultado(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F2EC" }}>
        <RefreshCw className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} />
      </div>
    );
  }

  if (bloqueado) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F5F2EC" }}>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-sm text-center">
          <CalendarDays className="w-10 h-10 mx-auto mb-4" style={{ color: "#5CB996" }} />
          <h2 className="font-display font-bold text-xl mb-2" style={{ color: "#0D1A0F" }}>
            Check-in ya realizado
          </h2>
          <p className="font-sans text-sm mb-6" style={{ color: "#6B7280" }}>
            Tu próximo check-in semanal estará disponible el <strong>{bloqueado}</strong>.
          </p>
          <button
            onClick={() => router.push("/mi-perfil/tareas")}
            className="w-full py-3 rounded-full font-display font-semibold text-white transition-colors"
            style={{ background: "#5CB996" }}
          >
            Ver tarea de hoy
          </button>
        </div>
      </div>
    );
  }

  if (resultado) {
    return (
      <div className="min-h-screen" style={{ background: "#F5F2EC" }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6" style={{ color: "#5CB996" }} />
              <div>
                <p className="font-display font-bold" style={{ color: "#0D1A0F" }}>Nueva semana, nuevo plan</p>
                <p className="font-sans text-xs" style={{ color: "#6B7280" }}>
                  Pool: {POOL_LABEL[resultado.pool_asignado] ?? resultado.pool_asignado}
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl" style={{ background: "#F9FAFB" }}>
                <p className="font-sans text-xs mb-0.5" style={{ color: "#9CA3AF" }}>Estado esta semana</p>
                <p className="font-display font-semibold text-sm capitalize" style={{ color: "#0D1A0F" }}>
                  {resultado.emocion_actual}
                </p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: "#F9FAFB" }}>
                <p className="font-sans text-xs mb-0.5" style={{ color: "#9CA3AF" }}>Perfil motivacional</p>
                <p className="font-display font-semibold text-sm capitalize" style={{ color: "#0D1A0F" }}>
                  {resultado.perfil_motivacional}
                </p>
              </div>
            </div>
          </div>

          <h2 className="font-display font-bold text-xl mb-4" style={{ color: "#0D1A0F" }}>
            Tu plan de los próximos 7 días
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

          <button
            onClick={() => router.push("/mi-perfil/tareas")}
            className="w-full py-3.5 rounded-full font-display font-semibold text-white transition-colors"
            style={{ background: "#5CB996" }}
          >
            Ver tarea de hoy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5F2EC" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color: "#0D1A0F" }}>
            Check-in semanal
          </h1>
          <p className="font-sans text-sm" style={{ color: "#6B7280" }}>
            4 preguntas para ajustar tu plan de esta semana
          </p>
        </div>
        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm text-red-700" style={{ background: "#FEE2E2" }}>{error}</div>
        )}
        {preguntas && (
          <QuizFlow
            preguntas={preguntas}
            onComplete={handleComplete}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}
