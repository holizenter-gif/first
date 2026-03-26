"use client";
import { useEffect, useState } from "react";
import { Calendar, ArrowRight, Share2 } from "lucide-react";
import type { EjeScore } from "@/lib/quiz-scoring";

interface QuizResultProps {
  score:                number;
  nivel:                "bajo" | "riesgo" | "critico";
  descripcion:          string;
  servicio_recomendado: string;
  nombre:               string;
  empresa:              string;
  ejes:                 EjeScore[];
}

const NIVEL_CONFIG = {
  bajo: {
    label:   "Equilibrio activo",
    emoji:   "🌱",
    color:   "#5CB996",
    bg:      "#EBF7F2",
    border:  "#A8DCC8",
    cta:     "Agendar diagnóstico preventivo",
    urgency: "Tu equipo tiene bases sólidas. Este es el momento de reforzarlas.",
  },
  riesgo: {
    label:   "Riesgo moderado",
    emoji:   "⚠️",
    color:   "#F59E0B",
    bg:      "#FFFBEB",
    border:  "#FCD34D",
    cta:     "Agendar diagnóstico completo",
    urgency: "La intervención ahora es más efectiva que esperar 3-6 meses.",
  },
  critico: {
    label:   "Burnout activo",
    emoji:   "🚨",
    color:   "#EF4444",
    bg:      "#FEF2F2",
    border:  "#FCA5A5",
    cta:     "Hablar con un especialista ahora",
    urgency: "Este nivel requiere atención profesional, no un taller.",
  },
};

function colorPorPct(pct: number): string {
  if (pct <= 40) return "#5CB996";
  if (pct <= 70) return "#F59E0B";
  return "#EF4444";
}

// ── Termómetro SVG ────────────────────────────────────────────────────
function Termometro({ score, color }: { score: number; color: string }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t); }, []);

  const height = 120;
  const fillH  = animated ? Math.round((score / 100) * height) : 0;
  const trackY = 10;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="36" height="160" viewBox="0 0 36 160" className="overflow-visible">
        {/* Track */}
        <rect x="13" y={trackY} width="10" height={height} rx="5" fill="#E5E7EB" />
        {/* Fill animado */}
        <rect
          x="13"
          y={trackY + height - fillH}
          width="10"
          height={fillH}
          rx="5"
          fill={color}
          style={{ transition: "height 1.2s cubic-bezier(0.34,1.56,0.64,1), y 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
        {/* Bulbo */}
        <circle cx="18" cy={trackY + height + 14} r="12" fill={color} />
        <circle cx="18" cy={trackY + height + 14} r="7" fill="white" opacity="0.3" />
        {/* Score label */}
        <text x="18" y={trackY - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>
          {animated ? score : 0}%
        </text>
      </svg>
      <span className="text-xs font-sans text-gray-400 mt-1">Score global</span>
    </div>
  );
}

// ── Barra animada ─────────────────────────────────────────────────────
function BarraEje({ eje, delay }: { eje: EjeScore; delay: number }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const color = colorPorPct(eje.pct);
  const width = animated ? `${eje.pct}%` : "0%";

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-sans font-medium text-sm" style={{ color: "#374151" }}>{eje.label}</span>
        <span className="font-display font-bold text-sm" style={{ color }}>{eje.pct}%</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
        <div
          className="h-full rounded-full"
          style={{
            width,
            background: color,
            transition: `width 1s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

// ── Resultado principal ───────────────────────────────────────────────
export default function QuizResult({
  score, nivel, descripcion, servicio_recomendado, nombre, empresa, ejes,
}: QuizResultProps) {
  const cfg = NIVEL_CONFIG[nivel];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Mi diagnóstico de burnout — Holizenter",
        text:  `Resultado: ${score}% — ${cfg.label}`,
        url:   window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#F5F2EC" }}>
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="text-center">
          <p className="font-sans text-sm text-gray-400 mb-1">
            Diagnóstico de {nombre} · {empresa}
          </p>
          <h1 className="font-display font-bold text-2xl md:text-3xl" style={{ color: "#0D1A0F" }}>
            Tu resultado de bienestar laboral
          </h1>
        </div>

        {/* Score card: termómetro + barras */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-display font-semibold mb-5"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
          >
            <span>{cfg.emoji}</span> {cfg.label}
          </div>

          <div className="flex gap-6 items-start">
            <Termometro score={score} color={cfg.color} />
            <div className="flex-1 space-y-4 pt-1">
              {ejes.map((eje, i) => (
                <BarraEje key={eje.label} eje={eje} delay={400 + i * 200} />
              ))}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div
          className="rounded-2xl p-5 border"
          style={{ background: cfg.bg, borderColor: cfg.border }}
        >
          <p className="font-sans text-base leading-relaxed" style={{ color: "#374151" }}>
            {descripcion}
          </p>
        </div>

        {/* Recomendación */}
        <div className="rounded-2xl p-5" style={{ background: "#0D1A0F" }}>
          <p className="text-xs font-display font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
            Recomendación
          </p>
          <p className="font-display font-bold text-white text-base mb-1">{servicio_recomendado}</p>
          <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{cfg.urgency}</p>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <a
            href={`/agendar?nombre=${encodeURIComponent(nombre)}&empresa=${encodeURIComponent(empresa)}`}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-display font-semibold text-white transition-colors"
            style={{ background: "#5CB996" }}
          >
            <Calendar className="w-5 h-5" />
            {cfg.cta}
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="/cotizador"
            className="w-full flex items-center justify-center py-4 rounded-full font-display font-semibold border-2 transition-colors"
            style={{ borderColor: "#0D1A0F", color: "#0D1A0F" }}
          >
            Ver cotizador de servicios
          </a>
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm transition-colors font-sans"
            style={{ color: "#9CA3AF" }}
          >
            <Share2 className="w-4 h-4" /> Compartir mi resultado
          </button>
        </div>

        <div className="text-center">
          <a href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
