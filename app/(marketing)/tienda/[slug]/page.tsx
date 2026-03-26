import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Clock, Star } from "lucide-react";
import { getProductoBySlug, getLabelTipo, calcularDescuento } from "@/lib/data/productos-helpers";
import { PRODUCTOS_MOCK } from "@/lib/data/productos-mock";
import AgregarCarritoBtn from "@/components/tienda/AgregarCarritoBtn";
import ProductoCard from "@/components/tienda/ProductoCard";

const TIPO_EMOJI: Record<string, string> = {
  curso_digital:   "🎓",
  material_fisico: "📚",
  merchandising:   "🌿",
  taller_grabado:  "🎥",
  membresia:       "⭐",
};

const NIVEL_LABEL: Record<string, string> = {
  basico:      "Básico",
  intermedio:  "Intermedio",
  avanzado:    "Avanzado",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = getProductoBySlug(slug);
  if (!producto) return { title: "Producto no encontrado" };
  return {
    title: `${producto.nombre} — Tienda Holizenter`,
    description: producto.descripcion,
  };
}

export async function generateStaticParams() {
  return PRODUCTOS_MOCK.map((p) => ({ slug: p.slug }));
}

export default async function ProductoDetallePage({ params }: Props) {
  const { slug } = await params;
  const producto = getProductoBySlug(slug);
  if (!producto) notFound();

  const descuento = calcularDescuento(producto.precio, producto.precio_original);
  const relacionados = PRODUCTOS_MOCK.filter(
    (p) => p.activo && p.categoria_slug === producto.categoria_slug && p.id !== producto.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-400 font-sans">
          <Link href="/tienda" className="hover:text-brand-teal transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Tienda
          </Link>
          <span>/</span>
          <span style={{ color: "#0D1A0F" }} className="font-medium truncate">{producto.nombre}</span>
        </div>
      </div>

      {/* Producto principal */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">

          {/* Imagen */}
          <div
            className="rounded-2xl flex items-center justify-center aspect-square max-h-96 text-8xl"
            style={{ background: "#EBF7F2" }}
          >
            {TIPO_EMOJI[producto.tipo] ?? "🛍️"}
          </div>

          {/* Info */}
          <div>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#EBF7F2", color: "#5CB996" }}
            >
              {getLabelTipo(producto.tipo)}
            </span>

            <h1
              className="font-display font-bold mb-3"
              style={{ fontSize: "clamp(22px,3vw,32px)", color: "#0D1A0F" }}
            >
              {producto.nombre}
            </h1>

            <p className="font-sans text-base leading-relaxed text-gray-600 mb-6">
              {producto.descripcion_larga}
            </p>

            {/* Detalles rápidos */}
            <div className="flex flex-wrap gap-3 mb-6">
              {producto.duracion_horas && (
                <span
                  className="flex items-center gap-1.5 text-xs font-sans font-medium px-3 py-1.5 rounded-full"
                  style={{ background: "#F5F2EC", color: "#6B7280" }}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {producto.duracion_horas}h de contenido
                </span>
              )}
              {producto.nivel && (
                <span
                  className="text-xs font-sans font-medium px-3 py-1.5 rounded-full"
                  style={{ background: "#F5F2EC", color: "#6B7280" }}
                >
                  Nivel: {NIVEL_LABEL[producto.nivel]}
                </span>
              )}
              {producto.instructor && (
                <span
                  className="text-xs font-sans font-medium px-3 py-1.5 rounded-full"
                  style={{ background: "#F5F2EC", color: "#6B7280" }}
                >
                  Instructor: {producto.instructor}
                </span>
              )}
              {producto.requiere_envio && (
                <span
                  className="text-xs font-sans font-medium px-3 py-1.5 rounded-full"
                  style={{ background: "#FFF7ED", color: "#D97706" }}
                >
                  Producto físico — envío incluido CDMX
                </span>
              )}
            </div>

            {/* Precio + CTA */}
            <div
              className="p-5 rounded-2xl border border-gray-100 mb-6"
              style={{ background: "#F9FAFB" }}
            >
              <div className="flex items-end gap-3 mb-4">
                <span className="font-display font-bold text-3xl" style={{ color: "#0D1A0F" }}>
                  ${producto.precio.toLocaleString("es-MX")}
                </span>
                {producto.precio_original && (
                  <span className="text-base text-gray-400 line-through mb-0.5">
                    ${producto.precio_original.toLocaleString("es-MX")}
                  </span>
                )}
                <span className="text-sm text-gray-400 mb-0.5">MXN</span>
                {descuento && (
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full text-white mb-0.5"
                    style={{ background: "#E53E3E" }}
                  >
                    -{descuento}% OFF
                  </span>
                )}
              </div>
              <AgregarCarritoBtn
                producto={producto}
                variant="primary"
                className="w-full py-3.5 text-base"
                label="Agregar al carrito"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {producto.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-sans px-2.5 py-1 rounded-full"
                  style={{ background: "#EBF7F2", color: "#3A8A6E" }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Incluye */}
      {producto.incluye && producto.incluye.length > 0 && (
        <section className="py-10 px-4" style={{ background: "#F5F2EC" }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-xl mb-6" style={{ color: "#0D1A0F" }}>
              ¿Qué incluye?
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {producto.incluye.map((item) => (
                <div key={item} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "#5CB996" }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-sans text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-xl mb-6" style={{ color: "#0D1A0F" }}>
              También te puede interesar
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relacionados.map((p) => (
                <ProductoCard key={p.id} producto={p} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
