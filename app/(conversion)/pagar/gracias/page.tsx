import Link from "next/link";
import { CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react";

const STATUS_CONFIG = {
  approved: {
    icon:    CheckCircle,
    color:   "text-brand-teal",
    bg:      "bg-brand-teal-50",
    border:  "border-brand-teal",
    titulo:  "¡Pago completado!",
    mensaje: "Tu compra fue procesada correctamente. Recibirás un email de confirmación en unos minutos.",
    cta:     "Ver mis compras",
    href:    "/mis-compras",
  },
  in_process: {
    icon:    Clock,
    color:   "text-amber-500",
    bg:      "bg-amber-50",
    border:  "border-amber-400",
    titulo:  "Pago en proceso",
    mensaje: "Tu pago está siendo verificado. Esto puede tomar hasta 2 días hábiles. Te notificaremos por email cuando se confirme.",
    cta:     "Volver al inicio",
    href:    "/",
  },
  rejected: {
    icon:    XCircle,
    color:   "text-red-500",
    bg:      "bg-red-50",
    border:  "border-red-400",
    titulo:  "Pago no procesado",
    mensaje: "No pudimos procesar tu pago. Puedes intentar con otro método de pago.",
    cta:     "Intentar de nuevo",
    href:    "/checkout",
  },
  cc_rejected_insufficient_amount: {
    icon:    XCircle,
    color:   "text-red-500",
    bg:      "bg-red-50",
    border:  "border-red-400",
    titulo:  "Fondos insuficientes",
    mensaje: "Tu tarjeta no tiene fondos suficientes para completar esta compra. Intenta con otra tarjeta o método de pago.",
    cta:     "Intentar con otra tarjeta",
    href:    "/checkout",
  },
  cc_rejected_card_disabled: {
    icon:    XCircle,
    color:   "text-red-500",
    bg:      "bg-red-50",
    border:  "border-red-400",
    titulo:  "Tarjeta bloqueada",
    mensaje: "Tu tarjeta está bloqueada o no habilitada para compras en línea. Comunícate con tu banco o intenta con otra tarjeta.",
    cta:     "Intentar con otra tarjeta",
    href:    "/checkout",
  },
  cc_rejected_other_reason: {
    icon:    XCircle,
    color:   "text-red-500",
    bg:      "bg-red-50",
    border:  "border-red-400",
    titulo:  "Tarjeta declinada",
    mensaje: "Tu banco declinó el pago. Verifica los datos de tu tarjeta o comunícate con tu banco para más información.",
    cta:     "Intentar con otra tarjeta",
    href:    "/checkout",
  },
};

interface Props {
  searchParams: Promise<{ status?: string; status_detail?: string; payment_id?: string }>;
}

export default async function PagarGraciasPage({ searchParams }: Props) {
  const { status = "rejected", status_detail = "", payment_id } = await searchParams;

  const config =
    STATUS_CONFIG[status_detail as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.rejected;

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="bg-brand-dark px-6 py-4">
            <p className="text-white font-display font-bold text-sm tracking-wider">HOLIZENTER</p>
          </div>

          <div className="p-8 text-center">
            <div className={`w-16 h-16 ${config.bg} border-2 ${config.border} rounded-full flex items-center justify-center mx-auto mb-5`}>
              <Icon className={`w-8 h-8 ${config.color}`} />
            </div>

            <h1 className="font-display font-bold text-brand-dark text-2xl mb-3">
              {config.titulo}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {config.mensaje}
            </p>

            {payment_id && status === "approved" && (
              <p className="text-gray-400 text-xs mb-6">
                Referencia de pago: {payment_id}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <Link
                href={config.href}
                className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold px-6 py-3 rounded-full transition-colors"
              >
                {config.cta} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-brand-dark text-sm font-display transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
