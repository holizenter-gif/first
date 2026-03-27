import { createClient }    from "@/lib/supabase/server";
import { redirect }        from "next/navigation";
import Link                from "next/link";
import { Plus, Eye, EyeOff, Edit, Package } from "lucide-react";
import { CATEGORIA_LABELS, CATEGORIA_EMOJIS, formatPrecio, getPrecioEfectivo } from "@/lib/data/productos-helpers";
import type { Producto } from "@/lib/data/productos-helpers";

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

  const activos   = (productos ?? []).filter((p) => p.activo).length;
  const inactivos = (productos ?? []).length - activos;

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

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Producto", "Categoría", "Precio", "Stock", "Tipo", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(productos ?? []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                    No hay productos.{" "}
                    <Link href="/admin/tienda/nuevo" className="text-brand-teal underline">Crear el primero →</Link>
                  </td>
                </tr>
              ) : (productos as Producto[]).map((p) => {
                const precioEfectivo = getPrecioEfectivo(p);
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="font-display font-semibold text-brand-dark text-sm truncate">{p.nombre}</p>
                      <p className="text-gray-400 text-xs mt-0.5 truncate">/{p.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-display font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        {CATEGORIA_EMOJIS[p.categoria] ?? "📦"} {CATEGORIA_LABELS[p.categoria] ?? p.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-display font-bold text-brand-teal text-sm">{formatPrecio(precioEfectivo)}</p>
                      {p.tipo_precio === "oferta" && p.precio_oferta && (
                        <p className="text-gray-400 text-xs line-through">{formatPrecio(p.precio)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {p.stock >= 999 ? "∞" : p.stock}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs">{p.digital ? "📱 Digital" : "📦 Físico"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-display font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${p.activo ? "bg-brand-teal-50 text-brand-teal" : "bg-gray-100 text-gray-500"}`}>
                        {p.activo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/tienda/${p.id}/editar`} className="text-brand-teal hover:underline text-xs font-display flex items-center gap-1">
                          <Edit className="w-3 h-3" /> Editar
                        </Link>
                        {p.activo && (
                          <Link href={`/tienda/${p.slug}`} target="_blank" className="text-gray-400 hover:text-brand-dark text-xs font-display flex items-center gap-1">
                            <Package className="w-3 h-3" /> Ver
                          </Link>
                        )}
                      </div>
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
