"use client";

import { useState }  from "react";
import { Loader2 }   from "lucide-react";
import { Input }     from "@/components/ui/input";
import { Label }     from "@/components/ui/label";
import { Button }    from "@/components/ui/button";

interface Profesional {
  id:               string;
  nombre:           string;
  especialidad?:    string | null;
  bio?:             string | null;
  bio_corta?:       string | null;
  whatsapp?:        string | null;
  linkedin?:        string | null;
  sitio_web?:       string | null;
  imagen_url?:      string | null;
  certificaciones?: string[] | null;
  cal_username?:    string | null;
}

interface Props { profesional: Profesional }

export default function AdminPerfilEspecialistaEditor({ profesional }: Props) {
  const [nombre,       setNombre]       = useState(profesional.nombre          ?? "");
  const [especialidad, setEspecialidad] = useState(profesional.especialidad    ?? "");
  const [bio,          setBio]          = useState(profesional.bio             ?? "");
  const [bioCorta,     setBioCorta]     = useState(profesional.bio_corta       ?? "");
  const [whatsapp,     setWhatsapp]     = useState(profesional.whatsapp        ?? "");
  const [linkedin,     setLinkedin]     = useState(profesional.linkedin        ?? "");
  const [sitioWeb,     setSitioWeb]     = useState(profesional.sitio_web       ?? "");
  const [imagenUrl,    setImagenUrl]    = useState(profesional.imagen_url      ?? "");
  const [certs,        setCerts]        = useState((profesional.certificaciones ?? []).join(", "));
  const [calUsername,  setCalUsername]  = useState(profesional.cal_username    ?? "");
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [error,        setError]        = useState("");

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
          nombre, especialidad, bio, bio_corta: bioCorta,
          whatsapp, linkedin, sitio_web: sitioWeb, imagen_url: imagenUrl,
          certificaciones: certs.split(",").map((c) => c.trim()).filter(Boolean),
          cal_username: calUsername.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Error guardando perfil");
      setSaved(true);
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const lbl = "text-xs font-sans font-semibold uppercase tracking-wide mb-1.5 block text-gray-500";
  const inputCls = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5CB996] bg-white";

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: "var(--hl-divider)" }}>
      <h3 className="font-sans font-bold text-base mb-5" style={{ color: "var(--hl-text)" }}>
        Editar perfil del especialista
      </h3>
      <form onSubmit={handleSave} className="space-y-5">

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className={lbl}>Nombre completo</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div>
            <Label className={lbl}>Especialidad</Label>
            <Input value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} placeholder="Ej: Psicología clínica" />
          </div>
        </div>

        <div>
          <Label className={lbl}>Bio corta (para tarjetas)</Label>
          <Input value={bioCorta} onChange={(e) => setBioCorta(e.target.value)} placeholder="Una línea descriptiva (máx 160 caracteres)" maxLength={160} />
        </div>

        <div>
          <Label className={lbl}>Bio completa</Label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            placeholder="Formación, enfoque y experiencia…"
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <Label className={lbl}>Certificaciones (separadas por coma)</Label>
          <Input value={certs} onChange={(e) => setCerts(e.target.value)} placeholder="MBSR Brown University, Psicología Somática…" />
        </div>

        <div>
          <Label className={lbl}>Foto de perfil (URL)</Label>
          <Input value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} placeholder="https://…" />
        </div>

        <div>
          <Label className={lbl}>Username de Cal.com</Label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">cal.com/</span>
            <Input value={calUsername} onChange={(e) => setCalUsername(e.target.value)} placeholder="nombre-del-especialista" className="text-sm" />
          </div>
          <p className="text-gray-400 text-xs mt-1">URL de Cal.com para recibir citas desde el directorio</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label className={lbl}>WhatsApp</Label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="55 1234 5678" />
          </div>
          <div>
            <Label className={lbl}>LinkedIn</Label>
            <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/…" />
          </div>
          <div>
            <Label className={lbl}>Sitio web</Label>
            <Input value={sitioWeb} onChange={(e) => setSitioWeb(e.target.value)} placeholder="https://…" />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm font-sans">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="text-white font-sans font-semibold rounded-xl"
            style={{ background: "#5CB996" }}
          >
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Guardando...</>
              : "Guardar cambios"}
          </Button>
          {saved && <p className="text-sm font-sans" style={{ color: "#5CB996" }}>✓ Perfil guardado</p>}
        </div>
      </form>
    </div>
  );
}
