export type TipoPrecio = "normal" | "oferta" | "precio_fijo";

export interface Variante {
  id:           string;
  nombre:       string;
  precio_extra: number;
  stock:        number;
}

export interface Producto {
  id:                   string;
  nombre:               string;
  slug:                 string;
  descripcion:          string | null;
  descripcion_corta:    string | null;
  precio:               number;
  precio_original:      number | null;
  precio_oferta:        number | null;
  tipo_precio:          TipoPrecio;
  fecha_inicio_oferta:  string | null;
  fecha_fin_oferta:     string | null;
  categoria:            string;
  imagen_url:           string | null;
  activo:               boolean;
  digital:              boolean;
  requiere_envio:       boolean;
  envio_gratis:         boolean;
  stock:                number;
  sku:                  string | null;
  peso_gramos:          number;
  largo_cm:             number;
  ancho_cm:             number;
  alto_cm:              number;
  archivo_url:          string | null;
  archivo_nombre:       string | null;
  archivo_tamano:       number | null;
  max_descargas:        number;
  dias_acceso:          number;
  variantes:            Variante[];
  imagen_alt:           string | null;
  meta_titulo:          string | null;
  meta_descripcion:     string | null;
  orden:                number;
  tags:                 string[];
  destacado:            boolean;
  created_at:           string;
  updated_at:           string;
}

export const CATEGORIA_LABELS: Record<string, string> = {
  cursos:            "Cursos online",
  materiales:        "Materiales y guías",
  merchandising:     "Productos físicos",
  talleres_grabados: "Talleres grabados",
  membresia:         "Membresía",
};

export const CATEGORIA_EMOJIS: Record<string, string> = {
  cursos:            "🎓",
  materiales:        "📄",
  merchandising:     "🎁",
  talleres_grabados: "🎥",
  membresia:         "⭐",
};

export function getPrecioEfectivo(p: Producto): number {
  if (p.tipo_precio === "oferta" && p.precio_oferta) {
    const ahora  = new Date();
    const inicio = p.fecha_inicio_oferta ? new Date(p.fecha_inicio_oferta) : null;
    const fin    = p.fecha_fin_oferta    ? new Date(p.fecha_fin_oferta)    : null;
    if ((!inicio || inicio <= ahora) && (!fin || fin >= ahora)) return p.precio_oferta;
  }
  return p.precio;
}

export function isOfertaActiva(p: Producto): boolean {
  if (p.tipo_precio !== "oferta" || !p.precio_oferta) return false;
  const ahora  = new Date();
  const inicio = p.fecha_inicio_oferta ? new Date(p.fecha_inicio_oferta) : null;
  const fin    = p.fecha_fin_oferta    ? new Date(p.fecha_fin_oferta)    : null;
  return (!inicio || inicio <= ahora) && (!fin || fin >= ahora);
}

export function descuentoPct(p: Producto): number | null {
  const base     = p.precio_original ?? p.precio;
  const efectivo = getPrecioEfectivo(p);
  if (efectivo >= base) return null;
  return Math.round((1 - efectivo / base) * 100);
}

// Backward-compat helpers (used by tienda pages)
export function calcularDescuento(precio: number, precioOriginal?: number | null): number | null {
  if (!precioOriginal || precioOriginal <= precio) return null;
  return Math.round(((precioOriginal - precio) / precioOriginal) * 100);
}

export function getLabelTipo(tipo: string): string {
  const labels: Record<string, string> = {
    curso_digital:      "🎓 Curso Digital",
    material_fisico:    "📚 Material",
    merchandising:      "🌿 Producto Físico",
    taller_grabado:     "🎥 Taller Grabado",
    membresia:          "⭐ Membresía",
    cursos:             "🎓 Cursos Online",
    materiales:         "📄 Materiales",
    talleres_grabados:  "🎥 Talleres Grabados",
  };
  return labels[tipo] ?? tipo;
}

export function formatPrecio(precio: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN", minimumFractionDigits: 0,
  }).format(precio);
}

export function getModalidadEnvio(p: Producto): string {
  if (!p.requiere_envio) return "Digital — acceso inmediato";
  if (p.envio_gratis)    return "Envío gratis a todo México";
  return "Envío a todo México";
}

