export const dynamic = "force-dynamic";

import { createClient }  from "@/lib/supabase/server";
import Link              from "next/link";
import { CalendarDays, MapPin, Video, Users, CheckCircle, XCircle } from "lucide-react";

const MODALIDAD_ICON = {
  presencial: MapPin,
  virtual:    Video,
  hibrido:    Users,
} as const;

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default async function AdminEventosPage() {
  const supabase = await createClient();

  const { data: eventos = [] } = await supabase
    .from("eventos")
    .select("id, titulo, slug, fecha_inicio, modalidad, precio, cupo_maximo, cupo_actual, activo, pasado, destacado")
    .order("fecha_inicio", { ascending: false });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sans font-bold text-2xl" style={{ color: "var(--hl-text)" }}>
            Eventos
          </h1>
          <p className="font-sans text-sm mt-1" style={{ color: "var(--hl-text-muted)" }}>
            {eventos?.length ?? 0} eventos registrados
          </p>
        </div>
        <Link
          href="/admin/eventos/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans font-semibold text-sm text-white"
          style={{ background: "#5CB996" }}
        >
          + Nuevo evento
        </Link>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--hl-divider)" }}>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr style={{ background: "var(--hl-bg)", borderBottom: "1px solid var(--hl-divider)" }}>
              <th className="text-left px-4 py-3 font-sans font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--hl-text-muted)" }}>
                Evento
              </th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: "var(--hl-text-muted)" }}>
                Fecha
              </th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-xs uppercase tracking-wider hidden lg:table-cell" style={{ color: "var(--hl-text-muted)" }}>
                Cupo
              </th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-xs uppercase tracking-wider hidden lg:table-cell" style={{ color: "var(--hl-text-muted)" }}>
                Precio
              </th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--hl-text-muted)" }}>
                Estado
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {eventos && eventos.length > 0 ? eventos.map((ev, i) => {
              const modalidad = ev.modalidad as keyof typeof MODALIDAD_ICON;
              const Icon = MODALIDAD_ICON[modalidad] ?? CalendarDays;
              const cupoRestante = ev.cupo_maximo ? ev.cupo_maximo - (ev.cupo_actual ?? 0) : null;

              return (
                <tr
                  key={ev.id}
                  style={{
                    borderBottom: i < (eventos?.length ?? 0) - 1 ? "1px solid var(--hl-divider)" : undefined,
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#5CB996" }} />
                      <div>
                        <p className="font-sans font-medium" style={{ color: "var(--hl-text)", fontSize: "13px" }}>
                          {ev.titulo}
                        </p>
                        <p className="font-sans" style={{ color: "var(--hl-text-muted)", fontSize: "11px" }}>
                          /eventos/{ev.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="font-sans text-xs" style={{ color: "var(--hl-text-muted)" }}>
                      {formatFecha(ev.fecha_inicio)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="font-sans text-xs" style={{ color: "var(--hl-text-muted)" }}>
                      {ev.cupo_maximo
                        ? `${ev.cupo_actual ?? 0} / ${ev.cupo_maximo}${cupoRestante === 0 ? " · LLENO" : ""}`
                        : "Sin límite"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="font-sans text-xs font-semibold" style={{ color: ev.precio === 0 ? "#5CB996" : "var(--hl-text)" }}>
                      {ev.precio === 0 ? "Gratis" : `$${ev.precio?.toLocaleString("es-MX")}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {ev.activo ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#EBF8F2", color: "#5CB996" }}>
                          <CheckCircle className="w-3 h-3" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#F3F4F6", color: "#6B7280" }}>
                          <XCircle className="w-3 h-3" /> Inactivo
                        </span>
                      )}
                      {ev.pasado && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#F3F4F6", color: "#9CA3AF" }}>
                          Pasado
                        </span>
                      )}
                      {ev.destacado && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#FEF3C7", color: "#92400E" }}>
                          Destacado
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/eventos/${ev.id}/editar`}
                        className="font-sans text-xs font-medium hover:underline"
                        style={{ color: "#5CB996" }}
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/eventos/${ev.slug}`}
                        target="_blank"
                        className="font-sans text-xs font-medium text-gray-400 hover:text-gray-600"
                      >
                        Ver →
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <CalendarDays className="w-10 h-10 mx-auto mb-3" style={{ color: "#D1D5DB" }} />
                  <p className="font-sans text-sm" style={{ color: "var(--hl-text-muted)" }}>
                    No hay eventos registrados aún.
                  </p>
                  <p className="font-sans text-xs mt-1" style={{ color: "var(--hl-text-muted)" }}>
                    Insértalos directamente en Supabase por ahora.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* SQL hint */}
      <div className="mt-8 p-4 rounded-xl border border-dashed" style={{ borderColor: "var(--hl-divider)" }}>
        <p className="font-sans font-semibold text-xs mb-2" style={{ color: "var(--hl-text-muted)" }}>
          Para agregar eventos usa Supabase directamente o ejecuta:
        </p>
        <code className="font-mono text-xs block p-3 rounded-lg" style={{ background: "#F5F2EC", color: "#0D1A0F" }}>
          INSERT INTO eventos (titulo, slug, descripcion, descripcion_corta, fecha_inicio, modalidad, precio, cupo_maximo) VALUES (...)
        </code>
      </div>
    </div>
  );
}
