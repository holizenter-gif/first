export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect }     from "next/navigation";
import Link             from "next/link";
import { ArrowLeft }    from "lucide-react";
import EventoForm       from "@/components/admin/EventoForm";

export default async function NuevoEventoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/eventos" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-sans text-2xl font-bold" style={{ color: "var(--hl-text)" }}>
            Nuevo evento
          </h1>
          <p className="font-sans text-sm mt-0.5" style={{ color: "var(--hl-text-muted)" }}>
            Se publicará en /eventos al activarlo
          </p>
        </div>
      </div>
      <EventoForm />
    </div>
  );
}
