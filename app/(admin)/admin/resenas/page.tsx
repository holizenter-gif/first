import { createClient }   from "@/lib/supabase/server";
import { redirect }        from "next/navigation";
import Link                from "next/link";
import { Star, ArrowLeft } from "lucide-react";
import AccionesResena      from "@/components/admin/AccionesResena";

export const dynamic    = "force-dynamic";
export const revalidate = 0;

interface Props {
  searchParams: Promise<{ producto?: string; estado?: string }>;
}

function EstrellasStatic({ valor }: { valor: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((n) => (
        <Star
          key={n}
          className="w-3 h-3"
          fill={n <= valor ? "#F59E0B" : "none"}
          stroke={n <= valor ? "#F59E0B" : "#D1D5DB"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

export default async function AdminResenasPage({ searchParams }: Props) {
  const { producto: productoFiltro, estado: estadoFiltro } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  let query = supabase
    .from("resenas")
    .select("id, nombre, calificacion, comentario, aprobada, created_at, producto_id, productos(nombre, slug)")
    .order("created_at", { ascending: false });

  if (productoFiltro) query = query.eq("producto_id", productoFiltro);
  if (estadoFiltro === "pendientes") query = query.eq("aprobada", false);
  if (estadoFiltro === "aprobadas")  query = query.eq("aprobada", true);

  const { data: resenas } = await query.limit(100);

  const total      = resenas?.length ?? 0;
  const pendientes = (resenas ?? []).filter((r) => !r.aprobada).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/tienda" className="text-gray-400 hover:text-brand-dark transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Reseñas</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {total} reseñas · {pendientes} pendientes de aprobación
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { label: "Todas",      href: "/admin/resenas" },
          { label: "Pendientes", href: "/admin/resenas?estado=pendientes" },
          { label: "Aprobadas",  href: "/admin/resenas?estado=aprobadas" },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="px-4 py-1.5 rounded-full text-xs font-display font-semibold border transition-colors"
            style={{
              background: "white",
              borderColor: "#E5E7EB",
              color: "#6B7280",
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {(resenas ?? []).length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No hay reseñas{estadoFiltro ? " con este filtro" : ""}.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {(resenas ?? []).map((r) => {
              const prod = Array.isArray(r.productos) ? r.productos[0] : r.productos;
              return (
                <div key={r.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-display font-semibold text-sm text-brand-dark">{r.nombre}</p>
                        <EstrellasStatic valor={r.calificacion} />
                        <span
                          className="text-xs font-display px-2 py-0.5 rounded-full"
                          style={{
                            background: r.aprobada ? "#EBF7F2" : "#FEF3C7",
                            color:      r.aprobada ? "#5CB996"  : "#D97706",
                          }}
                        >
                          {r.aprobada ? "Aprobada" : "Pendiente"}
                        </span>
                      </div>
                      {prod && (
                        <p className="text-xs text-gray-400 mb-2">
                          Producto:{" "}
                          <Link href={`/tienda/${prod.slug}`} target="_blank" className="hover:underline text-brand-teal">
                            {prod.nombre}
                          </Link>
                        </p>
                      )}
                      <p className="font-sans text-sm text-gray-600 leading-relaxed">{r.comentario}</p>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {new Date(r.created_at).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <AccionesResena id={r.id} aprobada={r.aprobada} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
