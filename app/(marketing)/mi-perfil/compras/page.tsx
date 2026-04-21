"use client";

import { useState, useEffect } from "react";
import { Loader2, ChevronDown, ChevronUp, Package, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ProductoItem { id: string; nombre: string; cantidad: number; precio: number }

interface Orden {
  id:              string;
  nombre:          string;
  email:           string;
  productos:       ProductoItem[];
  subtotal:        number;
  total:           number;
  costo_envio:     number;
  status:          string;
  status_envio?:   string;
  numero_rastreo?: string;
  carrier?:        string;
  requiere_envio:  boolean;
  direccion_envio?: Record<string, string>;
  created_at:      string;
}

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  pagado:    { bg: "#EBF8F2", color: "#1A6840" },
  aprobado:  { bg: "#EBF8F2", color: "#1A6840" },
  pendiente: { bg: "#FEF3C7", color: "#92400E" },
  rechazado: { bg: "#FEE2E2", color: "#B91C1C" },
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
}

function formatMonto(n: number) {
  return `$${(n / 100).toLocaleString("es-MX", { minimumFractionDigits: 0 })} MXN`;
}

export default function ComprasPage() {
  const [ordenes,    setOrdenes]    = useState<Orden[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filtroMes,  setFiltroMes]  = useState("");

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) { setLoading(false); return; }

      const { data } = await supabase
        .from("ordenes")
        .select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      setOrdenes((data ?? []) as Orden[]);
      setLoading(false);
    })();
  }, []);

  const mesesDisponibles = [...new Set(ordenes.map((o) => o.created_at.slice(0, 7)))];

  const ordenesFiltradas = filtroMes
    ? ordenes.filter((o) => o.created_at.startsWith(filtroMes))
    : ordenes;

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-sans font-semibold text-base" style={{ color: "#0D1A0F" }}>
          Historial de compras
        </h2>
        {mesesDisponibles.length > 1 && (
          <select
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-[#5CB996]/40"
          >
            <option value="">Todos los meses</option>
            {mesesDisponibles.map((m) => (
              <option key={m} value={m}>
                {new Date(m + "-01").toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
              </option>
            ))}
          </select>
        )}
      </div>

      {ordenesFiltradas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <Package className="w-10 h-10 mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400 text-sm font-sans">No tienes compras registradas aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ordenesFiltradas.map((o) => {
            const expanded = expandedId === o.id;
            const st = STATUS_COLOR[o.status] ?? STATUS_COLOR.pendiente;
            return (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Fila resumen */}
                <button
                  className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(expanded ? null : o.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-sans font-semibold text-sm" style={{ color: "#0D1A0F" }}>
                        {formatFecha(o.created_at)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-sans font-medium" style={{ background: st.bg, color: st.color }}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-sans truncate">
                      {Array.isArray(o.productos) ? `${o.productos.length} producto${o.productos.length !== 1 ? "s" : ""}` : "–"}
                    </p>
                  </div>
                  <span className="font-sans font-bold text-sm flex-shrink-0" style={{ color: "#5CB996" }}>
                    {formatMonto(o.total)}
                  </span>
                  {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>

                {/* Detalle expandible */}
                {expanded && (
                  <div className="border-t border-gray-100 px-4 py-4 space-y-4">
                    {/* Productos */}
                    <div>
                      <p className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider mb-2">Productos</p>
                      <div className="space-y-1.5">
                        {(Array.isArray(o.productos) ? o.productos : []).map((p, i) => (
                          <div key={i} className="flex items-center justify-between text-sm font-sans">
                            <span style={{ color: "#0D1A0F" }}>{p.nombre ?? "Producto"} × {p.cantidad ?? 1}</span>
                            <span className="text-gray-500">{formatMonto((p.precio ?? 0) * (p.cantidad ?? 1))}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between text-sm font-sans font-semibold">
                        <span style={{ color: "#0D1A0F" }}>Total</span>
                        <span style={{ color: "#5CB996" }}>{formatMonto(o.total)}</span>
                      </div>
                    </div>

                    {/* Envío */}
                    {o.requiere_envio && (
                      <div>
                        <p className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Envío
                        </p>
                        {o.direccion_envio && (
                          <p className="text-xs text-gray-500 font-sans">
                            {o.direccion_envio.calle} {o.direccion_envio.numero}, {o.direccion_envio.ciudad}, {o.direccion_envio.estado} {o.direccion_envio.codigo_postal}
                          </p>
                        )}
                        {o.numero_rastreo && (
                          <p className="text-xs text-gray-500 mt-1 font-sans">
                            Rastreo: <span className="font-semibold">{o.carrier} {o.numero_rastreo}</span>
                          </p>
                        )}
                        {o.status_envio && (
                          <p className="text-xs mt-1 font-sans" style={{ color: "#5CB996" }}>Estado: {o.status_envio}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
