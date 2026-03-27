import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, PackageX } from "lucide-react";
import { getProductoBySlug } from "@/lib/data/productos-server";
import {
  getLabelTipo,
  getPrecioEfectivo,
  descuentoPct,
  formatPrecio,
  getModalidadEnvio,
} from "@/lib/data/productos-helpers";
import AgregarCarritoBtn from "@/components/tienda/AgregarCarritoBtn";
import ProductoCard from "@/components/tienda/ProductoCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) return { title: "Producto no disponible — Tienda Holizenter" };
  return {
    title: `${producto.meta_titulo ?? producto.nombre} — Tienda Holizenter`,
    description: producto.meta_descripcion ?? producto.descripcion_corta ?? producto.descripcion ?? undefined,
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function ProductoDetallePage({ params }: Props) {
  const { slug } = await params;

  let producto = null;
  try {
    producto = await getProductoBySlug(slug);
  } catch {
    // DB error — fall through to unavailable state
  }

  // ── Producto no encontrado o no disponible ───────────────────────────────
  if (!producto) {
    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-400 font-sans">
            <Link href="/tienda" className="hover:text-brand-teal transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Tienda
            </Link>
          </div>
        </div>

        {/* Estado no disponible */}
        <div className="flex items-center justify-center px-4 py-24">
          <div className="max-w-md w-full text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "#F5F2EC" }}
            >
              <PackageX className="w-9 h-9" style={{ color: "#5CB996" }} />
            </div>
            <h1
              className="font-display font-bold text-2xl mb-3"
              style={{ color: "#0D1A0F" }}
            >
              Producto no disponible
            </h1>
            <p className="font-sans text-base text-gray-500 mb-2 leading-relaxed">
              Este producto está agotado o ya no se encuentra disponible por el momento.
            </p>
            <p className="font-sans text-sm text-gray-400 mb-8">
              Puede que regrese próximamente. Mientras tanto, explora el resto de nuestro catálogo.
            </p>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-display font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#5CB996" }}
            >
              Ver catálogo completo →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Producto encontrado ──────────────────────────────────────────────────
  const pEfectivo = getPrecioEfectivo(producto);
  const dscto     = descuentoPct(producto);
  const relacionados: typeof producto[] = [];

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
            className="rounded-2xl overflow-hidden flex items-center justify-center aspect-square max-h-96"
            style={{ background: "#EBF7F2" }}
          >
            {producto.imagen_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover" />
            ) : (
              <span className="text-8xl">🛍️</span>
            )}
          </div>

          {/* Info */}
          <div>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#EBF7F2", color: "#5CB996" }}
            >
              {getLabelTipo(producto.categoria)}
            </span>

            <h1
              className="font-display font-bold mb-3"
              style={{ fontSize: "clamp(22px,3vw,32px)", color: "#0D1A0F" }}
            >
              {producto.nombre}
            </h1>

            {producto.descripcion_corta && (
              <p className="font-sans text-base leading-relaxed text-gray-600 mb-4">
                {producto.descripcion_corta}
              </p>
            )}

            {producto.descripcion && (
              <p className="font-sans text-sm leading-relaxed text-gray-500 mb-6">
                {producto.descripcion}
              </p>
            )}

            {/* Detalles rápidos */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span
                className="text-xs font-sans font-medium px-3 py-1.5 rounded-full"
                style={{ background: "#F5F2EC", color: "#6B7280" }}
              >
                {getModalidadEnvio(producto)}
              </span>
              {producto.digital && producto.dias_acceso > 0 && (
                <span
                  className="text-xs font-sans font-medium px-3 py-1.5 rounded-full"
                  style={{ background: "#F5F2EC", color: "#6B7280" }}
                >
                  Acceso {producto.dias_acceso} días
                </span>
              )}
              {producto.sku && (
                <span
                  className="text-xs font-sans font-medium px-3 py-1.5 rounded-full"
                  style={{ background: "#F5F2EC", color: "#6B7280" }}
                >
                  SKU: {producto.sku}
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
                  {formatPrecio(pEfectivo)}
                </span>
                {dscto !== null && producto.precio_original && (
                  <span className="text-base text-gray-400 line-through mb-0.5">
                    {formatPrecio(producto.precio_original)}
                  </span>
                )}
                {dscto !== null && (
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full text-white mb-0.5"
                    style={{ background: "#E53E3E" }}
                  >
                    -{dscto}% OFF
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
            {producto.tags.length > 0 && (
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
            )}
          </div>
        </div>
      </section>

      {/* Variantes */}
      {producto.variantes.length > 0 && (
        <section className="py-10 px-4" style={{ background: "#F5F2EC" }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-xl mb-6" style={{ color: "#0D1A0F" }}>
              Variantes disponibles
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {producto.variantes.map((v) => (
                <div key={v.id} className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <span className="font-sans text-sm text-gray-700">{v.nombre}</span>
                  {v.precio_extra > 0 && (
                    <span className="text-xs font-semibold" style={{ color: "#5CB996" }}>
                      +{formatPrecio(v.precio_extra)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Digital notice */}
      {producto.digital && producto.archivo_url && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="flex items-start gap-4 p-5 rounded-2xl border"
              style={{ background: "#EBF7F2", borderColor: "#5CB996" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#5CB996" }}
              >
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-sans font-semibold text-sm" style={{ color: "#0D1A0F" }}>
                  Producto digital — descarga inmediata
                </p>
                {producto.archivo_nombre && (
                  <p className="font-sans text-xs text-gray-500 mt-1">
                    Archivo: {producto.archivo_nombre}
                    {producto.archivo_tamano && ` (${(producto.archivo_tamano / 1024 / 1024).toFixed(1)} MB)`}
                  </p>
                )}
                <p className="font-sans text-xs text-gray-500 mt-0.5">
                  Recibirás el enlace de descarga por correo y en tu cuenta.
                </p>
              </div>
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
