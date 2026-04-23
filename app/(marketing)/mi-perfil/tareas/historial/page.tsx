"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TareaHistorial {
  id:              string;
  tarea_id:        string;
  tarea_nombre:    string | null;
  fecha:           string;
  fecha_display:   string;
  dia_semana:      string;
  completada:      boolean;
  emocion_antes:   number | null;
  emocion_despues: number | null;
  delta:           number | null;
  notas:           string | null;
}

interface Resumen {
  completadas:    number;
  asignadas:      number;
  delta_promedio: number | null;
}

export default function HistorialTareasPage() {
  const [tareas,   setTareas]   = useState<TareaHistorial[]>([]);
  const [resumen,  setResumen]  = useState<Resumen | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [semanas,  setSemanas]  = useState(4);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tareas/historial?semanas=${semanas}`)
      .then((r) => r.json())
      .then((d) => {
        setTareas(d.tareas ?? []);
        setResumen(d.resumen ?? null);
      })
      .finally(() => setLoading(false));
  }, [semanas]);

  const FILTROS = [
    { label: "2 semanas", value: 2 },
    { label: "4 semanas", value: 4 },
    { label: "8 semanas", value: 8 },
  ];

  return (
    <div>
      {/* Filtro */}
      <div className="flex gap-2 mb-6">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setSemanas(f.value)}
            className="px-4 py-2 rounded-full text-xs font-display font-semibold transition-colors"
            style={{
              background: f.value === semanas ? "#5CB996" : "#FFFFFF",
              color:      f.value === semanas ? "#FFFFFF" : "#6B7280",
              border:     f.value === semanas ? "none" : "1px solid #E5E7EB",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {resumen && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard value={resumen.completadas} label="completadas" />
          <StatCard value={resumen.asignadas}   label="asignadas" />
          <StatCard
            value={resumen.delta_promedio === null ? "—" : resumen.delta_promedio > 0 ? `+${resumen.delta_promedio}` : `${resumen.delta_promedio}`}
            label="delta prom."
            color={resumen.delta_promedio === null ? undefined : resumen.delta_promedio > 0 ? "#2D7A5F" : resumen.delta_promedio < 0 ? "#DC2626" : undefined}
          />
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} />
        </div>
      ) : tareas.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <p className="font-sans text-sm" style={{ color: "#6B7280" }}>Sin tareas en este período.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tareas.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Fecha header */}
              <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
                <p className="font-display font-semibold text-sm capitalize" style={{ color: "#0D1A0F" }}>
                  {t.fecha_display}
                </p>
                {t.completada ? (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "#EBF8F2", color: "#2D7A5F" }}>
                    Completada
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "#F3F4F6", color: "#9CA3AF" }}>
                    No completada
                  </span>
                )}
              </div>

              <div className="px-5 py-4">
                <p className="font-display font-semibold text-sm mb-1" style={{ color: "#0D1A0F" }}>
                  {t.tarea_nombre ?? "Tarea diaria"}
                </p>

                {t.completada && t.emocion_antes != null && t.emocion_despues != null && (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans text-xs" style={{ color: "#9CA3AF" }}>Antes:</span>
                        <span className="font-display font-bold text-sm" style={{ color: "#374151" }}>
                          {t.emocion_antes}/10
                        </span>
                      </div>
                      <span className="font-sans text-xs" style={{ color: "#D1D5DB" }}>→</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans text-xs" style={{ color: "#9CA3AF" }}>Después:</span>
                        <span className="font-display font-bold text-sm" style={{ color: "#374151" }}>
                          {t.emocion_despues}/10
                        </span>
                      </div>
                      {t.delta !== null && (
                        <DeltaBadge delta={t.delta} />
                      )}
                    </div>

                    {/* Mensaje cálido según delta */}
                    {t.delta !== null && (
                      <p className="font-sans text-xs italic leading-relaxed" style={{ color: "#6B7280" }}>
                        {getMensajeDelta(t.delta, t.emocion_despues ?? 5)}
                      </p>
                    )}
                  </>
                )}

                {t.notas && (
                  <p className="font-sans text-xs mt-2 p-3 rounded-lg" style={{ background: "#F9FAFB", color: "#374151" }}>
                    "{t.notas}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ value, label, color }: { value: string | number; label: string; color?: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
      <p className="font-display font-bold text-2xl" style={{ color: color ?? "#0D1A0F" }}>{value}</p>
      <p className="font-sans text-xs" style={{ color: "#6B7280" }}>{label}</p>
    </div>
  );
}

function DeltaBadge({ delta }: { delta: number }) {
  const color = delta > 0 ? "#2D7A5F" : delta < 0 ? "#DC2626" : "#6B7280";
  const bg    = delta > 0 ? "#EBF8F2" : delta < 0 ? "#FEE2E2" : "#F3F4F6";
  const Icon  = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: bg, color }}>
      <Icon className="w-3 h-3" />
      {delta > 0 ? `+${delta}` : delta}
    </span>
  );
}

function getMensajeDelta(delta: number, emocionDespues: number): string {
  if (delta > 2)  return "Notaste un cambio real. Eso es lo que importa.";
  if (delta > 0)  return "Algo mejoró. Los pequeños cambios construyen.";
  if (delta === 0) return "Te mantuviste. A veces eso es la práctica.";
  if (emocionDespues >= 6) return "Empezaste fuerte y terminaste estable. Eso cuenta.";
  return "No fue tu mejor día. Pero apareciste. Eso también construye.";
}
