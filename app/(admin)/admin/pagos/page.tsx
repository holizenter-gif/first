import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Pago } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const ESTADO_LABEL: Record<Pago["estado"], string> = {
  pendiente:   "Pendiente",
  aprobado:    "Aprobado",
  rechazado:   "Rechazado",
  reembolsado: "Reembolsado",
};

const ESTADO_BG: Record<Pago["estado"], string> = {
  pendiente:   "#FEF9E7",
  aprobado:    "var(--hl-green)",
  rechazado:   "#FDECEA",
  reembolsado: "#E8EAF6",
};

const ESTADO_COLOR: Record<Pago["estado"], string> = {
  pendiente:   "#B7770D",
  aprobado:    "#fff",
  rechazado:   "#C0392B",
  reembolsado: "#3949AB",
};

export default async function AdminPagosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pagos")
    .select("*")
    .order("created_at", { ascending: false });

  const pagos: Pago[] = data ?? [];

  const aprobados = pagos.filter((p) => p.estado === "aprobado");
  const totalCobrado = aprobados.reduce((sum, p) => sum + (p.anticipo ?? 0), 0);
  const totalMonto = aprobados.reduce((sum, p) => sum + (p.monto ?? 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sans font-bold" style={{ fontSize: "24px", color: "var(--hl-text)" }}>
          Pagos
        </h1>
        <p className="font-sans mt-1" style={{ fontSize: "14px", color: "var(--hl-text-muted)" }}>
          Historial de anticipos y pagos via Mercado Pago
        </p>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div
          className="px-5 py-3"
          style={{
            background: "#fff",
            borderRadius: "6px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            borderTop: "3px solid var(--hl-green)",
          }}
        >
          <p className="font-sans" style={{ fontSize: "11px", color: "var(--hl-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Anticipos cobrados
          </p>
          <p className="font-sans font-bold" style={{ fontSize: "26px", color: "var(--hl-green)" }}>
            ${totalCobrado.toLocaleString("es-MX")} MXN
          </p>
        </div>
        <div
          className="px-5 py-3"
          style={{
            background: "#fff",
            borderRadius: "6px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            borderTop: "3px solid var(--hl-divider)",
          }}
        >
          <p className="font-sans" style={{ fontSize: "11px", color: "var(--hl-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Valor total contratado
          </p>
          <p className="font-sans font-bold" style={{ fontSize: "26px", color: "var(--hl-text)" }}>
            ${totalMonto.toLocaleString("es-MX")} MXN
          </p>
        </div>
        <div
          className="px-5 py-3"
          style={{
            background: "#fff",
            borderRadius: "6px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            borderTop: "3px solid var(--hl-divider)",
          }}
        >
          <p className="font-sans" style={{ fontSize: "11px", color: "var(--hl-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Transacciones aprobadas
          </p>
          <p className="font-sans font-bold" style={{ fontSize: "26px", color: "var(--hl-text)" }}>
            {aprobados.length}
          </p>
        </div>
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
              {["Cliente", "Servicio", "Monto total", "Anticipo (30%)", "Estado", "MP ID", "Fecha"].map((h) => (
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
            {pagos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center" style={{ color: "var(--hl-text-muted)" }}>
                  No hay pagos registrados.
                </td>
              </tr>
            ) : (
              pagos.map((pago) => (
                <tr key={pago.id} style={{ borderBottom: "1px solid var(--hl-divider)" }}>
                  <td className="px-4 py-3">
                    <p className="font-semibold" style={{ color: "var(--hl-text)" }}>{pago.nombre}</p>
                    {pago.empresa && (
                      <p style={{ color: "var(--hl-text-muted)", fontSize: "11px" }}>{pago.empresa}</p>
                    )}
                    <p style={{ color: "var(--hl-text-muted)", fontSize: "11px" }}>{pago.email}</p>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--hl-text-muted)" }}>
                    {pago.servicio}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "var(--hl-text)" }}>
                    ${pago.monto.toLocaleString("es-MX")}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "var(--hl-green)" }}>
                    ${pago.anticipo.toLocaleString("es-MX")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2 py-0.5 font-semibold"
                      style={{
                        fontSize: "11px",
                        borderRadius: "4px",
                        background: ESTADO_BG[pago.estado],
                        color: ESTADO_COLOR[pago.estado],
                      }}
                    >
                      {ESTADO_LABEL[pago.estado]}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--hl-text-muted)", fontSize: "12px" }}>
                    {pago.mp_payment_id ?? pago.mp_preference_id?.slice(0, 12) ?? "—"}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--hl-text-muted)", fontSize: "12px" }}>
                    {formatDistanceToNow(new Date(pago.created_at), { locale: es, addSuffix: true })}
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
