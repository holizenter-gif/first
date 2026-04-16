import { createClient }      from "@/lib/supabase/server";
import { redirect }           from "next/navigation";
import Link                   from "next/link";
import { Plus }               from "lucide-react";
import type { Producto }      from "@/lib/data/productos-helpers";
import AdminTiendaClient      from "@/components/admin/AdminTiendaClient";

export const dynamic    = "force-dynamic";
export const revalidate = 0;

export default async function AdminTiendaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .order("orden", { ascending: true });

  const { data: configEnvio } = await supabase
    .from("config_envios")
    .select("*")
    .single();

  const lista    = (productos ?? []) as Producto[];
  const activos   = lista.filter((p) => p.activo).length;
  const inactivos = lista.length - activos;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Tienda</h1>
          <p className="text-gray-500 text-sm mt-1">{activos} activos · {inactivos} inactivos</p>
        </div>
        <Link
          href="/admin/tienda/nuevo"
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo producto
        </Link>
      </div>

      <AdminTiendaClient productos={lista} />

      {/* Config envíos */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-brand-dark">Configuración de envíos</h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Solo aplica a productos físicos. Los digitales siempre son gratis.
            </p>
          </div>
          <span className="text-xs font-display font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-500">
            {configEnvio?.envio_gratis_activo ? "Envío gratis activo" : "Envío gratis desactivado"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-brand-beige rounded-xl p-4 text-center">
            <p className="text-gray-500 text-xs mb-1">Costo estándar</p>
            <p className="font-display font-bold text-brand-dark text-2xl">
              ${configEnvio?.costo_estandar ?? 199} MXN
            </p>
            <p className="text-gray-400 text-xs mt-1">Por envío · Todo México</p>
          </div>
          <div className="bg-brand-beige rounded-xl p-4 text-center">
            <p className="text-gray-500 text-xs mb-1">Umbral envío gratis</p>
            <p className="font-display font-bold text-brand-dark text-2xl">
              ${configEnvio?.umbral_gratis ?? 1000} MXN
            </p>
            <p className="text-gray-400 text-xs mt-1">Solo en productos físicos</p>
          </div>
          <div className="bg-brand-beige rounded-xl p-4 text-center">
            <p className="text-gray-500 text-xs mb-1">Estado actual</p>
            <p className="font-display font-bold text-gray-400 text-sm mt-2">
              {configEnvio?.envio_gratis_activo ? "Activo" : "Desactivado"}
            </p>
            <p className="text-gray-400 text-xs">Activar en Supabase cuando sea necesario</p>
          </div>
        </div>
      </div>
    </div>
  );
}
