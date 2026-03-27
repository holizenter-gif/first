"use client";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import ProductoCard from "@/components/tienda/ProductoCard";
import { PRODUCTOS_MOCK, CATEGORIAS } from "@/lib/data/productos-mock";

const TODAS = { id: "0", nombre: "Todos", slug: "todos", descripcion: "", icono: "🛍️", orden: 0 };
const CATS = [TODAS, ...CATEGORIAS];

export default function TiendaPage() {
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const productos = useMemo(() => {
    let lista = PRODUCTOS_MOCK.filter((p) => p.activo);
    if (categoriaActiva !== "todos") {
      lista = lista.filter((p) => p.categoria === categoriaActiva);
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          (p.descripcion ?? "").toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return lista;
  }, [categoriaActiva, busqueda]);

  const destacados = PRODUCTOS_MOCK.filter((p) => p.activo && p.destacado);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="px-4 pt-10 pb-12" style={{ background: "#0D1A0F" }}>
        <div className="max-w-5xl mx-auto text-center">
          <span
            className="inline-block text-xs font-display font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(92,185,150,0.15)", color: "#5CB996" }}
          >
            Tienda Holizenter
          </span>
          <h1
            className="font-display font-bold text-white mb-3"
            style={{ fontSize: "clamp(28px,4vw,48px)" }}
          >
            Recursos para tu bienestar integral
          </h1>
          <p className="font-sans max-w-xl mx-auto text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
            Cursos digitales, materiales descargables, kits físicos y membresías para individuos y empresas.
          </p>

          {/* Buscador */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, tema o categoría…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white font-sans text-sm text-gray-800 outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="sticky top-16 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-3 whitespace-nowrap">
            {CATS.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategoriaActiva(cat.slug)}
                className="px-4 py-2 rounded-full text-sm font-display font-medium transition-all"
                style={
                  categoriaActiva === cat.slug
                    ? { background: "#5CB996", color: "#fff" }
                    : { background: "#F5F2EC", color: "#6B7280" }
                }
              >
                {cat.icono} {cat.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destacados — solo cuando está en "todos" sin búsqueda */}
      {categoriaActiva === "todos" && !busqueda && (
        <section className="py-10 px-4" style={{ background: "#F5F2EC" }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-xl mb-6" style={{ color: "#0D1A0F" }}>
              ⭐ Más populares
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {destacados.map((p) => (
                <ProductoCard key={p.id} producto={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catálogo */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {categoriaActiva !== "todos" || busqueda ? (
            <h2 className="font-display font-bold text-xl mb-6" style={{ color: "#0D1A0F" }}>
              {busqueda
                ? `Resultados para "${busqueda}"`
                : CATS.find((c) => c.slug === categoriaActiva)?.nombre}
              <span className="ml-2 text-sm font-normal text-gray-400">({productos.length})</span>
            </h2>
          ) : (
            <h2 className="font-display font-bold text-xl mb-6" style={{ color: "#0D1A0F" }}>
              Todo el catálogo
              <span className="ml-2 text-sm font-normal text-gray-400">({productos.length})</span>
            </h2>
          )}

          {productos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 font-sans">No encontramos productos con esos filtros.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {productos.map((p) => (
                <ProductoCard key={p.id} producto={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA membresía */}
      <section className="py-14 px-4" style={{ background: "#0D1A0F" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-white text-2xl mb-3">
            ¿Quieres acceso a todo?
          </h2>
          <p className="font-sans text-base mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
            La membresía Club Holizenter te da acceso ilimitado a cursos, talleres y descuentos exclusivos.
          </p>
          <a
            href="/tienda/membresia-mensual"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-display font-semibold text-white transition-colors"
            style={{ background: "#5CB996" }}
          >
            Ver membresías →
          </a>
        </div>
      </section>
    </div>
  );
}
