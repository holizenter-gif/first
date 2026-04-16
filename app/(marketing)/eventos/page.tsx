import type { Metadata }  from "next";
import Link               from "next/link";
import { MapPin, Video, Users, CalendarDays, Clock } from "lucide-react";
import { createClient }   from "@/lib/supabase/server";

export const metadata: Metadata = {
  title:       "Eventos de Bienestar | Holizenter",
  description: "Talleres, retiros y eventos de bienestar. Próximas fechas y registro en línea.",
};

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

export default async function EventosPage() {
  const supabase = await createClient();

  const { data: proximos = [] } = await supabase
    .from("eventos")
    .select("id, titulo, slug, descripcion_corta, fecha_inicio, modalidad, ubicacion, precio, precio_descripcion, cupo_maximo, cupo_actual, imagen_url, destacado")
    .eq("activo", true)
    .eq("pasado", false)
    .order("fecha_inicio", { ascending: true });

  const { data: pasados = [] } = await supabase
    .from("eventos")
    .select("id, titulo, slug, descripcion_corta, fecha_inicio, modalidad, imagen_url")
    .eq("activo", true)
    .eq("pasado", true)
    .order("fecha_inicio", { ascending: false })
    .limit(6);

  return (
    <div className="min-h-screen" style={{ background: "#F5F2EC" }}>

      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: "#0D1A0F" }}>
        <div className="max-w-2xl mx-auto">
          <p className="font-display text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#5CB996" }}>
            Eventos
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Experiencias de{" "}
            <span style={{ color: "#5CB996" }}>bienestar</span>
          </h1>
          <p className="text-white/60 text-lg font-light">
            Talleres, retiros y encuentros para transformar tu vida y la de tu equipo.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-14">

        {/* Próximos eventos */}
        <h2 className="font-display text-2xl font-bold mb-8" style={{ color: "#0D1A0F" }}>
          Próximos eventos
        </h2>

        {proximos && proximos.length > 0 ? (
          <div className="space-y-5">
            {proximos.map((ev) => {
              const modalidad = ev.modalidad as keyof typeof MODALIDAD_CONFIG;
              const { Icon, label, color } = MODALIDAD_CONFIG[modalidad] ?? MODALIDAD_CONFIG.presencial;
              const cupoRestante = ev.cupo_maximo ? ev.cupo_maximo - (ev.cupo_actual ?? 0) : null;
              const agotado = cupoRestante !== null && cupoRestante <= 0;

              return (
                <Link
                  key={ev.id}
                  href={`/eventos/${ev.slug}`}
                  className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Imagen */}
                    {ev.imagen_url ? (
                      <div
                        className="md:w-56 h-48 md:h-auto flex-shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${ev.imagen_url})` }}
                      />
                    ) : (
                      <div className="md:w-56 h-48 md:h-auto flex-shrink-0 flex items-center justify-center" style={{ background: "#EBF8F2" }}>
                        <CalendarDays className="w-12 h-12" style={{ color: "#5CB996", opacity: 0.4 }} />
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{ background: "#EBF8F2", color }}
                          >
                            <Icon className="w-3 h-3" /> {label}
                          </span>
                          {ev.destacado && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#FEF3C7", color: "#92400E" }}>
                              Destacado
                            </span>
                          )}
                          {agotado && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#FEE2E2", color: "#991B1B" }}>
                              Cupo agotado
                            </span>
                          )}
                        </div>

                        <h3 className="font-display font-bold text-xl mb-2" style={{ color: "#0D1A0F" }}>
                          {ev.titulo}
                        </h3>
                        {ev.descripcion_corta && (
                          <p className="text-sm leading-relaxed mb-3" style={{ color: "#6B7280" }}>
                            {ev.descripcion_corta}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-4 text-xs" style={{ color: "#6B7280" }}>
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {formatFecha(ev.fecha_inicio)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatHora(ev.fecha_inicio)}
                          </span>
                          {ev.ubicacion && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {ev.ubicacion}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold text-lg" style={{ color: "#5CB996" }}>
                            {ev.precio_descripcion ?? formatPrecio(ev.precio ?? 0)}
                          </p>
                          {cupoRestante !== null && cupoRestante > 0 && cupoRestante <= 10 && (
                            <p className="text-xs" style={{ color: "#DC2626" }}>
                              Solo quedan {cupoRestante} lugares
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <CalendarDays className="w-12 h-12 mx-auto mb-4" style={{ color: "#5CB996", opacity: 0.4 }} />
            <p className="font-display font-semibold text-lg mb-2" style={{ color: "#0D1A0F" }}>
              Próximamente nuevos eventos
            </p>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Suscríbete a nuestro newsletter para ser el primero en enterarte.
            </p>
          </div>
        )}

        {/* Eventos pasados */}
        {pasados && pasados.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl font-bold mb-6" style={{ color: "#0D1A0F" }}>
              Eventos pasados
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pasados.map((ev) => {
                const modalidad = ev.modalidad as keyof typeof MODALIDAD_CONFIG;
                const { Icon, label, color } = MODALIDAD_CONFIG[modalidad] ?? MODALIDAD_CONFIG.presencial;
                return (
                  <div key={ev.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 opacity-75">
                    {ev.imagen_url ? (
                      <div
                        className="h-36 bg-cover bg-center grayscale"
                        style={{ backgroundImage: `url(${ev.imagen_url})` }}
                      />
                    ) : (
                      <div className="h-36 flex items-center justify-center" style={{ background: "#F3F4F6" }}>
                        <CalendarDays className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                    <div className="p-4">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mb-2"
                        style={{ background: "#F3F4F6", color }}
                      >
                        <Icon className="w-3 h-3" /> {label}
                      </span>
                      <p className="font-display font-semibold text-sm" style={{ color: "#0D1A0F" }}>
                        {ev.titulo}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                        {formatFecha(ev.fecha_inicio)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
