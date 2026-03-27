"use client";

import { useState }  from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button }    from "@/components/ui/button";
import { Label }     from "@/components/ui/label";

interface Props {
  solicitud: {
    id:           string;
    status:       string;
    nombre:       string;
    notas_admin?: string | null;
  };
}

export default function AccionesEspecialista({ solicitud }: Props) {
  const router  = useRouter();
  const [notas,   setNotas]   = useState(solicitud.notas_admin ?? "");
  const [loading, setLoading] = useState<"aprobar" | "rechazar" | null>(null);
  const [done,    setDone]    = useState(solicitud.status !== "pendiente");
  const [status,  setStatus]  = useState(solicitud.status);

  const handleAccion = async (accion: "aprobar" | "rechazar") => {
    setLoading(accion);
    try {
      const res = await fetch(`/api/admin/especialistas/${solicitud.id}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ accion, notas }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error procesando la acción");
      }
      setStatus(accion === "aprobar" ? "aprobado" : "rechazado");
      setDone(true);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error procesando la acción. Intenta de nuevo.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="rounded-2xl p-5 border shadow-sm sticky top-24"
      style={{ background: "#fff", borderColor: "var(--hl-divider)" }}
    >
      <p className="font-sans font-semibold text-sm mb-4" style={{ color: "var(--hl-text)" }}>
        Decisión
      </p>

      {done ? (
        <div
          className="text-center py-4 rounded-xl"
          style={{
            background: status === "aprobado" ? "#EBF7F2" : "#FEE2E2",
            color:      status === "aprobado" ? "#3A8A6E"  : "#B91C1C",
          }}
        >
          <p className="font-sans font-semibold text-sm">
            {status === "aprobado" ? "✅ Aprobado" : "❌ Rechazado"}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <Label className="text-xs text-gray-500 font-sans mb-1.5 block">
              Nota para el especialista (opcional)
            </Label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="Se incluirá en el email de respuesta…"
              className="w-full text-sm border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5CB996] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => handleAccion("aprobar")}
              disabled={loading !== null}
              className="w-full text-white font-sans font-semibold rounded-xl py-4"
              style={{ background: "#5CB996" }}
            >
              {loading === "aprobar"
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Aprobando...</>
                : <><CheckCircle className="w-4 h-4 mr-2" />Aprobar solicitud</>}
            </Button>
            <Button
              onClick={() => handleAccion("rechazar")}
              disabled={loading !== null}
              variant="outline"
              className="w-full font-sans font-semibold rounded-xl py-4 border-red-200 text-red-500 hover:bg-red-50"
            >
              {loading === "rechazar"
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Rechazando...</>
                : <><XCircle className="w-4 h-4 mr-2" />Rechazar solicitud</>}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
