"use client";

import { useState }  from "react";
import { Loader2 }   from "lucide-react";
import { Input }     from "@/components/ui/input";
import { Label }     from "@/components/ui/label";
import { Button }    from "@/components/ui/button";

interface Profesional {
  id:                string;
  nombre:            string;
  especialidad?:     string | null;
  bio?:              string | null;
  bio_corta?:        string | null;
  whatsapp?:         string | null;
  linkedin?:         string | null;
  sitio_web?:        string | null;
  imagen_url?:       string | null;
  certificaciones?:  string[] | null;
  [key: string]:     unknown;
}

interface Props {
  profesional: Profesional | null;
  userId:      string;
}

export default function PerfilEditor({ profesional, userId }: Props) {
  const [nombre,        setNombre]        = useState(profesional?.nombre        ?? "");
  const [especialidad,  setEspecialidad]  = useState(profesional?.especialidad  ?? "");
  const [bio,           setBio]           = useState(profesional?.bio           ?? "");
  const [bio_corta,     setBioCorta]      = useState(profesional?.bio_corta     ?? "");
  const [whatsapp,      setWhatsapp]      = useState(profesional?.whatsapp      ?? "");
  const [linkedin,      setLinkedin]      = useState(profesional?.linkedin      ?? "");
  const [sitio_web,     setSitioWeb]      = useState(profesional?.sitio_web     ?? "");
  const [imagen_url,    setImagenUrl]     = useState(profesional?.imagen_url    ?? "");
  const [certs,         setCerts]         = useState((profesional?.certificaciones ?? []).join(", "));
  const [saving,        setSaving]        = useState(false);
  const [saved,         setSaved]         = useState(false);
  const [error,         setError]         = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/portal/perfil", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          user_id:        userId,
          nombre,
          especialidad,
          bio,
          bio_corta,
          whatsapp,
          linkedin,
          sitio_web,
          imagen_url,
          certificaciones: certs.split(",").map((c) => c.trim()).filter(Boolean),
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

  const inputCls = "w-full text-sm border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5CB996]";
  const lbl = "text-xs font-sans font-semibold uppercase tracking-wide mb-1.5 block";

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: "var(--hl-divider)" }}>
      <form onSubmit={handleSave} className="space-y-5">

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className={lbl} style={{ color: "var(--hl-text-muted)" }}>Nombre completo</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div>
            <Label className={lbl} style={{ color: "var(--hl-text-muted)" }}>Especialidad</Label>
            <Input value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} placeholder="Ej: Psicología clínica" />
          </div>
        </div>

        <div>
          <Label className={lbl} style={{ color: "var(--hl-text-muted)" }}>Bio corta (para tarjetas)</Label>
          <Input
            value={bio_corta}
            onChange={(e) => setBioCorta(e.target.value)}
            placeholder="Una línea descriptiva (max 160 caracteres)"
            maxLength={160}
          />
        </div>

        <div>
          <Label className={lbl} style={{ color: "var(--hl-text-muted)" }}>Bio completa</Label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            placeholder="Cuéntanos sobre tu formación, enfoque y experiencia…"
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <Label className={lbl} style={{ color: "var(--hl-text-muted)" }}>Certificaciones (separadas por coma)</Label>
          <Input value={certs} onChange={(e) => setCerts(e.target.value)} placeholder="MBSR Brown University, Psicología Somática…" />
        </div>

        <div>
          <Label className={lbl} style={{ color: "var(--hl-text-muted)" }}>Foto de perfil (URL)</Label>
          <Input value={imagen_url} onChange={(e) => setImagenUrl(e.target.value)} placeholder="https://…" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label className={lbl} style={{ color: "var(--hl-text-muted)" }}>WhatsApp</Label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="55 1234 5678" />
          </div>
          <div>
            <Label className={lbl} style={{ color: "var(--hl-text-muted)" }}>LinkedIn</Label>
            <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/…" />
          </div>
          <div>
            <Label className={lbl} style={{ color: "var(--hl-text-muted)" }}>Sitio web</Label>
            <Input value={sitio_web} onChange={(e) => setSitioWeb(e.target.value)} placeholder="https://…" />
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
              : "Guardar perfil"}
          </Button>
          {saved && <p className="text-sm font-sans" style={{ color: "#5CB996" }}>✓ Perfil guardado</p>}
        </div>
      </form>
    </div>
  );
}
