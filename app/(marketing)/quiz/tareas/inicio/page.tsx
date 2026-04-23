"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, CalendarDays, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import QuizFlow from "@/components/tareas/QuizFlow";
import { PREGUNTAS_ONBOARDING } from "@/lib/tareas/preguntas";
import type { Letra } from "@/lib/tareas/preguntas";

interface PlanDia { dia: number; nombre: string; instruccion: string; por_que: string; duracion_min?: number; }
interface Resultado {
  perfil_motivacional: string;
  emocion_actual:      string;
  tiempo_disponible:   string;
  tono_intencional:    string;
  plan_7dias:          PlanDia[];
}

// ─── Datos del semáforo ────────────────────────────────────────────────────

const INTENSIDAD: Record<string, number> = {
  burnout: 90, depresion: 85, duelo: 82, estres: 70, ansiedad: 60, mantenimiento: 30,
  pragmatico: 80, competitivo: 85, introspectivo: 72, comunitario: 75,
  "5min": 35, "10min": 55, "15min": 70, "20min+": 85,
  restaurativo: 35, exploratorio: 50, accion: 65, profundo: 78,
};

const DESCRIPCION_EMOCION: Record<string, string> = {
  burnout:       "Tu sistema necesita restauración profunda",
  depresion:     "Tu energía está en pausa, necesita activación suave",
  duelo:         "Necesitas espacio para procesar y honrar",
  estres:        "Las demandas superan tus recursos actuales",
  ansiedad:      "Tu mente está en alerta, busca el presente",
  mantenimiento: "Vas bien — mantén y refuerza el ritmo",
};

const DESCRIPCION_MOTIVACION: Record<string, string> = {
  pragmatico:    "Orientado/a a resultados medibles",
  competitivo:   "Orientado/a al desafío y la superación",
  introspectivo: "Orientado/a al autoconocimiento",
  comunitario:   "Orientado/a a la conexión con otros",
};

const DESCRIPCION_TIEMPO: Record<string, string> = {
  "5min":   "Tiempo justo — suficiente para empezar",
  "10min":  "Espacio real para una práctica efectiva",
  "15min":  "Un bloque sólido de trabajo contigo mismo/a",
  "20min+": "Compromiso profundo con el proceso",
};

const DESCRIPCION_TONO: Record<string, string> = {
  accion:       "Necesitas movimiento, no solo reflexión",
  exploratorio: "Curiosidad y exploración interior",
  restaurativo: "Recuperación y descanso activo",
  profundo:     "Trabajo de introspección profunda",
};

const NOMBRE_EMOCION: Record<string, string> = {
  burnout: "Burnout", depresion: "Depresión", duelo: "Duelo",
  estres: "Estrés", ansiedad: "Ansiedad", mantenimiento: "Equilibrio",
};

const NOMBRE_MOTIVACION: Record<string, string> = {
  pragmatico: "Pragmático/a", competitivo: "Competitivo/a",
  introspectivo: "Introspectivo/a", comunitario: "Comunitario/a",
};

const NOMBRE_TONO: Record<string, string> = {
  accion: "Acción", exploratorio: "Exploratorio",
  restaurativo: "Restaurativo", profundo: "Profundo",
};

const DIAS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function getColor(pct: number): string {
  if (pct <= 40) return "#5CB996";
  if (pct <= 70) return "#F59E0B";
  return "#EF4444";
}

function getColorLabel(pct: number): string {
  if (pct <= 40) return "Equilibrio";
  if (pct <= 70) return "Atención";
  return "Urgencia";
}

interface TarjetaPerfilProps {
  label:       string;
  valor:       string;
  nombreMost:  string;
  descripcion: string;
  pct:         number;
}

function TarjetaPerfil({ label, valor: _valor, nombreMost, descripcion, pct }: TarjetaPerfilProps) {
  const color = getColor(pct);
  const colorLabel = getColorLabel(pct);
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <p className="font-sans text-xs font-medium mb-1" style={{ color: "#9CA3AF" }}>{label}</p>
      <div className="flex items-center justify-between mb-2">
        <p className="font-display font-bold text-base" style={{ color: "#0D1A0F" }}>{nombreMost}</p>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: color + "20", color }}>
          {colorLabel} · {pct}%
        </span>
      </div>
      {/* Barra */}
      <div className="h-2 rounded-full mb-3" style={{ background: "#F3F4F6" }}>
        <div className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="font-sans text-xs leading-relaxed" style={{ color: "#6B7280" }}>{descripcion}</p>
    </div>
  );
}

export default function QuizTareasInicioPage() {
  const router       = useRouter();
  const [fase,       setFase]      = useState<'intro' | 'quiz' | 'perfil' | 'plan'>('intro');
  const [resultado,  setResultado] = useState<Resultado | null>(null);
  const [error,      setError]     = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async (respuestas: Record<string, Letra>) => {
    setSubmitting(true);
    setError("");
    try {
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
      setFase("perfil");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  // ── INTRO ────────────────────────────────────────────────────────────────
  if (fase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
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
        <div className="lg:w-1/2 flex flex-col justify-center items-center px-8 py-16" style={{ background: "#F5F2EC" }}>
          <div className="w-full max-w-sm text-center">
            <p className="font-display font-semibold text-lg mb-2" style={{ color: "#0D1A0F" }}>¿Listo/a para empezar?</p>
            <p className="font-sans text-sm mb-8" style={{ color: "#6B7280" }}>Responde con honestidad. No hay respuestas correctas.</p>
            <button
              onClick={() => setFase("quiz")}
              className="w-full py-4 rounded-full font-display font-bold text-white text-lg transition-colors"
              style={{ background: "#5CB996" }}
            >
              Comenzar quiz
            </button>
            <p className="font-sans text-xs mt-4" style={{ color: "#9CA3AF" }}>
              ¿Ya tienes un plan? <Link href="/mi-perfil/tareas" className="underline">Ver mis tareas</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ ─────────────────────────────────────────────────────────────────
  if (fase === 'quiz') {
    return (
      <div className="min-h-screen" style={{ background: "#F5F2EC" }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm text-red-700" style={{ background: "#FEE2E2" }}>
              {error}
            </div>
          )}
          <QuizFlow preguntas={PREGUNTAS_ONBOARDING} onComplete={handleComplete} submitting={submitting} />
        </div>
      </div>
    );
  }

  // ── PERFIL (semáforos) ────────────────────────────────────────────────────
  if (fase === 'perfil' && resultado) {
    const em  = resultado.emocion_actual;
    const mot = resultado.perfil_motivacional;
    const tp  = resultado.tiempo_disponible;
    const ton = resultado.tono_intencional;

    return (
      <div className="min-h-screen" style={{ background: "#F5F2EC" }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#EBF8F2" }}>
              <Leaf className="w-6 h-6" style={{ color: "#5CB996" }} />
            </div>
            <h1 className="font-display font-bold text-2xl mb-2" style={{ color: "#0D1A0F" }}>Tu perfil de bienestar</h1>
            <p className="font-sans text-sm" style={{ color: "#6B7280" }}>Basado en tus 6 respuestas</p>
          </div>

          <div className="space-y-4 mb-8">
            <TarjetaPerfil
              label="Estado emocional"
              valor={em}
              nombreMost={NOMBRE_EMOCION[em] ?? em}
              descripcion={DESCRIPCION_EMOCION[em] ?? ""}
              pct={INTENSIDAD[em] ?? 50}
            />
            <TarjetaPerfil
              label="Perfil motivacional"
              valor={mot}
              nombreMost={NOMBRE_MOTIVACION[mot] ?? mot}
              descripcion={DESCRIPCION_MOTIVACION[mot] ?? ""}
              pct={INTENSIDAD[mot] ?? 70}
            />
            <TarjetaPerfil
              label="Disponibilidad"
              valor={tp}
              nombreMost={tp}
              descripcion={DESCRIPCION_TIEMPO[tp] ?? ""}
              pct={INTENSIDAD[tp] ?? 50}
            />
            <TarjetaPerfil
              label="Tu intención"
              valor={ton}
              nombreMost={NOMBRE_TONO[ton] ?? ton}
              descripcion={DESCRIPCION_TONO[ton] ?? ""}
              pct={INTENSIDAD[ton] ?? 50}
            />
          </div>

          <button
            onClick={() => setFase("plan")}
            className="w-full py-4 rounded-full font-display font-bold text-white text-lg flex items-center justify-center gap-2"
            style={{ background: "#5CB996" }}
          >
            Ver mi plan personalizado de 7 días
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ── PLAN 7 DÍAS ───────────────────────────────────────────────────────────
  if (fase === 'plan' && resultado) {
    const hoy = new Date();
    return (
      <div className="min-h-screen" style={{ background: "#F5F2EC" }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <h2 className="font-display font-bold text-2xl mb-2" style={{ color: "#0D1A0F" }}>
            Tu plan para los próximos 7 días
          </h2>
          <p className="font-sans text-sm mb-8" style={{ color: "#6B7280" }}>
            Prácticas diseñadas para tu estado actual — pequeñas, consistentes y basadas en evidencia.
          </p>

          <div className="space-y-4 mb-8">
            {resultado.plan_7dias.map((t) => {
              const fecha = new Date(hoy);
              fecha.setDate(hoy.getDate() + t.dia - 1);
              const diaLabel = t.dia === 1 ? "HOY" : DIAS_ES[fecha.getDay()].toUpperCase();
              return (
                <div key={t.dia} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-sm"
                      style={{ background: t.dia === 1 ? "#0D1A0F" : "#EBF8F2", color: t.dia === 1 ? "#FFFFFF" : "#2D7A5F" }}>
                      {t.dia === 1 ? "HOY" : `D${t.dia}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-sans text-xs font-medium" style={{ color: "#9CA3AF" }}>{diaLabel}</p>
                        {t.duracion_min && (
                          <span className="flex items-center gap-1 font-sans text-xs" style={{ color: "#9CA3AF" }}>
                            <Clock className="w-3 h-3" /> {t.duracion_min} min
                          </span>
                        )}
                      </div>
                      <p className="font-display font-semibold text-sm mb-1" style={{ color: "#0D1A0F" }}>{t.nombre}</p>
                      <p className="font-sans text-xs leading-relaxed mb-2" style={{ color: "#374151" }}>{t.instruccion}</p>
                      {t.por_que && (
                        <p className="font-sans text-xs italic" style={{ color: "#9CA3AF" }}>
                          Porque: {t.por_que}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/mi-perfil/tareas")}
              className="flex-1 py-3.5 rounded-full font-display font-semibold text-white text-center flex items-center justify-center gap-2"
              style={{ background: "#5CB996" }}
            >
              <CalendarDays className="w-4 h-4" />
              Empezar mi plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
