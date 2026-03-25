"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/brand/Logo";

function GraciasContent() {
  const searchParams = useSearchParams();
  const status       = searchParams.get("status") ?? "pending";

  const configs = {
    approved: {
      icon:    CheckCircle,
      color:   "text-brand-teal",
      bg:      "bg-brand-teal-50 border-brand-teal/30",
      titulo:  "¡Pago aprobado!",
      mensaje: "Tu reserva está confirmada. Recibirás un email con todos los detalles en los próximos minutos.",
      cta:     "Volver al inicio",
      ctaHref: "/",
    },
    rejected: {
      icon:    XCircle,
      color:   "text-red-500",
      bg:      "bg-red-50 border-red-200",
      titulo:  "Pago no procesado",
      mensaje: "No se pudo procesar el pago. Por favor intenta de nuevo o contáctanos por WhatsApp.",
      cta:     "Intentar de nuevo",
      ctaHref: "/cotizador",
    },
    pending: {
      icon:    Clock,
      color:   "text-amber-500",
      bg:      "bg-amber-50 border-amber-200",
      titulo:  "Pago en proceso",
      mensaje: "Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.",
      cta:     "Volver al inicio",
      ctaHref: "/",
    },
  };

  const cfg  = configs[status as keyof typeof configs] ?? configs.pending;
  const Icon = cfg.icon;

  return (
    <div className="min-h-screen bg-brand-beige">
      <div className="bg-brand-dark py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <Logo variant="blanco" size="sm" />
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="max-w-md w-full text-center">

          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-2 ${cfg.bg} mb-6`}>
            <Icon className={`w-10 h-10 ${cfg.color}`} />
          </div>

          <h1 className="font-display text-3xl font-bold text-brand-dark mb-3">{cfg.titulo}</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">{cfg.mensaje}</p>

          {status === "approved" && (
            <div className="bg-white rounded-2xl p-5 shadow-sm text-left mb-8">
              <p className="font-display font-semibold text-brand-dark text-sm mb-4">¿Qué sigue?</p>
              <div className="space-y-3">
                {[
                  { n: "1", t: "Revisa tu email",     d: "Enviamos confirmación del pago y los detalles de tu reserva." },
                  { n: "2", t: "Coordinamos contigo", d: "Nuestro equipo te contacta en 24h para confirmar fecha y logística." },
                  { n: "3", t: "¡Nos vemos pronto!",  d: "El día del taller llevamos todo. Solo necesitas traer a tu equipo." },
                ].map((s) => (
                  <div key={s.n} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-brand-teal text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {s.n}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{s.t}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={cfg.ctaHref}
              className="bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold px-6 py-3 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              {cfg.cta} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/servicios"
              className="border border-brand-teal text-brand-teal hover:bg-brand-teal-50 font-display font-medium px-6 py-3 rounded-full transition-colors"
            >
              Ver más servicios
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-beige flex items-center justify-center">
        <div className="text-brand-teal text-sm font-display">Cargando...</div>
      </div>
    }>
      <GraciasContent />
    </Suspense>
  );
}
