"use client";

import { useState, useRef }  from "react";
import { useRouter }          from "next/navigation";
import {
  Loader2, Upload, X, Plus, Trash2,
  Package, FileDigit, Truck, Tag,
  ChevronDown, ChevronUp,
} from "lucide-react";
import type { Producto, Variante } from "@/lib/data/productos-helpers";

const CATEGORIAS = [
  { value: "cursos",            label: "Cursos online"       },
  { value: "materiales",        label: "Materiales y guías"  },
  { value: "merchandising",     label: "Productos físicos"   },
  { value: "talleres_grabados", label: "Talleres grabados"   },
  { value: "membresia",         label: "Membresía"           },
];

const TIPOS_PRECIO = [
  { value: "normal",      label: "Precio normal",               desc: "El precio siempre es el mismo"          },
  { value: "oferta",      label: "Precio en oferta",            desc: "Precio especial con fechas opcionales"  },
  { value: "precio_fijo", label: "Precio fijo",                 desc: "Comunica que el precio no tiene descuento" },
];

const SECCIONES = [
  { id: "basico",     label: "Información básica",  icon: Tag       },
  { id: "precio",     label: "Precios y oferta",    icon: Tag       },
  { id: "inventario", label: "Inventario y stock",  icon: Package   },
  { id: "envio",      label: "Envío y dimensiones", icon: Truck     },
  { id: "digital",    label: "Archivo digital",     icon: FileDigit },
  { id: "variantes",  label: "Variantes",           icon: Package   },
  { id: "seo",        label: "SEO",                 icon: Tag       },
] as const;

interface ProductoEditorFormProps {
  producto?: Partial<Producto>;
  modo:      "crear" | "editar";
}

export default function ProductoEditorForm({ producto, modo }: ProductoEditorFormProps) {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [nombre,         setNombre]         = useState(producto?.nombre            ?? "");
  const [slug,           setSlug]           = useState(producto?.slug              ?? "");
  const [descripcion,    setDescripcion]    = useState(producto?.descripcion       ?? "");
  const [descCorta,      setDescCorta]      = useState(producto?.descripcion_corta ?? "");
  const [categoria,      setCategoria]      = useState(producto?.categoria         ?? "cursos");
  const [sku,            setSku]            = useState(producto?.sku               ?? "");
  const [orden,          setOrden]          = useState(producto?.orden             ?? 99);
  const [precio,         setPrecio]         = useState(producto?.precio            ?? 0);
  const [precioOrig,     setPrecioOrig]     = useState<string | number>(producto?.precio_original  ?? "");
  const [tipoPrecio,     setTipoPrecio]     = useState(producto?.tipo_precio       ?? "normal");
  const [precioOferta,   setPrecioOferta]   = useState<string | number>(producto?.precio_oferta    ?? "");
  const [fechaInicio,    setFechaInicio]    = useState(producto?.fecha_inicio_oferta ?? "");
  const [fechaFin,       setFechaFin]       = useState(producto?.fecha_fin_oferta    ?? "");
  const [activo,         setActivo]         = useState(producto?.activo            ?? true);
  const [stock,          setStock]          = useState(producto?.stock             ?? 999);
  const [digital,        setDigital]        = useState(producto?.digital           ?? true);
  const [requiereEnvio,  setRequiereEnvio]  = useState(producto?.requiere_envio    ?? false);
  const [envioGratis,    setEnvioGratis]    = useState(producto?.envio_gratis      ?? false);
  const [pesoGramos,     setPesoGramos]     = useState(producto?.peso_gramos       ?? 0);
  const [largoCm,        setLargoCm]        = useState(producto?.largo_cm          ?? 0);
  const [anchoCm,        setAnchoCm]        = useState(producto?.ancho_cm          ?? 0);
  const [altoCm,         setAltoCm]         = useState(producto?.alto_cm           ?? 0);
  const [archivoUrl,     setArchivoUrl]     = useState(producto?.archivo_url       ?? "");
  const [archivoNombre,  setArchivoNombre]  = useState(producto?.archivo_nombre    ?? "");
  const [maxDescargas,   setMaxDescargas]   = useState(producto?.max_descargas     ?? 3);
  const [diasAcceso,     setDiasAcceso]     = useState(producto?.dias_acceso       ?? 365);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading,      setUploading]      = useState(false);
  const [variantes,      setVariantes]      = useState<Variante[]>(producto?.variantes ?? []);
  const [tags,           setTags]           = useState(producto?.tags?.join(", ")  ?? "");
  const [metaTitulo,     setMetaTitulo]     = useState(producto?.meta_titulo       ?? "");
  const [metaDesc,       setMetaDesc]       = useState(producto?.meta_descripcion  ?? "");
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");
  const [seccionAbierta, setSeccionAbierta] = useState<string>("basico");

  const generarSlug = (t: string) =>
    t.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(10);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res  = await fetch("/api/admin/productos/upload", { method: "POST", body: formData });
      setUploadProgress(80);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setArchivoUrl(data.url);
      setArchivoNombre(file.name);
      setUploadProgress(100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error subiendo archivo");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const agregarVariante = () =>
    setVariantes([...variantes, { id: crypto.randomUUID(), nombre: "", precio_extra: 0, stock: 99 }]);

  const actualizarVariante = (id: string, campo: keyof Variante, valor: string | number) =>
    setVariantes(variantes.map((v) => v.id === id ? { ...v, [campo]: valor } : v));

  const eliminarVariante = (id: string) =>
    setVariantes(variantes.filter((v) => v.id !== id));

  const handleGuardar = async () => {
    if (!nombre.trim() || !slug.trim()) { setError("El nombre y el slug son obligatorios."); return; }
    setLoading(true);
    setError("");
    try {
      const body = {
        nombre, slug, descripcion, descripcion_corta: descCorta,
        categoria, sku: sku || null, orden,
        precio:          Number(precio),
        precio_original: precioOrig ? Number(precioOrig) : null,
        tipo_precio:     tipoPrecio,
        precio_oferta:   precioOferta ? Number(precioOferta) : null,
        fecha_inicio_oferta: fechaInicio || null,
        fecha_fin_oferta:    fechaFin    || null,
        activo, stock: Number(stock), digital,
        requiere_envio: !digital && requiereEnvio,
        envio_gratis:   !digital && envioGratis,
        peso_gramos: Number(pesoGramos), largo_cm: Number(largoCm),
        ancho_cm: Number(anchoCm), alto_cm: Number(altoCm),
        archivo_url:    digital ? (archivoUrl || null) : null,
        archivo_nombre: digital ? (archivoNombre || null) : null,
        max_descargas: Number(maxDescargas),
        dias_acceso:   Number(diasAcceso),
        variantes,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        meta_titulo:     metaTitulo || null,
        meta_descripcion: metaDesc || null,
      };

      const url    = modo === "crear" ? "/api/admin/productos" : `/api/admin/productos/${producto?.id}`;
      const method = modo === "crear" ? "POST" : "PUT";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data   = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error guardando");
      router.push("/admin/tienda");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error guardando producto");
    } finally {
      setLoading(false);
    }
  };

  const SeccionCard = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const sec    = SECCIONES.find((s) => s.id === id)!;
    const abierta = seccionAbierta === id;
    const Icon   = sec.icon;
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <button
          onClick={() => setSeccionAbierta(abierta ? "" : id)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-brand-teal" />
            <span className="font-display font-semibold text-brand-dark text-sm">{sec.label}</span>
          </div>
          {abierta ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {abierta && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">{children}</div>
        )}
      </div>
    );
  };

  const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal bg-white";
  const labelClass = "text-xs text-gray-500 font-display mb-1.5 block";

  const precioMostrar = tipoPrecio === "oferta" && precioOferta ? Number(precioOferta) : precio;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">

        <SeccionCard id="basico">
          <div>
            <label className={labelClass}>Nombre del producto *</label>
            <input value={nombre} onChange={(e) => { setNombre(e.target.value); if (modo === "crear") setSlug(generarSlug(e.target.value)); }} placeholder="Nombre del producto" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Slug (URL) *</label>
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-xs whitespace-nowrap">/tienda/</span>
                <input value={slug} onChange={(e) => setSlug(generarSlug(e.target.value))} className={`${inputClass} text-xs`} placeholder="url-del-producto" />
              </div>
            </div>
            <div>
              <label className={labelClass}>SKU</label>
              <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="HOL-001" className={`${inputClass} text-xs`} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Descripción corta (listado)</label>
            <textarea value={descCorta} onChange={(e) => setDescCorta(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Frase de 1-2 líneas para las cards del listado" />
          </div>
          <div>
            <label className={labelClass}>Descripción completa</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={5} className={`${inputClass} resize-y`} placeholder="Descripción detallada..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Categoría</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={inputClass}>
                {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Orden en listado</label>
              <input type="number" value={orden} onChange={(e) => setOrden(Number(e.target.value))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Tags (separados por coma)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="mbsr, mindfulness, burnout" className={inputClass} />
          </div>
        </SeccionCard>

        <SeccionCard id="precio">
          <div>
            <label className={labelClass}>Tipo de precio</label>
            <div className="grid grid-cols-3 gap-2">
              {TIPOS_PRECIO.map((t) => (
                <button key={t.value} onClick={() => setTipoPrecio(t.value as typeof tipoPrecio)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${tipoPrecio === t.value ? "border-brand-teal bg-brand-teal-50" : "border-gray-200 hover:border-brand-teal/50"}`}>
                  <p className={`font-display font-semibold text-xs ${tipoPrecio === t.value ? "text-brand-teal" : "text-brand-dark"}`}>{t.label}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5 leading-tight">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Precio MXN *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} className={`${inputClass} pl-7`} placeholder="0" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Precio original (tachado, opcional)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="number" value={precioOrig} onChange={(e) => setPrecioOrig(e.target.value)} className={`${inputClass} pl-7`} placeholder="Opcional" />
              </div>
            </div>
          </div>
          {tipoPrecio === "oferta" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <p className="font-display font-semibold text-amber-700 text-xs">Configuración de oferta</p>
              <div>
                <label className={labelClass}>Precio de oferta (MXN) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="number" value={precioOferta} onChange={(e) => setPrecioOferta(e.target.value)} className={`${inputClass} pl-7`} placeholder="Precio con descuento" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Inicio de oferta</label>
                  <input type="datetime-local" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className={`${inputClass} text-xs`} />
                </div>
                <div>
                  <label className={labelClass}>Fin de oferta</label>
                  <input type="datetime-local" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className={`${inputClass} text-xs`} />
                </div>
              </div>
            </div>
          )}
        </SeccionCard>

        <SeccionCard id="inventario">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Stock disponible</label>
              <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className={inputClass} placeholder="999 = ilimitado" />
              <p className="text-gray-400 text-xs mt-1">Usa 999 para sin límite</p>
            </div>
            <div className="flex flex-col gap-3 pt-1">
              {[
                { val: activo,  set: () => setActivo(!activo),   label: activo  ? "✅ Activo"   : "⏸ Inactivo",  sub: activo  ? "Visible en tienda" : "Oculto", color: activo  },
                { val: digital, set: () => setDigital(!digital), label: digital ? "📱 Digital"  : "📦 Físico",    sub: digital ? "Acceso inmediato"  : "Requiere envío", color: digital },
              ].map(({ val, set, label, sub, color }) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer" onClick={set}>
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${color ? "bg-brand-teal" : "bg-gray-300"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${color ? "translate-x-5" : "translate-x-1"}`} />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-brand-dark">{label}</p>
                    <p className="text-gray-400 text-xs">{sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </SeccionCard>

        {!digital && (
          <SeccionCard id="envio">
            <div className="flex gap-4 mb-2">
              {[
                { checked: requiereEnvio, set: setRequiereEnvio, label: "Requiere envío" },
                { checked: envioGratis,   set: setEnvioGratis,   label: "Envío gratis"  },
              ].map(({ checked, set, label }) => (
                <label key={label} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} className="accent-brand-teal" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
            <div className="bg-brand-beige rounded-xl p-4">
              <p className="font-display font-semibold text-brand-dark text-xs mb-3">Dimensiones para envío</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Peso (g)", val: pesoGramos, set: setPesoGramos },
                  { label: "Largo (cm)", val: largoCm,  set: setLargoCm   },
                  { label: "Ancho (cm)", val: anchoCm,  set: setAnchoCm   },
                  { label: "Alto (cm)",  val: altoCm,   set: setAltoCm    },
                ].map(({ label, val, set }) => (
                  <div key={label}>
                    <label className={labelClass}>{label}</label>
                    <input type="number" value={val} onChange={(e) => set(Number(e.target.value))} className={inputClass} placeholder="0" />
                  </div>
                ))}
              </div>
            </div>
          </SeccionCard>
        )}

        {digital && (
          <SeccionCard id="digital">
            <div
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-brand-teal hover:bg-brand-teal-50 transition-all"
              style={{ borderColor: archivoUrl ? "#5CB996" : "#E5E7EB" }}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" className="hidden" accept=".pdf,.mp3,.mp4,.zip"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
              {uploading ? (
                <div>
                  <Loader2 className="w-8 h-8 text-brand-teal animate-spin mx-auto mb-2" />
                  <p className="text-brand-teal text-sm font-display font-semibold">Subiendo... {uploadProgress}%</p>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-brand-teal rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : archivoUrl ? (
                <div>
                  <div className="w-10 h-10 bg-brand-teal-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <FileDigit className="w-5 h-5 text-brand-teal" />
                  </div>
                  <p className="font-display font-semibold text-brand-dark text-sm">{archivoNombre}</p>
                  <p className="text-gray-400 text-xs mt-1">Clic para reemplazar</p>
                  <button onClick={(e) => { e.stopPropagation(); setArchivoUrl(""); setArchivoNombre(""); }}
                    className="mt-2 text-red-400 hover:text-red-500 text-xs flex items-center gap-1 mx-auto">
                    <X className="w-3 h-3" /> Quitar archivo
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="font-display font-semibold text-brand-dark text-sm">Subir archivo digital</p>
                  <p className="text-gray-400 text-xs mt-1">PDF, MP3, MP4 o ZIP · Máx 500MB</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Máx. descargas por compra</label>
                <input type="number" value={maxDescargas} onChange={(e) => setMaxDescargas(Number(e.target.value))} min={1} max={99} className={inputClass} />
                <p className="text-gray-400 text-xs mt-1">Recomendado: 3 descargas</p>
              </div>
              <div>
                <label className={labelClass}>Días de acceso</label>
                <input type="number" value={diasAcceso} onChange={(e) => setDiasAcceso(Number(e.target.value))} min={1} className={inputClass} />
                <p className="text-gray-400 text-xs mt-1">365 = 1 año</p>
              </div>
            </div>
          </SeccionCard>
        )}

        <SeccionCard id="variantes">
          <p className="text-gray-500 text-xs mb-3">Variantes para productos con talla, color o formato. Cada una puede tener precio adicional y stock propio.</p>
          {variantes.map((v) => (
            <div key={v.id} className="grid grid-cols-12 gap-2 items-center mb-2">
              <div className="col-span-5">
                <input value={v.nombre} onChange={(e) => actualizarVariante(v.id, "nombre", e.target.value)} placeholder="Ej: Talla M" className={`${inputClass} text-xs`} />
              </div>
              <div className="col-span-3">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">+$</span>
                  <input type="number" value={v.precio_extra} onChange={(e) => actualizarVariante(v.id, "precio_extra", Number(e.target.value))} className={`${inputClass} text-xs pl-7`} placeholder="0" />
                </div>
              </div>
              <div className="col-span-3">
                <input type="number" value={v.stock} onChange={(e) => actualizarVariante(v.id, "stock", Number(e.target.value))} className={`${inputClass} text-xs`} placeholder="Stock" />
              </div>
              <div className="col-span-1">
                <button onClick={() => eliminarVariante(v.id)} className="text-red-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={agregarVariante} className="flex items-center gap-2 text-brand-teal text-xs font-display font-semibold hover:underline mt-2">
            <Plus className="w-3.5 h-3.5" /> Agregar variante
          </button>
        </SeccionCard>

        <SeccionCard id="seo">
          <div>
            <label className={labelClass}>Meta título (Google)</label>
            <input value={metaTitulo} onChange={(e) => setMetaTitulo(e.target.value)} placeholder={`${nombre || "Producto"} | Holizenter`} className={inputClass} />
            <p className="text-gray-400 text-xs mt-1">{metaTitulo.length}/60 caracteres</p>
          </div>
          <div>
            <label className={labelClass}>Meta descripción (Google)</label>
            <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Máx 160 caracteres." />
            <p className="text-gray-400 text-xs mt-1">{metaDesc.length}/160 caracteres</p>
          </div>
        </SeccionCard>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
        )}
      </div>

      {/* Panel lateral */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="font-display font-semibold text-brand-dark text-sm mb-4">Guardar producto</p>
          {precio > 0 && (
            <div className="bg-brand-beige rounded-xl p-3 mb-4">
              <p className="text-gray-500 text-xs mb-1">Precio en tienda</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-brand-teal text-xl">${precioMostrar.toLocaleString("es-MX")}</span>
                <span className="text-gray-400 text-xs">MXN</span>
              </div>
              {tipoPrecio === "oferta" && precioOferta && (
                <p className="text-gray-400 text-xs line-through">${precio.toLocaleString("es-MX")} MXN</p>
              )}
            </div>
          )}
          <div className="flex items-center justify-between mb-3 py-2 border-t border-gray-100">
            <span className="text-sm text-gray-600">Estado</span>
            <span className={`text-xs font-display font-semibold px-2.5 py-1 rounded-full ${activo ? "bg-brand-teal-50 text-brand-teal" : "bg-gray-100 text-gray-500"}`}>
              {activo ? "✅ Activo" : "⏸ Inactivo"}
            </span>
          </div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Tipo</span>
            <span className="text-xs font-display font-semibold text-gray-700">{digital ? "📱 Digital" : "📦 Físico"}</span>
          </div>
          <button
            onClick={handleGuardar}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-bold py-3 rounded-xl shadow-md shadow-brand-teal/20 disabled:opacity-50 transition-colors"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : modo === "crear" ? "Crear producto" : "Guardar cambios"}
          </button>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <p className="font-display font-semibold text-amber-700 text-xs mb-2">💡 Consejos</p>
          <ul className="space-y-1.5 text-xs text-gray-600">
            <li>· El slug no debe cambiar después de publicar</li>
            <li>· Stock 999 = sin límite de inventario</li>
            <li>· Ofertas sin fecha final nunca expiran</li>
            <li>· Sube el archivo antes de guardar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
