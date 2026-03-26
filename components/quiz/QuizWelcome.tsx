"use client";
import { Clock, BarChart3, Users, CheckCircle } from "lucide-react";

interface Stat   { value: string; label: string; }
interface QuizWelcomeProps {
  onStart:     () => void;
  badge?:      string;
  titulo:      React.ReactNode;
  subtitulo?:  string;
  stats?:      Stat[];
  bullets?:    string[];
  ctaLabel?:   string;
}

const DEFAULT_STATS: Stat[] = [
  { value: "4 min",  label: "para completar"     },
  { value: "100%",   label: "gratuito"            },
  { value: "+500",   label: "empresas evaluadas"  },
];

const DEFAULT_BULLETS = [
  "Score global con dimensiones desglosadas",
  "Termómetro visual de riesgo por eje",
  "Perfil de resultado y nivel de riesgo",
  "Recomendación específica de intervención",
];

export default function QuizWelcome({
  onStart,
  badge      = "Holizenter · Diagnóstico Gratuito",
  titulo,
  subtitulo,
  stats      = DEFAULT_STATS,
  bullets    = DEFAULT_BULLETS,
  ctaLabel   = "Comenzar diagnóstico gratis →",
}: QuizWelcomeProps) {
  const icons = [Clock, BarChart3, Users];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: "#F5F2EC" }}>
      <div className="max-w-2xl w-full">

        <div className="text-center mb-8">
          <span
            className="inline-block text-xs font-display font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
            style={{ background: "#0D1A0F", color: "#5CB996" }}
          >
            {badge}
          </span>
          <h1
            className="font-display font-bold leading-tight mb-4"
            style={{ fontSize: "clamp(26px,5vw,44px)", color: "#0D1A0F" }}
          >
            {titulo}
          </h1>
          {subtitulo && (
            <p className="font-sans text-lg leading-relaxed max-w-lg mx-auto" style={{ color: "#6B7280" }}>
              {subtitulo}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(({ value, label }, i) => {
            const Icon = icons[i] ?? BarChart3;
            return (
              <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: "#5CB996" }} />
                <div className="font-display font-bold text-lg" style={{ color: "#0D1A0F" }}>{value}</div>
                <div className="font-sans text-xs text-gray-400">{label}</div>
              </div>
            );
          })}
        </div>

        {/* Bullets */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
          <p className="font-display font-semibold text-sm mb-4" style={{ color: "#0D1A0F" }}>
            Al finalizar recibirás:
          </p>
          <div className="space-y-3">
            {bullets.map((item) => (
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
            {ctaLabel}
          </button>
          <p className="font-sans text-xs text-gray-400 mt-4">
            Sin registro previo · Tus datos están protegidos · LFPDPPP
          </p>
        </div>

      </div>
    </div>
  );
}
