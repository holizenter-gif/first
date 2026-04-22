"use client";

import { useEffect, useState } from "react";
import { Shield, TrendingUp, TrendingDown, Minus, Loader2, CheckCircle2 } from "lucide-react";

interface Patron {
  patron_dominante:                string | null;
  accion_mas_efectiva:             string | null;
  velocidad_recuperacion_promedio: number | null;
  updated_at:                      string | null;
}

interface RegistroEmotionResult {
  success:          boolean;
  delta_resiliencia: number | null;
}

type Fase = 'cargando' | 'formulario' | 'guardando' | 'completado';

const EMOCIONES = ['estrés', 'ansiedad', 'burnout', 'tristeza', 'enojo', 'frustración', 'calma', 'energía'];

const TRIGGERS = [
  { value: 'trabajo',    label: 'Trabajo' },
  { value: 'relacion',   label: 'Relación' },
  { value: 'fisico',     label: 'Físico' },
  { value: 'sin_motivo', label: 'Sin motivo claro' },
  { value: 'otro',       label: 'Otro' },
];

const ACCIONES = [
  { value: 'hice_tarea', label: 'Hice una tarea' },
  { value: 'respire',    label: 'Respiré / me calmé' },
  { value: 'hable',      label: 'Hablé con alguien' },
  { value: 'ejercicio',  label: 'Ejercicio' },
  { value: 'otro',       label: 'Otro' },
];

export default function ResilienciaPage() {
  const [fase,       setFase]       = useState<Fase>('cargando');
  const [patron,     setPatron]     = useState<Patron | null>(null);

  const [emocion,    setEmocion]    = useState(EMOCIONES[0]);
  const [intensidad, setIntensidad] = useState(5);
  const [trigger,    setTrigger]    = useState<string | null>(null);
  const [accion,     setAccion]     = useState<string | null>(null);
  const [resultado,  setResultado]  = useState<number | null>(null);

  const [deltaRes,   setDeltaRes]   = useState<number | null>(null);
  const [error,      setError]      = useState("");

  useEffect(() => {
    fetch("/api/usuario/progreso")
      .then((r) => r.json())
      .then((d) => {
        setPatron(d.resiliencia ?? null);
        setFase('formulario');
      });
  }, []);

  const handleGuardar = async () => {
    setError("");
    setFase('guardando');
    try {
      const body: Record<string, unknown> = {
        emocion_dominante: emocion,
        intensidad,
      };
      if (trigger)   body.trigger       = trigger;
      if (accion)    body.accion_tomada = accion;
      if (resultado != null) body.resultado = resultado;

      const res = await fetch("/api/tareas/registrar-emocion", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const d: RegistroEmotionResult = await res.json();
      if (!res.ok) throw new Error((d as unknown as Record<string, string>).error ?? "Error al guardar");
      setDeltaRes(d.delta_resiliencia);
      setFase('completado');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error inesperado");
      setFase('formulario');
    }
  };

  if (fase === 'cargando') {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} />
      </div>
    );
  }

  if (fase === 'completado') {
    const deltaPositivo = deltaRes != null && deltaRes > 0;
    const deltaNegativo = deltaRes != null && deltaRes < 0;
    return (
      <div className="space-y-4">
        <div className="rounded-2xl p-6" style={{ background: "#0D1A0F" }}>
          <div className="flex items-center gap-3 mb-1">
            <CheckCircle2 className="w-6 h-6" style={{ color: "#5CB996" }} />
            <h2 className="font-display font-bold text-lg text-white">Registro guardado</h2>
          </div>
          {deltaRes != null && (
            <div className="flex items-center gap-2 mt-3">
              {deltaPositivo ? (
                <TrendingUp className="w-5 h-5" style={{ color: "#5CB996" }} />
              ) : deltaNegativo ? (
                <TrendingDown className="w-5 h-5" style={{ color: "#EF4444" }} />
              ) : (
                <Minus className="w-5 h-5 text-white/40" />
              )}
              <p className="text-sm" style={{ color: deltaPositivo ? "#5CB996" : deltaNegativo ? "#EF4444" : "#9CA3AF" }}>
                {deltaPositivo
                  ? `Tu emoción mejoró ${deltaRes} puntos. Eso es resiliencia real.`
                  : deltaNegativo
                  ? "Hoy fue difícil. Registrarlo ya es un acto de conciencia."
                  : "La intensidad se mantuvo. La próxima acción puede marcar la diferencia."}
              </p>
            </div>
          )}
        </div>

        {patron && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="font-display font-semibold mb-3" style={{ color: "#0D1A0F" }}>
              Tu patrón de resiliencia
            </p>
            <div className="space-y-2 text-sm" style={{ color: "#6B7280" }}>
              {patron.patron_dominante && (
                <p><span className="font-semibold" style={{ color: "#0D1A0F" }}>Emoción frecuente:</span> {patron.patron_dominante}</p>
              )}
              {patron.accion_mas_efectiva && (
                <p><span className="font-semibold" style={{ color: "#0D1A0F" }}>Acción más efectiva:</span>{" "}
                  {ACCIONES.find((a) => a.value === patron.accion_mas_efectiva)?.label ?? patron.accion_mas_efectiva}
                </p>
              )}
              {patron.velocidad_recuperacion_promedio != null && (
                <p><span className="font-semibold" style={{ color: "#0D1A0F" }}>Velocidad de recuperación:</span> {patron.velocidad_recuperacion_promedio > 0 ? `+${patron.velocidad_recuperacion_promedio}` : patron.velocidad_recuperacion_promedio} puntos</p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => { setFase('formulario'); setDeltaRes(null); setResultado(null); }}
          className="w-full py-3 rounded-full font-display font-semibold text-sm border transition-colors"
          style={{ borderColor: "#5CB996", color: "#5CB996" }}
        >
          Registrar otra emoción
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl p-6" style={{ background: "#0D1A0F" }}>
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-6 h-6" style={{ color: "#5CB996" }} />
          <h2 className="font-display font-bold text-lg text-white">Registro de resiliencia</h2>
        </div>
        <p className="text-white/60 text-sm">
          Registra tu estado emocional y qué hiciste al respecto. Tus patrones se van revelando con el tiempo.
        </p>
      </div>

      {/* Patrón previo */}
      {patron?.accion_mas_efectiva && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-2 text-sm" style={{ background: "#EBF8F2" }}>
          <TrendingUp className="w-4 h-4 flex-shrink-0" style={{ color: "#5CB996" }} />
          <p style={{ color: "#2D7A5F" }}>
            Tu acción más efectiva hasta ahora:{" "}
            <strong>{ACCIONES.find((a) => a.value === patron.accion_mas_efectiva)?.label ?? patron.accion_mas_efectiva}</strong>
          </p>
        </div>
      )}

      {/* Emoción dominante */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <p className="font-display font-semibold mb-3" style={{ color: "#0D1A0F" }}>
          ¿Qué emoción es predominante ahora?
        </p>
        <div className="flex flex-wrap gap-2">
          {EMOCIONES.map((e) => (
            <button
              key={e}
              onClick={() => setEmocion(e)}
              className="px-4 py-2 rounded-full text-sm font-display font-semibold border transition-colors capitalize"
              style={{
                background:  emocion === e ? "#5CB996" : "transparent",
                color:       emocion === e ? "#fff"    : "#6B7280",
                borderColor: emocion === e ? "#5CB996" : "#E5E7EB",
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Intensidad */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <p className="font-display font-semibold mb-1" style={{ color: "#0D1A0F" }}>
          Intensidad: {intensidad}/10
        </p>
        <p className="text-xs mb-3" style={{ color: "#6B7280" }}>¿Qué tan fuerte la sientes ahora?</p>
        <input
          type="range" min={1} max={10} value={intensidad}
          onChange={(e) => setIntensidad(Number(e.target.value))}
          className="w-full accent-teal-500"
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: "#6B7280" }}>
          <span>Apenas perceptible</span>
          <span>Muy intensa</span>
        </div>
      </div>

      {/* Trigger */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <p className="font-display font-semibold mb-3" style={{ color: "#0D1A0F" }}>
          ¿Qué la desencadenó? <span className="font-normal text-sm" style={{ color: "#6B7280" }}>(opcional)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {TRIGGERS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTrigger(trigger === t.value ? null : t.value)}
              className="px-4 py-2 rounded-full text-sm font-display font-semibold border transition-colors"
              style={{
                background:  trigger === t.value ? "#0D1A0F" : "transparent",
                color:       trigger === t.value ? "#fff"    : "#6B7280",
                borderColor: trigger === t.value ? "#0D1A0F" : "#E5E7EB",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Acción tomada */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <p className="font-display font-semibold mb-3" style={{ color: "#0D1A0F" }}>
          ¿Qué hiciste al respecto? <span className="font-normal text-sm" style={{ color: "#6B7280" }}>(opcional)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {ACCIONES.map((a) => (
            <button
              key={a.value}
              onClick={() => setAccion(accion === a.value ? null : a.value)}
              className="px-4 py-2 rounded-full text-sm font-display font-semibold border transition-colors"
              style={{
                background:  accion === a.value ? "#0D1A0F" : "transparent",
                color:       accion === a.value ? "#fff"    : "#6B7280",
                borderColor: accion === a.value ? "#0D1A0F" : "#E5E7EB",
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resultado (si tomó acción) */}
      {accion && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="font-display font-semibold mb-1" style={{ color: "#0D1A0F" }}>
            Después de la acción, ¿cómo te sientes? {resultado != null ? `${resultado}/10` : ""}
          </p>
          <p className="text-xs mb-3" style={{ color: "#6B7280" }}>Compara con la intensidad anterior ({intensidad}/10)</p>
          <input
            type="range" min={1} max={10} value={resultado ?? intensidad}
            onChange={(e) => setResultado(Number(e.target.value))}
            className="w-full accent-teal-500"
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "#6B7280" }}>
            <span>Mucho peor</span>
            <span>Mucho mejor</span>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <button
        onClick={handleGuardar}
        disabled={fase === 'guardando'}
        className="w-full py-3.5 rounded-full font-display font-bold text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: "#5CB996" }}
      >
        {fase === 'guardando' && <Loader2 className="w-4 h-4 animate-spin" />}
        {fase === 'guardando' ? "Guardando..." : "Registrar emoción"}
      </button>
    </div>
  );
}
