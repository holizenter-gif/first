"use client";
import { Clock, BarChart3, Users, CheckCircle } from "lucide-react";

interface QuizWelcomeProps { onStart: () => void; }

export default function QuizWelcome({ onStart }: QuizWelcomeProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: "#F5F2EC" }}>
      <div className="max-w-2xl w-full">

        {/* Label */}
        <div className="text-center mb-8">
          <span
            className="inline-block text-xs font-display font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
            style={{ background: "#0D1A0F", color: "#5CB996" }}
          >
            Holizenter · Diagnóstico de Burnout Laboral
          </span>
          <h1
            className="font-display font-bold leading-tight mb-4"
            style={{ fontSize: "clamp(28px,5vw,46px)", color: "#0D1A0F" }}
          >
            ¿Cuál es el nivel real de{" "}
            <em className="not-italic" style={{ color: "#5CB996" }}>burnout</em>{" "}
            en tu equipo?
          </h1>
          <p className="font-sans text-lg leading-relaxed max-w-lg mx-auto" style={{ color: "#6B7280" }}>
            Responde 10 preguntas basadas en el modelo Maslach y recibe un diagnóstico
            con 3 dimensiones y recomendaciones específicas para tu empresa.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { Icon: Clock,     value: "4 min",  label: "para completar"    },
            { Icon: BarChart3, value: "100%",   label: "gratuito"          },
            { Icon: Users,     value: "+500",   label: "empresas evaluadas" },
          ].map(({ Icon, value, label }) => (
            <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: "#5CB996" }} />
              <div className="font-display font-bold text-lg" style={{ color: "#0D1A0F" }}>{value}</div>
              <div className="font-sans text-xs text-gray-400">{label}</div>
            </div>
          ))}
        </div>

        {/* Qué recibirás */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
          <p className="font-display font-semibold text-sm mb-4" style={{ color: "#0D1A0F" }}>
            Al finalizar recibirás:
          </p>
          <div className="space-y-3">
            {[
              "Score global de burnout con 3 ejes desglosados",
              "Termómetro visual de riesgo con barras por dimensión",
              "Perfil de resultado: Equilibrio activo / Riesgo moderado / Burnout activo",
              "Recomendación específica de intervención para tu empresa",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#5CB996" }} />
                <span className="font-sans text-sm" style={{ color: "#6B7280" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={onStart}
            className="font-display font-semibold text-lg px-10 py-4 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-105"
            style={{ background: "#5CB996" }}
          >
            Comenzar diagnóstico gratis →
          </button>
          <p className="font-sans text-xs text-gray-400 mt-4">
            Sin registro previo · Tus datos están protegidos · LFPDPPP
          </p>
        </div>

      </div>
    </div>
  );
}
