import { createClient } from "@/lib/supabase/server";
import MetricCard from "@/components/admin/MetricCard";
import LeadsTable from "@/components/admin/LeadsTable";
import KanbanBoard from "@/components/admin/KanbanBoard";
import type { Lead, Pago } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  const [{ data: leads }, { data: pagos }, { data: citas }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("pagos").select("*").order("created_at", { ascending: false }),
    supabase.from("citas").select("id, status").order("created_at", { ascending: false }),
  ]);

  const allLeads: Lead[] = leads ?? [];
  const allPagos: Pago[] = pagos ?? [];

  const totalIngresos = allPagos
    .filter((p) => p.estado === "aprobado")
    .reduce((sum, p) => sum + (p.anticipo ?? 0), 0);

  const citasHoy = (citas ?? []).filter((c) => {
    // count all non-cancelled
    return c.status !== "cancelada";
  }).length;

  return (
    <div>
      <div className="mb-8">
        <h1
          className="font-sans font-bold"
          style={{ fontSize: "24px", color: "var(--hl-text)" }}
        >
          Dashboard
        </h1>
        <p className="font-sans mt-1" style={{ fontSize: "14px", color: "var(--hl-text-muted)" }}>
          Resumen general de Holizenter
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard
          label="Leads totales"
          value={allLeads.length}
          sub={`${allLeads.filter((l) => l.estado_crm === "nuevo").length} nuevos`}
          accent
        />
        <MetricCard
          label="Leads activos"
          value={allLeads.filter((l) => l.estado_crm === "activo").length}
          sub="En programa"
        />
        <MetricCard
          label="Ingresos cobrados"
          value={`$${totalIngresos.toLocaleString("es-MX")}`}
          sub="Anticipos aprobados"
          accent
        />
        <MetricCard
          label="Citas agendadas"
          value={citasHoy}
          sub="No canceladas"
        />
      </div>

      {/* Kanban */}
      <section className="mb-10">
        <h2
          className="font-sans font-semibold mb-4"
          style={{ fontSize: "16px", color: "var(--hl-text)" }}
        >
          Pipeline de leads
        </h2>
        <KanbanBoard leads={allLeads} />
      </section>

      {/* Leads table */}
      <section>
        <h2
          className="font-sans font-semibold mb-4"
          style={{ fontSize: "16px", color: "var(--hl-text)" }}
        >
          Todos los leads
        </h2>
        <LeadsTable leads={allLeads} />
      </section>
    </div>
  );
}
