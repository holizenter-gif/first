"use client";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import type { PreguntaQuiz } from "@/lib/data/preguntas-burnout";

const EJE_LABEL: Record<1 | 2 | 3, string> = {
  1: "Agotamiento",
  2: "Desconexión",
  3: "Recursos y soporte",
};

interface QuizQuestionProps {
  question:       PreguntaQuiz;
  currentIndex:   number;
  totalQuestions: number;
  onAnswer:       (value: number) => void;
  onBack:         () => void;
  canGoBack:      boolean;
}

export default function QuizQuestion({
  question, currentIndex, onAnswer, onBack, canGoBack,
}: QuizQuestionProps) {
  const [selected,  setSelected]  = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => { setSelected(null); setAnimating(false); }, [currentIndex]);

  const handleSelect = (value: number) => {
    if (animating) return;
    setSelected(value);
    setAnimating(true);
    setTimeout(() => onAnswer(value), 380);
  };

  // ── Likert 1-5 ────────────────────────────────────────────────────
  if (question.tipo === "likert") {
    return (
      <div>
        {canGoBack && (
          <button onClick={onBack} className="flex items-center gap-1 text-sm mb-5 transition-colors" style={{ color: "#6B7280" }}>
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
        )}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6 border border-gray-100">
          <span
            className="inline-block text-xs font-display font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "#EBF7F2", color: "#5CB996" }}
          >
            {EJE_LABEL[question.eje]}
          </span>
          <h2 className="font-display font-bold text-lg md:text-xl leading-snug" style={{ color: "#0D1A0F" }}>
            {question.texto}
          </h2>
        </div>

        {/* Escala Likert horizontal */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between text-xs font-sans text-gray-400 mb-4 px-1">
            <span>Casi nunca</span>
            <span>Casi siempre</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {question.opciones.map((opcion, i) => {
              const isSelected = selected === opcion.value;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opcion.value)}
                  disabled={animating}
                  className="flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all duration-200 disabled:cursor-not-allowed"
                  style={{
                    borderColor:      isSelected ? "#5CB996" : "#E5E7EB",
                    background:       isSelected ? "#5CB996" : "#fff",
                    transform:        isSelected ? "scale(1.05)" : "scale(1)",
                    opacity:          animating && !isSelected ? 0.45 : 1,
                  }}
                >
                  <span
                    className="font-display font-bold text-lg"
                    style={{ color: isSelected ? "#fff" : "#0D1A0F" }}
                  >
                    {opcion.value}
                  </span>
                  <span
                    className="text-[10px] font-sans leading-tight text-center px-1 hidden sm:block"
                    style={{ color: isSelected ? "rgba(255,255,255,0.85)" : "#9CA3AF" }}
                  >
                    {opcion.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Opciones texto ────────────────────────────────────────────────
  return (
    <div>
      {canGoBack && (
        <button onClick={onBack} className="flex items-center gap-1 text-sm mb-5 transition-colors" style={{ color: "#6B7280" }}>
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
      )}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6 border border-gray-100">
        <span
          className="inline-block text-xs font-display font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
          style={{ background: "#EBF7F2", color: "#5CB996" }}
        >
          {EJE_LABEL[question.eje]}
        </span>
        <h2 className="font-display font-bold text-lg md:text-xl leading-snug" style={{ color: "#0D1A0F" }}>
          {question.texto}
        </h2>
      </div>
      <div className="space-y-3">
        {question.opciones.map((opcion, i) => {
          const isSelected = selected === opcion.value;
          return (
            <button
              key={i}
              onClick={() => handleSelect(opcion.value)}
              disabled={animating}
              className="w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200"
              style={{
                borderColor: isSelected ? "#5CB996" : "#E5E7EB",
                background:  isSelected ? "#5CB996" : "#fff",
                transform:   isSelected ? "scale(1.01)" : "scale(1)",
                opacity:     animating && !isSelected ? 0.45 : 1,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
                  style={{
                    borderColor: isSelected ? "#fff" : "#D1D5DB",
                    background:  isSelected ? "rgba(255,255,255,0.2)" : "transparent",
                  }}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
                <span
                  className="text-sm md:text-base leading-snug font-sans"
                  style={{ color: isSelected ? "#fff" : "#374151", fontWeight: isSelected ? 500 : 400 }}
                >
                  {opcion.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
