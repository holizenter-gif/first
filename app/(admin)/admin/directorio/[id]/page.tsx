export const dynamic = "force-dynamic";

import { createClient }               from "@/lib/supabase/server";
import { redirect, notFound }         from "next/navigation";
import Link                           from "next/link";
import { ArrowLeft }                  from "lucide-react";
import AdminPerfilEspecialistaEditor  from "@/components/admin/AdminPerfilEspecialistaEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarEspecialistaPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profesional } = await supabase
    .from("profesionales")
    .select("id, nombre, slug, especialidad, bio, bio_corta, filosofia, foto_url, modalidad, precio_base, experiencia_anos, tags, certificaciones, activo, orden, cal_username")
    .eq("id", id)
    .single();

  if (!profesional) notFound();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/directorio"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-sans text-2xl font-bold" style={{ color: "var(--hl-text)" }}>
            {profesional.nombre}
          </h1>
          <p className="font-sans text-sm mt-0.5" style={{ color: "var(--hl-text-muted)" }}>
            {profesional.especialidad ?? "Sin especialidad asignada"}
          </p>
        </div>
      </div>

      <AdminPerfilEspecialistaEditor profesional={profesional} />
    </div>
  );
}
