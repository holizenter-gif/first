import type { Metadata }    from "next";
import { notFound }          from "next/navigation";
import Link                  from "next/link";
import { MapPin, Video, Users, CalendarDays, Clock, ArrowLeft, UserCheck } from "lucide-react";
import { createClient }      from "@/lib/supabase/server";
import FormularioRegistroEvento from "@/components/eventos/FormularioRegistroEvento";

interface Props {
  params: Promise<{ slug: string }>;
}

const MODALIDAD_CONFIG = {
  presencial: { Icon: MapPin,  label: "Presencial", color: "#5CB996" },
  virtual:    { Icon: Video,   label: "Virtual",    color: "#6D8339" },
  hibrido:    { Icon: Users,   label: "Híbrido",    color: "#8B6914" },
} as const;

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString("es-MX", {
    hour: "2-digit", minute: "2-digit",
  });
}

function formatPrecio(precio: number) {
  if (precio === 0) return "Gratis";
  return `$${precio.toLocaleString("es-MX")} MXN`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase  = await createClient();
  const { data }  = await supabase.from("eventos").select("titulo, descripcion_corta").eq("slug", slug).single();
  if (!data) return { title: "Evento no encontrado | Holizenter" };
  return {
    title:       `${data.titulo} | Holizenter`,
    description: data.descripcion_corta ?? `Evento de bienestar: ${data.titulo}`,
  };
}

export default async function EventoPage({ params }: Props) {
  const { slug } = await params;
  const supabase  = await createClient();

  const { data: ev } = await supabase
    .from("eventos")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (!ev) notFound();

  const modalidad = ev.modalidad as keyof typeof MODALIDAD_CONFIG;
  const { Icon: ModalidadIcon, label: modalidadLabel, color: modalidadColor } =
    MODALIDAD_CONFIG[modalidad] ?? MODALIDAD_CONFIG.presencial;

  const cupoRestante = ev.cupo_maximo ? ev.cupo_maximo - (ev.cupo_actual ?? 0) : null;
  const agotado = cupoRestante !== null && cupoRestante <= 0;

  return (
    <div className="min-h-screen" style={{ background: "#F5F2EC" }}>

      {/* Back bar */}
      <div className="px-4 py-3" style={{ background: "#0D1A0F" }}>
        <div className="max-w-5xl mx-auto">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 font-sans text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a eventos
          </Link>
        </div>
      </div>

      {/* Imagen hero */}
      {ev.imagen_url && (
        <div className="w-full h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: `url(${ev.imagen_url})` }} />
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* ── Columna izquierda ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ background: "#EBF8F2", color: modalidadColor }}
                >
                  <ModalidadIcon className="w-3 h-3" /> {modalidadLabel}
                </span>
                {ev.pasado && (
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "#F3F4F6", color: "#6B7280" }}>
                    Evento pasado
                  </span>
                )}
                {ev.destacado && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "#FEF3C7", color: "#92400E" }}>
                    Destacado
                  </span>
                )}
              </div>

              <h1 className="font-display font-bold text-3xl mb-3" style={{ color: "#0D1A0F" }}>
                {ev.titulo}
              </h1>

              {ev.descripcion_corta && (
                <p className="text-base leading-relaxed mb-5" style={{ color: "#6B7280" }}>
                  {ev.descripcion_corta}
                </p>
              )}

              {/* Meta info */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 text-sm" style={{ color: "#6B7280" }}>
                  <CalendarDays className="w-4 h-4 flex-shrink-0" style={{ color: "#5CB996" }} />
                  {formatFecha(ev.fecha_inicio)}
                </div>
                <div className="flex items-center gap-2.5 text-sm" style={{ color: "#6B7280" }}>
                  <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#5CB996" }} />
                  {formatHora(ev.fecha_inicio)}
                  {ev.fecha_fin && ` — ${formatHora(ev.fecha_fin)}`}
                </div>
                {ev.ubicacion && (
                  <div className="flex items-center gap-2.5 text-sm" style={{ color: "#6B7280" }}>
                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#5CB996" }} />
                    {ev.ubicacion}
                  </div>
                )}
                {ev.link_virtual && (
                  <div className="flex items-center gap-2.5 text-sm" style={{ color: "#6B7280" }}>
                    <Video className="w-4 h-4 flex-shrink-0" style={{ color: "#5CB996" }} />
                    <a href={ev.link_virtual} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#5CB996" }}>
                      Enlace de acceso
                    </a>
                  </div>
                )}
                {ev.cupo_maximo && (
                  <div className="flex items-center gap-2.5 text-sm" style={{ color: "#6B7280" }}>
                    <UserCheck className="w-4 h-4 flex-shrink-0" style={{ color: "#5CB996" }} />
                    {agotado
                      ? "Cupo agotado"
                      : `${cupoRestante} lugares disponibles de ${ev.cupo_maximo}`}
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            {ev.descripcion && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-display font-bold text-lg mb-4" style={{ color: "#0D1A0F" }}>
                  Sobre este evento
                </h2>
                <div
                  className="prose prose-sm max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: ev.descripcion }}
                />
              </div>
            )}

          </div>

          {/* ── Columna derecha — registro ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24 border border-gray-100">
              <div className="px-5 py-4" style={{ background: "#0D1A0F" }}>
                <p className="font-sans font-semibold text-sm text-white">
                  {agotado ? "Cupo agotado" : ev.pasado ? "Evento finalizado" : "Reserva tu lugar"}
                </p>
                <p className="font-sans text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {ev.precio_descripcion ?? formatPrecio(ev.precio ?? 0)}
                </p>
              </div>
              <div className="p-4">
                {!ev.pasado && !agotado ? (
                  <FormularioRegistroEvento
                    eventoId={ev.id}
                    eventoTitulo={ev.titulo}
                    eventoSlug={ev.slug}
                    precio={ev.precio ?? 0}
                  />
                ) : (
                  <div className="p-5 text-center border border-dashed border-gray-200 rounded-2xl">
                    <p className="text-gray-400 text-sm">
                      {agotado ? "No hay lugares disponibles." : "Este evento ya terminó."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
