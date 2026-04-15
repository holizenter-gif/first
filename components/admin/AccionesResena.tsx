"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AccionesResenaProps {
  id: string;
  aprobada: boolean;
}

export default function AccionesResena({ id, aprobada: initialAprobada }: AccionesResenaProps) {
  const router = useRouter();
  const [aprobada, setAprobada] = useState(initialAprobada);
  const [loading, setLoading]   = useState<"aprobar" | "rechazar" | null>(null);

  const accion = async (tipo: "aprobar" | "rechazar") => {
    setLoading(tipo);
    try {
      const res = await fetch(`/api/admin/resenas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aprobada: tipo === "aprobar" }),
      });
      if (res.ok) {
        setAprobada(tipo === "aprobar");
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  };

  const eliminar = async () => {
    if (!confirm("¿Eliminar esta reseña? Esta acción no se puede deshacer.")) return;
    setLoading("rechazar");
    try {
      await fetch(`/api/admin/resenas/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {!aprobada && (
        <button
          onClick={() => accion("aprobar")}
          disabled={loading !== null}
          title="Aprobar"
          className="p-1.5 rounded-lg transition-colors hover:bg-brand-teal-50 text-brand-teal disabled:opacity-50"
        >
          {loading === "aprobar" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        </button>
      )}
      {aprobada && (
        <button
          onClick={() => accion("rechazar")}
          disabled={loading !== null}
          title="Quitar aprobación"
          className="p-1.5 rounded-lg transition-colors hover:bg-amber-50 text-amber-500 disabled:opacity-50"
        >
          {loading === "rechazar" ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </button>
      )}
      <button
        onClick={eliminar}
        disabled={loading !== null}
        title="Eliminar"
        className="p-1.5 rounded-lg transition-colors hover:bg-red-50 text-red-400 disabled:opacity-50"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
