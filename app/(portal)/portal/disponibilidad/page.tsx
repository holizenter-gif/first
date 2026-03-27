import { createClient }        from "@/lib/supabase/server";
import { redirect }            from "next/navigation";
import DisponibilidadEditor    from "@/components/portal/DisponibilidadEditor";

export const dynamic    = "force-dynamic";
export const revalidate = 0;

export default async function PortalDisponibilidadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: prof } = await supabase
    .from("profesionales")
    .select("id, nombre, modalidad, disponibilidad")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-2xl" style={{ color: "var(--hl-text)" }}>
          Disponibilidad
        </h1>
        <p className="text-sm font-sans text-gray-500 mt-1">
          Configura tus días y horarios disponibles para citas
        </p>
      </div>
      <DisponibilidadEditor profesionalId={prof?.id ?? null} disponibilidad={prof?.disponibilidad ?? null} />
    </div>
  );
}
