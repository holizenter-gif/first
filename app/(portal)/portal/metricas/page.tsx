import { createClient } from "@/lib/supabase/server";
import { redirect }     from "next/navigation";
import { Eye, Calendar, CheckCircle, TrendingUp } from "lucide-react";

export const dynamic    = "force-dynamic";
export const revalidate = 0;

export default async function PortalMetricasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: prof } = await supabase
    .from("profesionales")
    .select("id, vistas")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: metricas } = prof
    ? await supabase
        .from("metricas_especialista")
        .select("*")
        .eq("profesional_id", prof.id)
        .maybeSingle()
    : { data: null };

  const stats = [
    {
      label:  "Vistas al perfil",
      value:  metricas?.vistas_perfil ?? 0,
      icon:   Eye,
      color:  "#5CB996",
      bg:     "#EBF7F2",
    },
    {
      label:  "Citas confirmadas",
      value:  metricas?.citas_confirmadas ?? 0,
      icon:   Calendar,
      color:  "#6D8339",
      bg:     "#F0F4E8",
    },
    {
      label:  "Citas completadas",
      value:  metricas?.citas_completadas ?? 0,
      icon:   CheckCircle,
      color:  "#3A8A6E",
      bg:     "#EBF7F2",
    },
    {
      label:  "Citas próximas",
      value:  metricas?.citas_proximas ?? 0,
      icon:   TrendingUp,
      color:  "#D97706",
      bg:     "#FEF3C7",
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-2xl" style={{ color: "var(--hl-text)" }}>
          Métricas
        </h1>
        <p className="text-sm font-sans text-gray-500 mt-1">
          Estadísticas de tu perfil y actividad
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-5 border shadow-sm"
            style={{ borderColor: "var(--hl-divider)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: bg }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="font-sans font-bold text-3xl mb-1" style={{ color: "var(--hl-text)" }}>
              {value}
            </p>
            <p className="text-xs font-sans text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {!prof && (
        <div
          className="rounded-2xl p-6 text-center border"
          style={{ background: "#FFFBEB", borderColor: "#FCD34D" }}
        >
          <p className="text-sm font-sans" style={{ color: "#92400E" }}>
            Tu perfil aún no está activo en el directorio. Contacta al equipo de Holizenter.
          </p>
        </div>
      )}
    </div>
  );
}
