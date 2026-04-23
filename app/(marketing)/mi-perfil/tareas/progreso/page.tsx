"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Flame, Star, Trophy, Gift, RefreshCw } from "lucide-react";

interface BadgeInfo {
  id:           string;
  nombre:       string;
  dias:         number;
  desc:         string;
  desbloqueado: boolean;
}

interface RewardInfo {
  dias:        number;
  desc:        string;
  codigo:      string;
  disponible:  boolean;
  canjeado:    boolean;
}

interface Progreso {
  xp_total:       number;
  streak_actual:  number;
  streak_maximo:  number;
  streak_sueno:   number;
  badges:         BadgeInfo[];
  rewards:        RewardInfo[];
  siguiente_reward: { nombre: string; dias_faltantes: number } | null;
}

export default function ProgresoPage() {
  const [progreso, setProgreso] = useState<Progreso | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch("/api/usuario/progreso")
      .then((r) => r.json())
      .then((d) => {
        if (d.streak_actual != null) setProgreso(d);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} />
      </div>
    );
  }

  if (!progreso) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
        <Star className="w-10 h-10 mx-auto mb-3" style={{ color: "#D1D5DB" }} />
        <p className="font-display font-bold text-lg mb-2" style={{ color: "#0D1A0F" }}>
          Aún sin progreso registrado
        </p>
        <p className="font-sans text-sm mb-6" style={{ color: "#6B7280" }}>
          Completa tu primera tarea para comenzar a acumular XP y badges.
        </p>
        <Link href="/mi-perfil/tareas"
          className="inline-block px-6 py-3 rounded-full font-display font-semibold text-white"
          style={{ background: "#5CB996" }}>
          Ver tarea de hoy
        </Link>
      </div>
    );
  }

  const { streak_actual, xp_total, badges, rewards, siguiente_reward } = progreso;
  const badgesDesbloqueados = badges.filter((b) => b.desbloqueado);
  const xpParaSiguienteNivel = 500;
  const streakMsg = streak_actual === 0 ? "Completa tu primera tarea para empezar"
    : streak_actual < 3  ? "¡Buen comienzo! Mantén el ritmo"
    : streak_actual < 7  ? "Vas muy bien, mantén así"
    : streak_actual < 14 ? "Excelente racha. No pares"
    : "Leyenda. Sigue siendo constante";

  return (
    <div className="space-y-6">

      {/* Stats principales */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
          <Flame className="w-6 h-6 mx-auto mb-2" style={{ color: "#F59E0B" }} />
          <p className="font-display font-bold text-3xl" style={{ color: "#0D1A0F" }}>{streak_actual}</p>
          <p className="font-sans text-xs" style={{ color: "#6B7280" }}>días de racha</p>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
          <Star className="w-6 h-6 mx-auto mb-2" style={{ color: "#5CB996" }} />
          <p className="font-display font-bold text-3xl" style={{ color: "#0D1A0F" }}>{xp_total}</p>
          <p className="font-sans text-xs" style={{ color: "#6B7280" }}>XP total</p>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
          <Trophy className="w-6 h-6 mx-auto mb-2" style={{ color: "#A78BFA" }} />
          <p className="font-display font-bold text-3xl" style={{ color: "#0D1A0F" }}>{badgesDesbloqueados.length}</p>
          <p className="font-sans text-xs" style={{ color: "#6B7280" }}>badges</p>
        </div>
      </div>

      {/* XP progress */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex justify-between mb-2">
          <p className="font-display font-semibold text-sm" style={{ color: "#0D1A0F" }}>XP Total</p>
          <span className="font-sans text-xs" style={{ color: "#6B7280" }}>{xp_total} / {xpParaSiguienteNivel}</span>
        </div>
        <div className="h-2 rounded-full mb-2" style={{ background: "#F3F4F6" }}>
          <div className="h-2 rounded-full transition-all"
            style={{ width: `${Math.min(100, Math.round((xp_total / xpParaSiguienteNivel) * 100))}%`, background: "#5CB996" }} />
        </div>
        <p className="font-sans text-xs italic" style={{ color: "#6B7280" }}>{streakMsg}</p>
      </div>

      {/* Siguiente reward */}
      {siguiente_reward && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5" style={{ color: "#5CB996" }} />
            <p className="font-display font-bold text-sm" style={{ color: "#0D1A0F" }}>Próximo reward</p>
          </div>
          <p className="font-sans text-sm mb-1" style={{ color: "#374151" }}>{siguiente_reward.nombre}</p>
          <p className="font-sans text-xs mb-3" style={{ color: "#9CA3AF" }}>
            Faltan {siguiente_reward.dias_faltantes} día{siguiente_reward.dias_faltantes !== 1 ? "s" : ""} de racha
          </p>
          <div className="h-2 rounded-full" style={{ background: "#E5E7EB" }}>
            <div className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round((1 - siguiente_reward.dias_faltantes / (streak_actual + siguiente_reward.dias_faltantes)) * 100))}%`,
                background: "#5CB996",
              }} />
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="font-display font-bold text-sm mb-4" style={{ color: "#0D1A0F" }}>Badges</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div key={badge.id} className="p-3 rounded-xl border text-center"
              style={{
                borderColor: badge.desbloqueado ? "#5CB996" : "#E5E7EB",
                background:  badge.desbloqueado ? "#EBF8F2" : "#F9FAFB",
                opacity:     badge.desbloqueado ? 1 : 0.5,
              }}>
              <Trophy className="w-5 h-5 mx-auto mb-1.5"
                style={{ color: badge.desbloqueado ? "#2D7A5F" : "#9CA3AF" }} />
              <p className="font-display font-semibold text-xs leading-tight"
                style={{ color: badge.desbloqueado ? "#0D1A0F" : "#9CA3AF" }}>
                {badge.nombre}
              </p>
              <p className="font-sans text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{badge.dias} días</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="font-display font-bold text-sm mb-4" style={{ color: "#0D1A0F" }}>Rewards disponibles</p>
        <div className="space-y-2">
          {rewards.map((r) => (
            <div key={r.codigo} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: r.disponible ? "#EBF8F2" : "#F3F4F6",
                    color:      r.disponible ? "#2D7A5F" : "#9CA3AF",
                  }}>
                  {r.dias}d
                </div>
                <p className="font-sans text-sm" style={{ color: r.disponible ? "#374151" : "#9CA3AF" }}>
                  {r.desc}
                </p>
              </div>
              {r.canjeado
                ? <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "#F3F4F6", color: "#6B7280" }}>Canjeado</span>
                : r.disponible
                  ? <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "#EBF8F2", color: "#2D7A5F" }}>Disponible</span>
                  : null}
            </div>
          ))}
        </div>
      </div>

      {/* Check-in semanal */}
      <Link href="/quiz/tareas/semana"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-display font-semibold text-sm border"
        style={{ borderColor: "#5CB996", color: "#5CB996" }}>
        <RefreshCw className="w-4 h-4" /> Check-in semanal
      </Link>
    </div>
  );
}
