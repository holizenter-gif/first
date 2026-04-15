import { Star } from "lucide-react";

interface EstrellasProps {
  valor: number;       // 0–5, puede ser decimal
  max?: number;
  size?: number;
  className?: string;
}

export default function Estrellas({ valor, max = 5, size = 16, className = "" }: EstrellasProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${valor} de ${max} estrellas`}>
      {Array.from({ length: max }).map((_, i) => {
        const fill = Math.min(Math.max(valor - i, 0), 1); // 0, 0–1, o 1
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            {/* estrella vacía */}
            <Star
              style={{ width: size, height: size, color: "#D1D5DB" }}
              fill="#D1D5DB"
              strokeWidth={0}
            />
            {/* estrella llena (clip por porcentaje) */}
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  style={{ width: size, height: size, color: "#F59E0B" }}
                  fill="#F59E0B"
                  strokeWidth={0}
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

/** Versión interactiva para formularios */
interface EstrellasInputProps {
  valor: number;
  onChange: (v: number) => void;
  size?: number;
}

export function EstrellasInput({ valor, onChange, size = 28 }: EstrellasInputProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} estrellas`}
          className="transition-transform active:scale-90"
        >
          <Star
            style={{ width: size, height: size }}
            fill={n <= valor ? "#F59E0B" : "none"}
            stroke={n <= valor ? "#F59E0B" : "#D1D5DB"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
