"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Flame, Star, Trophy, Gift, RefreshCw } from "lucide-react";
import { BADGES, REWARDS } from "@/lib/tareas/constants";

interface Gamif {
  xp_total:         number;
  streak_actual:    number;
  streak_maximo:    number;
  badges_collected: string[];
  rewards_redeemed: string[];
}

export default function ProgresoPage() {
  const [gamif,   setGamif]   = useState<Gamif | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mi-perfil/gamificacion")
      .then((r) => r.json())
      .then((d) => setGamif(d.gamificacion))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} />
      </div>
    );
  }

  if (!gamif) {
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

  const siguienteReward = REWARDS.find((r) => gamif.streak_actual < r.dias);

  return (
    <div className="space-y-6">

      {/* Stats principales */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
          <Flame className="w-6 h-6 mx-auto mb-2" style={{ color: "#F59E0B" }} />
          <p className="font-display font-bold text-3xl" style={{ color: "#0D1A0F" }}>{gamif.streak_actual}</p>
          <p className="font-sans text-xs" style={{ color: "#6B7280" }}>días de racha</p>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
          <Star className="w-6 h-6 mx-auto mb-2" style={{ color: "#5CB996" }} />
          <p className="font-display font-bold text-3xl" style={{ color: "#0D1A0F" }}>{gamif.xp_total}</p>
          <p className="font-sans text-xs" style={{ color: "#6B7280" }}>XP total</p>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
          <Trophy className="w-6 h-6 mx-auto mb-2" style={{ color: "#A78BFA" }} />
          <p className="font-display font-bold text-3xl" style={{ color: "#0D1A0F" }}>{gamif.badges_collected.length}</p>
          <p className="font-sans text-xs" style={{ color: "#6B7280" }}>badges</p>
        </div>
      </div>

      {/* Siguiente reward */}
      {siguienteReward && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5" style={{ color: "#5CB996" }} />
            <p className="font-display font-bold text-sm" style={{ color: "#0D1A0F" }}>Próximo reward</p>
          </div>
          <p className="font-sans text-sm mb-3" style={{ color: "#374151" }}>{siguienteReward.desc}</p>
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs" style={{ color: "#6B7280" }}>
              {gamif.streak_actual} / {siguienteReward.dias} días
            </span>
            <span className="font-sans text-xs font-semibold" style={{ color: "#5CB996" }}>
              {siguienteReward.dias - gamif.streak_actual} días restantes
            </span>
          </div>
          <div className="h-2 rounded-full" style={{ background: "#E5E7EB" }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width:      `${Math.min(100, Math.round((gamif.streak_actual / siguienteReward.dias) * 100))}%`,
                background: "#5CB996",
              }}
            />
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="font-display font-bold text-sm mb-4" style={{ color: "#0D1A0F" }}>Badges</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BADGES.map((badge) => {
            const desbloqueado = gamif.badges_collected.includes(badge.id);
            return (
              <div
                key={badge.id}
                className="p-3 rounded-xl border text-center"
                style={{
                  borderColor: desbloqueado ? "#5CB996" : "#E5E7EB",
                  background:  desbloqueado ? "#EBF8F2" : "#F9FAFB",
                  opacity:     desbloqueado ? 1 : 0.5,
                }}
              >
                <Trophy className="w-5 h-5 mx-auto mb-1.5" style={{ color: desbloqueado ? "#2D7A5F" : "#9CA3AF" }} />
                <p className="font-display font-semibold text-xs leading-tight" style={{ color: desbloqueado ? "#0D1A0F" : "#9CA3AF" }}>
                  {badge.nombre}
                </p>
                <p className="font-sans text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{badge.dias} días</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards histórico */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="font-display font-bold text-sm mb-4" style={{ color: "#0D1A0F" }}>Rewards disponibles</p>
        <div className="space-y-2">
          {REWARDS.map((r) => {
            const desbloqueado = gamif.streak_actual >= r.dias;
            const canjeado     = gamif.rewards_redeemed.includes(r.codigo);
            return (
              <div key={r.codigo} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: desbloqueado ? "#EBF8F2" : "#F3F4F6", color: desbloqueado ? "#2D7A5F" : "#9CA3AF" }}
                  >
                    {r.dias}d
                  </div>
                  <p className="font-sans text-sm" style={{ color: desbloqueado ? "#374151" : "#9CA3AF" }}>
                    {r.desc}
                  </p>
                </div>
                {canjeado
                  ? <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "#F3F4F6", color: "#6B7280" }}>Canjeado</span>
                  : desbloqueado
                  ? <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "#EBF8F2", color: "#2D7A5F" }}>Disponible</span>
                  : null
                }
              </div>
            );
          })}
        </div>
      </div>

      {/* Check-in semanal */}
      <Link
        href="/quiz/tareas/semana"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-display font-semibold text-sm border transition-colors"
        style={{ borderColor: "#5CB996", color: "#5CB996" }}
      >
        <RefreshCw className="w-4 h-4" /> Check-in semanal
      </Link>
    </div>
  );
}
