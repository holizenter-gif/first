"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, Star, Flame, Trophy } from "lucide-react";

interface TareaHoy {
  id:           string;
  tarea_id:     string;
  completada:   boolean;
  fecha_asignada: string;
  tarea: {
    nombre:      string;
    instruccion: string;
    por_que:     string;
    duracion_min: number;
  } | null;
}

interface Gamif {
  xp_total:      number;
  streak_actual: number;
  badges_collected: string[];
}

type Fase = 'cargando' | 'sin_plan' | 'tarea' | 'slider_antes' | 'completando' | 'resultado';

interface ResultadoCompletada {
  xp_earned:            number;
  xp_total:             number;
  streak_actual:        number;
  delta_emocional:      number;
  badges_unlocked:      string[];
  validacion_emocional: string;
  rewards_disponibles:  { nombre: string; codigo: string }[];
}

export default function TareaHoyPage() {
  const router = useRouter();
  const [fase,         setFase]         = useState<Fase>('cargando');
  const [tareaHoy,     setTareaHoy]     = useState<TareaHoy | null>(null);
  const [gamif,        setGamif]        = useState<Gamif | null>(null);
  const [emocionAntes, setEmocionAntes] = useState(5);
  const [emocionDespues, setEmocionDespues] = useState(5);
  const [notas,        setNotas]        = useState("");
  const [resultado,    setResultado]    = useState<ResultadoCompletada | null>(null);
  const [error,        setError]        = useState("");

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];
    Promise.all([
      fetch(`/api/mi-perfil/tareas?fecha=${hoy}`).then((r) => r.json()),
      fetch("/api/mi-perfil/gamificacion").then((r) => r.json()),
    ]).then(([tareaData, gamifData]) => {
      if (!tareaData.tarea) {
        setFase("sin_plan");
      } else {
        setTareaHoy(tareaData.tarea);
        setGamif(gamifData.gamificacion ?? null);
        setFase(tareaData.tarea.completada ? "resultado" : "tarea");
      }
    }).catch(() => setFase("sin_plan"));
  }, []);

  const iniciarCompletado = () => setFase("slider_antes");

  const handleCompletar = async () => {
    if (!tareaHoy) return;
    setFase("completando");
    setError("");
    try {
      const res  = await fetch("/api/tareas/completar", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          tarea_id:       tareaHoy.tarea_id,
          emocion_antes:  emocionAntes,
          emocion_despues: emocionDespues,
          notas:          notas || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error completando");
      setResultado(data);
      setFase("resultado");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
      setFase("slider_antes");
    }
  };

  if (fase === 'cargando') {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} />
      </div>
    );
  }

  if (fase === 'sin_plan') {
    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
        <Star className="w-10 h-10 mx-auto mb-3" style={{ color: "#D1D5DB" }} />
        <p className="font-display font-bold text-lg mb-2" style={{ color: "#0D1A0F" }}>
          Aún no tienes un plan activo
        </p>
        <p className="font-sans text-sm mb-6" style={{ color: "#6B7280" }}>
          Completa el quiz de bienvenida para recibir tu primer plan de 7 días personalizado.
        </p>
        <Link
          href="/quiz/tareas/inicio"
          className="inline-block px-6 py-3 rounded-full font-display font-semibold text-white transition-colors"
          style={{ background: "#5CB996" }}
        >
          Empezar quiz
        </Link>
      </div>
    );
  }

  // Barra superior de stats
  const StatsBar = () => (
    <div className="flex gap-4 mb-6">
      {gamif && (
        <>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
            <Flame className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
            <span className="font-display font-bold text-sm" style={{ color: "#0D1A0F" }}>{gamif.streak_actual}</span>
            <span className="font-sans text-xs" style={{ color: "#6B7280" }}>streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
            <Star className="w-3.5 h-3.5" style={{ color: "#5CB996" }} />
            <span className="font-display font-bold text-sm" style={{ color: "#0D1A0F" }}>{gamif.xp_total}</span>
            <span className="font-sans text-xs" style={{ color: "#6B7280" }}>XP</span>
          </div>
        </>
      )}
    </div>
  );

  if (fase === 'tarea' && tareaHoy) {
    return (
      <div>
        <StatsBar />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5" style={{ background: "#0D1A0F" }}>
            <p className="font-sans text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Tarea de hoy · {tareaHoy.tarea?.duracion_min ?? 5} min
            </p>
            <h2 className="font-display font-bold text-2xl text-white">
              {tareaHoy.tarea?.nombre}
            </h2>
          </div>
          <div className="p-6">
            <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: "#374151" }}>
              {tareaHoy.tarea?.instruccion}
            </p>
            {tareaHoy.tarea?.por_que && (
              <div className="p-4 rounded-xl mb-6" style={{ background: "#EBF8F2" }}>
                <p className="font-sans text-xs font-semibold mb-1" style={{ color: "#2D7A5F" }}>¿Por qué esta práctica?</p>
                <p className="font-sans text-sm" style={{ color: "#374151" }}>{tareaHoy.tarea.por_que}</p>
              </div>
            )}
            <button
              onClick={iniciarCompletado}
              className="w-full py-4 rounded-full font-display font-bold text-white text-lg transition-colors"
              style={{ background: "#5CB996" }}
            >
              Completar tarea
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (fase === 'slider_antes' || fase === 'completando') {
    return (
      <div>
        <StatsBar />
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-display font-bold text-lg mb-6" style={{ color: "#0D1A0F" }}>
            ¿Cómo te sientes ahora?
          </h3>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <label className="font-sans text-sm font-medium" style={{ color: "#374151" }}>Antes de la práctica</label>
              <span className="font-display font-bold text-lg" style={{ color: "#5CB996" }}>{emocionAntes}/10</span>
            </div>
            <input
              type="range" min={1} max={10} value={emocionAntes}
              onChange={(e) => setEmocionAntes(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
            <div className="flex justify-between mt-1">
              <span className="font-sans text-xs" style={{ color: "#9CA3AF" }}>Muy mal</span>
              <span className="font-sans text-xs" style={{ color: "#9CA3AF" }}>Excelente</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <label className="font-sans text-sm font-medium" style={{ color: "#374151" }}>Después de la práctica</label>
              <span className="font-display font-bold text-lg" style={{ color: "#5CB996" }}>{emocionDespues}/10</span>
            </div>
            <input
              type="range" min={1} max={10} value={emocionDespues}
              onChange={(e) => setEmocionDespues(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
            <div className="flex justify-between mt-1">
              <span className="font-sans text-xs" style={{ color: "#9CA3AF" }}>Muy mal</span>
              <span className="font-sans text-xs" style={{ color: "#9CA3AF" }}>Excelente</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="font-sans text-sm font-medium block mb-2" style={{ color: "#374151" }}>
              Notas (opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="¿Cómo fue la experiencia?"
              className="w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2"
              style={{ borderColor: "#E5E7EB", color: "#374151" }}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}

          <button
            onClick={handleCompletar}
            disabled={fase === 'completando'}
            className="w-full py-4 rounded-full font-display font-bold text-white transition-colors disabled:opacity-60"
            style={{ background: "#5CB996" }}
          >
            {fase === 'completando' ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Guardar y ver resultados"}
          </button>
        </div>
      </div>
    );
  }

  if (fase === 'resultado') {
    const res = resultado;
    return (
      <div>
        <StatsBar />
        {res ? (
          <div className="space-y-4">
            {/* Validación emocional */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6" style={{ color: "#5CB996" }} />
                <p className="font-display font-bold" style={{ color: "#0D1A0F" }}>¡Tarea completada!</p>
              </div>
              <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: "#374151" }}>
                {res.validacion_emocional}
              </p>
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-xl text-center" style={{ background: "#EBF8F2" }}>
                  <p className="font-display font-bold text-lg" style={{ color: "#2D7A5F" }}>+{res.xp_earned}</p>
                  <p className="font-sans text-xs" style={{ color: "#6B7280" }}>XP ganados</p>
                </div>
                <div className="flex-1 p-3 rounded-xl text-center" style={{ background: "#FEF3C7" }}>
                  <p className="font-display font-bold text-lg" style={{ color: "#92400E" }}>{res.streak_actual}</p>
                  <p className="font-sans text-xs" style={{ color: "#6B7280" }}>días de racha</p>
                </div>
                <div className="flex-1 p-3 rounded-xl text-center" style={{ background: res.delta_emocional > 0 ? "#EBF8F2" : "#F3F4F6" }}>
                  <p className="font-display font-bold text-lg" style={{ color: res.delta_emocional > 0 ? "#2D7A5F" : "#6B7280" }}>
                    {res.delta_emocional > 0 ? `+${res.delta_emocional}` : res.delta_emocional}
                  </p>
                  <p className="font-sans text-xs" style={{ color: "#6B7280" }}>delta emocional</p>
                </div>
              </div>
            </div>

            {/* Badges nuevos */}
            {res.badges_unlocked.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5" style={{ color: "#F59E0B" }} />
                  <p className="font-display font-bold text-sm" style={{ color: "#0D1A0F" }}>Badge desbloqueado</p>
                </div>
                {res.badges_unlocked.map((b) => (
                  <span key={b} className="inline-block px-3 py-1 rounded-full text-xs font-semibold mr-2"
                    style={{ background: "#FEF3C7", color: "#92400E" }}>
                    {b.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            )}

            {/* Rewards disponibles */}
            {res.rewards_disponibles.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="font-display font-bold text-sm mb-3" style={{ color: "#0D1A0F" }}>🎁 Reward desbloqueado</p>
                {res.rewards_disponibles.map((r) => (
                  <p key={r.codigo} className="font-sans text-sm" style={{ color: "#374151" }}>{r.nombre}</p>
                ))}
              </div>
            )}

            <Link
              href="/mi-perfil/tareas/progreso"
              className="block w-full text-center py-3.5 rounded-full font-display font-semibold border transition-colors"
              style={{ borderColor: "#5CB996", color: "#5CB996" }}
            >
              Ver mi progreso
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: "#5CB996" }} />
            <p className="font-display font-bold text-lg" style={{ color: "#0D1A0F" }}>Tarea ya completada hoy</p>
            <p className="font-sans text-sm mt-2" style={{ color: "#6B7280" }}>Vuelve mañana para tu siguiente práctica.</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
