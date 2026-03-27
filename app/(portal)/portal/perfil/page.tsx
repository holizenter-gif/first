import { createClient } from "@/lib/supabase/server";
import { redirect }     from "next/navigation";
import PerfilEditor     from "@/components/portal/PerfilEditor";

export const dynamic    = "force-dynamic";
export const revalidate = 0;

export default async function PortalPerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: prof } = await supabase
    .from("profesionales")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-2xl" style={{ color: "var(--hl-text)" }}>
          Mi perfil
        </h1>
        <p className="text-sm font-sans text-gray-500 mt-1">
          Esta información aparece en el directorio de Holizenter
        </p>
      </div>
      <PerfilEditor profesional={prof} userId={user.id} />
    </div>
  );
}
