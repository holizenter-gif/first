import { createClient }  from "@/lib/supabase/server";
import { redirect }      from "next/navigation";
import Link              from "next/link";
import { Clock, CheckCircle, XCircle, User } from "lucide-react";

export const dynamic    = "force-dynamic";
export const revalidate = 0;

export default async function AdminEspecialistasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: solicitudes } = await supabase
    .from("solicitudes_especialistas")
    .select("*")
    .order("created_at", { ascending: false });

  const pendientes = (solicitudes ?? []).filter((s) => s.status === "pendiente");
  const aprobados  = (solicitudes ?? []).filter((s) => s.status === "aprobado");
  const rechazados = (solicitudes ?? []).filter((s) => s.status === "rechazado");

  const STATUS_CONFIG = {
    pendiente: { label: "Pendiente", Icon: Clock,        bg: "#FEF3C7", color: "#92400E" },
    aprobado:  { label: "Aprobado",  Icon: CheckCircle,  bg: "#EBF7F2", color: "#3A8A6E" },
    rechazado: { label: "Rechazado", Icon: XCircle,      bg: "#FEE2E2", color: "#B91C1C" },
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <div className="mb-8">
        <h1 className="font-sans text-2xl font-bold" style={{ color: "var(--hl-text)" }}>
          Especialistas
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""} ·{" "}
          {aprobados.length} aprobado{aprobados.length !== 1 ? "s" : ""} ·{" "}
          {rechazados.length} rechazado{rechazados.length !== 1 ? "s" : ""}
        </p>
      </div>

      {pendientes.length > 0 && (
        <div
          className="rounded-2xl p-4 mb-6 flex items-center gap-3 border"
          style={{ background: "#FFFBEB", borderColor: "#FCD34D" }}
        >
          <Clock className="w-5 h-5 flex-shrink-0" style={{ color: "#D97706" }} />
          <p className="font-sans font-semibold text-sm" style={{ color: "#92400E" }}>
            {pendientes.length} solicitud{pendientes.length !== 1 ? "es" : ""} esperando revisión
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--hl-beige)", borderBottom: "1px solid var(--hl-divider)" }}>
                {["Especialista", "Especialidad", "Experiencia", "Fecha", "Estado", "Acciones"].map((h) => (
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
              {(solicitudes ?? []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                    No hay solicitudes aún.
                  </td>
                </tr>
              ) : (solicitudes ?? []).map((sol) => {
                const cfg  = STATUS_CONFIG[sol.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pendiente;
                const Icon = cfg.Icon;
                return (
                  <tr key={sol.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "#EBF7F2" }}
                        >
                          <User className="w-4 h-4" style={{ color: "#5CB996" }} />
                        </div>
                        <div>
                          <p className="font-sans font-semibold text-sm" style={{ color: "var(--hl-text)" }}>
                            {sol.nombre}
                          </p>
                          <p className="text-gray-400 text-xs">{sol.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[160px]">
                      <span className="truncate block">{sol.especialidad}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {sol.experiencia_anos} años
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(sol.created_at).toLocaleDateString("es-MX", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-sans font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/especialistas/${sol.id}`}
                        className="text-sm font-sans font-medium hover:underline"
                        style={{ color: "#5CB996" }}
                      >
                        {sol.status === "pendiente" ? "Revisar →" : "Ver detalle →"}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
