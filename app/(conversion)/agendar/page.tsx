"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Clock, Video, Users, Star, ArrowRight } from "lucide-react";
import CalEmbed from "@/components/cal/CalEmbed";
import Logo     from "@/components/brand/Logo";
import Link     from "next/link";

const BENEFICIOS = [
  { icon: Clock,       text: "60 minutos · Sin costo"     },
  { icon: Video,       text: "Online · Zoom o Meet"        },
  { icon: Users,       text: "Especialista certificado"    },
  { icon: CheckCircle, text: "Sin compromiso de compra"    },
];

const INCLUYE = [
  "Análisis del estado actual de bienestar en tu empresa",
  "Identificación de los 3 principales factores de riesgo",
  "Recomendación de programa personalizado",
  "Reporte ejecutivo básico en PDF (en 48h)",
  "Plan de acción a 30 días sin costo",
];

function AgendarContent() {
  const searchParams = useSearchParams();
  const [booked, setBooked] = useState(false);

  const nombre  = searchParams.get("nombre")  ?? "";
  const email   = searchParams.get("email")   ?? "";
  const empresa = searchParams.get("empresa") ?? "";

  const calUsername = process.env.NEXT_PUBLIC_CAL_USERNAME ?? "holizenter";
  const eventSlug   = process.env.NEXT_PUBLIC_CAL_EVENT_DIAGNOSTICO ?? "diagnostico-bienestar-gratis";

  const handleBooked = async (data: unknown) => {
    setBooked(true);
    try {
      await fetch("/api/citas/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo:         "diagnostico_gratis",
          nombre, empresa, email,
          modalidad:    "online",
          cal_event_id: (data as Record<string, unknown>)?.uid ?? null,
          fecha:        new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.error("Error registrando cita:", e);
    }
  };

  if (booked) return <AgendarConfirmacion nombre={nombre} email={email} />;

  return (
    <div className="min-h-screen bg-brand-beige">

      {/* Header propio */}
      <div className="bg-brand-dark py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo variant="blanco" size="sm" href="/" />
          <span className="text-white/40 text-xs hidden sm:block">
            Diagnóstico gratuito · Sin compromiso
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Info columna izquierda */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-display font-medium px-4 py-2 rounded-full mb-6">
              <Star className="w-3 h-3 fill-brand-teal" />
              100% gratuito · Sin tarjeta
            </div>
            <h1 className="font-display text-3xl font-bold text-brand-dark mb-3 leading-tight">
              Diagnóstico de Bienestar Laboral Gratuito
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed text-sm">
              60 minutos con un especialista para entender el estado real
              del bienestar en tu empresa y darte un plan de acción concreto.
            </p>

            {/* Beneficios */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {BENEFICIOS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-white rounded-xl p-3 shadow-sm">
                  <Icon className="w-4 h-4 text-brand-teal flex-shrink-0" />
                  <span className="text-xs text-gray-600">{text}</span>
                </div>
              ))}
            </div>

            {/* Incluye */}
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
              <p className="font-display font-semibold text-sm text-brand-dark mb-4">
                ¿Qué cubre el diagnóstico?
              </p>
              <ul className="space-y-2.5">
                {INCLUYE.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonio */}
            <div className="bg-brand-teal-50 border border-brand-teal/20 rounded-2xl p-5">
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-brand-teal text-brand-teal" />
                ))}
              </div>
              <p className="text-gray-700 text-sm italic leading-relaxed mb-3">
                &ldquo;En 60 minutos entendimos exactamente por qué teníamos
                tanta rotación. Tres meses después la situación cambió
                radicalmente.&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-teal text-white text-xs font-bold flex items-center justify-center">
                  MG
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">María González</p>
                  <p className="text-xs text-gray-500">Dir. RRHH · Grupo Industrial MX</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cal.com embed columna derecha */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-brand-dark px-6 py-4">
                <p className="text-white font-display font-semibold text-sm">Elige fecha y hora</p>
                <p className="text-white/40 text-xs mt-0.5">Zona horaria: Ciudad de México (GMT-6)</p>
              </div>
              <div className="p-4">
                <CalEmbed
                  calUsername={calUsername}
                  eventSlug={eventSlug}
                  prefillName={nombre || undefined}
                  prefillEmail={email || undefined}
                  prefillNotes={empresa ? `Empresa: ${empresa}` : undefined}
                  onBooked={handleBooked}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function AgendarConfirmacion({ nombre, email }: { nombre: string; email: string }) {
  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full bg-brand-teal/10 border-2 border-brand-teal flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-brand-teal" />
        </div>
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-3">¡Cita confirmada!</h1>
        <p className="text-gray-600 mb-2">
          {nombre ? `Hola ${nombre.split(" ")[0]}, ya tienes` : "Ya tienes"} tu diagnóstico agendado.
        </p>
        {email && (
          <p className="text-gray-500 text-sm mb-8">
            Confirmación enviada a <strong className="text-brand-dark">{email}</strong>
          </p>
        )}
        <div className="bg-white rounded-2xl p-6 shadow-sm text-left mb-8">
          <p className="font-display font-semibold text-brand-dark mb-4 text-sm">¿Qué sigue?</p>
          <div className="space-y-4">
            {[
              { num: "1", t: "Revisa tu email",      d: "Enviamos confirmación con el enlace de videollamada." },
              { num: "2", t: "Prepara 3 datos clave", d: "Número de colaboradores, retos del equipo y objetivos del año." },
              { num: "3", t: "Conéctate 5 min antes", d: "Te enviamos recordatorio 48h y 2h antes de la sesión." },
            ].map((s) => (
              <div key={s.num} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-brand-teal text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {s.num}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{s.t}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold px-6 py-3 rounded-full transition-colors text-sm"
          >
            Volver al inicio
          </Link>
          <Link
            href="/servicios"
            className="border border-brand-teal text-brand-teal hover:bg-brand-teal-50 font-display font-medium px-6 py-3 rounded-full transition-colors text-sm"
          >
            Explorar servicios
          </Link>
        </div>
        <div className="mt-6">
          <ArrowRight className="w-4 h-4 text-gray-300 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export default function AgendarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-beige flex items-center justify-center">
        <div className="text-brand-teal text-sm font-display">Cargando...</div>
      </div>
    }>
      <AgendarContent />
    </Suspense>
  );
}
