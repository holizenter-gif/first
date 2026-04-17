"use client";

import { useState, useEffect } from "react";
import { useRouter }            from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { Input }                from "@/components/ui/input";
import { Label }                from "@/components/ui/label";
import { Button }               from "@/components/ui/button";
import ImagenUploader           from "@/components/admin/ImagenUploader";

interface EventoFormData {
  titulo:            string;
  slug:              string;
  descripcion_corta: string;
  descripcion:       string;
  fecha_inicio:      string;
  fecha_fin:         string;
  modalidad:         string;
  ubicacion:         string;
  link_virtual:      string;
  precio:            string;
  precio_descripcion:string;
  cupo_maximo:       string;
  imagen_url:        string;
  activo:            boolean;
  destacado:         boolean;
  pasado:            boolean;
}

interface Props {
  inicial?: Partial<EventoFormData>;
  eventoId?: string;   // si existe → modo editar (PUT), si no → modo crear (POST)
}

const EMPTY: EventoFormData = {
  titulo: "", slug: "", descripcion_corta: "", descripcion: "",
  fecha_inicio: "", fecha_fin: "", modalidad: "presencial",
  ubicacion: "", link_virtual: "", precio: "0",
  precio_descripcion: "", cupo_maximo: "", imagen_url: "",
  activo: true, destacado: false, pasado: false,
};

function generarSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const lbl = "text-xs font-sans font-semibold uppercase tracking-wide text-gray-500 mb-1.5 block" as const;
const ta  = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5CB996] bg-white resize-none" as const;

export default function EventoForm({ inicial, eventoId }: Props) {
  const router  = useRouter();
  const esEditar = !!eventoId;

  const [f, setF]       = useState<EventoFormData>({ ...EMPTY, ...inicial });
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);
  const [error,  setError]    = useState("");

  // Auto-slug desde título (solo en modo crear)
  useEffect(() => {
    if (!esEditar) {
      setF((prev) => ({ ...prev, slug: generarSlug(prev.titulo) }));
    }
  }, [f.titulo, esEditar]);

  const set = (key: keyof EventoFormData, val: string | boolean) =>
    setF((prev) => ({ ...prev, [key]: val }));

  const Toggle = ({ campo, label }: { campo: "activo" | "destacado" | "pasado"; label: string }) => (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => set(campo, !f[campo])}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
        style={{ background: f[campo] ? "#5CB996" : "#D1D5DB" }}
      >
        <span
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
          style={{ transform: f[campo] ? "translateX(22px)" : "translateX(2px)" }}
        />
      </button>
      <span className="text-sm font-sans" style={{ color: "var(--hl-text)" }}>{label}</span>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const url    = esEditar ? `/api/admin/eventos/${eventoId}` : "/api/admin/eventos";
      const method = esEditar ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo:            f.titulo.trim(),
          slug:              f.slug.trim(),
          descripcion_corta: f.descripcion_corta.trim() || null,
          descripcion:       f.descripcion.trim()       || null,
          fecha_inicio:      f.fecha_inicio             || null,
          fecha_fin:         f.fecha_fin                || null,
          modalidad:         f.modalidad,
          ubicacion:         f.ubicacion.trim()         || null,
          link_virtual:      f.link_virtual.trim()      || null,
          precio:            Number(f.precio)           || 0,
          precio_descripcion:f.precio_descripcion.trim()|| null,
          cupo_maximo:       f.cupo_maximo ? Number(f.cupo_maximo) : null,
          imagen_url:        f.imagen_url               || null,
          activo:            f.activo,
          destacado:         f.destacado,
          pasado:            f.pasado,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error guardando evento");
      if (esEditar) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        router.push("/admin/eventos");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ── Visibilidad ── */}
      <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "var(--hl-divider)" }}>
        <p className="font-sans font-bold text-xs uppercase tracking-wider" style={{ color: "#5CB996" }}>
          Visibilidad
        </p>
        <div className="flex flex-wrap gap-6">
          <Toggle campo="activo"    label="Activo (visible en el sitio)" />
          <Toggle campo="destacado" label="Destacado"                    />
          <Toggle campo="pasado"    label="Marcar como evento pasado"    />
        </div>
      </section>

      {/* ── Identidad ── */}
      <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "var(--hl-divider)" }}>
        <p className="font-sans font-bold text-xs uppercase tracking-wider" style={{ color: "#5CB996" }}>
          Identidad
        </p>
        <div>
          <Label className={lbl}>Título *</Label>
          <Input value={f.titulo} onChange={(e) => set("titulo", e.target.value)} required />
        </div>
        <div>
          <Label className={lbl}>Slug (URL)</Label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm flex-shrink-0">/eventos/</span>
            <Input
              value={f.slug}
              onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              required
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <Label className={lbl}>Descripción corta (para listado)</Label>
          <Input
            value={f.descripcion_corta}
            onChange={(e) => set("descripcion_corta", e.target.value)}
            placeholder="Una línea atractiva…"
            maxLength={200}
          />
          <p className="text-gray-400 text-xs mt-1">{f.descripcion_corta.length}/200</p>
        </div>
        <div>
          <Label className={lbl}>Descripción completa</Label>
          <textarea
            value={f.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
            rows={6}
            placeholder="Detalle del evento, qué aprenderán, quién facilita…"
            className={ta}
          />
        </div>
      </section>

      {/* ── Imagen ── */}
      <section className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--hl-divider)" }}>
        <p className="font-sans font-bold text-xs uppercase tracking-wider mb-4" style={{ color: "#5CB996" }}>
          Imagen
        </p>
        <ImagenUploader
          value={f.imagen_url}
          onChange={(url) => set("imagen_url", url)}
          bucket="imagenes-blog"
          label="Imagen del evento"
          aspectRatio="banner"
        />
      </section>

      {/* ── Fechas y modalidad ── */}
      <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "var(--hl-divider)" }}>
        <p className="font-sans font-bold text-xs uppercase tracking-wider" style={{ color: "#5CB996" }}>
          Fecha, hora y lugar
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className={lbl}>Fecha y hora de inicio *</Label>
            <Input
              type="datetime-local"
              value={f.fecha_inicio}
              onChange={(e) => set("fecha_inicio", e.target.value)}
              required
            />
          </div>
          <div>
            <Label className={lbl}>Fecha y hora de fin</Label>
            <Input
              type="datetime-local"
              value={f.fecha_fin}
              onChange={(e) => set("fecha_fin", e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label className={lbl}>Modalidad</Label>
          <select
            value={f.modalidad}
            onChange={(e) => set("modalidad", e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5CB996] bg-white"
          >
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className={lbl}>Ubicación (presencial)</Label>
            <Input
              value={f.ubicacion}
              onChange={(e) => set("ubicacion", e.target.value)}
              placeholder="CDMX, Col. Roma…"
            />
          </div>
          <div>
            <Label className={lbl}>Link virtual</Label>
            <Input
              value={f.link_virtual}
              onChange={(e) => set("link_virtual", e.target.value)}
              placeholder="https://zoom.us/j/…"
            />
          </div>
        </div>
      </section>

      {/* ── Precio y cupo ── */}
      <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "var(--hl-divider)" }}>
        <p className="font-sans font-bold text-xs uppercase tracking-wider" style={{ color: "#5CB996" }}>
          Precio y cupo
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label className={lbl}>Precio (MXN)</Label>
            <Input
              type="number"
              min="0"
              value={f.precio}
              onChange={(e) => set("precio", e.target.value)}
            />
            <p className="text-gray-400 text-xs mt-1">0 = evento gratuito</p>
          </div>
          <div>
            <Label className={lbl}>Descripción del precio</Label>
            <Input
              value={f.precio_descripcion}
              onChange={(e) => set("precio_descripcion", e.target.value)}
              placeholder="por persona"
            />
          </div>
          <div>
            <Label className={lbl}>Cupo máximo</Label>
            <Input
              type="number"
              min="1"
              value={f.cupo_maximo}
              onChange={(e) => set("cupo_maximo", e.target.value)}
              placeholder="Sin límite"
            />
          </div>
        </div>
      </section>

      {/* Error y acciones */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm font-sans">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={saving}
          className="font-sans font-bold rounded-xl px-8 text-white"
          style={{ background: "#5CB996" }}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {esEditar ? "Guardando…" : "Creando…"}
            </span>
          ) : esEditar ? "Guardar cambios" : "Crear evento"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-sans font-medium" style={{ color: "#5CB996" }}>
            <CheckCircle className="w-4 h-4" /> Guardado
          </span>
        )}
        <button
          type="button"
          onClick={() => router.push("/admin/eventos")}
          className="text-sm font-sans text-gray-400 hover:text-gray-600 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
