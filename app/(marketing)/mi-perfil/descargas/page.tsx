"use client";

import { useState, useEffect } from "react";
import { Loader2, Download, AlertCircle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Descarga {
  id:                  string;
  orden_id:            string;
  producto_id:         string;
  email:               string;
  token:               string;
  descargas_usadas:    number;
  max_descargas:       number;
  expira_en:           string;
  created_at:          string;
  productos?: { nombre: string; archivo_url: string } | null;
}

function diasRestantes(isoDate: string) {
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function DescargasPage() {
  const [descargas,    setDescargas]    = useState<Descarga[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [descargandoId, setDescargandoId] = useState<string | null>(null);
  const [toast,        setToast]        = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) { setLoading(false); return; }

      const { data } = await supabase
        .from("descargas")
        .select("*, productos(nombre, archivo_url)")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      setDescargas((data ?? []) as Descarga[]);
      setLoading(false);
    })();
  }, []);

  const handleDescargar = async (descarga: Descarga) => {
    setDescargandoId(descarga.id);
    try {
      const res  = await fetch(`/api/descargas/${descarga.token}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al obtener el archivo");

      const link = document.createElement("a");
      link.href  = data.url;
      link.download = descarga.productos?.nombre ?? "archivo";
      link.click();

      // Actualizar contador localmente
      setDescargas((prev) =>
        prev.map((d) => d.id === descarga.id ? { ...d, descargas_usadas: d.descargas_usadas + 1 } : d)
      );
      showToast("Descarga iniciada", true);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Error al descargar", false);
    } finally {
      setDescargandoId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} /></div>;
  }

  return (
    <div className="space-y-4">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-sans font-medium"
          style={{ background: toast.ok ? "#EBF8F2" : "#FEE2E2", color: toast.ok ? "#1A6840" : "#B91C1C" }}>
          {toast.msg}
        </div>
      )}

      <h2 className="font-sans font-semibold text-base" style={{ color: "#0D1A0F" }}>
        Mis descargas
      </h2>

      {descargas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <Download className="w-10 h-10 mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400 text-sm font-sans">No tienes productos digitales aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {descargas.map((d) => {
            const expirado  = new Date(d.expira_en) < new Date();
            const agotado   = d.descargas_usadas >= d.max_descargas;
            const disponible = !expirado && !agotado;
            const dias      = diasRestantes(d.expira_en);

            return (
              <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: disponible ? "#EBF8F2" : "#F3F4F6" }}
                >
                  <Download className="w-5 h-5" style={{ color: disponible ? "#5CB996" : "#9CA3AF" }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-sm" style={{ color: "#0D1A0F" }}>
                    {d.productos?.nombre ?? "Producto digital"}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-xs font-sans text-gray-400">
                      {d.descargas_usadas}/{d.max_descargas} descargas usadas
                    </span>
                    {!expirado ? (
                      <span className="flex items-center gap-1 text-xs font-sans" style={{ color: dias <= 7 ? "#D97706" : "#6B7280" }}>
                        <Clock className="w-3 h-3" />
                        {dias > 0 ? `Expira en ${dias} día${dias !== 1 ? "s" : ""}` : "Expira hoy"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-sans text-red-500">
                        <AlertCircle className="w-3 h-3" /> Expirado
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {disponible ? (
                    <button
                      onClick={() => handleDescargar(d)}
                      disabled={descargandoId === d.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-sans font-semibold text-white disabled:opacity-60"
                      style={{ background: "#5CB996" }}
                    >
                      {descargandoId === d.id
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Descargando…</>
                        : <><Download className="w-4 h-4" /> Descargar</>}
                    </button>
                  ) : (
                    <span className="text-xs font-sans font-medium px-3 py-1.5 rounded-xl" style={{ background: "#F3F4F6", color: "#9CA3AF" }}>
                      {expirado ? "Expirado" : "Límite alcanzado"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
