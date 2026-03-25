"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Lead } from "@/lib/supabase/types";

const ESTADO_LABELS: Record<Lead["estado_crm"], string> = {
  nuevo:       "Nuevo",
  contactado:  "Contactado",
  diagnostico: "Diagnóstico",
  propuesta:   "Propuesta",
  contrato:    "Contrato",
  activo:      "Activo",
  perdido:     "Perdido",
};

const ESTADO_COLORS: Record<Lead["estado_crm"], string> = {
  nuevo:       "#E8F4EE",
  contactado:  "#D4E6F1",
  diagnostico: "#FEF9E7",
  propuesta:   "#EDE7F6",
  contrato:    "#E8F5E9",
  activo:      "var(--hl-green)",
  perdido:     "#FDECEA",
};

const ESTADO_TEXT: Record<Lead["estado_crm"], string> = {
  nuevo:       "var(--hl-text)",
  contactado:  "var(--hl-text)",
  diagnostico: "var(--hl-text)",
  propuesta:   "var(--hl-text)",
  contrato:    "var(--hl-text)",
  activo:      "#fff",
  perdido:     "#C0392B",
};

interface LeadsTableProps {
  leads: Lead[];
}

const ESTADOS = ["todos", "nuevo", "contactado", "diagnostico", "propuesta", "contrato", "activo", "perdido"] as const;

export default function LeadsTable({ leads }: LeadsTableProps) {
  const [filtro, setFiltro] = useState<"todos" | Lead["estado_crm"]>("todos");
  const [busqueda, setBusqueda] = useState("");

  const filtrados = leads.filter((l) => {
    const matchEstado = filtro === "todos" || l.estado_crm === filtro;
    const q = busqueda.toLowerCase();
    const matchBusqueda =
      !q ||
      l.nombre.toLowerCase().includes(q) ||
      l.empresa?.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q);
    return matchEstado && matchBusqueda;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Buscar nombre, empresa o email…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="font-sans px-3 py-2 outline-none"
          style={{
            border: "1.5px solid var(--hl-divider)",
            borderRadius: "4px",
            fontSize: "13px",
            color: "var(--hl-text)",
            minWidth: "220px",
          }}
        />
        <div className="flex flex-wrap gap-1.5">
          {ESTADOS.map((e) => (
            <button
              key={e}
              onClick={() => setFiltro(e as typeof filtro)}
              className="font-sans font-semibold px-3 py-1.5 transition-colors"
              style={{
                fontSize: "12px",
                borderRadius: "4px",
                background: filtro === e ? "var(--hl-green)" : "var(--hl-beige)",
                color: filtro === e ? "#fff" : "var(--hl-text-muted)",
                border: "1px solid var(--hl-divider)",
              }}
            >
              {e === "todos" ? "Todos" : ESTADO_LABELS[e as Lead["estado_crm"]]}
            </button>
          ))}
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
              {["Nombre", "Empresa", "Email / WhatsApp", "Resultado quiz", "Estado", "Hace"].map((h) => (
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
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center" style={{ color: "var(--hl-text-muted)" }}>
                  No hay leads con estos filtros.
                </td>
              </tr>
            ) : (
              filtrados.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: "1px solid var(--hl-divider)" }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: "var(--hl-text)" }}>
                    {lead.nombre}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--hl-text-muted)" }}>
                    {lead.empresa || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <p style={{ color: "var(--hl-text)" }}>{lead.email}</p>
                    {lead.whatsapp && (
                      <p style={{ color: "var(--hl-text-muted)", fontSize: "12px" }}>{lead.whatsapp}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {lead.resultado ? (
                      <span
                        className="inline-block px-2 py-0.5 font-semibold"
                        style={{
                          fontSize: "11px",
                          borderRadius: "4px",
                          background:
                            lead.resultado === "critico" ? "#FDECEA" :
                            lead.resultado === "riesgo" ? "#FEF9E7" : "#E8F4EE",
                          color:
                            lead.resultado === "critico" ? "#C0392B" :
                            lead.resultado === "riesgo" ? "#B7770D" : "var(--hl-green)",
                        }}
                      >
                        {lead.resultado} {lead.puntaje != null ? `· ${lead.puntaje}pts` : ""}
                      </span>
                    ) : (
                      <span style={{ color: "var(--hl-text-muted)" }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2 py-0.5 font-semibold"
                      style={{
                        fontSize: "11px",
                        borderRadius: "4px",
                        background: ESTADO_COLORS[lead.estado_crm],
                        color: ESTADO_TEXT[lead.estado_crm],
                      }}
                    >
                      {ESTADO_LABELS[lead.estado_crm]}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--hl-text-muted)", fontSize: "12px" }}>
                    {formatDistanceToNow(new Date(lead.created_at), { locale: es, addSuffix: false })}
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
