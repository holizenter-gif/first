"use client";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import type { PreguntaQuiz } from "@/lib/data/preguntas-burnout";

interface QuizQuestionProps {
  question: PreguntaQuiz; currentIndex: number; totalQuestions: number;
  onAnswer: (value: number) => void; onBack: () => void; canGoBack: boolean;
}

export default function QuizQuestion({ question, currentIndex, onAnswer, onBack, canGoBack }: QuizQuestionProps) {
  const [selected,  setSelected]  = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => { setSelected(null); setAnimating(false); }, [currentIndex]);

  const handleSelect = (value: number) => {
    if (animating) return;
    setSelected(value);
    setAnimating(true);
    setTimeout(() => onAnswer(value), 400);
  };

  return (
    <div>
      {canGoBack && (
        <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-[#1B4332] text-sm mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
      )}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <div className="inline-block bg-[#F5F0E8] text-[#1B4332] text-xs font-medium px-3 py-1 rounded-full mb-4 capitalize">
          {question.categoria.replace("_", " ")}
        </div>
        <h2 className="font-serif text-xl md:text-2xl text-gray-900 leading-snug">{question.texto}</h2>
      </div>
      <div className="space-y-3">
        {question.opciones.map((opcion, i) => {
          const isSelected = selected === opcion.value;
          return (
            <button key={i} onClick={() => handleSelect(opcion.value)} disabled={animating}
              className={[
                "w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200",
                isSelected ? "border-brand-teal bg-brand-teal text-white shadow-lg scale-[1.02]" : "border-gray-200 bg-white text-gray-700 hover:border-brand-teal hover:bg-brand-teal-50 hover:shadow-md",
                animating && !isSelected ? "opacity-50" : "",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div className={["w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center", isSelected ? "border-white bg-white" : "border-gray-300"].join(" ")}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-teal" />}
                </div>
                <span className={`text-sm md:text-base leading-snug ${isSelected ? "font-medium" : ""}`}>{opcion.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
