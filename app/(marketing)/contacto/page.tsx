"use client";

import { useState } from "react";
import { MapPin, Mail, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ContactoPage() {
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setEnviado(true);
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    border: "1.5px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#374151",
    padding: "10px 12px",
    width: "100%",
    outline: "none",
    fontFamily: "inherit",
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F2EC" }}>

      {/* Hero */}
      <section className="px-4 pt-8 pb-16" style={{ background: "#0D1A0F" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="font-sans font-bold text-white mb-4"
            style={{ fontSize: "clamp(32px,5vw,52px)" }}
          >
            Hablemos
          </h1>
          <p className="font-sans" style={{ fontSize: "20px", color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>
            Sin formularios largos. Sin esperar días. Una conversación real.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="font-sans font-bold text-lg mb-5" style={{ color: "#0D1A0F" }}>
                  Formas de contactarnos
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      Icon:  MessageCircle,
                      label: "WhatsApp (más rápido)",
                      value: "Escríbenos directamente",
                      href:  `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "525500000000"}`,
                      color: "#25D366",
                    },
                    {
                      Icon:  Mail,
                      label: "Email",
                      value: "hola@holizenter.mx",
                      href:  "mailto:hola@holizenter.mx",
                      color: "#5CB996",
                    },
                    {
                      Icon:  MapPin,
                      label: "Ubicación",
                      value: "Ciudad de México",
                      href:  null,
                      color: "#6D8339",
                    },
                  ].map(({ Icon, label, value, href, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "#EBF8F2" }}
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div>
                        <p className="font-sans text-xs" style={{ color: "#9CA3AF" }}>{label}</p>
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans text-sm font-medium hover:underline"
                            style={{ color }}
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="font-sans text-sm font-medium" style={{ color: "#0D1A0F" }}>{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-2xl p-6" style={{ background: "#0D1A0F" }}>
                <h3 className="font-sans font-bold text-white mb-2">
                  ¿Prefieres ir directo al grano?
                </h3>
                <p className="font-sans text-sm mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Agenda el diagnóstico gratuito y en 60 minutos
                  sabrás exactamente qué necesita tu empresa.
                </p>
                <Link
                  href="/agendar"
                  className="inline-flex items-center gap-2 font-sans font-semibold px-5 py-2.5 rounded-full transition-colors text-sm text-white"
                  style={{ background: "#5CB996" }}
                >
                  Agendar diagnóstico gratis <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              {enviado ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "#EBF8F2", border: "2px solid #5CB996" }}
                  >
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="font-sans font-bold text-lg mb-2" style={{ color: "#0D1A0F" }}>
                    ¡Mensaje recibido!
                  </h3>
                  <p className="font-sans text-sm" style={{ color: "#9CA3AF" }}>
                    Te respondemos en menos de 24 horas hábiles.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-sans font-bold text-lg mb-5" style={{ color: "#0D1A0F" }}>
                    Envíanos un mensaje
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-sans text-xs block mb-1.5" style={{ color: "#9CA3AF" }}>Nombre</label>
                        <input name="nombre" placeholder="Tu nombre" required style={inputStyle} />
                      </div>
                      <div>
                        <label className="font-sans text-xs block mb-1.5" style={{ color: "#9CA3AF" }}>Empresa</label>
                        <input name="empresa" placeholder="Tu empresa" style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label className="font-sans text-xs block mb-1.5" style={{ color: "#9CA3AF" }}>Email</label>
                      <input name="email" type="email" placeholder="tu@empresa.com" required style={inputStyle} />
                    </div>
                    <div>
                      <label className="font-sans text-xs block mb-1.5" style={{ color: "#9CA3AF" }}>Mensaje</label>
                      <textarea
                        name="mensaje"
                        rows={4}
                        placeholder="Cuéntanos qué necesita tu empresa..."
                        required
                        style={{ ...inputStyle, resize: "none" }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full font-sans font-semibold py-3 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60 text-white"
                      style={{ background: "#5CB996", fontSize: "14px" }}
                    >
                      {loading ? "Enviando..." : "Enviar mensaje →"}
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
