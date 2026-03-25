import { PRODUCTOS_MOCK, CATEGORIAS } from "@/lib/data/productos-mock";
import type { Producto, ProductoTipo } from "@/lib/supabase/types";

export function getProductoBySlug(slug: string): Producto | undefined {
  return PRODUCTOS_MOCK.find((p) => p.slug === slug);
}

export function getProductosByCategoria(categoriaSlug: string): Producto[] {
  if (categoriaSlug === "todos") return PRODUCTOS_MOCK.filter((p) => p.activo);
  return PRODUCTOS_MOCK.filter((p) => p.activo && p.categoria_slug === categoriaSlug);
}

export function getProductosDestacados(): Producto[] {
  return PRODUCTOS_MOCK.filter((p) => p.activo && p.destacado);
}

export function getProductosByTipo(tipo: ProductoTipo): Producto[] {
  return PRODUCTOS_MOCK.filter((p) => p.activo && p.tipo === tipo);
}

export function calcularDescuento(precio: number, precioOriginal?: number): number | null {
  if (!precioOriginal || precioOriginal <= precio) return null;
  return Math.round(((precioOriginal - precio) / precioOriginal) * 100);
}

export function getLabelTipo(tipo: ProductoTipo): string {
  const labels: Record<ProductoTipo, string> = {
    curso_digital:   "🎓 Curso Digital",
    material_fisico: "📚 Material",
    merchandising:   "🌿 Producto Físico",
    taller_grabado:  "🎥 Taller Grabado",
    membresia:       "⭐ Membresía",
  };
  return labels[tipo];
}
