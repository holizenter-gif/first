"use client";
import { SERVICIOS_COTIZADOR, type ServicioCotizador } from "@/lib/cotizador";

interface CollaboratorSliderProps {
  value: number;
  onChange: (value: number) => void;
  servicio: ServicioCotizador;
}

export default function CollaboratorSlider({ value, onChange, servicio }: CollaboratorSliderProps) {
  const cfg = SERVICIOS_COTIZADOR[servicio];
  const segment = value <= 50 ? "PyME" : value <= 200 ? "Mediana Empresa" : "Corporativo";

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-brand-teal font-display font-bold text-2xl">{value} colaboradores</span>
        <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal text-sm font-display font-semibold rounded-full">
          {segment}
        </span>
      </div>
      <input
        type="range"
        min={cfg.min_personas}
        max={cfg.max_personas}
        step={cfg.max_personas <= 50 ? 1 : 10}
        value={Math.min(Math.max(value, cfg.min_personas), cfg.max_personas)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-teal"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Mín {cfg.min_personas}</span>
        <span>Máx {cfg.max_personas}</span>
      </div>
      {(value < cfg.min_personas || value > cfg.max_personas) && (
        <p className="text-amber-500 text-xs mt-1">
          Este servicio requiere entre {cfg.min_personas} y {cfg.max_personas} personas.
        </p>
      )}
    </div>
  );
}
