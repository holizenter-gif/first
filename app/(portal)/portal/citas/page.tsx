import { createClient } from "@/lib/supabase/server";
import { redirect }     from "next/navigation";
import { Calendar }     from "lucide-react";

export const dynamic    = "force-dynamic";
export const revalidate = 0;

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pendiente:  { bg: "#FEF3C7", color: "#92400E" },
  confirmada: { bg: "#EBF7F2", color: "#3A8A6E" },
  completada: { bg: "#F0F9FF", color: "#0369A1" },
  cancelada:  { bg: "#FEE2E2", color: "#B91C1C" },
};

export default async function PortalCitasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: prof } = await supabase
    .from("profesionales")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: citas } = prof
    ? await supabase
        .from("citas")
        .select("id, fecha, tipo, status, nombre, email, empresa, modalidad")
        .eq("profesional_id", prof.id)
        .order("fecha", { ascending: false })
        .limit(50)
    : { data: [] };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-2xl" style={{ color: "var(--hl-text)" }}>
          Mis citas
        </h1>
        <p className="text-sm font-sans text-gray-500 mt-1">
          {citas?.length ?? 0} citas en total
        </p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--hl-divider)" }}>
        {!citas || citas.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-sans">No tienes citas registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--hl-beige)", borderBottom: "1px solid var(--hl-divider)" }}>
                  {["Fecha", "Cliente", "Empresa", "Tipo", "Modalidad", "Estado"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-sans font-semibold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: "var(--hl-text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {citas.map((c) => {
                  const st = STATUS_STYLE[c.status] ?? STATUS_STYLE.pendiente;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-sans whitespace-nowrap" style={{ color: "var(--hl-text)" }}>
                        {new Date(c.fecha).toLocaleDateString("es-MX", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-sans font-medium" style={{ color: "var(--hl-text)" }}>{c.nombre}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-sans">{c.empresa ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-sans capitalize">
                        {c.tipo?.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-sans capitalize">{c.modalidad ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-sans font-semibold px-2.5 py-1 rounded-full capitalize"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
