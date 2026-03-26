"use client";
import { useState } from "react";
import { Search, Package, Clock, CheckCircle, XCircle, Truck, ShoppingBag, RefreshCw } from "lucide-react";
import type { Orden, OrdenEstado } from "@/lib/supabase/types";

const STATUS_CONFIG: Record<OrdenEstado, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  pendiente:   { label: "Pendiente",    color: "#D97706", bg: "#FFF7ED", Icon: Clock       },
  pagado:      { label: "Pagado",       color: "#5CB996", bg: "#EBF7F2", Icon: CheckCircle },
  procesando:  { label: "Procesando",   color: "#3B82F6", bg: "#EFF6FF", Icon: RefreshCw   },
  enviado:     { label: "Enviado",      color: "#8B5CF6", bg: "#F5F3FF", Icon: Truck       },
  entregado:   { label: "Entregado",    color: "#059669", bg: "#ECFDF5", Icon: Package     },
  cancelado:   { label: "Cancelado",    color: "#EF4444", bg: "#FEF2F2", Icon: XCircle     },
  reembolsado: { label: "Reembolsado",  color: "#6B7280", bg: "#F3F4F6", Icon: RefreshCw   },
};

const TIPO_EMOJI: Record<string, string> = {
  curso_digital:   "🎓",
  material_fisico: "📚",
  merchandising:   "🌿",
  taller_grabado:  "🎥",
  membresia:       "⭐",
};

function OrdenCard({ orden }: { orden: Orden }) {
  const cfg = STATUS_CONFIG[orden.estado];
  const Icon = cfg.Icon;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between border-b border-gray-100"
        style={{ background: "#F9FAFB" }}
      >
        <div>
          <span className="font-sans text-xs text-gray-400">Orden #</span>
          <span className="font-display font-bold text-sm ml-1" style={{ color: "#0D1A0F" }}>
            {orden.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            <Icon className="w-3 h-3" />
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="px-5 py-4 space-y-2">
        {orden.items.map((item) => (
          <div key={item.producto_id} className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: "#EBF7F2" }}
            >
              {TIPO_EMOJI[item.tipo] ?? "🛍️"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm font-medium truncate" style={{ color: "#0D1A0F" }}>
                {item.nombre}
              </p>
              <p className="font-sans text-xs text-gray-400">
                x{item.cantidad} · ${(item.precio * item.cantidad).toLocaleString("es-MX")} MXN
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="font-sans text-xs text-gray-400">
          {new Date(orden.created_at).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span className="font-display font-bold text-base" style={{ color: "#0D1A0F" }}>
          ${orden.total.toLocaleString("es-MX")} MXN
        </span>
      </div>
    </div>
  );
}

export default function MisComprasPage() {
  const [email, setEmail] = useState("");
  const [emailBuscado, setEmailBuscado] = useState("");
  const [ordenes, setOrdenes] = useState<Orden[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);

  const buscar = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setLoading(true);
    setBuscado(false);
    try {
      const res = await fetch(`/api/ordenes?email=${encodeURIComponent(email)}`);
      const json = await res.json();
      setOrdenes(json.ordenes ?? []);
      setEmailBuscado(email);
    } catch {
      setOrdenes([]);
    } finally {
      setLoading(false);
      setBuscado(true);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#F5F2EC" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "#EBF7F2" }}
          >
            <Package className="w-6 h-6" style={{ color: "#5CB996" }} />
          </div>
          <h1 className="font-display font-bold text-2xl mb-2" style={{ color: "#0D1A0F" }}>
            Mis compras
          </h1>
          <p className="font-sans text-base text-gray-500">
            Ingresa el email con el que realizaste tu compra para ver tus órdenes.
          </p>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <label className="block font-display font-medium text-sm mb-2" style={{ color: "#374151" }}>
            Correo electrónico
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="tu@correo.com"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-sans text-sm text-gray-800 outline-none focus:ring-2 focus:ring-brand-teal"
            />
            <button
              onClick={buscar}
              disabled={loading}
              className="px-5 py-3 rounded-xl font-display font-semibold text-white text-sm flex items-center gap-2 transition-colors disabled:opacity-60"
              style={{ background: "#5CB996" }}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Buscar
            </button>
          </div>
        </div>

        {/* Resultados */}
        {buscado && ordenes !== null && (
          <>
            {ordenes.length === 0 ? (
              <div className="text-center py-14">
                <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="font-display font-semibold" style={{ color: "#0D1A0F" }}>
                  No encontramos órdenes
                </p>
                <p className="font-sans text-sm text-gray-400 mt-1">
                  No hay compras registradas para{" "}
                  <span className="font-medium" style={{ color: "#5CB996" }}>{emailBuscado}</span>.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="font-sans text-sm text-gray-500">
                  {ordenes.length} {ordenes.length === 1 ? "orden encontrada" : "órdenes encontradas"} para{" "}
                  <span className="font-medium" style={{ color: "#5CB996" }}>{emailBuscado}</span>
                </p>
                {ordenes.map((o) => (
                  <OrdenCard key={o.id} orden={o} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
