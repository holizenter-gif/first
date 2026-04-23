"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, Star, Flame, Trophy, Clock, Square, CheckSquare } from "lucide-react";

interface TareaDetalle {
  nombre:      string;
  instruccion: string;
  por_que:     string;
  duracion_min: number;
}

interface TareaDiaria {
  id:             string;
  tarea_id:       string;
  completada:     boolean;
  fecha_asignada: string;
  tarea:          TareaDetalle | null;
}

interface TareaSemanal {
  id:           string;
  nombre:       string;
  instruccion:  string;
  por_que:      string;
  protocolo:    string;
  duracion_min: number;
  dia_nombre:   string;
  completada:   boolean;
}

interface ResultadoCompletada {
  xp_earned:            number;
  xp_total:             number;
  streak_actual:        number;
  delta_emocional:      number;
  badges_unlocked:      string[];
  validacion_emocional: string;
  rewards_disponibles:  { nombre: string; codigo: string }[];
}

type Fase = 'cargando' | 'sin_plan' | 'tarea' | 'slider' | 'completando' | 'resultado';

export default function TareaHoyPage() {
  const [fase,           setFase]           = useState<Fase>('cargando');
  const [tareaDiaria,    setTareaDiaria]    = useState<TareaDiaria | null>(null);
  const [tareasSemanales, setTareasSemanales] = useState<TareaSemanal[]>([]);
  const [xpTotal,        setXpTotal]        = useState(0);
  const [streak,         setStreak]         = useState(0);
  const [emocionAntes,   setEmocionAntes]   = useState(5);
  const [emocionDespues, setEmocionDespues] = useState(5);
  const [notas,          setNotas]          = useState("");
  const [resultado,      setResultado]      = useState<ResultadoCompletada | null>(null);
  const [error,          setError]          = useState("");
  const [completandoSemanal, setCompletandoSemanal] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tareas/hoy")
      .then((r) => r.json())
      .then((d) => {
        if (!d.tarea_diaria) {
          setFase("sin_plan");
        } else {
          setTareaDiaria(d.tarea_diaria);
          setTareasSemanales(d.tareas_semanales ?? []);
          setXpTotal(d.xp_total ?? 0);
          setStreak(d.streaks?.tareas ?? 0);
          setFase(d.tarea_diaria.completada ? "resultado" : "tarea");
        }
      })
      .catch(() => setFase("sin_plan"));
  }, []);

  const handleCompletar = async () => {
    if (!tareaDiaria) return;
    setFase("completando");
    setError("");
    try {
      const res  = await fetch("/api/tareas/completar", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          tarea_id:        tareaDiaria.tarea_id,
          emocion_antes:   emocionAntes,
          emocion_despues: emocionDespues,
          notas:           notas || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error completando");
      setResultado(data);
      setStreak(data.streak_actual);
      setXpTotal(data.xp_total);
      setFase("resultado");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
      setFase("slider");
    }
  };

  const handleCompletarSemanal = async (tareaId: string) => {
    setCompletandoSemanal(tareaId);
    try {
      await fetch("/api/tareas/completar", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ tarea_id: tareaId, tipo: "semanal" }),
      });
      setTareasSemanales((prev) => prev.map((t) => t.id === tareaId ? { ...t, completada: true } : t));
    } finally {
      setCompletandoSemanal(null);
    }
  };

  const StatsBar = () => (
    <div className="flex gap-3 mb-6">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
        <Flame className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
        <span className="font-display font-bold text-sm" style={{ color: "#0D1A0F" }}>{streak}</span>
        <span className="font-sans text-xs" style={{ color: "#6B7280" }}>streak</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
        <Star className="w-3.5 h-3.5" style={{ color: "#5CB996" }} />
        <span className="font-display font-bold text-sm" style={{ color: "#0D1A0F" }}>{xpTotal}</span>
        <span className="font-sans text-xs" style={{ color: "#6B7280" }}>XP</span>
      </div>
    </div>
  );

  // ── CARGANDO ──────────────────────────────────────────────────────────────
  if (fase === 'cargando') {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} />
      </div>
    );
  }

  // ── SIN PLAN ──────────────────────────────────────────────────────────────
  if (fase === 'sin_plan') {
    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
        <Star className="w-10 h-10 mx-auto mb-3" style={{ color: "#D1D5DB" }} />
        <p className="font-display font-bold text-lg mb-2" style={{ color: "#0D1A0F" }}>
          Aún no tienes un plan activo
        </p>
        <p className="font-sans text-sm mb-6" style={{ color: "#6B7280" }}>
          Completa el quiz de bienvenida para recibir tu plan de 7 días personalizado.
        </p>
        <Link
          href="/quiz/tareas/inicio"
          className="inline-block px-6 py-3 rounded-full font-display font-semibold text-white"
          style={{ background: "#5CB996" }}
        >
          Empezar quiz
        </Link>
      </div>
    );
  }

  // ── TAREA DIARIA ──────────────────────────────────────────────────────────
  if (fase === 'tarea' && tareaDiaria) {
    const hoyLabel = new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
    return (
      <div className="space-y-6">
        <StatsBar />

        {/* Tarea diaria */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5" style={{ background: "#0D1A0F" }}>
            <p className="font-sans text-xs font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              HOY — {hoyLabel.toUpperCase()}
            </p>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                Tarea diaria obligatoria
              </p>
              {tareaDiaria.tarea?.duracion_min && (
                <span className="flex items-center gap-1 font-sans text-xs" style={{ color: "#5CB996" }}>
                  <Clock className="w-3 h-3" /> {tareaDiaria.tarea.duracion_min} min
                </span>
              )}
            </div>
            <h2 className="font-display font-bold text-2xl text-white">
              {tareaDiaria.tarea?.nombre ?? "Cargando..."}
            </h2>
          </div>
          <div className="p-6">
            <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: "#374151" }}>
              {tareaDiaria.tarea?.instruccion}
            </p>
            {tareaDiaria.tarea?.por_que && (
              <div className="p-4 rounded-xl mb-6" style={{ background: "#EBF8F2" }}>
                <p className="font-sans text-xs font-semibold mb-1" style={{ color: "#2D7A5F" }}>¿Por qué esta práctica?</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "#374151" }}>{tareaDiaria.tarea.por_que}</p>
              </div>
            )}
            <button
              onClick={() => setFase("slider")}
              className="w-full py-4 rounded-full font-display font-bold text-white text-lg"
              style={{ background: "#5CB996" }}
            >
              Completar tarea
            </button>
          </div>
        </div>

        {/* Tareas semanales */}
        <TareasSemanalesSection
          tareas={tareasSemanales}
          onCompletar={handleCompletarSemanal}
          completando={completandoSemanal}
        />
      </div>
    );
  }

  // ── SLIDER EMOCIÓN ────────────────────────────────────────────────────────
  if ((fase === 'slider' || fase === 'completando') && tareaDiaria) {
    return (
      <div className="space-y-6">
        <StatsBar />
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-display font-bold text-lg mb-6" style={{ color: "#0D1A0F" }}>
            ¿Cómo te sientes?
          </h3>

          <SliderEmocion
            label="Antes de la práctica"
            value={emocionAntes}
            onChange={setEmocionAntes}
          />
          <SliderEmocion
            label="Después de la práctica"
            value={emocionDespues}
            onChange={setEmocionDespues}
          />

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

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <button
            onClick={handleCompletar}
            disabled={fase === 'completando'}
            className="w-full py-4 rounded-full font-display font-bold text-white disabled:opacity-60"
            style={{ background: "#5CB996" }}
          >
            {fase === 'completando'
              ? <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              : "Guardar y ver resultados"}
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTADO ─────────────────────────────────────────────────────────────
  if (fase === 'resultado') {
    return (
      <div className="space-y-4">
        <StatsBar />

        {resultado ? (
          <>
            {/* Validación */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#EBF8F2" }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: "#5CB996" }} />
                </div>
                <p className="font-display font-bold" style={{ color: "#0D1A0F" }}>¡Tarea completada!</p>
              </div>
              <p className="font-sans text-sm leading-relaxed mb-5" style={{ color: "#374151" }}>
                {resultado.validacion_emocional}
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl text-center" style={{ background: "#EBF8F2" }}>
                  <p className="font-display font-bold text-lg" style={{ color: "#2D7A5F" }}>+{resultado.xp_earned}</p>
                  <p className="font-sans text-xs" style={{ color: "#6B7280" }}>XP ganados</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: "#FEF3C7" }}>
                  <p className="font-display font-bold text-lg" style={{ color: "#92400E" }}>{resultado.streak_actual}</p>
                  <p className="font-sans text-xs" style={{ color: "#6B7280" }}>días streak</p>
                </div>
                <div className="p-3 rounded-xl text-center"
                  style={{ background: resultado.delta_emocional > 0 ? "#EBF8F2" : "#F3F4F6" }}>
                  <p className="font-display font-bold text-lg"
                    style={{ color: resultado.delta_emocional > 0 ? "#2D7A5F" : "#6B7280" }}>
                    {resultado.delta_emocional > 0 ? `+${resultado.delta_emocional}` : resultado.delta_emocional}
                  </p>
                  <p className="font-sans text-xs" style={{ color: "#6B7280" }}>delta emocional</p>
                </div>
              </div>
            </div>

            {resultado.badges_unlocked.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5" style={{ color: "#F59E0B" }} />
                  <p className="font-display font-bold text-sm" style={{ color: "#0D1A0F" }}>Badge desbloqueado</p>
                </div>
                {resultado.badges_unlocked.map((b) => (
                  <span key={b} className="inline-block px-3 py-1 rounded-full text-xs font-semibold mr-2"
                    style={{ background: "#FEF3C7", color: "#92400E" }}>
                    {b.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: "#5CB996" }} />
            <p className="font-display font-bold text-lg" style={{ color: "#0D1A0F" }}>Tarea ya completada hoy</p>
            <p className="font-sans text-sm mt-2" style={{ color: "#6B7280" }}>Vuelve mañana para tu siguiente práctica.</p>
          </div>
        )}

        {/* Semanales siempre visibles en resultado */}
        <TareasSemanalesSection
          tareas={tareasSemanales}
          onCompletar={handleCompletarSemanal}
          completando={completandoSemanal}
        />

        <Link
          href="/mi-perfil/tareas/progreso"
          className="block w-full text-center py-3.5 rounded-full font-display font-semibold border"
          style={{ borderColor: "#5CB996", color: "#5CB996" }}
        >
          Ver mi progreso
        </Link>
      </div>
    );
  }

  return null;
}

// ── Subcomponentes ─────────────────────────────────────────────────────────

function SliderEmocion({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-7">
      <div className="flex justify-between mb-2">
        <label className="font-sans text-sm font-medium" style={{ color: "#374151" }}>{label}</label>
        <span className="font-display font-bold text-lg" style={{ color: "#5CB996" }}>{value}/10</span>
      </div>
      <input
        type="range" min={1} max={10} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-teal-500"
      />
      <div className="flex justify-between mt-1">
        <span className="font-sans text-xs" style={{ color: "#9CA3AF" }}>Muy mal</span>
        <span className="font-sans text-xs" style={{ color: "#9CA3AF" }}>Excelente</span>
      </div>
    </div>
  );
}

function TareasSemanalesSection({
  tareas,
  onCompletar,
  completando,
}: {
  tareas:      TareaSemanal[];
  onCompletar: (id: string) => void;
  completando: string | null;
}) {
  if (tareas.length === 0) return null;
  const completadas = tareas.filter((t) => t.completada).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-sm" style={{ color: "#0D1A0F" }}>Tareas semanales</p>
            <p className="font-sans text-xs" style={{ color: "#6B7280" }}>Elige cuándo hacerlas esta semana</p>
          </div>
          <span className="font-sans text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "#EBF8F2", color: "#2D7A5F" }}>
            {completadas}/{tareas.length}
          </span>
        </div>
        {/* Barra de progreso semanales */}
        <div className="h-1.5 rounded-full mt-3" style={{ background: "#F3F4F6" }}>
          <div className="h-1.5 rounded-full transition-all"
            style={{ width: `${(completadas / tareas.length) * 100}%`, background: "#5CB996" }} />
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {tareas.map((t) => (
          <div key={t.id} className="px-5 py-4 flex items-start gap-3">
            <button
              onClick={() => !t.completada && onCompletar(t.id)}
              disabled={t.completada || completando === t.id}
              className="flex-shrink-0 mt-0.5"
            >
              {t.completada
                ? <CheckSquare className="w-5 h-5" style={{ color: "#5CB996" }} />
                : completando === t.id
                  ? <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#9CA3AF" }} />
                  : <Square className="w-5 h-5" style={{ color: "#D1D5DB" }} />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-sans text-xs font-medium" style={{ color: "#9CA3AF" }}>{t.dia_nombre}</p>
                <span className="flex items-center gap-1 font-sans text-xs" style={{ color: "#9CA3AF" }}>
                  <Clock className="w-3 h-3" />{t.duracion_min} min
                </span>
              </div>
              <p className="font-display font-semibold text-sm mb-0.5"
                style={{ color: t.completada ? "#9CA3AF" : "#0D1A0F",
                         textDecoration: t.completada ? "line-through" : "none" }}>
                {t.nombre}
              </p>
              <p className="font-sans text-xs leading-relaxed" style={{ color: "#6B7280" }}>{t.instruccion}</p>
              <p className="font-sans text-xs mt-1" style={{ color: "#9CA3AF" }}>{t.protocolo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
