"use client";
import { useEffect, useState } from "react";

const MENSAJES = [
  "Analizando patrones de estrés laboral...",
  "Evaluando indicadores de burnout...",
  "Procesando dimensiones de bienestar...",
  "Generando recomendaciones personalizadas...",
  "Preparando tu reporte...",
];

interface QuizAnalyzingProps { nombre: string; }

export default function QuizAnalyzing({ nombre }: QuizAnalyzingProps) {
  const [mensajeIdx, setMensajeIdx] = useState(0);
  const [progreso,   setProgreso]   = useState(0);

  useEffect(() => {
    const im = setInterval(() => setMensajeIdx((i) => (i + 1) % MENSAJES.length), 600);
    const ip = setInterval(() => setProgreso((p) => Math.min(p + 2, 95)), 50);
    return () => { clearInterval(im); clearInterval(ip); };
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-white/20" />
          <div className="absolute inset-0 rounded-full border-4 border-brand-teal border-t-transparent animate-spin" style={{ animationDuration: "1s" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-display font-bold text-2xl">{progreso}%</span>
          </div>
        </div>
        <h2 className="font-display text-2xl text-white font-bold mb-3">
          Analizando resultados{nombre ? `, ${nombre.split(" ")[0]}` : ""}...
        </h2>
        <p className="text-white/70 text-sm mb-8 min-h-[20px]">{MENSAJES[mensajeIdx]}</p>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-brand-teal rounded-full transition-all duration-100" style={{ width: `${progreso}%` }} />
        </div>
      </div>
    </div>
  );
}
