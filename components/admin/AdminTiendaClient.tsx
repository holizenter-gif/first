"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Edit, Eye, EyeOff, Package, Star,
  Search, CheckSquare, Square, ToggleLeft, ToggleRight,
} from "lucide-react";
import { CATEGORIA_LABELS, formatPrecio, getPrecioEfectivo } from "@/lib/data/productos-helpers";
import type { Producto } from "@/lib/data/productos-helpers";

interface Props { productos: Producto[] }

export default function AdminTiendaClient({ productos }: Props) {
  const router              = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busqueda,  setBusqueda]  = useState("");
  const [selected,  setSelected]  = useState<Set<string>>(new Set());
  const [applying,  setApplying]  = useState(false);

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return productos;
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        (p.sku ?? "").toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }, [productos, busqueda]);

  const todosSeleccionados =
    filtrados.length > 0 && filtrados.every((p) => selected.has(p.id));

  const toggleTodos = () => {
    if (todosSeleccionados) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtrados.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtrados.forEach((p) => next.add(p.id));
        return next;
      });
    }
  };

  const toggleProducto = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const aplicarBulk = async (activo: boolean) => {
    const ids = [...selected];
    if (ids.length === 0) return;
    setApplying(true);
    try {
      const res = await fetch("/api/admin/productos/bulk", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ids, activo }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      setSelected(new Set());
      startTransition(() => router.refresh());
    } catch {
      alert("Error al aplicar la acción masiva. Intenta de nuevo.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div>
      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o slug…"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setSelected(new Set()); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-teal bg-white"
          />
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-display whitespace-nowrap">
              {selected.size} seleccionado{selected.size !== 1 ? "s" : ""}
            </span>
            <button
              onClick={() => aplicarBulk(true)}
              disabled={applying || isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-display font-semibold text-white transition-colors disabled:opacity-50"
              style={{ background: "#5CB996" }}
            >
              <ToggleRight className="w-4 h-4" />
              Activar
            </button>
            <button
              onClick={() => aplicarBulk(false)}
              disabled={applying || isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-display font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              <ToggleLeft className="w-4 h-4" />
              Desactivar
            </button>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 w-10">
                  <button onClick={toggleTodos} className="text-gray-400 hover:text-brand-teal transition-colors">
                    {todosSeleccionados
                      ? <CheckSquare className="w-4 h-4 text-brand-teal" />
                      : <Square className="w-4 h-4" />}
                  </button>
                </th>
                {["Producto", "Categoría", "Precio", "Stock", "Tipo", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-display font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                    {busqueda ? `Sin resultados para "${busqueda}"` : "No hay productos."}
                  </td>
                </tr>
              ) : filtrados.map((p) => {
                const precioEfectivo = getPrecioEfectivo(p);
                const checked = selected.has(p.id);
                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-gray-50 transition-colors ${checked ? "bg-brand-teal-50/30" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <button onClick={() => toggleProducto(p.id)} className="text-gray-400 hover:text-brand-teal transition-colors">
                        {checked
                          ? <CheckSquare className="w-4 h-4 text-brand-teal" />
                          : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="font-display font-semibold text-brand-dark text-sm truncate">{p.nombre}</p>
                      <p className="text-gray-400 text-xs mt-0.5 truncate">
                        /{p.slug}{p.sku ? ` · ${p.sku}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-display font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        {CATEGORIA_LABELS[p.categoria] ?? p.categoria}
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
                      <span className="text-xs text-gray-500">{p.digital ? "Digital" : "Físico"}</span>
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
                        <Link href={`/admin/resenas?producto=${p.id}`} className="text-amber-500 hover:text-amber-600 text-xs font-display flex items-center gap-1">
                          <Star className="w-3 h-3" /> Reseñas
                        </Link>
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
