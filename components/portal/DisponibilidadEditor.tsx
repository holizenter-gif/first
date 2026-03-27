"use client";

import { useState } from "react";
import { Loader2 }  from "lucide-react";
import { Button }   from "@/components/ui/button";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const HORAS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

interface DisponibilidadEditorProps {
  profesionalId:  string | null;
  disponibilidad: Record<string, string[]> | null;
}

export default function DisponibilidadEditor({ profesionalId, disponibilidad }: DisponibilidadEditorProps) {
  const [horarios, setHorarios] = useState<Record<string, string[]>>(
    disponibilidad ?? {}
  );
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  const toggleHora = (dia: string, hora: string) => {
    setHorarios((prev) => {
      const actuales = prev[dia] ?? [];
      const nuevo = actuales.includes(hora)
        ? actuales.filter((h) => h !== hora)
        : [...actuales, hora].sort();
      return { ...prev, [dia]: nuevo };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    if (!profesionalId) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/portal/disponibilidad`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ profesional_id: profesionalId, disponibilidad: horarios }),
      });
      if (!res.ok) throw new Error("Error guardando");
      setSaved(true);
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (!profesionalId) {
    return (
      <div
        className="rounded-2xl p-6 text-center border"
        style={{ background: "#FFFBEB", borderColor: "#FCD34D" }}
      >
        <p className="text-sm font-sans" style={{ color: "#92400E" }}>
          Tu perfil aún no está activo. Contacta al equipo de Holizenter para completar la activación.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: "var(--hl-divider)" }}>
      <p className="text-sm font-sans text-gray-500 mb-5">
        Selecciona los horarios en que puedes recibir citas
      </p>

      <div className="space-y-4">
        {DIAS.map((dia) => (
          <div key={dia}>
            <p className="text-xs font-sans font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--hl-text-muted)" }}>
              {dia}
            </p>
            <div className="flex flex-wrap gap-2">
              {HORAS.map((hora) => {
                const activo = (horarios[dia] ?? []).includes(hora);
                return (
                  <button
                    key={hora}
                    type="button"
                    onClick={() => toggleHora(dia, hora)}
                    className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all"
                    style={
                      activo
                        ? { background: "#5CB996", color: "#fff" }
                        : { background: "var(--hl-beige)", color: "var(--hl-text-muted)", border: "1px solid var(--hl-divider)" }
                    }
                  >
                    {hora}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-4 font-sans">{error}</p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="text-white font-sans font-semibold rounded-xl"
          style={{ background: "#5CB996" }}
        >
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Guardando...</>
            : "Guardar disponibilidad"}
        </Button>
        {saved && <p className="text-sm font-sans" style={{ color: "#5CB996" }}>✓ Guardado</p>}
      </div>
    </div>
  );
}
