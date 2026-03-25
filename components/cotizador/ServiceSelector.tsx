"use client";
export const SERVICIOS_COTIZADOR = [
  { id: "taller", label: "Taller Grupal (2h)", precio_base: 8000, precio_max: 25000 },
  { id: "sensibilizacion", label: "Sensibilización Alta Dirección", precio_base: 18000, precio_max: 45000 },
  { id: "integracion_medio", label: "Integración de Equipos (medio día)", precio_base: 22000, precio_max: 60000 },
  { id: "integracion_dia", label: "Integración de Equipos (día completo)", precio_base: 45000, precio_max: 120000 },
  { id: "diagnostico", label: "Diagnóstico Bienestar Laboral", precio_base: 4500, precio_max: 12000 },
  { id: "programa_anual", label: "Programa Anual Recurrente", precio_base: 120000, precio_max: 400000 },
] as const;

interface ServiceSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

export default function ServiceSelector({ selected, onChange }: ServiceSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {SERVICIOS_COTIZADOR.map((s) => (
        <button key={s.id} onClick={() => onChange(s.id)} className={`p-4 text-left rounded-xl border-2 transition-colors ${selected === s.id ? "border-brand-gold bg-brand-gold/5" : "border-gray-200 hover:border-brand-gold/50"}`}>
          <p className="font-semibold text-brand-green">{s.label}</p>
          <p className="text-sm text-gray-500 mt-1">Desde ${s.precio_base.toLocaleString()} MXN</p>
        </button>
      ))}
    </div>
  );
}
