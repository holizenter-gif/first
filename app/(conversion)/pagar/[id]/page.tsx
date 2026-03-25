"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Shield, CreditCard, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMXN } from "@/lib/cotizador";
import Logo from "@/components/brand/Logo";

const SERVICIOS_LABEL: Record<string, string> = {
  taller:            "Taller Grupal",
  sensibilizacion:   "Sensibilización Alta Dirección",
  integracion_medio: "Integración de Equipos (medio día)",
  integracion_dia:   "Integración de Equipos (día completo)",
  diagnostico:       "Diagnóstico de Bienestar Laboral",
  programa_anual:    "Programa Anual Recurrente",
};

export default function PagarPage() {
  const searchParams = useSearchParams();

  const servicio  = searchParams.get("servicio")  ?? "taller";
  const personas  = Number(searchParams.get("personas")  ?? 20);
  const modalidad = searchParams.get("modalidad") ?? "presencial";
  const monto     = Number(searchParams.get("monto")     ?? 0);
  const nombre    = searchParams.get("nombre")    ?? "";
  const empresa   = searchParams.get("empresa")   ?? "";
  const email     = searchParams.get("email")     ?? "";
  const whatsapp  = searchParams.get("whatsapp")  ?? "";

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const anticipo = Math.round((monto * 0.3) / 100) * 100;
  const saldo    = monto - anticipo;

  const handlePagar = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pagos/preferencia", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicio, personas, modalidad,
          monto: anticipo,
          nombre, empresa, email, whatsapp,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al crear preferencia");

      const url = data.sandbox_init_point ?? data.init_point;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No se obtuvo URL de pago");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al procesar el pago");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige">

      {/* Header mínimo */}
      <div className="bg-brand-dark py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo variant="blanco" size="sm" />
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Shield className="w-3.5 h-3.5" />
            Pago seguro con Mercado Pago
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Resumen del servicio */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-brand-dark px-6 py-4">
            <p className="text-white/50 text-xs font-display uppercase tracking-wider">Resumen de tu pedido</p>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-brand-teal-50 flex items-center justify-center text-2xl flex-shrink-0">
                🧘
              </div>
              <div>
                <h2 className="font-display font-bold text-brand-dark text-lg">
                  {SERVICIOS_LABEL[servicio] ?? servicio}
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  {personas} personas · {modalidad.charAt(0).toUpperCase() + modalidad.slice(1)}
                </p>
                {empresa && (
                  <p className="text-gray-400 text-xs mt-0.5">{empresa}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total del servicio</span>
                <span className="font-display font-semibold text-brand-dark">{formatMXN(monto)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Saldo restante (post-evento)</span>
                <span className="text-gray-500">{formatMXN(saldo)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div>
                  <span className="font-display font-bold text-brand-dark">Anticipo 30% hoy</span>
                  <p className="text-gray-400 text-xs">Para confirmar tu reserva</p>
                </div>
                <span className="font-display font-bold text-2xl text-brand-teal">{formatMXN(anticipo)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Datos del cliente */}
        {nombre && (
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <p className="font-display font-semibold text-brand-dark text-sm mb-3">Datos de facturación</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Nombre</p>
                <p className="text-brand-dark font-medium">{nombre}</p>
              </div>
              {empresa && (
                <div>
                  <p className="text-gray-400 text-xs">Empresa</p>
                  <p className="text-brand-dark font-medium">{empresa}</p>
                </div>
              )}
              {email && (
                <div className="col-span-2">
                  <p className="text-gray-400 text-xs">Email de confirmación</p>
                  <p className="text-brand-dark font-medium">{email}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Garantías */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Shield,      text: "Pago 100% seguro con MP" },
            { icon: CheckCircle, text: "Confirmación inmediata"  },
            { icon: CreditCard,  text: "Tarjeta, OXXO, transferencia" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="bg-white rounded-xl p-3 text-center shadow-sm">
              <Icon className="w-4 h-4 text-brand-teal mx-auto mb-1.5" />
              <p className="text-xs text-gray-500 leading-tight">{text}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handlePagar}
          disabled={loading || !monto}
          className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-bold py-7 rounded-2xl text-lg shadow-lg shadow-brand-teal/20 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Preparando pago...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              Pagar {formatMXN(anticipo)} con Mercado Pago
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Al pagar aceptas nuestros{" "}
          <a href="/terminos" className="text-brand-teal underline">términos de uso</a>.
          El saldo restante ({formatMXN(saldo)}) se liquida antes del evento.
        </p>

      </div>
    </div>
  );
}
