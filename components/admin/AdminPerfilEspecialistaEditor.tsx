"use client";

import { useState }                 from "react";
import { Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { Input }                    from "@/components/ui/input";
import { Label }                    from "@/components/ui/label";
import { Button }                   from "@/components/ui/button";

interface Profesional {
  id:               string;
  nombre:           string;
  slug:             string;
  especialidad:     string | null;
  bio:              string | null;
  bio_corta:        string | null;
  foto_url:         string | null;
  filosofia:        string | null;
  modalidad:        string | null;
  precio_base:      number | null;
  experiencia_anos: number | null;
  tags:             string[] | null;
  certificaciones:  string[] | null;
  activo:           boolean | null;
  orden:            number | null;
  cal_username:     string | null;
}

interface Props { profesional: Profesional }

const MODALIDADES = [
  { value: "presencial", label: "Presencial CDMX" },
  { value: "online",     label: "Online"           },
  { value: "hibrido",    label: "Presencial + Online" },
];

export default function AdminPerfilEspecialistaEditor({ profesional }: Props) {
  const [nombre,          setNombre]          = useState(profesional.nombre              ?? "");
  const [slug,            setSlug]            = useState(profesional.slug               ?? "");
  const [especialidad,    setEspecialidad]    = useState(profesional.especialidad       ?? "");
  const [bioCorta,        setBioCorta]        = useState(profesional.bio_corta          ?? "");
  const [bio,             setBio]             = useState(profesional.bio                ?? "");
  const [filosofia,       setFilosofia]       = useState(profesional.filosofia          ?? "");
  const [fotoUrl,         setFotoUrl]         = useState(profesional.foto_url           ?? "");
  const [modalidad,       setModalidad]       = useState(profesional.modalidad          ?? "hibrido");
  const [precioBase,      setPrecioBase]      = useState(String(profesional.precio_base ?? 0));
  const [experienciaAnos, setExperienciaAnos] = useState(String(profesional.experiencia_anos ?? 0));
  const [tags,            setTags]            = useState((profesional.tags             ?? []).join(", "));
  const [certs,           setCerts]           = useState((profesional.certificaciones  ?? []).join(", "));
  const [activo,          setActivo]          = useState(profesional.activo            ?? true);
  const [orden,           setOrden]           = useState(String(profesional.orden      ?? 99));
  const [calUsername,     setCalUsername]     = useState(profesional.cal_username      ?? "");

  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/especialistas/${profesional.id}/perfil`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          nombre:           nombre.trim(),
          slug:             slug.trim().toLowerCase().replace(/\s+/g, "-"),
          especialidad:     especialidad.trim()    || null,
          bio:              bio.trim()             || null,
          bio_corta:        bioCorta.trim()        || null,
          filosofia:        filosofia.trim()       || null,
          foto_url:         fotoUrl.trim()         || null,
          modalidad:        modalidad              || "hibrido",
          precio_base:      Number(precioBase)     || 0,
          experiencia_anos: Number(experienciaAnos) || 0,
          tags:             tags.split(",").map((t) => t.trim()).filter(Boolean),
          certificaciones:  certs.split(",").map((c) => c.trim()).filter(Boolean),
          activo,
          orden:            Number(orden) || 99,
          cal_username:     calUsername.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error guardando perfil");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const lbl = "text-xs font-sans font-semibold uppercase tracking-wide mb-1.5 block" as const;
  const textarea = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5CB996] bg-white resize-none" as const;

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--hl-divider)" }}>

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b" style={{ background: "#F5F2EC", borderColor: "var(--hl-divider)" }}>
        <div>
          <h3 className="font-sans font-bold text-base" style={{ color: "var(--hl-text)" }}>
            Editar perfil público
          </h3>
          <p className="font-sans text-xs mt-0.5" style={{ color: "var(--hl-text-muted)" }}>
            Los cambios se reflejan en el directorio al instante.
          </p>
        </div>
        <a
          href={`/directorio/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-sans font-medium hover:underline"
          style={{ color: "#5CB996" }}
        >
          Ver perfil <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-7">

        {/* ── Visibilidad ── */}
        <section>
          <p className="font-sans font-bold text-xs uppercase tracking-wider mb-3" style={{ color: "#5CB996" }}>
            Visibilidad
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActivo(!activo)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
              style={{ background: activo ? "#5CB996" : "#D1D5DB" }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                style={{ transform: activo ? "translateX(22px)" : "translateX(2px)" }}
              />
            </button>
            <span className="font-sans text-sm" style={{ color: "var(--hl-text)" }}>
              {activo ? "Visible en el directorio" : "Oculto del directorio"}
            </span>
          </div>
        </section>

        {/* ── Identidad ── */}
        <section>
          <p className="font-sans font-bold text-xs uppercase tracking-wider mb-3" style={{ color: "#5CB996" }}>
            Identidad
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className={`${lbl} text-gray-500`}>Nombre completo *</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
              <Label className={`${lbl} text-gray-500`}>Especialidad principal</Label>
              <Input value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} placeholder="Ej: Psicología clínica" />
            </div>
          </div>
          <div className="mt-4">
            <Label className={`${lbl} text-gray-500`}>Slug (URL del perfil)</Label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">/directorio/</span>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                placeholder="nombre-apellido"
                className="flex-1"
              />
            </div>
            <p className="text-gray-400 text-xs mt-1">Cambia esto solo si el URL actual tiene errores.</p>
          </div>
        </section>

        {/* ── Foto ── */}
        <section>
          <p className="font-sans font-bold text-xs uppercase tracking-wider mb-3" style={{ color: "#5CB996" }}>
            Foto de perfil
          </p>
          <div className="flex items-start gap-4">
            {fotoUrl && (
              <div
                className="w-16 h-16 rounded-full bg-cover bg-center flex-shrink-0 border-2"
                style={{ backgroundImage: `url(${fotoUrl})`, borderColor: "#EBF8F2" }}
              />
            )}
            <div className="flex-1">
              <Label className={`${lbl} text-gray-500`}>URL de la foto</Label>
              <Input
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
                placeholder="https://…"
              />
              <p className="text-gray-400 text-xs mt-1">Sube la imagen a Supabase Storage o usa una URL directa.</p>
            </div>
          </div>
        </section>

        {/* ── Textos ── */}
        <section>
          <p className="font-sans font-bold text-xs uppercase tracking-wider mb-3" style={{ color: "#5CB996" }}>
            Textos
          </p>
          <div className="space-y-4">
            <div>
              <Label className={`${lbl} text-gray-500`}>Bio corta (para tarjetas del directorio)</Label>
              <Input
                value={bioCorta}
                onChange={(e) => setBioCorta(e.target.value)}
                placeholder="Una línea descriptiva (máx 160 caracteres)"
                maxLength={160}
              />
              <p className="text-gray-400 text-xs mt-1">{bioCorta.length}/160 caracteres</p>
            </div>
            <div>
              <Label className={`${lbl} text-gray-500`}>Bio completa (página de perfil)</Label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                placeholder="Formación, enfoque y experiencia…"
                className={textarea}
              />
            </div>
            <div>
              <Label className={`${lbl} text-gray-500`}>Filosofía / frase de cabecera</Label>
              <textarea
                value={filosofia}
                onChange={(e) => setFilosofia(e.target.value)}
                rows={2}
                placeholder="Aparece como blockquote en el perfil…"
                className={textarea}
              />
            </div>
          </div>
        </section>

        {/* ── Formación ── */}
        <section>
          <p className="font-sans font-bold text-xs uppercase tracking-wider mb-3" style={{ color: "#5CB996" }}>
            Formación y experiencia
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className={`${lbl} text-gray-500`}>Años de experiencia</Label>
              <Input
                type="number"
                min="0"
                max="50"
                value={experienciaAnos}
                onChange={(e) => setExperienciaAnos(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label className={`${lbl} text-gray-500`}>Certificaciones (separadas por coma)</Label>
            <Input
              value={certs}
              onChange={(e) => setCerts(e.target.value)}
              placeholder="MBSR Brown University, Psicología Somática, NOM-035…"
            />
          </div>
        </section>

        {/* ── Tags ── */}
        <section>
          <p className="font-sans font-bold text-xs uppercase tracking-wider mb-3" style={{ color: "#5CB996" }}>
            Tags (filtros del directorio)
          </p>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="ansiedad, estrés, burnout, meditación…"
          />
          <p className="text-gray-400 text-xs mt-1">Separa con comas. Aparecen como píldoras en el perfil y filtran en el directorio.</p>
          {tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full font-sans capitalize"
                  style={{ background: "#EBF8F2", color: "#5CB996" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* ── Logística ── */}
        <section>
          <p className="font-sans font-bold text-xs uppercase tracking-wider mb-3" style={{ color: "#5CB996" }}>
            Logística
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label className={`${lbl} text-gray-500`}>Modalidad</Label>
              <select
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5CB996] bg-white"
              >
                {MODALIDADES.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className={`${lbl} text-gray-500`}>Precio base (MXN)</Label>
              <Input
                type="number"
                min="0"
                value={precioBase}
                onChange={(e) => setPrecioBase(e.target.value)}
                placeholder="0 = Consultar"
              />
              <p className="text-gray-400 text-xs mt-1">0 muestra "Consultar precio"</p>
            </div>
            <div>
              <Label className={`${lbl} text-gray-500`}>Orden en directorio</Label>
              <Input
                type="number"
                min="1"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              />
              <p className="text-gray-400 text-xs mt-1">Número menor = aparece primero</p>
            </div>
          </div>
        </section>

        {/* ── Cal.com ── */}
        <section>
          <p className="font-sans font-bold text-xs uppercase tracking-wider mb-3" style={{ color: "#5CB996" }}>
            Agenda (Cal.com)
          </p>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm flex-shrink-0">cal.com/</span>
            <Input
              value={calUsername}
              onChange={(e) => setCalUsername(e.target.value)}
              placeholder="nombre-del-especialista"
            />
          </div>
          <p className="text-gray-400 text-xs mt-1">
            Si está vacío, el perfil muestra "Agenda disponible próximamente" en lugar del calendario.
          </p>
        </section>

        {/* Errores y acciones */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm font-sans">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2 border-t" style={{ borderColor: "var(--hl-divider)" }}>
          <Button
            type="submit"
            disabled={saving}
            className="font-sans font-bold rounded-xl px-6 text-white"
            style={{ background: "#5CB996" }}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
              </span>
            ) : "Guardar cambios"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-sans font-medium" style={{ color: "#5CB996" }}>
              <CheckCircle className="w-4 h-4" /> Cambios guardados
            </span>
          )}
        </div>

      </form>
    </div>
  );
}
