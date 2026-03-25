"use client";
import { AlertTriangle, AlertCircle, Calendar, ArrowRight, Share2, CheckCircle } from "lucide-react";

interface QuizResultProps {
  score: number; nivel: "bajo" | "riesgo" | "critico"; descripcion: string;
  servicio_recomendado: string; color: string; emoji: string; nombre: string; empresa: string;
}

const CONFIG = {
  critico: { label: "Atención Prioritaria", icon: AlertCircle, bg: "bg-red-50", border: "border-red-200", iconColor: "text-red-600", ctaLabel: "Agenda diagnóstico GRATIS ahora", urgency: "Tu equipo necesita atención inmediata" },
  riesgo:  { label: "Zona de Riesgo",       icon: AlertTriangle, bg: "bg-amber-50", border: "border-amber-200", iconColor: "text-amber-600", ctaLabel: "Reservar taller grupal", urgency: "Actúa antes de que escale a burnout crítico" },
  bajo:    { label: "Bienestar Activo",      icon: CheckCircle,  bg: "bg-green-50", border: "border-green-200", iconColor: "text-green-600", ctaLabel: "Conocer membresía Club Holizenter", urgency: "Mantén y fortalece el bienestar de tu equipo" },
};

export default function QuizResult({ score, nivel, descripcion, servicio_recomendado, emoji, nombre, empresa }: QuizResultProps) {
  const cfg  = CONFIG[nivel];
  const Icon = cfg.icon;
  const barColor = nivel === "critico" ? "#DC2626" : nivel === "riesgo" ? "#D97706" : "#1B4332";

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: "Mi diagnóstico — Holizenter", text: `Mi resultado: ${score}% — ${cfg.label}`, url: window.location.href });
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{emoji}</div>
          <p className="text-[#1B4332] font-medium text-sm mb-2">Reporte de {nombre} · {empresa}</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Tu diagnóstico de bienestar</h1>
        </div>

        <div className={`${cfg.bg} ${cfg.border} border-2 rounded-2xl p-6 mb-6 text-center`}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Icon className={`w-7 h-7 ${cfg.iconColor}`} />
            <span className={`font-bold text-lg ${cfg.iconColor}`}>{cfg.label}</span>
          </div>
          <div className="text-6xl font-bold text-gray-900 mb-2">{score}%</div>
          <div className="w-full bg-white rounded-full h-3 mb-4 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: barColor }} />
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{descripcion}</p>
        </div>

        <div className="bg-[#1B4332] rounded-2xl p-6 mb-6">
          <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2">Recomendación para tu empresa</p>
          <h3 className="text-white font-bold text-lg mb-1">{servicio_recomendado}</h3>
          <p className="text-white/70 text-sm">{cfg.urgency}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">Reporte enviado a tu email</p>
            <p className="text-gray-500 text-xs">Revisa tu bandeja de entrada en los próximos 60 segundos</p>
          </div>
        </div>

        <div className="space-y-3">
          <a href="/agendar" className="w-full flex items-center justify-center gap-2 py-4 bg-[#D4A017] hover:bg-[#A67C0F] text-white font-semibold rounded-xl text-base transition-colors">
            <Calendar className="w-5 h-5" />{cfg.ctaLabel}<ArrowRight className="w-5 h-5" />
          </a>
          <a href="/cotizador" className="w-full flex items-center justify-center py-4 border-2 border-[#1B4332] text-[#1B4332] font-semibold rounded-xl text-base hover:bg-[#1B4332] hover:text-white transition-colors">
            Ver cotizador de servicios
          </a>
          <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-3 text-gray-500 hover:text-[#1B4332] text-sm transition-colors">
            <Share2 className="w-4 h-4" />Compartir mi resultado
          </button>
        </div>
        <div className="mt-8 text-center">
          <a href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Volver al inicio</a>
        </div>
      </div>
    </div>
  );
}
