import type { Metadata }          from "next";
import { notFound }               from "next/navigation";
import Image                      from "next/image";
import Link                       from "next/link";
import { MapPin, Clock, CheckCircle, ArrowLeft, Building2 } from "lucide-react";
import { getProfesionalBySlug } from "@/lib/data/profesionales-helpers";
import { getModalidadLabel, formatPrecioSesion } from "@/lib/data/profesionales-utils";
import CalEmbed from "@/components/cal/CalEmbed";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProfesionalBySlug(slug);
  if (!p) return { title: "Especialista no encontrado | Holizenter" };
  return {
    title:       `${p.nombre} — ${p.especialidad} | Holizenter`,
    description: p.bio_corta ?? `Especialista en bienestar. ${p.especialidad}.`,
  };
}

export default async function ProfesionalPage({ params }: Props) {
  const { slug } = await params;
  const p = await getProfesionalBySlug(slug);
  if (!p) notFound();

  const calUsername = process.env.NEXT_PUBLIC_CAL_USERNAME ?? "holizenter";
  const calSlug     = p.cal_username ?? (process.env.NEXT_PUBLIC_CAL_EVENT_DIAGNOSTICO ?? "diagnostico");
  const initials    = p.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="min-h-screen" style={{ background: "#F5F2EC" }}>

      {/* Back bar */}
      <div className="px-4 py-3" style={{ background: "#0D1A0F" }}>
        <div className="max-w-5xl mx-auto">
          <Link
            href="/directorio"
            className="inline-flex items-center gap-2 font-sans text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al directorio
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* ── Columna izquierda ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Card principal */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">

              {/* Foto */}
              <div className="relative h-64" style={{ background: "#EBF8F2" }}>
                {p.foto_url ? (
                  <Image
                    src={p.foto_url}
                    alt={p.nombre}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-white font-sans font-bold text-3xl"
                      style={{ background: "#5CB996" }}
                    >
                      {initials}
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="font-sans font-bold text-2xl mb-1" style={{ color: "#0D1A0F" }}>
                      {p.nombre}
                    </h1>
                    <p className="font-sans font-semibold text-sm" style={{ color: "#5CB996" }}>
                      {p.especialidad}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="flex items-center gap-1.5 text-xs font-sans font-medium px-3 py-1.5 rounded-full"
                      style={{ background: "#EBF8F2", color: "#5CB996" }}
                    >
                      <MapPin className="w-3 h-3" /> {getModalidadLabel(p.modalidad)}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-xs font-sans font-medium px-3 py-1.5 rounded-full"
                      style={{ background: "#F0F4E8", color: "#6D8339" }}
                    >
                      <Clock className="w-3 h-3" /> {p.experiencia_anos} años
                    </span>
                  </div>
                </div>

                {/* Filosofía */}
                {p.filosofia && (
                  <blockquote
                    className="border-l-4 pl-4 mb-5 italic text-sm leading-relaxed"
                    style={{ borderColor: "#5CB996", color: "#6B7280" }}
                  >
                    &ldquo;{p.filosofia}&rdquo;
                  </blockquote>
                )}

                {/* Bio */}
                {p.bio && (
                  <p className="font-sans text-sm leading-relaxed mb-5" style={{ color: "#6B7280" }}>
                    {p.bio}
                  </p>
                )}

                {/* Tags */}
                {p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full font-sans capitalize"
                        style={{ background: "#EBF8F2", color: "#5CB996" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Certificaciones */}
                {p.certificaciones.length > 0 && (
                  <div>
                    <p className="font-sans font-semibold text-sm mb-3" style={{ color: "#0D1A0F" }}>
                      Certificaciones y formación
                    </p>
                    <div className="space-y-2">
                      {p.certificaciones.map((cert) => (
                        <div key={cert} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#5CB996" }} />
                          <span className="font-sans text-sm" style={{ color: "#6B7280" }}>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Invitar a empresa */}
            <div className="rounded-2xl p-6" style={{ background: "#0D1A0F" }}>
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <Building2 className="w-5 h-5" style={{ color: "#5CB996" }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-sans font-semibold text-white text-base mb-1">
                    ¿Quieres invitar a {p.nombre.split(" ")[0]} a tu empresa?
                  </h3>
                  <p className="font-sans text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Coordina un taller o programa personalizado para tu equipo.
                  </p>
                  <Link
                    href={`/agendar?profesional=${p.slug}&tipo=empresa&nombre_pro=${encodeURIComponent(p.nombre)}`}
                    className="inline-flex items-center font-sans font-semibold px-5 py-2.5 transition-opacity hover:opacity-90"
                    style={{
                      background: "#5CB996",
                      color: "#fff",
                      borderRadius: "999px",
                      fontSize: "14px",
                    }}
                  >
                    Invitar a mi empresa →
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* ── Columna derecha — agenda ── */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24 border border-gray-100"
            >
              <div className="px-5 py-4" style={{ background: "#0D1A0F" }}>
                <p className="font-sans font-semibold text-sm text-white">
                  Agenda una sesión
                </p>
                <p className="font-sans text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {formatPrecioSesion(p.precio_base)}
                </p>
              </div>
              <div className="p-4">
                <CalEmbed
                  calUsername={calUsername}
                  eventSlug={calSlug}
                  prefillNotes={`Solicitud de sesión con ${p.nombre}`}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
