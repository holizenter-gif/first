import { createClient } from "@/lib/supabase/server";
import { redirect }     from "next/navigation";
import Link             from "next/link";
import { Calendar, BarChart2, User, ArrowRight } from "lucide-react";

export const dynamic    = "force-dynamic";
export const revalidate = 0;

export default async function PortalDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const nombre = user.user_metadata?.nombre ?? "Especialista";

  // Fetch profesional linked to this user
  const { data: prof } = await supabase
    .from("profesionales")
    .select("id, nombre, slug, vistas")
    .eq("user_id", user.id)
    .maybeSingle();

  // Fetch próximas citas
  const { data: citas } = prof
    ? await supabase
        .from("citas")
        .select("id, fecha, tipo, status, nombre_cliente:nombre")
        .eq("profesional_id", prof.id)
        .gte("fecha", new Date().toISOString())
        .in("status", ["confirmada", "pendiente"])
        .order("fecha", { ascending: true })
        .limit(3)
    : { data: [] };

  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-sans" style={{ color: "var(--hl-text-muted)" }}>{saludo}</p>
        <h1 className="font-sans font-bold text-2xl mt-0.5" style={{ color: "var(--hl-text)" }}>
          {nombre} 👋
        </h1>
      </div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border shadow-sm" style={{ borderColor: "var(--hl-divider)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EBF7F2" }}>
              <Calendar className="w-4 h-4" style={{ color: "#5CB996" }} />
            </div>
            <span className="text-xs font-sans font-semibold uppercase tracking-wide text-gray-400">
              Citas próximas
            </span>
          </div>
          <p className="font-sans font-bold text-3xl" style={{ color: "var(--hl-text)" }}>
            {citas?.length ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm" style={{ borderColor: "var(--hl-divider)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EBF7F2" }}>
              <BarChart2 className="w-4 h-4" style={{ color: "#5CB996" }} />
            </div>
            <span className="text-xs font-sans font-semibold uppercase tracking-wide text-gray-400">
              Vistas al perfil
            </span>
          </div>
          <p className="font-sans font-bold text-3xl" style={{ color: "var(--hl-text)" }}>
            {prof?.vistas ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm" style={{ borderColor: "var(--hl-divider)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EBF7F2" }}>
              <User className="w-4 h-4" style={{ color: "#5CB996" }} />
            </div>
            <span className="text-xs font-sans font-semibold uppercase tracking-wide text-gray-400">
              Mi perfil
            </span>
          </div>
          <p className="font-sans font-bold text-sm truncate" style={{ color: "var(--hl-text)" }}>
            {prof ? (
              <Link href={`/directorio/${prof.slug}`} target="_blank" className="hover:underline" style={{ color: "#5CB996" }}>
                Ver perfil →
              </Link>
            ) : "Sin perfil aún"}
          </p>
        </div>
      </div>

      {/* Próximas citas */}
      <div className="bg-white rounded-2xl border shadow-sm" style={{ borderColor: "var(--hl-divider)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--hl-divider)" }}>
          <h2 className="font-sans font-bold text-base" style={{ color: "var(--hl-text)" }}>
            Próximas citas
          </h2>
          <Link
            href="/portal/citas"
            className="text-xs font-sans font-medium flex items-center gap-1 hover:underline"
            style={{ color: "#5CB996" }}
          >
            Ver todas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!citas || citas.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-sans">No tienes citas próximas</p>
            <Link
              href="/portal/disponibilidad"
              className="text-xs font-sans mt-2 inline-block hover:underline"
              style={{ color: "#5CB996" }}
            >
              Configura tu disponibilidad →
            </Link>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--hl-divider)" }}>
            {citas.map((cita) => (
              <div key={cita.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-sans font-semibold text-sm" style={{ color: "var(--hl-text)" }}>
                    {(cita as Record<string, string>).nombre_cliente ?? "Cliente"}
                  </p>
                  <p className="text-xs text-gray-400 font-sans">
                    {new Date(cita.fecha).toLocaleDateString("es-MX", {
                      weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className="text-xs font-sans font-semibold px-2.5 py-1 rounded-full capitalize"
                  style={{
                    background: cita.status === "confirmada" ? "#EBF7F2" : "#FEF3C7",
                    color:      cita.status === "confirmada" ? "#3A8A6E"  : "#92400E",
                  }}
                >
                  {cita.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
