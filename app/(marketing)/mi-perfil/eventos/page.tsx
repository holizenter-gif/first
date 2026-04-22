"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Video, Users, ExternalLink, X, Loader2 } from "lucide-react";

interface EventoRegistro {
  id:          string;
  status:      "confirmado" | "pendiente" | "cancelado";
  monto_pagado: number;
  created_at:  string;
  evento: {
    id:          string;
    titulo:      string;
    slug:        string;
    fecha_inicio: string;
    fecha_fin:   string | null;
    modalidad:   "presencial" | "virtual" | "hibrido";
    precio:      number;
    imagen_url:  string | null;
  };
}

const MODALIDAD_ICON = {
  presencial: MapPin,
  virtual:    Video,
  hibrido:    Users,
} as const;

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  confirmado: { label: "Confirmado", bg: "#EBF8F2", color: "#2D7A5F" },
  pendiente:  { label: "Pendiente",  bg: "#FEF3C7", color: "#92400E" },
  cancelado:  { label: "Cancelado",  bg: "#F3F4F6", color: "#6B7280" },
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

export default function MisEventosPage() {
  const [eventos,     setEventos]     = useState<EventoRegistro[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [cancelId,    setCancelId]    = useState<string | null>(null);
  const [cancelando,  setCancelando]  = useState(false);
  const [confirmOpen, setConfirmOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/mi-perfil/eventos")
      .then((r) => r.json())
      .then((d) => setEventos(d.eventos ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (registroId: string) => {
    setCancelando(true);
    try {
      const res = await fetch(`/api/mi-perfil/eventos/${registroId}`, { method: "DELETE" });
      if (res.ok) {
        setEventos((prev) =>
          prev.map((e) => e.id === registroId ? { ...e, status: "cancelado" } : e)
        );
      }
    } finally {
      setCancelando(false);
      setConfirmOpen(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} />
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
        <CalendarDays className="w-10 h-10 mx-auto mb-3" style={{ color: "#D1D5DB" }} />
        <p className="font-display font-semibold text-lg mb-1" style={{ color: "#0D1A0F" }}>
          Sin eventos registrados
        </p>
        <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
          Explora nuestra agenda y únete a un evento.
        </p>
        <Link
          href="/eventos"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-display font-semibold text-white transition-colors"
          style={{ background: "#5CB996" }}
        >
          Ver eventos <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {eventos.map((reg) => {
        const MIcon = MODALIDAD_ICON[reg.evento.modalidad] ?? MapPin;
        const st    = STATUS_STYLE[reg.status] ?? STATUS_STYLE.pendiente;
        const pasado = new Date(reg.evento.fecha_inicio) < new Date();

        return (
          <div
            key={reg.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Imagen */}
              {reg.evento.imagen_url && (
                <div
                  className="w-full sm:w-32 h-32 sm:h-auto bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${reg.evento.imagen_url})` }}
                />
              )}

              {/* Contenido */}
              <div className="flex-1 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <h3 className="font-display font-bold text-base" style={{ color: "#0D1A0F" }}>
                    {reg.evento.titulo}
                  </h3>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{ background: st.bg, color: st.color }}
                  >
                    {st.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-3" style={{ color: "#6B7280" }}>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {formatFecha(reg.evento.fecha_inicio)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MIcon className="w-3.5 h-3.5" />
                    {reg.evento.modalidad.charAt(0).toUpperCase() + reg.evento.modalidad.slice(1)}
                  </span>
                  {reg.monto_pagado > 0 && (
                    <span>${reg.monto_pagado.toLocaleString("es-MX")} MXN pagados</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/eventos/${reg.evento.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors"
                    style={{ borderColor: "#5CB996", color: "#5CB996" }}
                  >
                    Ver evento <ExternalLink className="w-3 h-3" />
                  </Link>
                  {reg.status === "confirmado" && !pasado && (
                    <button
                      onClick={() => setConfirmOpen(reg.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors border-red-200 text-red-500 hover:bg-red-50"
                    >
                      <X className="w-3 h-3" /> Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Confirm dialog inline */}
            {confirmOpen === reg.id && (
              <div className="border-t border-gray-100 bg-red-50 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-red-700">
                  ¿Confirmas la cancelación de tu registro?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmOpen(null)}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-white transition-colors"
                  >
                    No, mantener
                  </button>
                  <button
                    onClick={() => handleCancel(reg.id)}
                    disabled={cancelando}
                    className="text-xs px-3 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {cancelando && <Loader2 className="w-3 h-3 animate-spin" />}
                    Sí, cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
