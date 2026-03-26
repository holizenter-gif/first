import { createClient }    from "@/lib/supabase/server";
import { redirect }        from "next/navigation";
import Link                from "next/link";
import { Plus, Eye, EyeOff, Edit, Globe } from "lucide-react";
import { CATEGORIA_LABELS, CATEGORIA_COLORS } from "@/lib/blog";

export const dynamic    = "force-dynamic";
export const revalidate = 0;

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: articulos } = await supabase
    .from("articulos")
    .select("*")
    .order("created_at", { ascending: false });

  const publicados = (articulos ?? []).filter((a) => a.publicado).length;
  const borradores = (articulos ?? []).length - publicados;

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Blog</h1>
          <p className="text-gray-500 text-sm mt-1">
            {publicados} publicados · {borradores} borradores
          </p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm shadow-brand-teal/20 text-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo artículo
        </Link>
      </div>

      {/* Tabla de artículos */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Título", "Categoría", "Autor", "Quiz", "Vistas", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(articulos ?? []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                    No hay artículos aún.{" "}
                    <Link href="/admin/blog/nuevo" className="text-brand-teal underline">
                      Crear el primero →
                    </Link>
                  </td>
                </tr>
              ) : (articulos ?? []).map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 max-w-[260px]">
                    <p className="font-display font-semibold text-brand-dark text-sm truncate">{a.titulo}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">/{a.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-display font-medium px-2.5 py-1 rounded-full ${CATEGORIA_COLORS[a.categoria] ?? "bg-gray-100 text-gray-600"}`}>
                      {CATEGORIA_LABELS[a.categoria] ?? a.categoria}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{a.autor}</td>
                  <td className="px-4 py-3">
                    {a.quiz_id ? (
                      <span className="bg-brand-teal-50 text-brand-teal text-xs font-display px-2 py-0.5 rounded-full">
                        {a.quiz_id}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-gray-400" /> {a.vistas}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-display font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${
                      a.publicado
                        ? "bg-brand-teal-50 text-brand-teal"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {a.publicado ? <Globe className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {a.publicado ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blog/${a.id}/editar`}
                        className="text-brand-teal hover:underline text-xs font-display flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" /> Editar
                      </Link>
                      {a.publicado && (
                        <Link
                          href={`/blog/${a.slug}`}
                          target="_blank"
                          className="text-gray-400 hover:text-brand-dark text-xs font-display flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Ver
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
