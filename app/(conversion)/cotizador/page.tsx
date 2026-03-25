"use client";
import { useState } from "react";
import ServiceSelector from "@/components/cotizador/ServiceSelector";
import CollaboratorSlider from "@/components/cotizador/CollaboratorSlider";
import PriceDisplay from "@/components/cotizador/PriceDisplay";
import {
  type ServicioCotizador,
  type Modalidad,
  SERVICIOS_COTIZADOR,
  calcularCotizacion,
} from "@/lib/cotizador";

const STEPS = ["Servicio", "Tu equipo", "Tu cotización"] as const;

export default function CotizadorPage() {
  const [step, setStep] = useState(0);
  const [servicio, setServicio] = useState<ServicioCotizador>("taller");
  const [personas, setPersonas] = useState(30);
  const [modalidad, setModalidad] = useState<Modalidad>("presencial");

  const cfg = SERVICIOS_COTIZADOR[servicio];
  const result = calcularCotizacion(servicio, personas, modalidad);

  const canNext =
    step === 0
      ? true
      : step === 1
      ? personas >= cfg.min_personas && personas <= cfg.max_personas
      : true;

  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Header */}
      <div className="bg-brand-dark py-12 px-4 text-center">
        <p className="text-brand-teal font-display text-sm font-semibold uppercase tracking-widest mb-3">
          Cotizador
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
          ¿Cuánto cuesta para tu empresa?
        </h1>
        <p className="text-white/60 font-light">
          Precio estimado en 3 pasos. Sin compromiso.
        </p>
      </div>

      {/* Stepper */}
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-sm font-display font-semibold transition-colors ${
                  i === step
                    ? "text-brand-teal"
                    : i < step
                    ? "text-brand-dark cursor-pointer hover:text-brand-teal"
                    : "text-gray-400 cursor-default"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === step
                      ? "bg-brand-teal text-white"
                      : i < step
                      ? "bg-brand-dark text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 ${i < step ? "bg-brand-teal" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          {step === 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-brand-dark mb-2">
                ¿Qué servicio necesitas?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Selecciona el tipo de intervención para tu equipo.
              </p>
              <ServiceSelector value={servicio} onChange={setServicio} />
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-xl font-bold text-brand-dark mb-2">
                ¿Cuántas personas participan?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Ajusta el número de colaboradores y elige la modalidad.
              </p>

              <CollaboratorSlider
                value={personas}
                onChange={setPersonas}
                servicio={servicio}
              />

              <div className="mt-8">
                <p className="font-display font-semibold text-brand-dark mb-3">Modalidad</p>
                <div className="flex flex-wrap gap-3">
                  {cfg.modalidades.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModalidad(m)}
                      className={`px-4 py-2 rounded-full text-sm font-display font-semibold border-2 transition-all ${
                        modalidad === m
                          ? "border-brand-teal bg-brand-teal text-white"
                          : "border-gray-200 text-gray-600 hover:border-brand-teal/40"
                      }`}
                    >
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-xl font-bold text-brand-dark mb-2">
                Tu cotización estimada
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {cfg.label} · {personas} personas · {modalidad}
              </p>
              <PriceDisplay result={result} modalidad={modalidad} servicio={servicio} personas={personas} />
              <p className="text-gray-400 text-xs text-center mt-4">
                * Precio referencial. La cotización formal puede variar según
                personalización, ubicación y fecha.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-gray-500 font-display font-semibold text-sm hover:text-brand-dark transition-colors"
              >
                ← Anterior
              </button>
            ) : (
              <span />
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => canNext && setStep((s) => s + 1)}
                disabled={!canNext}
                className={`font-display font-semibold px-8 py-3 rounded-full text-sm transition-all ${
                  canNext
                    ? "bg-brand-teal hover:bg-brand-teal-dark text-white shadow-sm"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Siguiente →
              </button>
            ) : (
              <a
                href="/agendar"
                className="bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold px-8 py-3 rounded-full text-sm transition-colors"
              >
                Agendar diagnóstico gratis →
              </a>
            )}
          </div>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-6 py-8 text-xs text-gray-400">
          <span>✓ Sin compromiso</span>
          <span>✓ Respuesta en 24h</span>
          <span>✓ Cotización formal gratis</span>
        </div>
      </div>
    </div>
  );
}
