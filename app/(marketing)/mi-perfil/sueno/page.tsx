"use client";

import { useEffect, useState } from "react";
import { Moon, Star, CheckCircle2, Loader2, Music } from "lucide-react";

interface Sleepcast {
  id:           string;
  nombre:       string;
  duracion_min: number;
  protocolo:    string | null;
  complejidad:  string | null;
  emocion_ideal: string[];
}

interface RegistroHoy {
  completado:     boolean;
  calidad_sueno:  number | null;
  tiempo_dormido: number | null;
  notas:          string | null;
  sleepcast_id:   string | null;
}

type Fase = 'cargando' | 'formulario' | 'guardando' | 'completado';

const COMPLEJIDAD_LABEL: Record<string, string> = {
  ligero:   'Ligero',
  medio:    'Moderado',
  profundo: 'Profundo',
};

export default function SuenoPage() {
  const [fase,           setFase]           = useState<Fase>('cargando');
  const [sleepcasts,     setSleepcasts]     = useState<Sleepcast[]>([]);
  const [registroHoy,    setRegistroHoy]    = useState<RegistroHoy | null>(null);
  const [streakSueno,    setStreakSueno]    = useState(0);

  const [sleepcastId,    setSleepcastId]    = useState<string | null>(null);
  const [calidad,        setCalidad]        = useState(7);
  const [tiempoDormido,  setTiempoDormido]  = useState<number | null>(null);
  const [notas,          setNotas]          = useState("");
  const [nuevoStreak,    setNuevoStreak]    = useState<number | null>(null);
  const [error,          setError]          = useState("");

  useEffect(() => {
    fetch("/api/tareas/registrar-sueno")
      .then((r) => r.json())
      .then((d) => {
        setSleepcasts(d.sleepcasts ?? []);
        setStreakSueno(d.streak_sueno ?? 0);
        if (d.registro_hoy?.completado) {
          setRegistroHoy(d.registro_hoy);
          setFase('completado');
        } else {
          setFase('formulario');
        }
      });
  }, []);

  const handleGuardar = async () => {
    setError("");
    setFase('guardando');
    try {
      const res = await fetch("/api/tareas/registrar-sueno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sleepcast_id:   sleepcastId,
          calidad_sueno:  calidad,
          tiempo_dormido: tiempoDormido,
          notas:          notas.trim() || null,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Error al guardar");
      setNuevoStreak(d.streak_sueno);
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
    const sk = nuevoStreak ?? streakSueno;
    return (
      <div className="space-y-4">
        {/* Header streak */}
        <div
          className="rounded-2xl p-6 flex items-center gap-4"
          style={{ background: "#0D1A0F" }}
        >
          <Moon className="w-8 h-8 flex-shrink-0" style={{ color: "#5CB996" }} />
          <div>
            <p className="text-white font-display font-bold text-lg">Sueño registrado</p>
            <p className="text-white/60 text-sm">
              {sk > 0 ? `${sk} noche${sk !== 1 ? "s" : ""} seguidas ·` : ""} ¡Sigue así!
            </p>
          </div>
          {sk > 0 && (
            <div className="ml-auto flex items-center gap-1">
              <Star className="w-5 h-5" style={{ color: "#F59E0B" }} />
              <span className="font-display font-bold text-white">{sk}</span>
            </div>
          )}
        </div>

        {registroHoy && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5" style={{ color: "#5CB996" }} />
              <span className="font-display font-semibold" style={{ color: "#0D1A0F" }}>
                Tu registro de anoche
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm" style={{ color: "#6B7280" }}>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1">Calidad de sueño</p>
                <p className="font-display font-bold text-2xl" style={{ color: "#0D1A0F" }}>
                  {registroHoy.calidad_sueno}/10
                </p>
              </div>
              {registroHoy.tiempo_dormido && (
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1">Horas dormidas</p>
                  <p className="font-display font-bold text-2xl" style={{ color: "#0D1A0F" }}>
                    {registroHoy.tiempo_dormido}h
                  </p>
                </div>
              )}
            </div>
            {registroHoy.notas && (
              <p className="text-sm italic" style={{ color: "#6B7280" }}>{registroHoy.notas}</p>
            )}
          </div>
        )}

        {/* Sleepcasts para esta noche */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="font-display font-semibold mb-4" style={{ color: "#0D1A0F" }}>
            Para esta noche
          </p>
          <div className="space-y-2">
            {sleepcasts.slice(0, 3).map((sc) => (
              <div
                key={sc.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "#F5F2EC" }}
              >
                <Music className="w-4 h-4 flex-shrink-0" style={{ color: "#5CB996" }} />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm truncate" style={{ color: "#0D1A0F" }}>
                    {sc.nombre}
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {sc.duracion_min} min · {sc.complejidad ? COMPLEJIDAD_LABEL[sc.complejidad] : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "#0D1A0F" }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Moon className="w-6 h-6" style={{ color: "#5CB996" }} />
          <h2 className="font-display font-bold text-lg text-white">Registro de sueño</h2>
        </div>
        <p className="text-white/60 text-sm">
          Registra cómo dormiste anoche y elige un sleepcast para esta noche.
        </p>
      </div>

      {/* Calidad */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <p className="font-display font-semibold mb-2" style={{ color: "#0D1A0F" }}>
          ¿Cómo dormiste anoche?
        </p>
        <p className="text-xs mb-4" style={{ color: "#6B7280" }}>Calidad del sueño: {calidad}/10</p>
        <input
          type="range" min={1} max={10} value={calidad}
          onChange={(e) => setCalidad(Number(e.target.value))}
          className="w-full accent-teal-500"
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: "#6B7280" }}>
          <span>Muy mal</span>
          <span>Excelente</span>
        </div>
      </div>

      {/* Horas */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <p className="font-display font-semibold mb-3" style={{ color: "#0D1A0F" }}>
          ¿Cuántas horas dormiste? <span className="font-normal text-sm" style={{ color: "#6B7280" }}>(opcional)</span>
        </p>
        <div className="flex gap-2 flex-wrap">
          {[4, 5, 6, 7, 8, 9].map((h) => (
            <button
              key={h}
              onClick={() => setTiempoDormido(tiempoDormido === h ? null : h)}
              className="px-4 py-2 rounded-full text-sm font-display font-semibold border transition-colors"
              style={{
                background:   tiempoDormido === h ? "#5CB996" : "transparent",
                color:        tiempoDormido === h ? "#fff"    : "#6B7280",
                borderColor:  tiempoDormido === h ? "#5CB996" : "#E5E7EB",
              }}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      {/* Sleepcast */}
      {sleepcasts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="font-display font-semibold mb-1" style={{ color: "#0D1A0F" }}>
            ¿Usaste un sleepcast anoche? <span className="font-normal text-sm" style={{ color: "#6B7280" }}>(opcional)</span>
          </p>
          <div className="space-y-2 mt-3">
            {sleepcasts.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSleepcastId(sleepcastId === sc.id ? null : sc.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left"
                style={{
                  background:  sleepcastId === sc.id ? "#EBF8F2" : "#F5F2EC",
                  borderColor: sleepcastId === sc.id ? "#5CB996"  : "transparent",
                }}
              >
                <Music className="w-4 h-4 flex-shrink-0" style={{ color: "#5CB996" }} />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm truncate" style={{ color: "#0D1A0F" }}>
                    {sc.nombre}
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {sc.duracion_min} min · {sc.protocolo ?? ""} · {sc.complejidad ? COMPLEJIDAD_LABEL[sc.complejidad] : ""}
                  </p>
                </div>
                {sleepcastId === sc.id && (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#5CB996" }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notas */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <p className="font-display font-semibold mb-3" style={{ color: "#0D1A0F" }}>
          Notas <span className="font-normal text-sm" style={{ color: "#6B7280" }}>(opcional)</span>
        </p>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
          placeholder="¿Soñaste algo? ¿Cómo te sientes esta mañana?"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:border-teal-400"
          style={{ color: "#0D1A0F" }}
        />
      </div>

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
        {fase === 'guardando' ? "Guardando..." : "Registrar sueño"}
      </button>
    </div>
  );
}
