"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { Pregunta, Letra } from "@/lib/tareas/preguntas";

interface Props {
  preguntas:   Pregunta[];
  onComplete:  (respuestas: Record<string, Letra>) => void;
  submitting:  boolean;
}

export default function QuizFlow({ preguntas, onComplete, submitting }: Props) {
  const [paso,      setPaso]      = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, Letra>>({});

  const preguntaActual = preguntas[paso];
  const total          = preguntas.length;
  const progreso       = Math.round(((paso) / total) * 100);
  const seleccion      = respuestas[preguntaActual?.id ?? ''];

  const elegir = (letra: Letra) => {
    setRespuestas((prev) => ({ ...prev, [preguntaActual.id]: letra }));
  };

  const siguiente = () => {
    if (!seleccion) return;
    if (paso < total - 1) {
      setPaso((p) => p + 1);
    } else {
      onComplete(respuestas);
    }
  };

  const anterior = () => setPaso((p) => Math.max(0, p - 1));

  if (!preguntaActual) return null;

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs" style={{ color: "#6B7280" }}>
            Pregunta {paso + 1} de {total}
          </span>
          <span className="font-sans text-xs font-semibold" style={{ color: "#5CB996" }}>
            {progreso}%
          </span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: "#E5E7EB" }}>
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progreso}%`, background: "#5CB996" }}
          />
        </div>
      </div>

      {/* Pregunta */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-xl leading-snug mb-6" style={{ color: "#0D1A0F" }}>
          {preguntaActual.pregunta}
        </h2>
        <div className="space-y-3">
          {preguntaActual.opciones.map((op) => {
            const activa = seleccion === op.letra;
            return (
              <button
                key={op.letra}
                onClick={() => elegir(op.letra)}
                className="w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-150 flex items-start gap-4"
                style={{
                  borderColor: activa ? "#5CB996" : "#E5E7EB",
                  background:  activa ? "#EBF8F2" : "#FFFFFF",
                }}
              >
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-sm"
                  style={{
                    background: activa ? "#5CB996" : "#F3F4F6",
                    color:      activa ? "#fff"    : "#9CA3AF",
                  }}
                >
                  {op.letra}
                </span>
                <span className="font-sans text-sm leading-relaxed" style={{ color: activa ? "#0D1A0F" : "#374151" }}>
                  {op.texto}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between">
        <button
          onClick={anterior}
          disabled={paso === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-sm font-medium transition-colors disabled:opacity-30"
          style={{ color: "#6B7280" }}
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        <button
          onClick={siguiente}
          disabled={!seleccion || submitting}
          className="flex items-center gap-1.5 px-6 py-3 rounded-full font-display font-semibold text-sm text-white transition-colors disabled:opacity-40"
          style={{ background: seleccion ? "#5CB996" : "#9CA3AF" }}
        >
          {submitting
            ? "Procesando..."
            : paso < total - 1
            ? <><span>Siguiente</span> <ChevronRight className="w-4 h-4" /></>
            : "Ver mi plan"}
        </button>
      </div>
    </div>
  );
}
