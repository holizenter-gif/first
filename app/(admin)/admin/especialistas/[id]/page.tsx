import { createClient }          from "@/lib/supabase/server";
import { redirect, notFound }    from "next/navigation";
import Link                      from "next/link";
import { ArrowLeft }             from "lucide-react";
import AccionesEspecialista      from "@/components/admin/AccionesEspecialista";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetalleEspecialistaPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: sol } = await supabase
    .from("solicitudes_especialistas")
    .select("*")
    .eq("id", id)
    .single();

  if (!sol) notFound();

  const ROWS = [
    { label: "Especialidad",    value: sol.especialidad              },
    { label: "Experiencia",     value: `${sol.experiencia_anos} años` },
    { label: "Certificaciones", value: sol.certificaciones           },
    { label: "WhatsApp",        value: sol.whatsapp                  },
    { label: "LinkedIn",        value: sol.linkedin                  },
    { label: "Sitio web",       value: sol.sitio_web                 },
  ].filter((r) => r.value);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/especialistas"
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-sans text-2xl font-bold" style={{ color: "var(--hl-text)" }}>
            {sol.nombre}
          </h1>
          <p className="text-gray-500 text-sm">{sol.email} · {sol.especialidad}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Datos */}
        <div className="md:col-span-2 space-y-4">
          {ROWS.map((row) => (
            <div
              key={row.label}
              className="bg-white rounded-xl p-4 border shadow-sm"
              style={{ borderColor: "var(--hl-divider)" }}
            >
              <p className="text-xs text-gray-400 font-sans mb-1">{row.label}</p>
              <p className="text-sm" style={{ color: "var(--hl-text)" }}>{row.value}</p>
            </div>
          ))}

          {sol.bio && (
            <div
              className="bg-white rounded-xl p-4 border shadow-sm"
              style={{ borderColor: "var(--hl-divider)" }}
            >
              <p className="text-xs text-gray-400 font-sans mb-1">Bio</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--hl-text)" }}>
                {sol.bio}
              </p>
            </div>
          )}

          {sol.motivacion && (
            <div
              className="rounded-xl p-4 border"
              style={{ background: "#EBF7F2", borderColor: "rgba(92,185,150,0.3)" }}
            >
              <p className="text-xs font-sans mb-1" style={{ color: "#5CB996" }}>
                Motivación para unirse
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--hl-text)" }}>
                {sol.motivacion}
              </p>
            </div>
          )}
        </div>

        {/* Panel de acciones */}
        <div>
          <AccionesEspecialista solicitud={sol} />
        </div>
      </div>
    </div>
  );
}
