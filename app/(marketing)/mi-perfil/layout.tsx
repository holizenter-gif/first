import { redirect }     from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MiPerfilTabs     from "@/components/mi-perfil/MiPerfilTabs";

export default async function MiPerfilLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <MiPerfilTabs>{children}</MiPerfilTabs>;
}
