"use client";

import { useState } from "react";
import { EstrellasInput } from "./Estrellas";
import { Loader2, CheckCircle } from "lucide-react";

interface FormularioResenaProps {
  productoId: string;
  onExito?: () => void;
}

export default function FormularioResena({ productoId, onExito }: FormularioResenaProps) {
  const [calificacion, setCalificacion] = useState(0);
  const [nombre, setNombre]             = useState("");
  const [comentario, setComentario]     = useState("");
  const [loading, setLoading]           = useState(false);
  const [enviado, setEnviado]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const enviar = async () => {
    setError(null);
    if (calificacion === 0) { setError("Selecciona una calificación"); return; }
    if (!nombre.trim())     { setError("Tu nombre es requerido"); return; }
    if (!comentario.trim()) { setError("Escribe un comentario"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/resenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ producto_id: productoId, calificacion, nombre: nombre.trim(), comentario: comentario.trim() }),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setEnviado(true);
      onExito?.();
    } catch {
      setError("No pudimos enviar tu reseña. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
        <CheckCircle className="w-10 h-10" style={{ color: "#5CB996" }} />
        <p className="font-display font-semibold text-base" style={{ color: "#0D1A0F" }}>
          ¡Gracias por tu reseña!
        </p>
        <p className="font-sans text-sm text-gray-500">
          Será publicada después de revisión.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-display font-medium mb-2" style={{ color: "#374151" }}>
          Tu calificación
        </p>
        <EstrellasInput valor={calificacion} onChange={setCalificacion} />
      </div>

      <div>
        <label className="block text-sm font-display font-medium mb-1.5" style={{ color: "#374151" }}>
          Tu nombre
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. María G."
          maxLength={80}
          className="w-full px-4 py-2.5 rounded-xl border font-sans text-sm text-gray-800 outline-none focus:ring-2 focus:ring-brand-teal"
          style={{ borderColor: "#E5E7EB" }}
        />
      </div>

      <div>
        <label className="block text-sm font-display font-medium mb-1.5" style={{ color: "#374151" }}>
          Comentario
        </label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="¿Qué te pareció el producto?"
          rows={3}
          maxLength={600}
          className="w-full px-4 py-2.5 rounded-xl border font-sans text-sm text-gray-800 outline-none focus:ring-2 focus:ring-brand-teal resize-none"
          style={{ borderColor: "#E5E7EB" }}
        />
        <p className="text-right text-xs text-gray-400 mt-0.5">{comentario.length}/600</p>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        onClick={enviar}
        disabled={loading}
        className="w-full py-3 rounded-full font-display font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: "#5CB996" }}
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando…</> : "Publicar reseña"}
      </button>
    </div>
  );
}
