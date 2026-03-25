"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Lead } from "@/lib/supabase/types";

type EstadoCRM = Lead["estado_crm"];

const COLUMNAS: { key: EstadoCRM; label: string }[] = [
  { key: "nuevo",       label: "Nuevo" },
  { key: "contactado",  label: "Contactado" },
  { key: "diagnostico", label: "Diagnóstico" },
  { key: "propuesta",   label: "Propuesta" },
  { key: "contrato",    label: "Contrato" },
  { key: "activo",      label: "Activo" },
];

interface KanbanBoardProps {
  leads: Lead[];
}

export default function KanbanBoard({ leads }: KanbanBoardProps) {
  const byEstado = (estado: EstadoCRM) =>
    leads.filter((l) => l.estado_crm === estado);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {COLUMNAS.map(({ key, label }) => {
        const col = byEstado(key);
        const isActivo = key === "activo";
        return (
          <div
            key={key}
            className="flex flex-col"
            style={{ minWidth: "200px", flex: "0 0 200px" }}
          >
            {/* Column header */}
            <div
              className="flex items-center justify-between px-3 py-2 mb-2"
              style={{
                background: isActivo ? "var(--hl-green)" : "#fff",
                borderRadius: "6px",
                border: isActivo ? "none" : "1px solid var(--hl-divider)",
              }}
            >
              <span
                className="font-sans font-semibold"
                style={{
                  fontSize: "12px",
                  color: isActivo ? "#fff" : "var(--hl-text)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {label}
              </span>
              <span
                className="font-sans font-bold"
                style={{
                  fontSize: "12px",
                  color: isActivo ? "rgba(255,255,255,0.8)" : "var(--hl-text-muted)",
                }}
              >
                {col.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2 min-h-16">
              {col.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3"
                  style={{
                    background: "#fff",
                    borderRadius: "6px",
                    borderLeft: "3px solid var(--hl-green)",
                    boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <p
                    className="font-sans font-semibold truncate"
                    style={{ fontSize: "13px", color: "var(--hl-text)" }}
                  >
                    {lead.nombre}
                  </p>
                  {lead.empresa && (
                    <p
                      className="font-sans truncate"
                      style={{ fontSize: "11px", color: "var(--hl-text-muted)" }}
                    >
                      {lead.empresa}
                    </p>
                  )}
                  {lead.servicio_recomendado && (
                    <p
                      className="font-sans mt-1 truncate"
                      style={{
                        fontSize: "11px",
                        color: "var(--hl-green)",
                        fontWeight: 500,
                      }}
                    >
                      {lead.servicio_recomendado}
                    </p>
                  )}
                  <p
                    className="font-sans mt-1"
                    style={{ fontSize: "10px", color: "var(--hl-text-muted)" }}
                  >
                    {formatDistanceToNow(new Date(lead.created_at), {
                      locale: es,
                      addSuffix: true,
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
