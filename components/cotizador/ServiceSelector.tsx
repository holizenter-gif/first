"use client";
import { SERVICIOS_COTIZADOR, type ServicioCotizador } from "@/lib/cotizador";

interface ServiceSelectorProps {
  value: ServicioCotizador;
  onChange: (v: ServicioCotizador) => void;
}

export default function ServiceSelector({ value, onChange }: ServiceSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {(Object.entries(SERVICIOS_COTIZADOR) as [ServicioCotizador, (typeof SERVICIOS_COTIZADOR)[ServicioCotizador]][]).map(
        ([key, cfg]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              value === key
                ? "border-brand-teal bg-brand-teal/5 shadow-sm"
                : "border-gray-200 hover:border-brand-teal/40 hover:bg-gray-50"
            }`}
          >
            <p className={`font-display font-semibold text-sm mb-1 ${value === key ? "text-brand-teal" : "text-brand-dark"}`}>
              {cfg.label}
            </p>
            <p className="text-gray-500 text-xs leading-snug">{cfg.descripcion}</p>
            <p className="text-brand-teal font-display font-bold text-xs mt-2">
              Desde ${cfg.precio_base.toLocaleString()} MXN
            </p>
          </button>
        )
      )}
    </div>
  );
}
