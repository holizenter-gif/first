import { createClient } from "@/lib/supabase/server";
import Link             from "next/link";
import { Download, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface Props { params: Promise<{ token: string }> }

export default async function DescargaPage({ params }: Props) {
  const { token } = await params;
  const supabase  = await createClient();

  const { data: descarga } = await supabase
    .from("descargas")
    .select("*, productos(nombre, archivo_nombre, max_descargas, dias_acceso)")
    .eq("token", token)
    .single();

  const expirado = descarga ? new Date(descarga.expira_en) < new Date() : true;
  const agotado  = descarga ? descarga.descargas_usadas >= descarga.max_descargas : false;
  const valido   = descarga && !expirado && !agotado;

  if (!descarga) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm border border-gray-100">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="font-display font-bold text-brand-dark text-xl mb-2">Link no válido</h1>
          <p className="text-gray-500 text-sm mb-6">Este link de descarga no existe o ya no está disponible.</p>
          <Link href="/mis-compras" className="inline-flex items-center gap-2 bg-brand-teal text-white font-display font-semibold px-6 py-3 rounded-full text-sm hover:bg-brand-teal-dark transition-colors">
            Ir a Mis Compras
          </Link>
        </div>
      </div>
    );
  }

  if (expirado) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm border border-gray-100">
          <Clock className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="font-display font-bold text-brand-dark text-xl mb-2">Link expirado</h1>
          <p className="text-gray-500 text-sm mb-6">
            El acceso a esta descarga expiró el{" "}
            {new Date(descarga.expira_en).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}.
          </p>
          <Link href="/contacto?origen=descarga-expirada" className="inline-flex items-center gap-2 bg-brand-teal text-white font-display font-semibold px-6 py-3 rounded-full text-sm hover:bg-brand-teal-dark transition-colors">
            Contactar soporte
          </Link>
        </div>
      </div>
    );
  }

  if (agotado) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm border border-gray-100">
          <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h1 className="font-display font-bold text-brand-dark text-xl mb-2">Límite de descargas alcanzado</h1>
          <p className="text-gray-500 text-sm mb-6">
            Ya usaste las {descarga.max_descargas} descargas disponibles para este archivo.
          </p>
          <Link href="/contacto?origen=descarga-agotada" className="inline-flex items-center gap-2 bg-brand-teal text-white font-display font-semibold px-6 py-3 rounded-full text-sm hover:bg-brand-teal-dark transition-colors">
            Contactar soporte
          </Link>
        </div>
      </div>
    );
  }

  const restantes = descarga.max_descargas - descarga.descargas_usadas;

  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-sm border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-brand-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-brand-teal" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-brand-teal-50 text-brand-teal text-xs font-display font-semibold px-3 py-1 rounded-full mb-3">
            <CheckCircle className="w-3 h-3" /> Pago confirmado
          </div>
          <h1 className="font-display font-bold text-brand-dark text-xl mb-1">
            {descarga.productos?.nombre ?? "Tu descarga"}
          </h1>
          {descarga.productos?.archivo_nombre && (
            <p className="text-gray-400 text-xs">{descarga.productos.archivo_nombre}</p>
          )}
        </div>

        <div className="bg-brand-beige rounded-xl p-4 mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Descargas disponibles</span>
            <span className="font-display font-semibold text-brand-dark">{restantes} de {descarga.max_descargas}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Acceso válido hasta</span>
            <span className="font-display font-semibold text-brand-dark">
              {new Date(descarga.expira_en).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        <a
          href={`/api/descargas/${token}`}
          className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-bold px-6 py-4 rounded-xl transition-colors shadow-md shadow-brand-teal/20 mb-3"
        >
          <Download className="w-5 h-5" />
          Descargar archivo
        </a>

        <p className="text-center text-xs text-gray-400">
          Cada clic en el botón cuenta como una descarga.
        </p>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link href="/mis-compras" className="text-brand-teal text-xs font-display font-semibold hover:underline">
            Ver todas mis compras →
          </Link>
        </div>
      </div>
    </div>
  );
}
