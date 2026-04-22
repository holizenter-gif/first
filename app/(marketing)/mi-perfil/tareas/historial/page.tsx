"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Registro {
  id:              string;
  tarea_id:        string;
  fecha_asignada:  string;
  completada:      boolean;
  emocion_antes:   number | null;
  emocion_despues: number | null;
  notas:           string | null;
  tarea: { nombre: string } | null;
}

export default function HistorialTareasPage() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [mesActual, setMesActual] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    setLoading(true);
    fetch(`/api/mi-perfil/tareas/historial?mes=${mesActual}`)
      .then((r) => r.json())
      .then((d) => setRegistros(d.registros ?? []))
      .finally(() => setLoading(false));
  }, [mesActual]);

  const completadas = registros.filter((r) => r.completada);
  const deltaPromedio = completadas.length
    ? Math.round(
        (completadas.reduce((acc, r) => acc + ((r.emocion_despues ?? 0) - (r.emocion_antes ?? 0)), 0) /
          completadas.length) * 10
      ) / 10
    : null;

  const meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toISOString().slice(0, 7);
  });

  return (
    <div>
      {/* Filtro de mes */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {meses.map((m) => (
          <button
            key={m}
            onClick={() => setMesActual(m)}
            className="px-4 py-2 rounded-full text-xs font-display font-semibold whitespace-nowrap transition-colors flex-shrink-0"
            style={{
              background: m === mesActual ? "#5CB996" : "#FFFFFF",
              color:      m === mesActual ? "#FFFFFF" : "#6B7280",
              border:     m === mesActual ? "none" : "1px solid #E5E7EB",
            }}
          >
            {new Date(m + "-01").toLocaleDateString("es-MX", { month: "short", year: "numeric" })}
          </button>
        ))}
      </div>

      {/* Stats del mes */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <p className="font-display font-bold text-2xl" style={{ color: "#0D1A0F" }}>{completadas.length}</p>
          <p className="font-sans text-xs" style={{ color: "#6B7280" }}>completadas</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <p className="font-display font-bold text-2xl" style={{ color: "#0D1A0F" }}>{registros.length}</p>
          <p className="font-sans text-xs" style={{ color: "#6B7280" }}>asignadas</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <p className="font-display font-bold text-2xl" style={{
            color: deltaPromedio === null ? "#6B7280" : deltaPromedio > 0 ? "#2D7A5F" : deltaPromedio < 0 ? "#DC2626" : "#6B7280"
          }}>
            {deltaPromedio === null ? "—" : deltaPromedio > 0 ? `+${deltaPromedio}` : deltaPromedio}
          </p>
          <p className="font-sans text-xs" style={{ color: "#6B7280" }}>delta emocional</p>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} />
        </div>
      ) : registros.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <p className="font-sans text-sm" style={{ color: "#6B7280" }}>Sin tareas en este período.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {registros.map((r) => {
            const delta = r.emocion_despues != null && r.emocion_antes != null
              ? r.emocion_despues - r.emocion_antes : null;
            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: r.completada ? "#5CB996" : "#E5E7EB" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm truncate" style={{ color: "#0D1A0F" }}>
                    {r.tarea?.nombre ?? r.tarea_id}
                  </p>
                  <p className="font-sans text-xs" style={{ color: "#6B7280" }}>
                    {new Date(r.fecha_asignada).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })}
                  </p>
                </div>
                {delta !== null && (
                  <div className="flex items-center gap-1 text-xs font-semibold"
                    style={{ color: delta > 0 ? "#2D7A5F" : delta < 0 ? "#DC2626" : "#6B7280" }}>
                    {delta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : delta < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    {delta > 0 ? `+${delta}` : delta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
