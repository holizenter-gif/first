import { CheckCircle } from "lucide-react";
import { type CotizacionResult, formatMXN } from "@/lib/cotizador";

interface PriceDisplayProps {
  result:    CotizacionResult;
  modalidad: string;
  servicio?: string;
  personas?: number;
}

export default function PriceDisplay({ result, modalidad, servicio = "taller", personas = 20 }: PriceDisplayProps) {
  return (
    <div className="bg-brand-dark rounded-2xl p-6 text-white">
      <p className="text-white/60 text-xs font-display uppercase tracking-widest mb-1 text-center">
        Precio estimado · {modalidad}
      </p>
      <p className="font-display text-5xl font-bold text-brand-teal text-center mt-1">
        {formatMXN(result.precio_estimado)}
      </p>
      <p className="text-white/40 text-xs text-center mt-1">
        Rango: {formatMXN(result.precio_min)} – {formatMXN(result.precio_max)} MXN
      </p>

      <div className="bg-white/5 rounded-xl p-4 mt-4 mb-5">
        <p className="text-white/70 text-xs font-display mb-1">Anticipo 30%</p>
        <p className="font-display font-bold text-xl text-brand-teal">{formatMXN(result.anticipo_30)}</p>
      </div>

      <p className="text-white/60 text-xs font-display uppercase tracking-wider mb-3">Incluye</p>
      <ul className="space-y-2 mb-6">
        {result.incluye.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-white/80">
            <CheckCircle className="w-4 h-4 text-brand-teal flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      <a
        href="/agendar"
        className="block text-center py-3 bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold rounded-full transition-colors mb-3"
      >
        Solicitar cotización formal →
      </a>

      <a
        href={`/pagar/nuevo?servicio=${encodeURIComponent(servicio)}&personas=${personas}&modalidad=${encodeURIComponent(modalidad)}&monto=${result.precio_estimado}`}
        className="block text-center py-3 border border-white/20 text-white hover:bg-white/10 font-display font-medium rounded-full transition-colors text-sm"
      >
        Reservar con anticipo del 30% ({formatMXN(result.anticipo_30)})
      </a>
    </div>
  );
}
