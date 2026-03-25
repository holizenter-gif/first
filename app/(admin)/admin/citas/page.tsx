import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";
import type { Cita } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<Cita["status"], string> = {
  pendiente:   "Pendiente",
  confirmada:  "Confirmada",
  completada:  "Completada",
  cancelada:   "Cancelada",
};

const STATUS_BG: Record<Cita["status"], string> = {
  pendiente:  "#FEF9E7",
  confirmada: "#E8F4EE",
  completada: "var(--hl-green)",
  cancelada:  "#FDECEA",
};

const STATUS_COLOR: Record<Cita["status"], string> = {
  pendiente:  "#B7770D",
  confirmada: "var(--hl-green)",
  completada: "#fff",
  cancelada:  "#C0392B",
};

const TIPO_LABEL: Record<Cita["tipo"], string> = {
  diagnostico_gratis:  "Diagnóstico gratis",
  taller_grupal:       "Taller grupal",
  sensibilizacion:     "Sensibilización",
  integracion:         "Integración",
  sesion_individual:   "Sesión individual",
};

export default async function AdminCitasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("citas")
    .select("*")
    .order("fecha", { ascending: false });

  const citas: Cita[] = data ?? [];

  const porStatus = (s: Cita["status"]) => citas.filter((c) => c.status === s).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sans font-bold" style={{ fontSize: "24px", color: "var(--hl-text)" }}>
          Citas
        </h1>
        <p className="font-sans mt-1" style={{ fontSize: "14px", color: "var(--hl-text-muted)" }}>
          Gestión de citas y sesiones agendadas
        </p>
      </div>

      {/* Quick stats */}
      <div className="flex flex-wrap gap-3 mb-6">
        {(["pendiente", "confirmada", "completada", "cancelada"] as Cita["status"][]).map((s) => (
          <div
            key={s}
            className="px-4 py-2.5"
            style={{
              background: "#fff",
              borderRadius: "6px",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
              borderLeft: "3px solid var(--hl-green)",
            }}
          >
            <p className="font-sans" style={{ fontSize: "11px", color: "var(--hl-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {STATUS_LABEL[s]}
            </p>
            <p className="font-sans font-bold" style={{ fontSize: "22px", color: "var(--hl-text)" }}>
              {porStatus(s)}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto"
        style={{
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <table className="w-full font-sans" style={{ fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--hl-divider)" }}>
              {["Cliente", "Tipo", "Fecha", "Modalidad", "Estado", "Registrado"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: "var(--hl-text-muted)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {citas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center" style={{ color: "var(--hl-text-muted)" }}>
                  No hay citas registradas.
                </td>
              </tr>
            ) : (
              citas.map((cita) => (
                <tr key={cita.id} style={{ borderBottom: "1px solid var(--hl-divider)" }}>
                  <td className="px-4 py-3">
                    <p className="font-semibold" style={{ color: "var(--hl-text)" }}>
                      {cita.nombre_cliente ?? "Sin nombre"}
                    </p>
                    {cita.empresa_nombre && (
                      <p style={{ color: "var(--hl-text-muted)", fontSize: "11px" }}>{cita.empresa_nombre}</p>
                    )}
                    {cita.email_cliente && (
                      <p style={{ color: "var(--hl-text-muted)", fontSize: "11px" }}>{cita.email_cliente}</p>
                    )}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--hl-text-muted)" }}>
                    {TIPO_LABEL[cita.tipo]}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--hl-text)" }}>
                    {format(new Date(cita.fecha), "d MMM yyyy, HH:mm", { locale: es })}
                  </td>
                  <td className="px-4 py-3 capitalize" style={{ color: "var(--hl-text-muted)" }}>
                    {cita.modalidad}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2 py-0.5 font-semibold"
                      style={{
                        fontSize: "11px",
                        borderRadius: "4px",
                        background: STATUS_BG[cita.status],
                        color: STATUS_COLOR[cita.status],
                      }}
                    >
                      {STATUS_LABEL[cita.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--hl-text-muted)", fontSize: "12px" }}>
                    {formatDistanceToNow(new Date(cita.created_at), { locale: es, addSuffix: true })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
